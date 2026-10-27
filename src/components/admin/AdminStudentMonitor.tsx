import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Search,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';

interface MockStudent {
  id: string;
  nip: string;
  name: string;
  agency: string;
  role: string;
  enrolledCourseTitle: string;
  completedModules: number;
  totalModules: number;
  avgScore: number;
  finalExamStatus: 'PASSED' | 'FAILED' | 'READY' | 'LOCKED';
  certificateNumber?: string;
}

export const AdminStudentMonitor: React.FC = () => {
  const { userProfile, showToast } = useLMS();

  // Seed realistic government participants across municipal agencies
  const [students, setStudents] = useState<MockStudent[]>([
    {
      id: 'usr-01',
      nip: userProfile.nip,
      name: userProfile.name,
      agency: userProfile.agency,
      role: 'Walidata Daerah',
      enrolledCourseTitle: 'Pembinaan Statistik Sektoral 2026',
      completedModules: 0,
      totalModules: 4,
      avgScore: 0,
      finalExamStatus: 'LOCKED',
    },
    {
      id: 'usr-02',
      nip: '198804152010011003',
      name: 'Rahmat Hidayat, S.Kom., M.T.',
      agency: 'Dinas Komunikasi, Informatika, dan Statistik',
      role: 'Walidata Teknis',
      enrolledCourseTitle: 'Pembinaan Statistik Sektoral 2026',
      completedModules: 4,
      totalModules: 4,
      avgScore: 92,
      finalExamStatus: 'PASSED',
      certificateNumber: 'PSS/2026/SDI-880415',
    },
    {
      id: 'usr-03',
      nip: '199203112015022001',
      name: 'Siti Nurhaliza, S.Stat.',
      agency: 'Badan Perencanaan Pembangunan Daerah (Bappeda)',
      role: 'Sekretariat Forum SDI',
      enrolledCourseTitle: 'Tata Kelola Metadata Statistik 2026',
      completedModules: 3,
      totalModules: 3,
      avgScore: 88,
      finalExamStatus: 'PASSED',
      certificateNumber: 'META/2026/SDI-920311',
    },
    {
      id: 'usr-04',
      nip: '198507202008011005',
      name: 'Budi Santoso, S.E., M.Si.',
      agency: 'Dinas Kesehatan Kabupaten',
      role: 'Produsen Data',
      enrolledCourseTitle: 'Pembinaan Statistik Sektoral 2026',
      completedModules: 2,
      totalModules: 4,
      avgScore: 78,
      finalExamStatus: 'LOCKED',
    },
    {
      id: 'usr-05',
      nip: '199012052014032002',
      name: 'Dewi Anggraeni, S.Si.',
      agency: 'Dinas Tanaman Pangan & Hortikultura',
      role: 'Produsen Data',
      enrolledCourseTitle: 'Tata Kelola Metadata Statistik 2026',
      completedModules: 1,
      totalModules: 3,
      avgScore: 82,
      finalExamStatus: 'LOCKED',
    },
    {
      id: 'usr-06',
      nip: '198709142011011004',
      name: 'Agus Purnomo, S.T.',
      agency: 'Dinas Pekerjaan Umum dan Penataan Ruang',
      role: 'Produsen Data',
      enrolledCourseTitle: 'Pembinaan Statistik Sektoral 2026',
      completedModules: 4,
      totalModules: 4,
      avgScore: 85,
      finalExamStatus: 'READY',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('all');

  const agencies = Array.from(new Set(students.map((s) => s.agency)));

  const filteredStudents = students.filter((s) => {
    const matchAgency = selectedAgency === 'all' || s.agency === selectedAgency;
    const matchSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nip.includes(searchQuery) ||
      s.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAgency && matchSearch;
  });

  const handleResetParticipant = (studentId: string, studentName: string) => {
    if (confirm(`Reset status dan progres belajar peserta ${studentName}?`)) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, completedModules: 0, avgScore: 0, finalExamStatus: 'LOCKED' }
            : s
        )
      );
      showToast('info', 'Progres Direset', `Progres ${studentName} dikembalikan ke awal.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Monitoring Peserta ASN & Status Pembinaan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau progres belajar, kehadiran, nilai evaluasi, dan status kelulusan peserta lintas Organisasi Perangkat Daerah (OPD).
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama peserta, NIP, atau OPD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-900 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-900 text-xs bg-white text-slate-700"
            >
              <option value="all">Semua Instansi / OPD ({agencies.length})</option>
              {agencies.map((agency) => (
                <option key={agency} value={agency}>
                  {agency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Menampilkan <strong className="text-slate-900">{filteredStudents.length}</strong> peserta ASN
          </span>
          {(searchQuery !== '' || selectedAgency !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedAgency('all');
              }}
              className="text-blue-900 font-semibold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama & NIP Peserta</th>
                <th className="py-3 px-4">Instansi / OPD</th>
                <th className="py-3 px-4">Program Kelas</th>
                <th className="py-3 px-4">Progres Modul</th>
                <th className="py-3 px-4">Skor Evaluasi</th>
                <th className="py-3 px-4">Kelulusan & Sertifikat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const percent = Math.round((st.completedModules / st.totalModules) * 100);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & NIP */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">NIP {st.nip}</div>
                    </td>

                    {/* Agency */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                      <div className="truncate font-medium">{st.agency}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{st.role}</div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {st.enrolledCourseTitle}
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {percent}%
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({st.completedModules}/{st.totalModules})
                        </span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.finalExamStatus === 'PASSED' ? 'bg-emerald-600' : 'bg-blue-900'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {st.avgScore > 0 ? `${st.avgScore} / 100` : '—'}
                    </td>

                    {/* Status & Certificate */}
                    <td className="py-3.5 px-4">
                      {st.finalExamStatus === 'PASSED' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Lulus Bersertifikat</span>
                          </span>
                          <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                            {st.certificateNumber}
                          </span>
                        </div>
                      ) : st.finalExamStatus === 'READY' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          <span>Siap Ujian Akhir</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Dalam Proses</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleResetParticipant(st.id, st.name)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Reset Progres Belajar"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
