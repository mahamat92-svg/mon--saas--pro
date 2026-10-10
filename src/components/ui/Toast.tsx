'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-in slide-in-from-top-3 ${
              isSuccess
                ? 'bg-slate-900/95 text-slate-100 border-emerald-500/40 shadow-emerald-950/30'
                : isError
                ? 'bg-slate-900/95 text-slate-100 border-rose-500/40 shadow-rose-950/30'
                : 'bg-slate-900/95 text-slate-100 border-indigo-500/40 shadow-indigo-950/30'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertTriangle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-white tracking-wide">{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
