import React from 'react';
import type { ToastKind, ToastMsg } from '../types';


const toastStyle: Record<ToastKind, string> = {
  success: 'bg-emerald-600 text-white',
  info: 'bg-brand-600 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-rose-600 text-white',
};


export const ToastContainer: React.FC<{
  toasts: ToastMsg[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => (
  <div className="fixed top-4 right-4 z-[9999] space-y-2">
    {toasts.map((t) => (
      <div key={t.id} className={"flex items-center gap-3 rounded-lg px-3 py-2 shadow-lg " + toastStyle[t.kind]}>
        <span className="text-sm">{t.msg}</span>
        <button className="ml-1 text-white/80 hover:text-white text-xs" onClick={() => onClose(t.id)}>
          Đóng
        </button>
      </div>
    ))}
  </div>
);