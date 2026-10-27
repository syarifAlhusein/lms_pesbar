import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { DEMO_USERS } from '../../data/modulesData';
import {
  ShieldCheck,
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  Award,
  CheckCircle2,
  Building2,
  Loader2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useLMS();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('NIP/Email dan Kata Sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await login({
        identifier: identifier.trim(),
        password: password.trim(),
      });
      if (!res.success) {
        setErrorMessage(res.message || 'Email atau kata sandi tidak sesuai dengan database.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi gangguan saat memproses login.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (type: 'student' | 'admin') => {
    setErrorMessage(null);
    if (type === 'admin') {
      setIdentifier(DEMO_USERS.admin.email);
      setPassword('admin12345');
    } else {
      setIdentifier(DEMO_USERS.student.email);
      setPassword('peserta12345');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-800 selection:text-white">

      {/* Top Brand Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-blue-900/40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-900/50 border border-blue-400/30">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <span>LMS Pembinaan Statistik Sektoral Terpadu</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>BPS KABUPATEN PESISIR BARAT</span>
        </div>
      </header>

      {/* Main Content: Hero & Unified Login Form */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left Column: Context & Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/50 border border-blue-700/60 text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Portal Pembelajaran & Sertifikasi Resmi ASN</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pusat Pengembangan Kompetensi Statistik Sektoral Daerah
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Portal tunggal bagi aparatur Walidata dan Produsen Data Pemerintah Daerah untuk mengikuti pembinaan materi, evaluasi kompetensi, dan sertifikasi resmi Satu Data Indonesia.
            </p>
          </div>

          {/* 3 Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-blue-900/50 space-y-1">
              <Award className="w-4 h-4 text-emerald-400" />
              <div className="font-bold text-xs text-white">Sertifikat Resmi SDI</div>
              <div className="text-[11px] text-slate-400">Verifikasi QR Code nasional</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-blue-900/50 space-y-1">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <div className="font-bold text-xs text-white">Kurikulum Berjenjang</div>
              <div className="text-[11px] text-slate-400">Pre-test, materi, post-test</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-blue-900/50 space-y-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <div className="font-bold text-xs text-white">Standar BPS RI</div>
              <div className="text-[11px] text-slate-400">Sesuai Perpres No. 39/2019</div>
            </div>
          </div>
        </div>

        {/* Right Column: Unified Single Login Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl shadow-blue-950/60 border border-slate-100 space-y-5">

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Masuk ke Akun Anda
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan NIP atau Alamat Email Dinas resmi yang telah terdaftar.
              </p>
            </div>

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Unified Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP Aparatur / Email Dinas Resmi *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 19920315... atau nama@pesisirbaratkab.go.id"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-900 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Kata Sandi *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Amankan sandi Anda
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem Pembelajaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Testing Auto-Fill Helpers */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Bantuan Pengujian (Isi Otomatis Kredensial):</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleFillDemo('student')}
                  className="p-2 rounded-lg border border-slate-200 hover:border-blue-800 hover:bg-blue-50/50 text-slate-700 text-left transition-colors"
                >
                  <div className="font-semibold text-blue-950">Akun Peserta ASN</div>
                  <div className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                    {DEMO_USERS.student.email}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="p-2 rounded-lg border border-slate-200 hover:border-purple-800 hover:bg-purple-50/50 text-slate-700 text-left transition-colors"
                >
                  <div className="font-semibold text-purple-950">Akun Administrator</div>
                  <div className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                    {DEMO_USERS.admin.email}
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-blue-900/40 text-center text-xs text-slate-400 space-y-1">
        <p>
          LMS Pembinaan Statistik Sektoral © 2026 Pemerintah Kabupaten Pesisir Barat & Badan Pusat Statistik.
        </p>
        <p className="text-[11px] text-slate-500">
          Dilindungi oleh UU No. 16 Tahun 1997 tentang Statistik dan Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia.
        </p>
      </footer>

    </div>
  );
};
