import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: 'border-emerald-100 bg-emerald-50/95 dark:border-emerald-950 dark:bg-emerald-950/90 text-emerald-950 dark:text-emerald-100',
    error: 'border-rose-100 bg-rose-50/95 dark:border-rose-950 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100',
    info: 'border-blue-100 bg-blue-50/95 dark:border-blue-950 dark:bg-blue-950/90 text-blue-950 dark:text-blue-100',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md animate-slide-in duration-300 ${colors[toast.type]}`}
      style={{ direction: 'rtl' }}
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
      >
        <X className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
};
