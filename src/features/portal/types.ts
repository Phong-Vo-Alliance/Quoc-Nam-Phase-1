// Định nghĩa tất cả type & interface
export type BadgeType = 'processing' | 'waiting' | 'done' | 'danger' | 'neutral';
export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export interface ToastMsg {
  id: string;
  kind: ToastKind;
  msg: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'waiting' | 'processing' | 'done';
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadThread {
  id: string;
  t: string;
  type: 'Nội bộ' | 'POS';
  owner: string;
  st: 'Đang xử lý' | 'Chờ phản hồi' | 'Đã chốt';
  at: string;
}
