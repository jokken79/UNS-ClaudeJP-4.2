// Tipos para la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  factory_id: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}