import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useLMS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 animate-slide-up ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : isError
                ? 'bg-red-50 border-red-200 text-red-950'
                : 'bg-blue-50 border-blue-200 text-blue-950'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {isError && <XCircle className="w-5 h-5 text-red-600" />}
              {isInfo && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1 text-sm">
              <h4 className="font-bold">{toast.title}</h4>
              <p className="mt-0.5 text-xs opacity-90 leading-relaxed">{toast.description}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
