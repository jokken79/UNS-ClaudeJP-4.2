'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/lib/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Employee {
  id: number;
  hakenmoto_id: number;
  uns_id: string;
  full_name_kanji: string;
  full_name_kana: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  visa_type: string | null;
  zairyu_expire_date: string | null;
  factory_id: string;
  factory_name: string | null;
  hire_date: string;
  jikyu: number;
  hourly_rate_charged: number | null;
  contract_type: string | null;
  is_active: boolean;
  termination_date: string | null;
  yukyu_remaining: number;
  status?: string;
}

interface PaginatedResponse {
  items: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

type ColumnKey =
  | 'employeeNumber'
  | 'fullName'
  | 'kanaName'
  | 'dateOfBirth'
  | 'gender'
  | 'nationality'
  | 'contractType'
  | 'factory'
  | 'hourlyWage'
  | 'hourlyRateCharged'
  | 'hireDate'
  | 'phone'
  | 'email'
  | 'address'
  | 'visaType'
  | 'zairyuExpireDate'
  | 'yukyuRemaining'
  | 'status'
  | 'terminationDate'
  | 'actions';

interface ColumnDefinition {
  key: ColumnKey;
  label: string;
  headerClassName: string;
  cellClassName: string;
  render: (employee: Employee) => React.ReactNode;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterFactory, setFilterFactory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 500;

  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    employeeNumber: true,
    fullName: true,
    kanaName: true,
    dateOfBirth: false,
    gender: false,
    nationality: true,
    contractType: true,
    factory: true,
    hourlyWage: true,
    hourlyRateCharged: false,
    hireDate: true,
    phone: false,
    email: false,
    address: false,
    visaType: false,
    zairyuExpireDate: false,
    yukyuRemaining: false,
    status: true,
    terminationDate: false,
    actions: true,
  });

  // Fetch employees with React Query
  const { data, isLoading, error } = useQuery<PaginatedResponse>({
    queryKey: ['employees', currentPage, searchTerm, filterActive, filterFactory],
    queryFn: async () => {
      const params: any = {
        page: currentPage,
        page_size: pageSize,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterActive !== null) params.is_active = filterActive;
      if (filterFactory) params.factory_id = filterFactory;

      return employeeService.getEmployees(params);
    },
  });

  const employees = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          在籍中
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${type.color}`}>
        {type.label}
      </span>
    );
  };

  const columnDefinitions: ColumnDefinition[] = [
    {
      key: 'employeeNumber',
      label: '社員№',
      headerClassName: 'px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900',
      render: (employee) => employee.hakenmoto_id,
    },
    {
      key: 'fullName',
      label: '氏名',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      render: (employee) => employee.full_name_kanji,
    },
    {
      key: 'kanaName',
      label: 'カナ',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => employee.full_name_kana || '-',
    },
    {
      key: 'dateOfBirth',
      label: '生年月日',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => formatDate(employee.date_of_birth),
    },
    {
      key: 'gender',
      label: '性別',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => employee.gender || '-',
    },
    {
      key: 'nationality',
      label: '国籍',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => employee.nationality || '-',
    },
    {
      key: 'contractType',
      label: '契約形態',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm',
      render: (employee) => getContractTypeBadge(employee.contract_type),
    },
    {
      key: 'factory',
      label: '派遣先',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      render: (employee) => employee.factory_name || employee.factory_id || '-',
    },
    {
      key: 'hourlyWage',
      label: '時給',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      render: (employee) => formatCurrency(employee.jikyu),
    },
    {
      key: 'hourlyRateCharged',
      label: '請求時給',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      render: (employee) => formatCurrency(employee.hourly_rate_charged || 0),
    },
    {
      key: 'hireDate',
      label: '入社日',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => formatDate(employee.hire_date),
    },
    {
      key: 'phone',
      label: '電話番号',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => employee.phone || '-',
    },
    {
      key: 'email',
      label: 'メール',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => employee.email || '-',
    },
    {
      key: 'address',
      label: '住所',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate',
      render: (employee) => employee.address || '-',
    },
    {
      key: 'visaType',
      label: 'ビザ種類',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => employee.visa_type || '-',
    },
    {
      key: 'zairyuExpireDate',
      label: '在留期限',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => formatDate(employee.zairyu_expire_date),
    },
    {
      key: 'yukyuRemaining',
      label: '有給残日数',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      render: (employee) => `${employee.yukyu_remaining || 0}日`,
    },
    {
      key: 'status',
      label: '状態',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap',
      render: (employee) => getStatusBadge(employee.is_active),
    },
    {
      key: 'terminationDate',
      label: '退社日',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      render: (employee) => formatDate(employee.termination_date),
    },
    {
      key: 'actions',
      label: '操作',
      headerClassName: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cellClassName: 'px-6 py-4 whitespace-nowrap text-sm font-medium',
      render: (employee) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/employees/${employee.id}`)}
            className="text-blue-600 hover:text-blue-900"
            title="詳細を見る"
          >
            <EyeIcon className="h-5 w-5 inline" />
          </button>
          <button
            onClick={() => router.push(`/employees/${employee.id}/edit`)}
            className="text-gray-600 hover:text-gray-900"
            title="編集"
          >
            <PencilIcon className="h-5 w-5 inline" />
          </button>
        </div>
      ),
    },
  ];

  const handleColumnToggle = (key: ColumnKey) => {
    setVisibleColumns((prev) => {
      const visibleCount = Object.values(prev).filter(Boolean).length;
      if (visibleCount <= 1 && prev[key]) {
        return prev;
      }
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const visibleColumnDefinitions = columnDefinitions.filter((column) => visibleColumns[column.key]);

  const activeCount = employees.filter((e) => e.is_active).length;
  const inactiveCount = employees.filter((e) => !e.is_active).length;

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">総従業員数</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="text-4xl font-black">{total}</p>
            <p className="text-xs opacity-75 mt-1">登録済みデータベース</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">在籍中</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-4xl font-black">{activeCount}</p>
            <p className="text-xs opacity-75 mt-1">アクティブ従業員</p>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">退社済</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-4xl font-black">{inactiveCount}</p>
            <p className="text-xs opacity-75 mt-1">非アクティブ</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              従業員管理
            </h1>
            <p className="mt-2 text-sm text-gray-600">全{total}名の従業員を管理</p>
          </div>
          <button
            onClick={() => router.push('/employees/new')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
          >
            <UserPlusIcon className="h-5 w-5" />
            新規登録
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">検索</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="氏名または社員番号で検索..."
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">在籍状況</label>
                <div className="relative">
                  <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    value={filterActive === null ? '' : filterActive.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterActive(value === '' ? null : value === 'true');
                      setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">全て</option>
                    <option value="true">在籍中</option>
                    <option value="false">退社済</option>
                  </select>
                </div>
              </div>

              {/* Factory Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">派遣先</label>
                <input
                  type="text"
                  value={filterFactory}
                  onChange={(e) => {
                    setFilterFactory(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Factory-XX"
                  className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Column Selector */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">表示する列</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allVisible = Object.keys(visibleColumns).reduce((acc, key) => {
                        acc[key as ColumnKey] = true;
                        return acc;
                      }, {} as Record<ColumnKey, boolean>);
                      setVisibleColumns(allVisible);
                    }}
                    className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    全て表示
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleColumns({
                        employeeNumber: true,
                        fullName: true,
                        kanaName: true,
                        dateOfBirth: false,
                        gender: false,
                        nationality: true,
                        contractType: true,
                        factory: true,
                        hourlyWage: true,
                        hourlyRateCharged: false,
                        hireDate: true,
                        phone: false,
                        email: false,
                        address: false,
                        visaType: false,
                        zairyuExpireDate: false,
                        yukyuRemaining: false,
                        status: true,
                        terminationDate: false,
                        actions: true,
                      });
                    }}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    デフォルト
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {columnDefinitions.map((column) => (
                  <label key={column.key} className="inline-flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      checked={visibleColumns[column.key]}
                      onChange={() => handleColumnToggle(column.key)}
                    />
                    <span className="ml-2">{column.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">※最低1列は表示する必要があります。</p>
              <p className="mt-1 text-xs text-blue-600 font-medium">
                💡 表示中: {visibleColumnDefinitions.length}列 / 全{columnDefinitions.length}列
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">エラーが発生しました。もう一度お試しください。</p>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table
              className="w-full divide-y divide-gray-200"
              style={{ minWidth: `${Math.max(visibleColumnDefinitions.length * 220, 1800)}px` }}
            >
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {visibleColumnDefinitions.map((column) => (
                    <th key={column.key} className={column.headerClassName}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumnDefinitions.length} className="px-6 py-12 text-center text-sm text-gray-500">
                      従業員が見つかりませんでした
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-blue-50/50 transition-colors">
                      {visibleColumnDefinitions.map((column) => (
                        <td key={column.key} className={column.cellClassName}>
                          {column.render(employee)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition"
                >
                  前へ
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition"
                >
                  次へ
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{total}</span> 件中{' '}
                    <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> -{' '}
                    <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> 件を表示
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition"
                    >
                      前へ
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      const page = idx + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition ${
                            currentPage === page
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition"
                    >
                      次へ
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
