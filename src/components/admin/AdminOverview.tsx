import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  BookOpen,
  Layers,
  FileQuestion,
  Users,
  Database,
  ArrowRight
} from 'lucide-react';
import { AdminSubView } from '../../types/lms';

interface AdminOverviewProps {
  onNavigate: (view: AdminSubView) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const { courses, modules } = useLMS();
  const supabaseConnected = isSupabaseConfigured();

  // Calculate total questions across all modules and courses
  const totalQuestions =
    modules.reduce(
      (acc, m) => acc + (m.preTestQuestions?.length || 0) + (m.postTestQuestions?.length || 0),
      0
    ) +
    courses.reduce(
      (acc, c) => acc + (c.finalExam?.questions?.length || 0),
      0
    );

  return (
    <div className="space-y-6">
      
      {/* 1. Supabase Backend Connectivity Card */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          supabaseConnected
            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/70 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                supabaseConnected ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">
                  {supabaseConnected
                    ? 'Database Supabase Terhubung Aktif'
                    : 'Backend Database: Mode Lokal / Standby'}
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    supabaseConnected
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {supabaseConnected ? 'ONLINE' : 'LOCAL DEMO'}
                </span>
              </div>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {supabaseConnected
                  ? 'Koneksi ke PostgreSQL Supabase aktif. Perubahan data kelas, modul, dan bank soal tersinkronisasi otomatis secara cloud.'
                  : 'Aplikasi saat ini berjalan menggunakan data lokal terstruktur. Untuk beralih ke backend Supabase dinamis, cukup tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di berkas .env Anda.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
              Skema: <strong className="text-slate-900">supabase/schema.sql</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Kelas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Kelas Terdaftar</span>
            <BookOpen className="w-4 h-4 text-blue-900" />
          </div>
          <div className="pt-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {courses.length}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Program SDI</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 inline-flex items-center gap-1"
            >
              <span>Kelola Kelas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Total Modul */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Modul Pembelajaran</span>
            <Layers className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="pt-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {modules.length}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Modul Berjenjang</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
            >
              <span>Lihat Silabus</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Total Bank Soal */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Bank Soal Terintegrasi</span>
            <FileQuestion className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="pt-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {totalQuestions}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Butir Soal</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('questions')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              <span>Kelola Bank Soal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Total Peserta Terdaftar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Peserta ASN Terdaftar</span>
            <Users className="w-4 h-4 text-purple-700" />
          </div>
          <div className="pt-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              14
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">OPD / Walidata</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
            >
              <span>Monitoring Peserta</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Program Breakdown Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Classes Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Daftar Program Pembinaan Aktif
            </h3>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {courses.length} Kelas
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.map((course) => {
              const courseModules = modules.filter(m => course.moduleIds.includes(m.id));
              return (
                <div key={course.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900">
                        {course.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                      {course.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {courseModules.length} Modul · KKM Ujian Akhir {course.finalExam?.passingScore || 80}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('courses')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs shrink-0"
                  >
                    Detail
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Action Shortcuts & Documentation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Panduan Integrasi Supabase
            </h3>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
              v1.0 Ready
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-900 block">Langkah 1: Eksekusi SQL di Supabase</span>
              <p>
                Buka SQL Editor di Dashboard Supabase Anda, lalu jalankan seluruh skrip pada berkas <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-900">supabase/schema.sql</code> dan <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-900">supabase/seed.sql</code>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-900 block">Langkah 2: Tambahkan Variabel Lingkungan</span>
              <p>
                Salin berkas <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-900">.env.example</code> menjadi <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-900">.env</code> lalu isikan Project URL dan Anon Public Key.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
