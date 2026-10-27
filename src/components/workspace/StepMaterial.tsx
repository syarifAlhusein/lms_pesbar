import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { DownloadableResource } from '../../types/lms';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, ArrowRight } from 'lucide-react';

export const StepMaterial: React.FC = () => {
  const {
    activeModuleId,
    modules,
    completeMaterial,
    showToast,
  } = useLMS();

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const material = currentModule.material;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(30);

  const handleDownload = (resource: DownloadableResource) => {
    if (resource.url && (resource.url.startsWith('http') || resource.url.startsWith('blob:') || resource.url.startsWith('data:'))) {
      const link = document.createElement('a');
      link.href = resource.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${resource.title.replace(/\s+/g, '_')}.${resource.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('info', 'File Diunduh', `Berkas "${resource.title}" (${resource.size}) sedang diunduh.`);
      return;
    }

    const dummyContent = `KEMENTERIAN / LEMBAGA / PEMERINTAH DAERAH
PEMBINAAN STATISTIK SEKTORAL & SATU DATA INDONESIA

DOKUMEN MATERI RESMI:
Judul Dokumen : ${resource.title}
Format Berkas : ${resource.format}
Ukuran Berkas : ${resource.size}
Kode Modul    : ${currentModule.code} (${currentModule.title})
Tanggal Unduh : ${new Date().toLocaleString('id-ID')}

RINGKASAN TEKNIS:
${material.summary}

POIN PEMBELAJARAN UTAMA:
${material.learningPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Hak Cipta © 2026 Badan Pusat Statistik & Komite Satu Data Indonesia.
    `;

    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/\s+/g, '_')}.${resource.format.toLowerCase() === 'ppt' ? 'pptx' : resource.format.toLowerCase() === 'xlsx' ? 'xlsx' : 'pdf'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('info', 'File Diunduh', `Berkas "${resource.title}" (${resource.size}) berhasil diunduh.`);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Materi Pembelajaran: {currentModule.title}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-xl">
          Pelajari paparan kuliah narasumber dan pelajari dokumen acuan teknis sebelum melanjutkan ke evaluasi Post-Test.
        </p>
      </div>

      {/* 16:9 Video Player */}
      <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between">
          
          {/* Top metadata */}
          <div className="p-4 z-10 flex items-center justify-between text-white/90 text-xs">
            <span className="font-medium">{material.videoTitle}</span>
            <span className="font-mono text-slate-400">{material.videoDuration}</span>
          </div>

          {/* Central Play/Pause button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-blue-900/90 text-white flex items-center justify-center hover:bg-blue-800 transition-transform active:scale-95"
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="p-4 z-10 space-y-2 bg-gradient-to-t from-black/80 to-transparent">
            {/* Seekbar */}
            <div
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer hover:h-1.5 transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                setCurrentProgress(Math.round((clickX / rect.width) * 100));
              }}
            >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${currentProgress}%` }}
              />
            </div>

            {/* Time and buttons */}
            <div className="flex items-center justify-between text-white text-xs pt-0.5">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-blue-400">
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setCurrentProgress(0)} className="hover:text-blue-400" title="Ulangi">
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-blue-400">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <span className="font-mono text-[11px] text-slate-400">
                  {Math.floor((currentProgress / 100) * 18)}:{Math.floor(((currentProgress / 100) * 42) % 60).toString().padStart(2, '0')} / {material.videoDuration}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">1080p</span>
            </div>
          </div>

        </div>
      </div>

      {/* Summary and Key Competencies */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            Ringkasan Substansi Materi
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {material.summary}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400 mb-2">
            Poin Penting Kompetensi
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {material.learningPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-900 shrink-0 mt-1.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Downloadable Resources */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-bold text-slate-900">
            Berkas Panduan & Bahan Bacaan Resmi
          </h3>
          <span className="text-slate-500 font-mono">
            {material.resources.length} berkas
          </span>
        </div>

        <div className="space-y-2">
          {material.resources.map((res) => (
            <div
              key={res.id}
              className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded uppercase">
                  {res.format}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                    <span>{res.size}</span>
                    <span>·</span>
                    <span>Format {res.format}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(res)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-4 z-20 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          Selesai mempelajari materi? Lanjutkan ke Post-Test evaluasi.
        </p>

        <button
          type="button"
          onClick={() => completeMaterial(activeModuleId)}
          className="w-full sm:w-auto px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Lanjut ke Post-Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
