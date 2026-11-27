import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePlatform();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-elevated"
        >
          {toast.variant === 'warning' ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          ) : toast.variant === 'info' ? (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-slate-500">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
