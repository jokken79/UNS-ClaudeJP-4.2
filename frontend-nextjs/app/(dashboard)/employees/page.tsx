'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/lib/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  PencilIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// Complete Employee interface with ALL 42+ fields
interface Employee {
  id: number;
  hakenmoto_id: number;
  rirekisho_id: string | null;
  factory_id: string | null;
  factory_name: string | null;
  hakensaki_shain_id: string | null;
  photo_url: string | null;

  // Personal
  full_name_kanji: string;
  full_name_kana: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  postal_code: string | null;

  // Assignment
  assignment_location: string | null;
  assignment_line: string | null;
  job_description: string | null;

  // Employment
  hire_date: string;
  current_hire_date: string | null;
  entry_request_date: string | null;
  termination_date: string | null;

  // Financial
  jikyu: number;
  jikyu_revision_date: string | null;
  hourly_rate_charged: number | null;
  billing_revision_date: string | null;
  profit_difference: number | null;
  standard_compensation: number | null;
  health_insurance: number | null;
  nursing_insurance: number | null;
  pension_insurance: number | null;
  social_insurance_date: string | null;

  // Visa
  visa_type: string | null;
  zairyu_expire_date: string | null;
  visa_renewal_alert: boolean | null;
  visa_alert_days: number | null;

  // Documents
  license_type: string | null;
  license_expire_date: string | null;
  commute_method: string | null;
  optional_insurance_expire: string | null;
  japanese_level: string | null;
  career_up_5years: boolean | null;

  // Apartment
  apartment_id: number | null;
  apartment_start_date: string | null;
  apartment_move_out_date: string | null;
  apartment_rent: number | null;

  // Yukyu
  yukyu_remaining: number;

  // Status
  current_status: string | null;
  is_active: boolean;
  notes: string | null;
  contract_type: string | null;
}

interface PaginatedResponse {
  items: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Column key type with ALL 44 columns
type ColumnKey =
  | 'photo'
  | 'current_status'
  | 'hakenmoto_id'
  | 'hakensaki_shain_id'
  | 'factory_name'
  | 'assignment_location'
  | 'assignment_line'
  | 'job_description'
  | 'full_name_kanji'
  | 'full_name_kana'
  | 'gender'
  | 'nationality'
  | 'date_of_birth'
  | 'age'
  | 'jikyu'
  | 'jikyu_revision_date'
  | 'hourly_rate_charged'
  | 'billing_revision_date'
  | 'profit_difference'
  | 'standard_compensation'
  | 'health_insurance'
  | 'nursing_insurance'
  | 'pension_insurance'
  | 'zairyu_expire_date'
  | 'visa_renewal_alert'
  | 'visa_type'
  | 'postal_code'
  | 'address'
  | 'apartment_id'
  | 'apartment_start_date'
  | 'hire_date'
  | 'termination_date'
  | 'apartment_move_out_date'
  | 'social_insurance_date'
  | 'entry_request_date'
  | 'notes'
  | 'current_hire_date'
  | 'license_type'
  | 'license_expire_date'
  | 'commute_method'
  | 'optional_insurance_expire'
  | 'japanese_level'
  | 'career_up_5years'
  | 'actions';

interface ColumnDefinition {
  key: ColumnKey;
  label: string;
  defaultWidth: number;
  render: (employee: Employee) => React.ReactNode;
}

// Resizable Column Component
interface ResizableColumnProps {
  columnKey: ColumnKey;
  width: number;
  onResize: (key: ColumnKey, width: number) => void;
  children: React.ReactNode;
  isSticky?: boolean;
}

const ResizableColumn: React.FC<ResizableColumnProps> = ({
  columnKey,
  width,
  onResize,
  children,
  isSticky = false,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(80, Math.min(500, startWidth + diff));
      onResize(columnKey, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <th
      style={{
        width: `${width}px`,
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
        position: isSticky ? 'sticky' : 'relative',
        left: isSticky ? 0 : 'auto',
        zIndex: isSticky ? 20 : 10,
        backgroundColor: isSticky ? '#f9fafb' : 'transparent',
      }}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
    >
      <div className="flex items-center justify-between">
        {children}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 ${
          isResizing ? 'bg-blue-500' : 'bg-transparent'
        }`}
        style={{ zIndex: 30 }}
      />
    </th>
  );
};

export default function EmployeesPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(''); // Local input value
  const [searchTerm, setSearchTerm] = useState(''); // Debounced search value
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterFactory, setFilterFactory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const pageSize = 500;

  // Debounce search input - espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load column widths from localStorage
  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('employeeColumnWidths');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse column widths:', e);
        }
      }
    }
    // Default widths for all columns
    return {
      photo: 80,
      current_status: 100,
      hakenmoto_id: 100,
      hakensaki_shain_id: 140,
      factory_name: 180,
      assignment_location: 120,
      assignment_line: 120,
      job_description: 200,
      full_name_kanji: 140,
      full_name_kana: 140,
      gender: 80,
      nationality: 100,
      date_of_birth: 120,
      age: 80,
      jikyu: 100,
      jikyu_revision_date: 120,
      hourly_rate_charged: 120,
      billing_revision_date: 120,
      profit_difference: 120,
      standard_compensation: 120,
      health_insurance: 120,
      nursing_insurance: 120,
      pension_insurance: 120,
      zairyu_expire_date: 120,
      visa_renewal_alert: 140,
      visa_type: 140,
      postal_code: 120,
      address: 250,
      apartment_id: 120,
      apartment_start_date: 120,
      hire_date: 120,
      termination_date: 120,
      apartment_move_out_date: 120,
      social_insurance_date: 120,
      entry_request_date: 120,
      notes: 200,
      current_hire_date: 120,
      license_type: 120,
      license_expire_date: 120,
      commute_method: 120,
      optional_insurance_expire: 140,
      japanese_level: 120,
      career_up_5years: 140,
      actions: 120,
    };
  });

  // Load visible columns from localStorage - Default to top 10 important columns
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('employeeVisibleColumns');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // ALWAYS ensure 'photo' column exists in saved data (for backward compatibility)
          if (!('photo' in parsed)) {
            parsed.photo = true;
          }
          return parsed;
        } catch (e) {
          console.error('Failed to parse visible columns:', e);
        }
      }
    }
    // Default visible columns (top 10)
    return {
      photo: true,
      current_status: true,
      hakenmoto_id: true,
      hakensaki_shain_id: true,
      factory_name: true,
      assignment_location: false,
      assignment_line: false,
      job_description: false,
      full_name_kanji: true,
      full_name_kana: false,
      gender: false,
      nationality: false,
      date_of_birth: false,
      age: false,
      jikyu: true,
      jikyu_revision_date: false,
      hourly_rate_charged: false,
      billing_revision_date: false,
      profit_difference: false,
      standard_compensation: false,
      health_insurance: false,
      nursing_insurance: false,
      pension_insurance: false,
      zairyu_expire_date: true,
      visa_renewal_alert: false,
      visa_type: false,
      postal_code: false,
      address: false,
      apartment_id: false,
      apartment_start_date: false,
      hire_date: true,
      termination_date: false,
      apartment_move_out_date: false,
      social_insurance_date: false,
      entry_request_date: false,
      notes: true,
      current_hire_date: false,
      license_type: false,
      license_expire_date: false,
      commute_method: false,
      optional_insurance_expire: false,
      japanese_level: false,
      career_up_5years: false,
      actions: true,
    };
  });

  // Save to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('employeeColumnWidths', JSON.stringify(columnWidths));
    }
  }, [columnWidths]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('employeeVisibleColumns', JSON.stringify(visibleColumns));
    }
  }, [visibleColumns]);

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

  // Helper functions
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return `¥${amount.toLocaleString()}`;
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age}歳`;
  };

  const getStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      active: { label: '在籍中', color: 'bg-green-100 text-green-800' },
      terminated: { label: '退社済', color: 'bg-gray-100 text-gray-800' },
      suspended: { label: '休職中', color: 'bg-yellow-100 text-yellow-800' },
    };

    const statusInfo = status ? statusMap[status] : null;
    if (!statusInfo) return '-';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getVisaAlertBadge = (alert: boolean | null, expireDate: string | null) => {
    if (!alert) return '-';

    const isExpiringSoon = expireDate && new Date(expireDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isExpiringSoon ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isExpiringSoon ? '⚠️ 要更新' : '⚠️ 確認'}
      </span>
    );
  };

  // All 44 column definitions in Excel order
  const columnDefinitions: ColumnDefinition[] = [
    {
      key: 'photo',
      label: '写真',
      defaultWidth: 80,
      render: (emp) => (
        emp.photo_url ? (
          <img
            src={emp.photo_url}
            alt={emp.full_name_kanji}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
          </div>
        )
      ),
    },
    {
      key: 'current_status',
      label: '現在',
      defaultWidth: 100,
      render: (emp) => getStatusBadge(emp.current_status),
    },
    {
      key: 'hakenmoto_id',
      label: '社員№',
      defaultWidth: 100,
      render: (emp) => emp.hakenmoto_id,
    },
    {
      key: 'hakensaki_shain_id',
      label: '派遣先ID',
      defaultWidth: 140,
      render: (emp) => (
        <span className="font-medium text-blue-600">{emp.hakensaki_shain_id || '-'}</span>
      ),
    },
    {
      key: 'factory_name',
      label: '派遣先',
      defaultWidth: 180,
      render: (emp) => emp.factory_name || emp.factory_id || '-',
    },
    {
      key: 'assignment_location',
      label: '配属先',
      defaultWidth: 120,
      render: (emp) => emp.assignment_location || '-',
    },
    {
      key: 'assignment_line',
      label: '配属ライン',
      defaultWidth: 120,
      render: (emp) => emp.assignment_line || '-',
    },
    {
      key: 'job_description',
      label: '仕事内容',
      defaultWidth: 200,
      render: (emp) => (
        <span className="truncate max-w-[180px] inline-block" title={emp.job_description || ''}>
          {emp.job_description || '-'}
        </span>
      ),
    },
    {
      key: 'full_name_kanji',
      label: '氏名',
      defaultWidth: 140,
      render: (emp) => emp.full_name_kanji,
    },
    {
      key: 'full_name_kana',
      label: 'カナ',
      defaultWidth: 140,
      render: (emp) => emp.full_name_kana || '-',
    },
    {
      key: 'gender',
      label: '性別',
      defaultWidth: 80,
      render: (emp) => emp.gender || '-',
    },
    {
      key: 'nationality',
      label: '国籍',
      defaultWidth: 100,
      render: (emp) => emp.nationality || '-',
    },
    {
      key: 'date_of_birth',
      label: '生年月日',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.date_of_birth),
    },
    {
      key: 'age',
      label: '年齢',
      defaultWidth: 80,
      render: (emp) => calculateAge(emp.date_of_birth),
    },
    {
      key: 'jikyu',
      label: '時給',
      defaultWidth: 100,
      render: (emp) => formatCurrency(emp.jikyu),
    },
    {
      key: 'jikyu_revision_date',
      label: '時給改定',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.jikyu_revision_date),
    },
    {
      key: 'hourly_rate_charged',
      label: '請求単価',
      defaultWidth: 120,
      render: (emp) => formatCurrency(emp.hourly_rate_charged),
    },
    {
      key: 'billing_revision_date',
      label: '請求改定',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.billing_revision_date),
    },
    {
      key: 'profit_difference',
      label: '差額利益',
      defaultWidth: 120,
      render: (emp) => formatCurrency(emp.profit_difference),
    },
    {
      key: 'standard_compensation',
      label: '標準報酬',
      defaultWidth: 120,
      render: (emp) => formatCurrency(emp.standard_compensation),
    },
    {
      key: 'health_insurance',
      label: '健康保険',
      defaultWidth: 120,
      render: (emp) => formatCurrency(emp.health_insurance),
    },
    {
      key: 'nursing_insurance',
      label: '介護保険',
      defaultWidth: 120,
      render: (emp) => formatCurrency(emp.nursing_insurance),
    },
    {
      key: 'pension_insurance',
      label: '厚生年金',
      defaultWidth: 120,
      render: (emp) => formatCurrency(emp.pension_insurance),
    },
    {
      key: 'zairyu_expire_date',
      label: 'ビザ期限',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.zairyu_expire_date),
    },
    {
      key: 'visa_renewal_alert',
      label: 'ｱﾗｰﾄ(ﾋﾞｻﾞ更新)',
      defaultWidth: 140,
      render: (emp) => getVisaAlertBadge(emp.visa_renewal_alert, emp.zairyu_expire_date),
    },
    {
      key: 'visa_type',
      label: 'ビザ種類',
      defaultWidth: 140,
      render: (emp) => emp.visa_type || '-',
    },
    {
      key: 'postal_code',
      label: '〒',
      defaultWidth: 120,
      render: (emp) => emp.postal_code || '-',
    },
    {
      key: 'address',
      label: '住所',
      defaultWidth: 250,
      render: (emp) => (
        <span className="truncate max-w-[230px] inline-block" title={emp.address || ''}>
          {emp.address || '-'}
        </span>
      ),
    },
    {
      key: 'apartment_id',
      label: 'ｱﾊﾟｰﾄ',
      defaultWidth: 120,
      render: (emp) => emp.apartment_id ? `#${emp.apartment_id}` : '-',
    },
    {
      key: 'apartment_start_date',
      label: '入居',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.apartment_start_date),
    },
    {
      key: 'hire_date',
      label: '入社日',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.hire_date),
    },
    {
      key: 'termination_date',
      label: '退社日',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.termination_date),
    },
    {
      key: 'apartment_move_out_date',
      label: '退去',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.apartment_move_out_date),
    },
    {
      key: 'social_insurance_date',
      label: '社保加入',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.social_insurance_date),
    },
    {
      key: 'entry_request_date',
      label: '入社依頼',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.entry_request_date),
    },
    {
      key: 'notes',
      label: '備考',
      defaultWidth: 200,
      render: (emp) => (
        <span className="truncate max-w-[180px] inline-block" title={emp.notes || ''}>
          {emp.notes || '-'}
        </span>
      ),
    },
    {
      key: 'current_hire_date',
      label: '現入社',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.current_hire_date),
    },
    {
      key: 'license_type',
      label: '免許種類',
      defaultWidth: 120,
      render: (emp) => emp.license_type || '-',
    },
    {
      key: 'license_expire_date',
      label: '免許期限',
      defaultWidth: 120,
      render: (emp) => formatDate(emp.license_expire_date),
    },
    {
      key: 'commute_method',
      label: '通勤方法',
      defaultWidth: 120,
      render: (emp) => emp.commute_method || '-',
    },
    {
      key: 'optional_insurance_expire',
      label: '任意保険期限',
      defaultWidth: 140,
      render: (emp) => formatDate(emp.optional_insurance_expire),
    },
    {
      key: 'japanese_level',
      label: '日本語検定',
      defaultWidth: 120,
      render: (emp) => emp.japanese_level || '-',
    },
    {
      key: 'career_up_5years',
      label: 'キャリアアップ5年目',
      defaultWidth: 140,
      render: (emp) => emp.career_up_5years ? '✓ 該当' : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      defaultWidth: 120,
      render: (emp) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/employees/${emp.id}`)}
            className="text-blue-600 hover:text-blue-900"
            title="詳細を見る"
          >
            <EyeIcon className="h-5 w-5 inline" />
          </button>
          <button
            onClick={() => router.push(`/employees/${emp.id}/edit`)}
            className="text-gray-600 hover:text-gray-900"
            title="編集"
          >
            <PencilIcon className="h-5 w-5 inline" />
          </button>
        </div>
      ),
    },
  ];

  const handleColumnResize = (key: ColumnKey, width: number) => {
    setColumnWidths((prev) => ({ ...prev, [key]: width }));
  };

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
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
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

            {/* Column Selector Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  表示中: {visibleColumnDefinitions.length}列 / 全{columnDefinitions.length}列
                </span>
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  {showColumnSelector ? '列選択を閉じる' : '列を選択'}
                </button>
              </div>

              {/* Column Selector Panel */}
              {showColumnSelector && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">表示する列を選択</span>
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
                            photo: true,
                            current_status: true,
                            hakenmoto_id: true,
                            hakensaki_shain_id: true,
                            factory_name: true,
                            assignment_location: false,
                            assignment_line: false,
                            job_description: false,
                            full_name_kanji: true,
                            full_name_kana: false,
                            gender: false,
                            nationality: false,
                            date_of_birth: false,
                            age: false,
                            jikyu: true,
                            jikyu_revision_date: false,
                            hourly_rate_charged: false,
                            billing_revision_date: false,
                            profit_difference: false,
                            standard_compensation: false,
                            health_insurance: false,
                            nursing_insurance: false,
                            pension_insurance: false,
                            zairyu_expire_date: true,
                            visa_renewal_alert: false,
                            visa_type: false,
                            postal_code: false,
                            address: false,
                            apartment_id: false,
                            apartment_start_date: false,
                            hire_date: true,
                            termination_date: false,
                            apartment_move_out_date: false,
                            social_insurance_date: false,
                            entry_request_date: false,
                            notes: true,
                            current_hire_date: false,
                            license_type: false,
                            license_expire_date: false,
                            commute_method: false,
                            optional_insurance_expire: false,
                            japanese_level: false,
                            career_up_5years: false,
                            actions: true,
                          });
                        }}
                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        デフォルト
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {columnDefinitions.map((column) => (
                      <label
                        key={column.key}
                        className="inline-flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition"
                      >
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">エラーが発生しました。もう一度お試しください。</p>
          </div>
        )}

        {/* Employees Table with Horizontal Scroll */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
            <table className="w-full divide-y divide-gray-200" style={{ minWidth: 'max-content' }}>
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  {visibleColumnDefinitions.map((column, index) => (
                    <ResizableColumn
                      key={column.key}
                      columnKey={column.key}
                      width={columnWidths[column.key] || column.defaultWidth}
                      onResize={handleColumnResize}
                      isSticky={index === 0} // Make first column (社員№) sticky
                    >
                      {column.label}
                    </ResizableColumn>
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
                      {visibleColumnDefinitions.map((column, index) => (
                        <td
                          key={column.key}
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100"
                          style={{
                            width: `${columnWidths[column.key] || column.defaultWidth}px`,
                            minWidth: `${columnWidths[column.key] || column.defaultWidth}px`,
                            maxWidth: `${columnWidths[column.key] || column.defaultWidth}px`,
                            position: index === 0 ? 'sticky' : 'relative',
                            left: index === 0 ? 0 : 'auto',
                            zIndex: index === 0 ? 5 : 1,
                            backgroundColor: index === 0 ? 'white' : 'transparent',
                          }}
                        >
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
