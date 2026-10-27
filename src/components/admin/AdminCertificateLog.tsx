import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface CertificateRecord {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientNip: string;
  agency: string;
  courseTitle: string;
  courseCode: string;
  finalScore: number;
  issueDate: string;
  qrCodeUrl: string;
  status: 'VALID' | 'REVOKED';
}

export const AdminCertificateLog: React.FC = () => {
  const { showToast } = useLMS();

  const [certificates] = useState<CertificateRecord[]>([
    {
      id: 'cert-01',
      certificateNumber: 'PSS/2026/SDI-880415',
      recipientName: 'Rahmat Hidayat, S.Kom., M.T.',
      recipientNip: '198804152010011003',
      agency: 'Dinas Komunikasi, Informatika, dan Statistik',
      courseTitle: 'Pembinaan Statistik Sektoral 2026',
      courseCode: 'PSS-2026',
      finalScore: 92,
      issueDate: '24 Oktober 2026',
      qrCodeUrl: 'https://satudata.go.id/verifikasi-sertifikat?id=PSS-2026-880415',
      status: 'VALID',
    },
    {
      id: 'cert-02',
      certificateNumber: 'META/2026/SDI-920311',
      recipientName: 'Siti Nurhaliza, S.Stat.',
      recipientNip: '199203112015022001',
      agency: 'Badan Perencanaan Pembangunan Daerah (Bappeda)',
      courseTitle: 'Tata Kelola Metadata Statistik & Interoperabilitas Data 2026',
      courseCode: 'SDI-META-2026',
      finalScore: 88,
      issueDate: '25 Oktober 2026',
      qrCodeUrl: 'https://satudata.go.id/verifikasi-sertifikat?id=META-2026-920311',
      status: 'VALID',
    },
    {
      id: 'cert-03',
      certificateNumber: 'PSS/2026/SDI-791102',
      recipientName: 'Ir. Ahmad Syukri, M.M.',
      recipientNip: '197911022005011002',
      agency: 'Dinas Pertanian dan Ketahanan Pangan',
      courseTitle: 'Pembinaan Statistik Sektoral 2026',
      courseCode: 'PSS-2026',
      finalScore: 95,
      issueDate: '20 Oktober 2026',
      qrCodeUrl: 'https://satudata.go.id/verifikasi-sertifikat?id=PSS-2026-791102',
      status: 'VALID',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = certificates.filter(
    (c) =>
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientNip.includes(searchQuery) ||
      c.agency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifyCert = (cert: CertificateRecord) => {
    showToast(
      'success',
      'Sertifikat Sah & Terverifikasi',
      `Nomor ${cert.certificateNumber} tercatat sah di Komite Satu Data Indonesia.`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Buku Register & Log Sertifikat Kompetensi Resmi
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Daftar seluruh sertifikat kelulusan yang telah diterbitkan dan tervalidasi secara elektronik oleh BPS & Komite Satu Data Indonesia.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor registrasi sertifikat, nama penerima, NIP, atau OPD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-900 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Registrasi Sertifikat</th>
                <th className="py-3 px-4">Penerima & NIP</th>
                <th className="py-3 px-4">Instansi / OPD</th>
                <th className="py-3 px-4">Program Kelulusan</th>
                <th className="py-3 px-4">Nilai Akhir</th>
                <th className="py-3 px-4">Tanggal Terbit</th>
                <th className="py-3 px-4">Integritas QR</th>
                <th className="py-3 px-4 text-right">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Certificate Number */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-950 text-xs">
                      {cert.certificateNumber}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cert.courseCode}
                    </span>
                  </td>

                  {/* Recipient */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{cert.recipientName}</div>
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                      NIP {cert.recipientNip}
                    </div>
                  </td>

                  {/* Agency */}
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate font-medium">
                    {cert.agency}
                  </td>

                  {/* Course */}
                  <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                    {cert.courseTitle}
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {cert.finalScore} / 100
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 font-sans">
                    {cert.issueDate}
                  </td>

                  {/* Verification */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>Terverifikasi BPS</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleVerifyCert(cert)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Cek QR</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
