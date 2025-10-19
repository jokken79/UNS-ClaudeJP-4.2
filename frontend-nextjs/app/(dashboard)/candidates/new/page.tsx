'use client';

import CandidateForm from '@/components/CandidateForm';

export default function NewCandidatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            新規候補者登録
          </h1>
          <p className="text-gray-600">
            候補者の情報を入力して登録してください。OCRでドキュメントをスキャンすると自動入力されます。
          </p>
        </div>

        {/* Form */}
        <CandidateForm />
      </div>
    </div>
  );
}
