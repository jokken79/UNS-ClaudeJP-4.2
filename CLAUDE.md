# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UNS-ClaudeJP 4.0 is a comprehensive HR management system for Japanese staffing agencies (人材派遣会社), built with:
- **Backend**: FastAPI 0.115.6 (Python 3.11+) with SQLAlchemy 2.0.36 ORM and PostgreSQL 15
- **Frontend**: Next.js 15.5.5 with TypeScript 5.6 and Tailwind CSS 3.4 (App Router)
- **DevOps**: Docker Compose for orchestration

The system manages the complete lifecycle of temporary workers: candidates (履歴書/Rirekisho), employees (派遣社員), factories (派遣先), attendance (タイムカード), payroll (給与), and requests (申請). It includes hybrid OCR processing (Azure + EasyOCR + Tesseract) for Japanese document handling.

**Version 4.0** represents a major upgrade from v3.x with migration from React/Vite to Next.js 15, implementing 15 functional pages across 8 core modules.

## Quick Start Commands

```bash
# Start all services (DB, Backend, Frontend)
START.bat
# Services available at:
# - Frontend: http://localhost:3000
# - API Docs: http://localhost:8000/api/docs
# - Adminer: http://localhost:8080

# Stop all services
STOP.bat

# View logs
LOGS.bat

# Reset database (WARNING: destroys all data)
REINSTALAR.bat
```

Default credentials: `admin` / `admin123`

## Development Commands

### Backend Development

```bash
# Access backend container
docker exec -it uns-claudejp-backend bash

# Run database migrations
cd /app
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Create admin user
python scripts/create_admin_user.py

# Import sample data
python scripts/import_data.py

# Install a new dependency
pip install package-name
# Then add to requirements.txt
```

### Frontend Development (Next.js 15)

```bash
# Access frontend container
docker exec -it uns-claudejp-frontend bash

# Install new dependency
npm install <package-name>

# Development server (already running)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Database Management

```bash
# Access PostgreSQL directly
docker exec -it uns-claudejp-db psql -U uns_admin -d uns_claudejp

# Run database verification
docker exec -it uns-claudejp-backend python scripts/verify_data.py

# View Adminer web interface
# Navigate to http://localhost:8080
# Server: db | Username: uns_admin | Password: 57UD10R | Database: uns_claudejp
```

## System Architecture

### Backend Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI entry point with 14 router registrations
│   ├── api/                    # REST API endpoints (14 routers)
│   │   ├── auth.py            # JWT authentication
│   │   ├── candidates.py      # 履歴書 CRUD + OCR processing
│   │   ├── employees.py       # 派遣社員 management
│   │   ├── factories.py       # 派遣先 client sites
│   │   ├── timer_cards.py     # タイムカード attendance tracking
│   │   ├── salary.py          # 給与 payroll calculations
│   │   ├── requests.py        # 申請 leave requests workflow
│   │   ├── dashboard.py       # Stats & analytics
│   │   ├── database.py        # Database management utilities
│   │   ├── azure_ocr.py       # Azure Vision API integration
│   │   ├── import_export.py   # Data import/export
│   │   ├── monitoring.py      # System health monitoring
│   │   ├── notifications.py   # Email/LINE notifications
│   │   └── reports.py         # PDF report generation
│   ├── models/
│   │   └── models.py          # SQLAlchemy ORM (13 tables)
│   ├── schemas/               # Pydantic request/response models
│   ├── services/              # Business logic layer
│   │   ├── auth_service.py
│   │   ├── azure_ocr_service.py
│   │   ├── easyocr_service.py
│   │   ├── hybrid_ocr_service.py
│   │   ├── face_detection_service.py
│   │   ├── import_service.py
│   │   ├── notification_service.py
│   │   ├── payroll_service.py
│   │   └── report_service.py
│   ├── core/                  # Core configuration
│   │   ├── config.py         # Settings management
│   │   ├── database.py       # SQLAlchemy session setup
│   │   ├── logging.py        # Application logging (loguru)
│   │   └── middleware.py     # Security, logging, exception handling
│   └── utils/                # Utility functions
├── alembic/                  # Database migrations
│   └── versions/
└── scripts/                  # Maintenance scripts
```

### Frontend Structure (Next.js 15 App Router)

```
frontend-nextjs/
├── app/
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home/landing page
│   ├── login/page.tsx         # Authentication
│   ├── dashboard/page.tsx     # Main dashboard
│   ├── candidates/            # Candidate management (4 pages)
│   │   ├── page.tsx           # List view with filtering
│   │   ├── new/page.tsx       # Create new candidate
│   │   ├── [id]/page.tsx      # Detail view
│   │   └── [id]/edit/page.tsx # Edit form
│   ├── employees/             # Employee management (4 pages)
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   ├── [id]/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── factories/page.tsx     # Factory/client management
│   ├── timercards/            # Attendance tracking
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── salary/                # Payroll management
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── requests/              # Leave request management
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── components/            # Page-level components
├── components/
│   ├── EmployeeForm.tsx       # Shared form (Create/Edit)
│   ├── CandidateForm.tsx      # Shared form (Create/Edit)
│   ├── OCRUploader.tsx        # Document OCR uploader
│   ├── layout/                # Layout components (Header, Sidebar, Navigation)
│   ├── forms/                 # Reusable form components
│   └── ui/                    # Shadcn UI components
├── lib/
│   ├── api.ts                 # Axios API client with interceptors
│   └── api/                   # API service modules
├── stores/                    # Zustand state management
├── types/                     # TypeScript type definitions
├── middleware.ts              # Next.js authentication middleware
└── public/                    # Static assets
```

### Database Schema (13 Tables)

**Core Personnel Tables:**
- `users` - System users with role hierarchy (SUPER_ADMIN → ADMIN → COORDINATOR → KANRININSHA → EMPLOYEE → CONTRACT_WORKER)
- `candidates` - Candidate records (履歴書/Rirekisho) with 50+ fields, approval workflow, OCR data storage
- `employees` - Dispatch workers (派遣社員) linked to candidates via `rirekisho_id`
- `contract_workers` - Contract workers (請負社員)
- `staff` - Office/HR personnel (スタッフ)

**Business Tables:**
- `factories` - Client companies (派遣先) with JSON configuration storage
- `apartments` - Employee housing (社宅) with rent tracking
- `documents` - File storage with OCR data
- `contracts` - Employment contracts

**Operations Tables:**
- `timer_cards` - Attendance records (タイムカード) with 3 shift types (朝番/昼番/夜番), overtime, night, and holiday hours
- `salary_calculations` - Monthly payroll with detailed breakdowns
- `requests` - Employee requests (有給/半休/一時帰国/退社) with approval workflow
- `audit_log` - Complete audit trail

**Key Relationships:**
- Candidates → Employees via `rirekisho_id`
- Employees → Factories via `factory_id`
- Employees → Apartments via `apartment_id`

## Key Technical Details

### Authentication & Authorization

- **JWT-based authentication** with bcrypt password hashing
- **Role hierarchy**: SUPER_ADMIN → ADMIN → COORDINATOR → KANRININSHA → EMPLOYEE → CONTRACT_WORKER
- **Frontend**: Next.js middleware protects routes (`middleware.ts`)
- **Backend**: FastAPI dependency injection validates JWT on each request
- Access tokens stored in localStorage
- Token expiration: 480 minutes (8 hours)
- Login endpoint: `POST /api/auth/login`

### State Management (Frontend)

- **Zustand**: Global state for auth and settings (lightweight alternative to Redux)
- **React Query (@tanstack/react-query)**: Server state management with intelligent caching, auto-refetching
- **Next.js App Router**: File-based routing with dynamic `[id]` routes

### OCR Integration (Hybrid Approach)

The system uses a **multi-provider OCR strategy** for processing Japanese documents:

- **Primary**: Azure Computer Vision API (best for Japanese text)
- **Secondary**: EasyOCR (deep learning-based, works offline)
- **Fallback**: Tesseract OCR (open-source)
- **Face Detection**: MediaPipe for photo verification

**OCR Workflow:**
1. User uploads 履歴書 (Rirekisho) image via `OCRUploader` component
2. Image sent to backend `/api/azure-ocr/process` endpoint
3. Hybrid OCR service processes with available providers
4. Extracted data normalized and validated
5. Candidate record auto-created/updated
6. OCR results stored in `documents.ocr_data` JSON field

**Supported Documents:**
- 履歴書 (Rirekisho/Resume) - Full Japanese CV with 50+ fields
- 在留カード (Zairyu Card/Residence Card) - Foreign worker permit
- 運転免許証 (Driver's License)

**Configuration:**
Set `AZURE_COMPUTER_VISION_ENDPOINT` and `AZURE_COMPUTER_VISION_KEY` in environment. System automatically falls back to other providers if Azure is unavailable.

### Environment Variables

Key variables in `.env` or `docker-compose.yml`:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing key
- `FRONTEND_URL` - For CORS configuration

**Optional:**
- `AZURE_COMPUTER_VISION_*` - OCR service credentials
- `SMTP_*` - Email service configuration
- `LINE_NOTIFY_TOKEN` - For LINE notifications
- `DEBUG` - Enable debug mode
- `LOG_LEVEL` - Logging level (default: INFO)

See `.env.example` for complete list of configuration options.

### Date Handling

- Backend uses `datetime` with timezone awareness (pytz)
- Frontend uses `date-fns` for date formatting
- Japanese calendar considerations for fiscal year calculations
- Date formats:
  - Database: ISO-8601 with timezone
  - API: ISO-8601
  - UI: Localized JP format (YYYY年MM月DD日)

## Common Development Workflows

### Adding a New API Endpoint

1. Define Pydantic schema in `app/schemas/`:
```python
from pydantic import BaseModel
from datetime import datetime

class NewEntityBase(BaseModel):
    name: str
    description: str | None = None

class NewEntityCreate(NewEntityBase):
    pass

class NewEntityResponse(NewEntityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode)
```

2. Create endpoint in `app/api/`:
```python
from fastapi import APIRouter, Depends
from app.schemas.new_entity import NewEntityCreate, NewEntityResponse
from app.models.models import NewEntity
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/new-entities", tags=["new-entities"])

@router.post("/", response_model=NewEntityResponse)
def create_new_entity(
    entity: NewEntityCreate,
    db: Session = Depends(get_db)
):
    db_entity = NewEntity(**entity.model_dump())
    db.add(db_entity)
    db.commit()
    db.refresh(db_entity)
    return db_entity
```

3. Register router in `app/main.py`:
```python
from app.api import new_entity
app.include_router(new_entity.router, prefix="/api")
```

4. Update frontend API client in `lib/api.ts` or `lib/api/`

### Adding a New Database Table

1. Add SQLAlchemy model to `app/models/models.py`:
```python
class NewEntity(Base):
    __tablename__ = "new_entities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.now)

    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="new_entities")
```

2. Create migration: `alembic revision --autogenerate -m "add_new_entity"`
3. Review migration file in `backend/alembic/versions/`
4. Apply migration: `alembic upgrade head`
5. Create corresponding Pydantic schemas

### Adding a New Next.js Page

1. Create page file in `app/` directory:
```typescript
// app/new-feature/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function NewFeaturePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['newFeature'],
    queryFn: () => api.get('/api/new-feature').then(res => res.data)
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>New Feature</h1>
      {/* Your content */}
    </div>
  );
}
```

2. For dynamic routes, use `[id]` folder structure:
```
app/
└── new-feature/
    ├── page.tsx              # List view
    ├── [id]/
    │   └── page.tsx          # Detail view
    └── [id]/edit/
        └── page.tsx          # Edit view
```

3. Add navigation link in `components/layout/Sidebar.tsx` or navigation component

### Debugging Issues

**Logs and Monitoring:**
- Check logs: `LOGS.bat` (select service to monitor)
- Real-time logs: `docker logs -f uns-claudejp-backend` (or `-frontend`, `-db`)
- API documentation: http://localhost:8000/api/docs (Swagger UI)
- Database admin: http://localhost:8080 (Adminer)

**Common Issues:**

1. **Login fails**:
   - Reset admin password: `docker exec -it uns-claudejp-backend python scripts/create_admin_user.py`
   - Default credentials: `admin` / `admin123`
   - Check JWT `SECRET_KEY` is set in environment

2. **Database errors**:
   - Verify PostgreSQL is running: `docker ps | findstr uns-claudejp-db`
   - Check connection: `docker exec -it uns-claudejp-db psql -U uns_admin -d uns_claudejp`
   - Run migrations: `docker exec -it uns-claudejp-backend alembic upgrade head`

3. **Frontend doesn't load**:
   - Next.js compilation can take 1-2 minutes on first build
   - Check frontend logs: `docker logs uns-claudejp-frontend`
   - Verify backend is accessible: http://localhost:8000/api/health
   - Clear browser cache and localStorage

4. **OCR failures**:
   - Check if Azure credentials are set: `AZURE_COMPUTER_VISION_ENDPOINT`, `AZURE_COMPUTER_VISION_KEY`
   - System automatically falls back to EasyOCR/Tesseract if Azure unavailable
   - OCR can be disabled with `OCR_ENABLED=false`

5. **Port conflicts**:
   - Required ports: 3000 (frontend), 8000 (backend), 5432 (PostgreSQL), 8080 (Adminer)
   - Windows: `netstat -ano | findstr "3000"` to check port usage
   - Kill process: `taskkill /PID <pid> /F`

6. **Docker issues**:
   - Ensure Docker Desktop is running
   - Check container status: `docker ps -a`
   - Restart containers: `STOP.bat` then `START.bat`
   - Nuclear option: `REINSTALAR.bat` (destroys all data)

## Testing

### Backend Tests
- Located in `backend/tests/`
- Run with `pytest` inside backend container
- Use `pytest-asyncio` for async endpoint testing
- Debug with: `pytest -vs` for verbose output

### Frontend Tests
- Testing framework: Playwright (E2E) available in devDependencies
- Currently minimal testing infrastructure
- Add component tests using Vitest or Jest

## Important Notes

- **LIXO folder**: Contains obsolete v3.x files (old Vite frontend), can be ignored
- **Default credentials**: `admin` / `admin123` (CHANGE IN PRODUCTION!)
- **Docker required**: All services run in containers
- **Port requirements**: 3000, 8000, 5432, 8080
- **Japanese terminology**: Extensive use of Japanese HR terms (履歴書, 派遣社員, タイムカード, etc.)
- **v4.0 Migration**: Frontend migrated from React/Vite to Next.js 15 in January 2025
- **Next.js**: Uses App Router (not Pages Router), Server Components by default

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js application |
| **Backend API** | http://localhost:8000 | FastAPI REST API |
| **API Docs** | http://localhost:8000/api/docs | Interactive Swagger UI |
| **ReDoc** | http://localhost:8000/api/redoc | Alternative API docs |
| **Adminer** | http://localhost:8080 | Database management UI |
| **Health Check** | http://localhost:8000/api/health | Backend health status |

## Docker Services

The application runs 5 services via Docker Compose:

1. **db** - PostgreSQL 15 with persistent volume
2. **importer** - One-time data initialization (creates admin user, imports demo data)
3. **backend** - FastAPI application with hot reload
4. **frontend** - Next.js 15 application with hot reload
5. **adminer** - Database management UI

All services communicate via `uns-network` bridge network.
