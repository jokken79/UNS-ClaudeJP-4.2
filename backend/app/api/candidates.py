"""
Candidates API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
import asyncio
from sqlalchemy.orm import Session
from sqlalchemy import func
import os
import shutil
from typing import Optional

from app.core.database import get_db
from app.core.config import settings
from app.models.models import Candidate, Document, Employee, User, CandidateStatus, DocumentType
from app.schemas.candidate import (
    CandidateCreate, CandidateUpdate, CandidateResponse,
    CandidateApprove, CandidateReject, DocumentUpload, OCRData
)
from app.schemas.base import PaginatedResponse
from app.services.auth_service import auth_service
from app.services.azure_ocr_service import azure_ocr_service

import logging

router = APIRouter()

logger = logging.getLogger(__name__)


def _build_emergency_contact(candidate: "Candidate") -> Optional[str]:
    """Build emergency contact string combining name and relation."""
    parts = []
    if getattr(candidate, "emergency_contact_name", None):
        parts.append(candidate.emergency_contact_name)
    if getattr(candidate, "emergency_contact_relation", None):
        parts.append(f"({candidate.emergency_contact_relation})")

    contact = " ".join(parts).strip()
    return contact or None


import threading

# Lock for thread-safe Rirekisho ID generation
id_generation_lock = threading.Lock()

def generate_rirekisho_id(db: Session) -> str:
    """Generate next Rirekisho ID in a thread-safe manner."""
    with id_generation_lock:
        # Get last candidate
        last_candidate = db.query(Candidate).order_by(Candidate.id.desc()).first()

        prefix = getattr(settings, 'RIREKISHO_ID_PREFIX', 'UNS-')
        start_num = getattr(settings, 'RIREKISHO_ID_START', 1)

        if not isinstance(prefix, str) or not prefix:
            raise ValueError("RIREKISHO_ID_PREFIX must be a non-empty string.")
        if not isinstance(start_num, int) or start_num < 1:
            raise ValueError("RIREKISHO_ID_START must be a positive integer.")

        if last_candidate and hasattr(last_candidate, 'rirekisho_id') and last_candidate.rirekisho_id:
            try:
                last_num = int(last_candidate.rirekisho_id.split('-')[1])
                next_num = last_num + 1
            except (IndexError, ValueError):
                # Fallback if parsing fails
                next_num = db.query(Candidate).count() + start_num
        else:
            next_num = start_num

        return f"{prefix}{next_num}"


@router.post("/", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def create_candidate(
    candidate: CandidateCreate,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create new candidate from rirekisho (履歴書)
    """
    # Basic validation
    if not candidate.full_name_kanji and not candidate.full_name_roman:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Candidate name (Kanji or Roman) is required.",
        )

    # Generate Rirekisho ID
    rirekisho_id = generate_rirekisho_id(db)

    # Create candidate with all rirekisho fields
    new_candidate = Candidate(
        rirekisho_id=rirekisho_id,
        **candidate.model_dump(exclude_unset=True)
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return new_candidate


@router.get("/", response_model=PaginatedResponse)
async def list_candidates(
    page: int = 1,
    page_size: int = 20,
    status_filter: Optional[CandidateStatus] = None,
    search: Optional[str] = None,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    List all candidates with pagination
    """
    query = db.query(Candidate)

    # Apply filters
    if status_filter:
        query = query.filter(Candidate.status == status_filter)

    if search:
        query = query.filter(
            (Candidate.full_name_kanji.ilike(f"%{search}%")) |
            (Candidate.full_name_kana.ilike(f"%{search}%")) |
            (Candidate.full_name_roman.ilike(f"%{search}%")) |
            (Candidate.rirekisho_id.ilike(f"%{search}%"))
        )

    # Get total count
    total = query.count()

    # Apply pagination
    candidates = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": candidates,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get candidate by ID
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    return candidate


@router.put("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: int,
    candidate_update: CandidateUpdate,
    current_user: User = Depends(auth_service.require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Update candidate
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    # Update fields
    for field, value in candidate_update.model_dump(exclude_unset=True).items():
        setattr(candidate, field, value)

    db.commit()
    db.refresh(candidate)

    return candidate


@router.delete("/{candidate_id}")
async def delete_candidate(
    candidate_id: int,
    current_user: User = Depends(auth_service.require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Delete candidate
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    db.delete(candidate)
    db.commit()

    return {"message": "Candidate deleted successfully"}


@router.post("/{candidate_id}/upload", response_model=DocumentUpload)
async def upload_document(
    candidate_id: int,
    file: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: User = Depends(auth_service.require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Upload document for candidate with OCR processing
    """
    # Verify candidate exists
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    # Validate file type
    file_ext = os.path.splitext(file.filename)[1].lower().replace('.', '')
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}"
        )

    # Create upload directory if not exists
    upload_dir = os.path.join(settings.UPLOAD_DIR, "candidates", str(candidate_id))
    os.makedirs(upload_dir, exist_ok=True)

    # Save file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process with OCR
    ocr_data = None
    if document_type in ["rirekisho", "zairyu_card", "license"]:
        try:
            # Process with Azure OCR service
            ocr_result = azure_ocr_service.process_document(file_path, document_type)

            # Convert to OCRData model
            ocr_data = OCRData(
                full_name_kanji=ocr_result.get('name_kanji'),
                full_name_kana=ocr_result.get('name_kana'),
                date_of_birth=ocr_result.get('birthday'),
                gender=ocr_result.get('gender'),
                address=ocr_result.get('address'),
                phone=ocr_result.get('phone'),
                email=ocr_result.get('email'),
                raw_text=ocr_result.get('raw_text', '') or ocr_result.get('extracted_text', '')
            )
        except Exception as e:
            logger.error(f"OCR processing error: {e}")
            ocr_data = OCRData(raw_text=f"Error processing: {str(e)}")

    # Save document record
    document = Document(
        candidate_id=candidate_id,
        document_type=DocumentType[document_type.upper()],
        file_name=file.filename,
        file_path=file_path,
        file_size=os.path.getsize(file_path),
        mime_type=file.content_type,
        ocr_data=ocr_data.model_dump() if ocr_data else None,
        uploaded_by=current_user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return DocumentUpload(
        document_id=document.id,
        file_name=file.filename,
        file_path=file_path,
        ocr_data=ocr_data,
        message="Document uploaded and processed successfully"
    )


@router.post("/{candidate_id}/approve", response_model=CandidateResponse)
async def approve_candidate(
    candidate_id: int,
    approve_data: CandidateApprove,
    current_user: User = Depends(auth_service.require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Approve candidate
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    candidate.status = CandidateStatus.APPROVED
    candidate.approved_by = current_user.id
    candidate.approved_at = func.now()

    if approve_data.promote_to_employee:
        # Avoid creating duplicate employees for the same rirekisho_id
        existing_employee = db.query(Employee).filter(Employee.rirekisho_id == candidate.rirekisho_id).first()

        if not existing_employee:
            employee_name = candidate.full_name_kanji or candidate.full_name_roman
            if not employee_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Candidate name is required to create an employee",
                )

            last_employee = db.query(Employee).order_by(Employee.hakenmoto_id.desc()).first()
            next_hakenmoto_id = (last_employee.hakenmoto_id + 1) if last_employee else 1

            address_parts = [
                candidate.current_address,
                candidate.address_banchi,
                candidate.building_name,
            ]
            candidate_address = " ".join([part for part in address_parts if part]) or candidate.registered_address

            jikyu_value = approve_data.jikyu if approve_data.jikyu is not None else 0

            new_employee = Employee(
                hakenmoto_id=next_hakenmoto_id,
                rirekisho_id=candidate.rirekisho_id,
                factory_id=approve_data.factory_id,
                hakensaki_shain_id=approve_data.hakensaki_shain_id,
                full_name_kanji=employee_name,
                full_name_kana=candidate.full_name_kana,
                photo_url=candidate.photo_url,
                date_of_birth=candidate.date_of_birth,
                gender=candidate.gender,
                nationality=candidate.nationality,
                zairyu_card_number=candidate.residence_card_number,
                zairyu_expire_date=candidate.residence_expiry,
                address=candidate_address,
                postal_code=candidate.postal_code,
                phone=candidate.mobile or candidate.phone,
                email=candidate.email,
                emergency_contact_name=candidate.emergency_contact_name,
                emergency_contact_relationship=candidate.emergency_contact_relation,
                emergency_contact_phone=candidate.emergency_contact_phone,
                hire_date=approve_data.hire_date or candidate.hire_date,
                jikyu=jikyu_value,
                position=approve_data.position,
                contract_type=approve_data.contract_type,
                notes=approve_data.notes,
            )

            db.add(new_employee)
            db.flush()

            # Copy candidate documents to the new employee profile
            candidate_documents = db.query(Document).filter(Document.candidate_id == candidate.id).all()
            for doc in candidate_documents:
                employee_document = Document(
                    employee_id=new_employee.id,
                    candidate_id=None,
                    document_type=doc.document_type,
                    file_name=doc.file_name,
                    file_path=doc.file_path,
                    file_size=doc.file_size,
                    mime_type=doc.mime_type,
                    ocr_data=doc.ocr_data,
                    uploaded_by=current_user.id,
                )
                db.add(employee_document)
        candidate.status = CandidateStatus.HIRED

    db.commit()
    db.refresh(candidate)

    return candidate


@router.post("/{candidate_id}/reject", response_model=CandidateResponse)
async def reject_candidate(
    candidate_id: int,
    reject_data: CandidateReject,
    current_user: User = Depends(auth_service.require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Reject candidate
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    candidate.status = CandidateStatus.REJECTED
    candidate.approved_by = current_user.id
    candidate.approved_at = func.now()

    db.commit()
    db.refresh(candidate)

    return candidate


@router.options("/ocr/process")
async def ocr_process_options():
    """Handle OPTIONS request for CORS preflight."""
    return {"success": True}


@router.post("/ocr/process")
async def process_ocr_document(
    file: UploadFile = File(...),
    document_type: str = Form(...)
):
    """
    Process document with OCR without creating candidate
    Returns extracted data including personal information

    Supported document types:
    - rirekisho: Resume/CV (履歴書)
    - zairyu_card: Residence Card (在留カード)
    - license: Driver's License (免許証)
    """
    logger.info(f"Starting OCR process for {document_type}")
    import tempfile

    # Validate file type
    logger.info(f"Validating file type for {file.filename}")
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.jpg', '.jpeg', '.png', '.pdf']:
        logger.error(f"Invalid file type: {file_ext}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not allowed. Allowed types: jpg, jpeg, png, pdf"
        )

    # Save to temporary file
    try:
        logger.info("Creating temporary file")
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            logger.info(f"Temporary file created at {tmp_file.name}")
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name
        logger.info("File saved to temporary location")
    except Exception as e:
        logger.error(f"Error saving temporary file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving temporary file: {str(e)}"
        )

    try:
        logger.info("Processing document with Azure OCR service")
        # Process with Azure OCR service
        ocr_result = azure_ocr_service.process_document(tmp_path, document_type)
        logger.info("OCR processing complete")

        # Add document type to the result
        ocr_result["document_type"] = document_type

        return {
            "success": True,
            "data": ocr_result,
            "message": "Document processed successfully"
        }
    except Exception as e:
        logger.error(f"OCR processing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing error: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_path):
            logger.info(f"Cleaning up temporary file {tmp_path}")
            os.remove(tmp_path)