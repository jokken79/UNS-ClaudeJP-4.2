'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  PlusIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Factory {
  id: number;
  factory_id: string;
  name: string;
  address?: string;
  phone?: string;
  contact_person?: string;
  is_active: boolean;
  created_at?: string;
  config?: any;
}

interface FactoriesResponse {
  items: Factory[];
  total: number;
}

export default function FactoriesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Factory>>({});

  const { data, isLoading } = useQuery<FactoriesResponse>({
    queryKey: ['factories', searchTerm],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`http://localhost:8000/api/factories/?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch factories');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Factory>) => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/factories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create factory');
      return response.json();
    },
    onSuccess: () => {
      toast.success('工場を作成しました');
      queryClient.invalidateQueries({ queryKey: ['factories'] });
      setShowForm(false);
      setFormData({});
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Factory> }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/factories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update factory');
      return response.json();
    },
    onSuccess: () => {
      toast.success('工場を更新しました');
      queryClient.invalidateQueries({ queryKey: ['factories'] });
      setEditingFactory(null);
      setFormData({});
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFactory) {
      updateMutation.mutate({ id: editingFactory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (factory: Factory) => {
    setEditingFactory(factory);
    setFormData(factory);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFactory(null);
    setFormData({});
  };

  const factories = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">工場管理 (派遣先)</h1>
            <p className="text-gray-600 mt-1">登録済み工場の管理・編集</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規工場登録
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="工場名、工場ID、電話番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingFactory ? '工場情報編集' : '新規工場登録'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      工場ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.factory_id || ''}
                      onChange={(e) => setFormData({ ...formData, factory_id: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      工場名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      住所
                    </label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電話番号
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      担当者名
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person || ''}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      稼働中
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {editingFactory ? '更新' : '作成'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">{total}件の工場が登録されています</p>
        </div>

        {/* Factories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : factories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BuildingOffice2Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">工場がありません</h3>
            <p className="text-gray-600 mb-6">新しい工場を登録してください</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              新規工場登録
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factories.map((factory) => (
              <div key={factory.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{factory.name}</h3>
                        <p className="text-sm text-blue-600">{factory.factory_id}</p>
                      </div>
                    </div>
                    {factory.is_active ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" title="稼働中" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-gray-400" title="停止中" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {factory.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2">{factory.address}</p>
                      </div>
                    )}
                    {factory.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <p>{factory.phone}</p>
                      </div>
                    )}
                    {factory.contact_person && (
                      <p className="text-sm text-gray-600">担当: {factory.contact_person}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleEdit(factory)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    編集
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
