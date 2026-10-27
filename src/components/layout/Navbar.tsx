import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowLeft,
  Zap,
  Award,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  LogOut,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    overallProgressPercent,
    completedModulesCount,
    modules,
    userProfile,
    userRole,
    logout,
    finalExamProgress,
    resetProgress,
    applyPreset,
    toasts,
  } = useLMS();

  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const presetRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetRef.current && !presetRef.current.contains(event.target as Node)) {
        setShowPresetMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* ========================================================= */}
          {/* SISI KIRI: KONDISIONAL ANTARA LOGO BRAND / KEMBALI KORIDOR */}
          {/* Sesuai standar Dicoding: saat di ruang belajar (workspace), */}
          {/* logo digantikan dengan tombol "← Kembali ke koridor"       */}
          {/* ========================================================= */}
          <div className="flex items-center">
            {userRole === 'admin' ? (
              <div className="flex items-center gap-2.5 text-left select-none">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-purple-300 border border-slate-700 flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
                  SDI
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                    LMS Statistik Sektoral
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-200 uppercase">
                      Admin
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                    Pusat Kendali Administrator · BPS & SDI
                  </span>
                </div>
              </div>
            ) : activeView === 'workspace' ? (
              <button
                type="button"
                onClick={() => setActiveView('progress')}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-950 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors text-sm font-semibold group"
                title="Kembali ke Progres Belajar (Koridor)"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-blue-950 transition-colors" />
                <span>Kembali ke koridor</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2.5 text-left focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs group-hover:bg-blue-900 transition-colors">
                  SDI
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-blue-950 transition-colors block">
                    LMS Statistik Sektoral
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                    Satu Data Indonesia · BPS
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* ========================================================= */}
          {/* SISI TENGAH: KOSONG & LAPANG                               */}
          {/* ========================================================= */}
          <div className="flex-1" />

          {/* ========================================================= */}
          {/* SISI KANAN: STATUS KILAT, ALAT UJI, NOTIFIKASI & PROFIL   */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {userRole === 'admin' ? (
              /* DEDICATED ADMIN BADGE (Zero Student Chrome) */
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-950 text-xs font-bold shadow-2xs select-none"
                title="Sesi Resmi Administrator SDI"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span className="font-mono tracking-tight">KONSOL ADMINISTRATOR</span>
                <span className="text-[10px] font-semibold text-purple-700 hidden md:inline">· Hak Akses Penuh</span>
              </div>
            ) : (
              <>
                {/* 1. Progress / Streak Pill (Format ⚡ persis Dicoding) */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold shadow-2xs select-none"
                  title={`Progres Pembinaan: ${overallProgressPercent}% selesai (${completedModulesCount} dari ${modules.length} modul)`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-mono">{overallProgressPercent}%</span>
                  <span className="text-[11px] font-normal text-amber-800 hidden sm:inline">Tuntas</span>
                </div>

                {/* 2. Certificate Pill (Muncul bila sudah lulus ujian akhir) */}
                {finalExamProgress.passed && (
                  <button
                    type="button"
                    onClick={() => setActiveView('certificate')}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    title="Buka Sertifikat Kelulusan Resmi"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sertifikat Terbit</span>
                  </button>
                )}

                {/* 3. Simulator Demo Pill (Tombol outline persis Dapatkan Rp50k di Dicoding) */}
                <div className="relative" ref={presetRef}>
                  <button
                    type="button"
                    onClick={() => setShowPresetMenu(!showPresetMenu)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    title="Pilih skenario simulasi modul"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Mode Uji</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {showPresetMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-fade-in">
                      <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                        Skenario Pengujian LMS
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => { applyPreset('fresh'); setShowPresetMenu(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Mulai Awal (Modul 1 Aktif)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { applyPreset('module2'); setShowPresetMenu(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>Modul 1 Selesai → Modul 2 Aktif</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { applyPreset('module4'); setShowPresetMenu(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>Modul 1–3 Selesai → Modul 4 Aktif</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { applyPreset('ready-final'); setShowPresetMenu(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        <span>Semua Modul Tuntas → Buka Ujian</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { applyPreset('completed'); setShowPresetMenu(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-800 font-semibold"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Lulus Lengkap (Sertifikat Terbit)</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={() => { resetProgress(); setShowPresetMenu(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Seluruh Data</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Notification Bell Icon */}
                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                    className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                    title="Pemberitahuan Aktivitas"
                    aria-label="Notifikasi"
                  >
                    <Bell className="w-4 h-4" />
                    {toasts.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
                    )}
                  </button>

                  {showNotificationMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50 text-xs animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                        <span className="font-bold text-slate-900">Pemberitahuan Sistem</span>
                        <button
                          type="button"
                          onClick={() => setShowNotificationMenu(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                          <p className="font-semibold text-blue-950">Kurikulum Statistik Sektoral</p>
                          <p className="text-[11px] text-blue-800 mt-0.5">
                            Anda terdaftar sebagai peserta aktif pembinaan EPSS mandiri Satu Data Indonesia.
                          </p>
                        </div>

                        {completedModulesCount > 0 && (
                          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                            <p className="font-semibold text-emerald-950">Progres Pembelajaran</p>
                            <p className="text-[11px] text-emerald-800 mt-0.5">
                              {completedModulesCount} dari {modules.length} modul telah dinyatakan lulus.
                            </p>
                          </div>
                        )}

                        {finalExamProgress.passed && (
                          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                            <p className="font-semibold text-amber-950">Sertifikat Kelulusan Terbit</p>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                              Sertifikat kompetensi resmi Anda siap diunduh dalam format PDF.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 5. Participant Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 focus:outline-none"
                title="Profil Pengguna"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 transition-all ${
                  userRole === 'admin'
                    ? 'bg-purple-950 text-purple-200 ring-purple-200 hover:ring-purple-900'
                    : 'bg-blue-950 text-white ring-slate-200 hover:ring-blue-900'
                }`}>
                  {userProfile.name.charAt(0)}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 text-xs animate-fade-in">
                  
                  {/* Identity Header */}
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      userRole === 'admin'
                        ? 'bg-purple-950 text-purple-200'
                        : 'bg-blue-950 text-white'
                    }`}>
                      {userProfile.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{userProfile.name}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">NIP {userProfile.nip}</p>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">{userProfile.agency}</p>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          userRole === 'admin'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {userRole === 'admin' ? 'Administrator LMS' : 'Peserta Pelatihan ASN'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="py-3 border-b border-slate-100 space-y-2 text-slate-600">
                    {userRole === 'admin' ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Peran Sistem</span>
                          </span>
                          <span className="font-semibold text-purple-900">
                            Super Administrator
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hak Kelola</span>
                          </span>
                          <span className="font-semibold text-slate-800">
                            Penuh (Kurikulum & Evaluasi)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                            <span>Jabatan</span>
                          </span>
                          <span className="font-medium text-slate-700 truncate max-w-[140px] text-right">
                            {userProfile.jobTitle || 'Pengelola LMS SDI'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Modul terselesaikan</span>
                          </span>
                          <span className="font-semibold text-slate-800">
                            {completedModulesCount} dari {modules.length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Status Ujian Akhir</span>
                          </span>
                          <span className="font-semibold text-slate-800">
                            {finalExamProgress.passed ? `Lulus (${finalExamProgress.score})` : finalExamProgress.status === 'AVAILABLE' ? 'Siap' : 'Terkunci'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                            <span>Jabatan</span>
                          </span>
                          <span className="font-medium text-slate-700 truncate max-w-[140px] text-right">
                            {userProfile.jobTitle || 'Operator Data'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar Akun (Logout)</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
