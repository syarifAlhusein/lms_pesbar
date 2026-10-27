import React, { useState } from 'react';
import { AdminSubView } from '../../types/lms';
import { AdminOverview } from './AdminOverview';
import { AdminCourseManager } from './AdminCourseManager';
import { AdminQuestionBank } from './AdminQuestionBank';
import { AdminStudentMonitor } from './AdminStudentMonitor';
import { AdminCertificateLog } from './AdminCertificateLog';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Users,
  Award,
  ShieldCheck
} from 'lucide-react';

export const AdminWorkspace: React.FC = () => {
  const [subView, setSubView] = useState<AdminSubView>('overview');

  const navItems: { id: AdminSubView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Ringkasan Eksekutif', icon: LayoutDashboard },
    { id: 'courses', label: 'Manajemen Kelas & Silabus', icon: BookOpen },
    { id: 'questions', label: 'Bank Soal Evaluasi', icon: FileQuestion },
    { id: 'students', label: 'Monitoring Peserta ASN', icon: Users },
    { id: 'certificates', label: 'Buku Register Sertifikat', icon: Award },
  ];

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* 1. Header Bar Admin */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUPER ADMINISTRATOR PORTAL</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-medium">
              Komite Satu Data Indonesia & BPS
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Pusat Kendali Pembinaan & Evaluasi SDI
          </h1>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Kelola kurikulum, susun instrumen materi dan bank soal, pantau progres peserta ASN, dan awasi integritas sertifikat kelulusan daerah.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-purple-200">KONSOL AKTIF · KONTROL PENUH</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = subView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubView(item.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-View Canvas */}
      <div>
        {subView === 'overview' && <AdminOverview onNavigate={setSubView} />}
        {subView === 'courses' && <AdminCourseManager />}
        {subView === 'questions' && <AdminQuestionBank />}
        {subView === 'students' && <AdminStudentMonitor />}
        {subView === 'certificates' && <AdminCertificateLog />}
      </div>

    </div>
  );
};
