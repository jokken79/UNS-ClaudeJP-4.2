'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import OCRUploader from './OCRUploader';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface CandidateFormProps {
  candidateId?: string;
  isEdit?: boolean;
}

type CandidateFormData = {
  [key: string]: any;
  full_name_kanji?: string;
  full_name_kana?: string;
  full_name_roman?: string;
  date_of_birth?: string;
  age?: number;
  gender?: string;
  nationality?: string;
  phone?: string;
  mobile?: string;
  fax_number?: string;
  email?: string;
  postal_code?: string;
  current_address?: string;
  address?: string;
  residence_status?: string;
  visa_period?: string;
  residence_expiry?: string;
  residence_card_number?: string;
  passport_number?: string;
  passport_expiry?: string;
  license_number?: string;
  license_expiry?: string;
  listening_level?: string;
  speaking_level?: string;
  reading_level?: string;
  writing_level?: string;
  exp_nc_lathe?: boolean;
  exp_lathe?: boolean;
  exp_press?: boolean;
  exp_forklift?: boolean;
  exp_packing?: boolean;
  exp_welding?: boolean;
  exp_car_assembly?: boolean;
  exp_car_line?: boolean;
  exp_car_inspection?: boolean;
  exp_electronic_inspection?: boolean;
  exp_food_processing?: boolean;
  exp_casting?: boolean;
  exp_line_leader?: boolean;
  exp_painting?: boolean;
  exp_other?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_phone?: string;
  photo_url?: string;
};

export default function CandidateForm({ candidateId, isEdit = false }: CandidateFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CandidateFormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [showOCRUploader, setShowOCRUploader] = useState(false);

  // Fetch candidate data if editing
  const { data: candidate, isLoading } = useQuery<CandidateFormData>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/candidates/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch candidate');
      return response.json();
    },
    enabled: !!candidateId && isEdit,
  });

  useEffect(() => {
    if (candidate) {
      setFormData(candidate);
    }
  }, [candidate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.full_name_kanji && !formData.full_name_roman) {
      toast.error('氏名を入力してください');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const url = isEdit
        ? `http://localhost:8000/api/candidates/${candidateId}`
        : 'http://localhost:8000/api/candidates/';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'サーバーエラーが発生しました。');
      }

      const savedCandidate = await response.json();
      toast.success(isEdit ? '候補者を正常に更新しました。' : '候補者を正常に作成しました。');

      if (!isEdit) {
        router.push(`/candidates/${savedCandidate.id}`);
      } else {
        router.push(`/candidates/${candidateId}`);
      }
    } catch (err: any) {
      toast.error(`保存に失敗しました: ${err.message}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOCRComplete = (ocrData: any) => {
    const mappedData: Partial<CandidateFormData> = {};

    // Names
    const fullNameKanji = ocrData.full_name_kanji || ocrData.name_kanji;
    const fullNameKana = ocrData.full_name_kana || ocrData.name_kana;
    const fullNameRoman = ocrData.full_name_roman || ocrData.name_roman;
    if (fullNameKanji) mappedData.full_name_kanji = fullNameKanji;
    if (fullNameKana) mappedData.full_name_kana = fullNameKana;
    if (fullNameRoman) mappedData.full_name_roman = fullNameRoman;

    // Contact info
    if (ocrData.phone || ocrData.phone_number) mappedData.phone = ocrData.phone || ocrData.phone_number;
    if (ocrData.email) mappedData.email = ocrData.email;

    // Address
    const detectedAddress = ocrData.current_address || ocrData.address || ocrData.registered_address;
    if (detectedAddress) {
      mappedData.current_address = detectedAddress;
      mappedData.address = detectedAddress;
    }
    if (ocrData.postal_code) mappedData.postal_code = ocrData.postal_code;

    // Personal
    const dateOfBirth = ocrData.date_of_birth || ocrData.birthday;
    if (dateOfBirth) mappedData.date_of_birth = dateOfBirth;
    if (ocrData.gender) mappedData.gender = ocrData.gender;

    // Visa/Residence
    if (ocrData.nationality) mappedData.nationality = ocrData.nationality;
    const residenceStatus = ocrData.residence_status || ocrData.visa_status;
    if (residenceStatus) mappedData.residence_status = residenceStatus;
    const visaPeriod = ocrData.visa_period;
    if (visaPeriod) mappedData.visa_period = visaPeriod;
    const residenceExpiry = ocrData.residence_expiry || ocrData.zairyu_expire_date;
    if (residenceExpiry) mappedData.residence_expiry = residenceExpiry;
    const residenceCardNumber = ocrData.residence_card_number || ocrData.zairyu_card_number;
    if (residenceCardNumber) mappedData.residence_card_number = residenceCardNumber;

    // License
    if (ocrData.license_number) mappedData.license_number = ocrData.license_number;
    const licenseExpiry = ocrData.license_expiry || ocrData.license_expire_date;
    if (licenseExpiry) mappedData.license_expiry = licenseExpiry;

    // Photo
    const photoUrl = ocrData.photo_url || ocrData.photo;
    if (photoUrl) mappedData.photo_url = photoUrl;

    setFormData(prev => ({
      ...prev,
      ...mappedData
    }));

    toast.success('OCRデータをフォームに適用しました。内容を確認して必要に応じて編集してください。');
    setShowOCRUploader(false);
  };

  if (isLoading && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">履歴書フォーム</h2>
          <button
            type="button"
            onClick={() => setShowOCRUploader(!showOCRUploader)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            {showOCRUploader ? 'OCRアップローダーを閉じる' : 'OCRでドキュメントをスキャン'}
          </button>
        </div>

        {/* OCR Uploader */}
        {showOCRUploader && (
          <div className="mb-6">
            <OCRUploader onOCRComplete={handleOCRComplete} />
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-start">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">OCRについて</p>
                <p>履歴書や在留カードなどのドキュメントをアップロードすると、システムが自動的に情報を抽出してフォームに入力します。抽出された情報は必ず確認し、必要に応じて修正してください。</p>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">
            個人情報
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name_kanji" className="block text-sm font-medium text-gray-700 mb-1">
                氏名 (Kanji) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name_kanji"
                id="full_name_kanji"
                value={formData.full_name_kanji || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="full_name_kana" className="block text-sm font-medium text-gray-700 mb-1">
                フリガナ (Kana)
              </label>
              <input
                type="text"
                name="full_name_kana"
                id="full_name_kana"
                value={formData.full_name_kana || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="full_name_roman" className="block text-sm font-medium text-gray-700 mb-1">
                氏名 (Roman)
              </label>
              <input
                type="text"
                name="full_name_roman"
                id="full_name_roman"
                value={formData.full_name_roman || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                生年月日 (Date of Birth)
              </label>
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                value={formData.date_of_birth || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                性別 (Gender)
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">選択してください</option>
                <option value="男性">男性 (Male)</option>
                <option value="女性">女性 (Female)</option>
              </select>
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                国籍 (Nationality)
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                value={formData.nationality || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
            連絡先情報
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                郵便番号 (Postal Code)
              </label>
              <input
                type="text"
                name="postal_code"
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="current_address" className="block text-sm font-medium text-gray-700 mb-1">
                現住所 (Current Address)
              </label>
              <textarea
                name="current_address"
                id="current_address"
                value={formData.current_address || ''}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                電話番号 (Phone)
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                携帯電話 (Mobile)
              </label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={formData.mobile || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="fax_number" className="block text-sm font-medium text-gray-700 mb-1">
                ファックス番号 (Fax)
              </label>
              <input
                type="text"
                name="fax_number"
                id="fax_number"
                value={formData.fax_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス (Email)
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Visa/Residence Documents Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
            在留資格・書類情報
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="residence_status" className="block text-sm font-medium text-gray-700 mb-1">
                在留資格 (Visa Status)
              </label>
              <input
                type="text"
                name="residence_status"
                id="residence_status"
                value={formData.residence_status || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="visa_period" className="block text-sm font-medium text-gray-700 mb-1">
                在留期間 (Period of Stay)
              </label>
              <input
                type="text"
                name="visa_period"
                id="visa_period"
                value={formData.visa_period || ''}
                onChange={handleInputChange}
                placeholder="例: 3年, 5年"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="residence_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                在留期間満了日 (Residence Expiry)
              </label>
              <input
                type="date"
                name="residence_expiry"
                id="residence_expiry"
                value={formData.residence_expiry || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="residence_card_number" className="block text-sm font-medium text-gray-700 mb-1">
                在留カード番号 (Residence Card No.)
              </label>
              <input
                type="text"
                name="residence_card_number"
                id="residence_card_number"
                value={formData.residence_card_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="passport_number" className="block text-sm font-medium text-gray-700 mb-1">
                パスポート番号 (Passport No.)
              </label>
              <input
                type="text"
                name="passport_number"
                id="passport_number"
                value={formData.passport_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="passport_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                パスポート期限 (Passport Expiry)
              </label>
              <input
                type="date"
                name="passport_expiry"
                id="passport_expiry"
                value={formData.passport_expiry || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-1">
                運転免許番号 (Driver's License No.)
              </label>
              <input
                type="text"
                name="license_number"
                id="license_number"
                value={formData.license_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="license_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                運転免許期限 (License Expiry)
              </label>
              <input
                type="date"
                name="license_expiry"
                id="license_expiry"
                value={formData.license_expiry || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Japanese Language Skills Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500">
            日本語能力
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="listening_level" className="block text-sm font-medium text-gray-700 mb-1">
                聞く (Listening)
              </label>
              <select
                name="listening_level"
                id="listening_level"
                value={formData.listening_level || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">選択してください</option>
                <option value="beginner">初級 (Beginner)</option>
                <option value="intermediate">中級 (Intermediate)</option>
                <option value="advanced">上級 (Advanced)</option>
              </select>
            </div>

            <div>
              <label htmlFor="speaking_level" className="block text-sm font-medium text-gray-700 mb-1">
                話す (Speaking)
              </label>
              <select
                name="speaking_level"
                id="speaking_level"
                value={formData.speaking_level || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">選択してください</option>
                <option value="beginner">初級 (Beginner)</option>
                <option value="intermediate">中級 (Intermediate)</option>
                <option value="advanced">上級 (Advanced)</option>
              </select>
            </div>

            <div>
              <label htmlFor="reading_level" className="block text-sm font-medium text-gray-700 mb-1">
                読む (Reading)
              </label>
              <input
                type="text"
                name="reading_level"
                id="reading_level"
                value={formData.reading_level || ''}
                onChange={handleInputChange}
                placeholder="例: N2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="writing_level" className="block text-sm font-medium text-gray-700 mb-1">
                書く (Writing)
              </label>
              <input
                type="text"
                name="writing_level"
                id="writing_level"
                value={formData.writing_level || ''}
                onChange={handleInputChange}
                placeholder="例: N3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-orange-500">
            経験作業内容
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'exp_nc_lathe', label: 'NC旋盤' },
              { name: 'exp_lathe', label: '旋盤' },
              { name: 'exp_press', label: 'プレス' },
              { name: 'exp_forklift', label: 'フォークリフト' },
              { name: 'exp_packing', label: '梱包' },
              { name: 'exp_welding', label: '溶接' },
              { name: 'exp_car_assembly', label: '車部品組立' },
              { name: 'exp_car_line', label: '車部品ライン' },
              { name: 'exp_car_inspection', label: '車部品検査' },
              { name: 'exp_electronic_inspection', label: '電子部品検査' },
              { name: 'exp_food_processing', label: '食品加工' },
              { name: 'exp_casting', label: '鋳造' },
              { name: 'exp_line_leader', label: 'ラインリーダー' },
              { name: 'exp_painting', label: '塗装' },
            ].map(exp => (
              <div key={exp.name} className="flex items-center">
                <input
                  id={exp.name}
                  name={exp.name}
                  type="checkbox"
                  checked={!!formData[exp.name]}
                  onChange={(e) => handleCheckboxChange(exp.name, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor={exp.name} className="ml-2 block text-sm text-gray-900">
                  {exp.label}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor="exp_other" className="block text-sm font-medium text-gray-700 mb-1">
              その他 (Other)
            </label>
            <textarea
              name="exp_other"
              id="exp_other"
              value={formData.exp_other || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-500">
            緊急連絡先
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                氏名 (Name)
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                id="emergency_contact_name"
                value={formData.emergency_contact_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="emergency_contact_relation" className="block text-sm font-medium text-gray-700 mb-1">
                続柄 (Relation)
              </label>
              <input
                type="text"
                name="emergency_contact_relation"
                id="emergency_contact_relation"
                value={formData.emergency_contact_relation || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                電話番号 (Phone)
              </label>
              <input
                type="text"
                name="emergency_contact_phone"
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
        >
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
