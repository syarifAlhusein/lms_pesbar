import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="font-semibold text-slate-700">
              Sistem Pembinaan Penyelenggaraan Statistik Sektoral (PSS)
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a
              href="https://satudata.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>Portal SDI Nasional</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://romantik.bps.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>ROMANTIK BPS</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-400 text-[11px] gap-2">
          <p>© 2026 Badan Pusat Statistik & Komite Satu Data Indonesia.</p>
          <p>Sesuai Standar Perpres No. 39/2019 & Perka BPS No. 5/2020</p>
        </div>
      </div>
    </footer>
  );
};
