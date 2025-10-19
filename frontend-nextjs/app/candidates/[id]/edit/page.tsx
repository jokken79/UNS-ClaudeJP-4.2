'use client';

import { useParams } from 'next/navigation';
import CandidateForm from '@/components/CandidateForm';

export default function EditCandidatePage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            候補者情報編集
          </h1>
          <p className="text-gray-600">
            候補者ID: {id}
          </p>
        </div>

        {/* Form */}
        <CandidateForm candidateId={id} isEdit={true} />
      </div>
    </div>
  );
}
