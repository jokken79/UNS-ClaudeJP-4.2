'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/lib/api';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
  CalendarIcon,
  BanknotesIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Employee {
  id: number;
  hakenmoto_id: number;
  uns_id: string;
  factory_id: string;
  hakensaki_shain_id: string | null;
  full_name_kanji: string;
  full_name_kana: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  zairyu_card_number: string | null;
  zairyu_expire_date: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  hire_date: string;
  jikyu: number;
  position: string | null;
  contract_type: string | null;
  apartment_id: number | null;
  apartment_start_date: string | null;
  apartment_rent: number | null;
  yukyu_total: number;
  yukyu_used: number;
  yukyu_remaining: number;
  is_active: boolean;
  termination_date: string | null;
  termination_reason: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: employee, isLoading, error } = useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployee(id),
    enabled: !!id,
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          在籍中
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          退社済
        </span>
      );
    }
  };

  const getContractTypeBadge = (contractType: string | null) => {
    const types: { [key: string]: { label: string; color: string } } = {
      '派遣': { label: '派遣社員', color: 'bg-blue-100 text-blue-800' },
      '請負': { label: '請負社員', color: 'bg-purple-100 text-purple-800' },
      'スタッフ': { label: 'スタッフ', color: 'bg-yellow-100 text-yellow-800' },
    };

    const type = contractType ? types[contractType] : null;
    if (!type) return '-';

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${type.color}`}>
        {type.label}
      </span>
    );
  };

  const isVisaExpiringSoon = (expireDate: string | null) => {
    if (!expireDate) return false;
    const expire = new Date(expireDate);
    const today = new Date();
    const diffInDays = Math.ceil((expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 90 && diffInDays >= 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">従業員が見つかりませんでした</p>
          </div>
          <button
            onClick={() => router.push('/employees')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-start space-x-4">
            <button
              onClick={() => router.push('/employees')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              戻る
            </button>
            <div>
              <div className="flex items-center space-x-3 flex-wrap">
                <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {employee.full_name_kanji}
                </h1>
                {getStatusBadge(employee.is_active)}
                {getContractTypeBadge(employee.contract_type)}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                社員№ <span className="font-semibold">{employee.hakenmoto_id}</span> | UNS-ID:{' '}
                <span className="font-semibold">{employee.uns_id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/employees/${employee.id}/edit`)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            編集
          </button>
        </div>

        {/* Visa Expiring Soon Alert */}
        {employee.is_active && isVisaExpiringSoon(employee.zairyu_expire_date) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>警告:</strong> 在留カードの有効期限が近づいています（期限: {formatDate(employee.zairyu_expire_date)}）
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <UserCircleIcon className="h-6 w-6 mr-2 text-indigo-500" />
                  個人情報
                </h2>
              </div>
              <div className="px-6 py-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">氏名（漢字）</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-semibold">{employee.full_name_kanji}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">氏名（カナ）</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.full_name_kana || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">生年月日</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(employee.date_of_birth)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">性別</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.gender || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">国籍</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.nationality || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">在留カード番号</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.zairyu_card_number || '-'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">在留カード有効期限</dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isVisaExpiringSoon(employee.zairyu_expire_date)
                          ? 'text-yellow-600 font-semibold'
                          : 'text-gray-900'
                      }`}
                    >
                      {formatDate(employee.zairyu_expire_date)}
                      {isVisaExpiringSoon(employee.zairyu_expire_date) && ' ⚠️'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <PhoneIcon className="h-6 w-6 mr-2 text-green-500" />
                  連絡先情報
                </h2>
              </div>
              <div className="px-6 py-5">
                <dl className="space-y-5">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <HomeIcon className="h-4 w-4 mr-1" />
                      住所
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.address || '-'}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        電話番号
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.phone || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        メールアドレス
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{employee.email || '-'}</dd>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">緊急連絡先</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">名前</dt>
                        <dd className="mt-1 text-sm text-gray-900">{employee.emergency_contact || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.emergency_phone || '-'}</dd>
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="h-6 w-6 mr-2 text-blue-500" />
                  雇用情報
                </h2>
              </div>
              <div className="px-6 py-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">入社日</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(employee.hire_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">契約形態</dt>
                    <dd className="mt-1 text-sm">{getContractTypeBadge(employee.contract_type)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">時給</dt>
                    <dd className="mt-1 text-lg font-bold text-indigo-600">{formatCurrency(employee.jikyu)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">職種</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.position || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">派遣先ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.factory_id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">派遣先社員ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.hakensaki_shain_id || '-'}</dd>
                  </div>
                  {!employee.is_active && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">退社日</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(employee.termination_date)}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">退社理由</dt>
                        <dd className="mt-1 text-sm text-gray-900">{employee.termination_reason || '-'}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>

            {/* Apartment Information */}
            {employee.apartment_id && (
              <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <HomeIcon className="h-6 w-6 mr-2 text-purple-500" />
                    寮・住居情報
                  </h2>
                </div>
                <div className="px-6 py-5">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">寮ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.apartment_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">入居日</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(employee.apartment_start_date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">家賃</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-semibold">
                        {employee.apartment_rent ? formatCurrency(employee.apartment_rent) : '-'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Yukyu Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-400/30">
                <h2 className="text-lg font-bold flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2" />
                  有給休暇
                </h2>
              </div>
              <div className="px-6 py-6 space-y-5">
                <div>
                  <dt className="text-sm font-medium opacity-90">付与日数</dt>
                  <dd className="mt-1 text-3xl font-black">{employee.yukyu_total}日</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium opacity-90">使用日数</dt>
                  <dd className="mt-1 text-3xl font-black">{employee.yukyu_used}日</dd>
                </div>
                <div className="pt-5 border-t border-blue-400/30">
                  <dt className="text-sm font-medium opacity-90">残日数</dt>
                  <dd className="mt-1 text-4xl font-black">{employee.yukyu_remaining}日</dd>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">クイックアクション</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <button className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all hover:scale-105">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  タイムカードを見る
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all hover:scale-105">
                  <BanknotesIcon className="h-5 w-5 mr-2 text-gray-400" />
                  給与明細を見る
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all hover:scale-105">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                  書類を見る
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-3">システム情報</h3>
              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-gray-600">登録日時</dt>
                  <dd className="text-gray-900 font-mono mt-1">{new Date(employee.created_at).toLocaleString('ja-JP')}</dd>
                </div>
                {employee.updated_at && (
                  <div>
                    <dt className="text-gray-600">更新日時</dt>
                    <dd className="text-gray-900 font-mono mt-1">{new Date(employee.updated_at).toLocaleString('ja-JP')}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
