import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { CheckSquare, ArrowRight, Clock, UserCheck } from 'lucide-react';

export const StepAttendance: React.FC = () => {
  const {
    activeModuleId,
    modules,
    moduleProgresses,
    userProfile,
    setAttendance,
    goToStep,
  } = useLMS();

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const progress = moduleProgresses[activeModuleId];
  const attendanceChecked = Boolean(progress?.attendanceChecked);
  const attendanceTimestamp = progress?.attendanceTimestamp;

  const handleContinue = () => {
    if (!attendanceChecked) return;
    goToStep(activeModuleId, 'pretest');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Presensi Peserta: Modul {currentModule.number}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-xl">
          Sebagai bukti keikutsertaan pelatihan resmi, setiap peserta wajib melakukan konfirmasi kehadiran secara mandiri sebelum dapat mengakses soal Entry Test (Pre-Test).
        </p>
      </div>

      {/* Participant Identity Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-xs font-bold text-slate-900">
          <UserCheck className="w-4 h-4 text-blue-900" />
          <span>Data Identitas Peserta Terverifikasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Nama Lengkap & Gelar</span>
            <span className="font-semibold text-slate-800">{userProfile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Nomor Induk Pegawai (NIP)</span>
            <span className="font-mono text-slate-800">{userProfile.nip}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Instansi / Perangkat Daerah</span>
            <span className="text-slate-800">{userProfile.agency}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Modul yang Diikuti</span>
            <span className="font-semibold text-blue-900">Modul {currentModule.number} - {currentModule.code}</span>
          </div>
        </div>
      </div>

      {/* Attendance Declaration Form */}
      <div className={`p-5 rounded-xl border transition-colors ${
        attendanceChecked ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
            attendanceChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
          }`}>
            <CheckSquare className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Pernyataan Kehadiran Pembelajaran
              </h3>
              {attendanceTimestamp && (
                <span className="text-xs font-mono text-emerald-800 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Tercatat: {attendanceTimestamp}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Dengan mencentang pernyataan di bawah ini, saya menyatakan secara sadar dan bertanggung jawab bahwa saya hadir dan mengikuti modul ini secara tuntas.
            </p>

            <label className={`mt-3.5 flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer select-none transition-colors ${
              attendanceChecked
                ? 'bg-white border-emerald-400 text-emerald-950 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={attendanceChecked}
                onChange={(e) => setAttendance(activeModuleId, e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span className="text-xs leading-relaxed">
                Saya menyatakan hadir dan siap mengikuti pembelajaran <strong>Modul {currentModule.number}: {currentModule.title}</strong>.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {attendanceChecked
            ? 'Presensi telah dicatat. Silakan melanjutkan ke Entry Test.'
            : 'Centang pernyataan di atas untuk melanjutkan ke Entry Test.'}
        </span>

        <button
          type="button"
          disabled={!attendanceChecked}
          onClick={handleContinue}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
            attendanceChecked
              ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-xs cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          <span>Lanjut ke Entry Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
