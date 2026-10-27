import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CourseData, ModuleData, DownloadableResource, ResourceFormat } from '../../types/lms';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  BookOpen,
  Video,
  FileText,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  Paperclip,
  Loader2
} from 'lucide-react';

export const AdminCourseManager: React.FC = () => {
  const {
    courses,
    modules,
    showToast,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModule,
    deleteModule
  } = useLMS();

  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    code: '',
    title: '',
    subtitle: '',
    category: 'Statistik Sektoral',
    badge: 'Program Resmi SDI',
    estimatedDuration: '6 Jam Pembelajaran',
    passingScore: 80,
    durationMinutes: 30,
    description: '',
  });

  // Module Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState<string>('');
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showAddUrlForm, setShowAddUrlForm] = useState(false);

  const [moduleFormData, setModuleFormData] = useState<{
    number: number;
    code: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    estimatedDuration: string;
    passingScore: number;
    videoUrl: string;
    videoTitle: string;
    videoDuration: string;
    summary: string;
    learningPoints: string;
    resources: DownloadableResource[];
  }>({
    number: 1,
    code: '',
    title: '',
    subtitle: '',
    description: '',
    category: 'Pembinaan Statistik Sektoral',
    estimatedDuration: '90 Menit',
    passingScore: 75,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoTitle: '',
    videoDuration: '15 Menit',
    summary: '',
    learningPoints: '',
    resources: [],
  });

  const [externalUrlForm, setExternalUrlForm] = useState<{
    title: string;
    url: string;
    format: ResourceFormat;
    size: string;
    description: string;
  }>({
    title: '',
    url: '',
    format: 'PDF',
    size: '1.5 MB',
    description: '',
  });

  // Open Course Add
  const handleOpenAddCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({
      code: '',
      title: '',
      subtitle: '',
      category: 'Statistik Sektoral',
      badge: 'Program Resmi SDI',
      estimatedDuration: '6 Jam Pembelajaran',
      passingScore: 80,
      durationMinutes: 30,
      description: '',
    });
    setIsCourseModalOpen(true);
  };

  // Open Course Edit
  const handleOpenEditCourseModal = (course: CourseData) => {
    setEditingCourse(course);
    setCourseFormData({
      code: course.code,
      title: course.title,
      subtitle: course.subtitle,
      category: course.category,
      badge: course.badge,
      estimatedDuration: course.estimatedDuration,
      passingScore: course.finalExam?.passingScore || 80,
      durationMinutes: course.finalExam?.durationMinutes || 30,
      description: course.description,
    });
    setIsCourseModalOpen(true);
  };

  // Save Course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseFormData.title || !courseFormData.code) {
      showToast('error', 'Validasi Gagal', 'Kode dan Judul Kelas wajib diisi.');
      return;
    }

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code: courseFormData.code,
        title: courseFormData.title,
        subtitle: courseFormData.subtitle,
        category: courseFormData.category,
        badge: courseFormData.badge,
        estimatedDuration: courseFormData.estimatedDuration,
        description: courseFormData.description,
        finalExam: {
          ...editingCourse.finalExam,
          passingScore: courseFormData.passingScore,
          durationMinutes: courseFormData.durationMinutes,
        },
      });
      showToast('success', 'Kelas Diperbarui', `Kelas ${courseFormData.code} berhasil diperbarui.`);
    } else {
      const newId = courseFormData.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newCourse: CourseData = {
        id: newId,
        code: courseFormData.code,
        title: courseFormData.title,
        subtitle: courseFormData.subtitle,
        category: courseFormData.category,
        badge: courseFormData.badge,
        estimatedDuration: courseFormData.estimatedDuration,
        description: courseFormData.description,
        moduleIds: [],
        finalExam: {
          id: `${newId}-FINAL`,
          title: `Ujian Akhir Komprehensif: ${courseFormData.title}`,
          description: `Evaluasi komprehensif menguji penguasaan seluruh materi ${courseFormData.title}.`,
          passingScore: courseFormData.passingScore,
          durationMinutes: courseFormData.durationMinutes,
          questions: [],
        },
      };
      addCourse(newCourse);
      setExpandedCourseId(newId);
      showToast('success', 'Kelas Baru Ditambahkan', `Kelas ${newCourse.code} siap diisi materi modul.`);
    }

    setIsCourseModalOpen(false);
  };

  // Delete Course
  const handleDeleteCourse = (courseId: string, courseCode: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${courseCode}"? Seluruh modul dan bank soal terkait akan terhapus.`)) {
      deleteCourse(courseId);
      showToast('info', 'Kelas Dihapus', `Kelas ${courseCode} berhasil dihapus dari kurikulum.`);
    }
  };

  // Open Module Add Modal
  const handleOpenAddModuleModal = (courseId: string, defaultNumber: number) => {
    setTargetCourseId(courseId);
    setEditingModule(null);
    setShowAddUrlForm(false);
    const parentCourse = courses.find((c) => c.id === courseId);
    const codePrefix = parentCourse ? parentCourse.code.split('-')[0] : 'MOD';

    setModuleFormData({
      number: defaultNumber,
      code: `${codePrefix}-MOD-0${defaultNumber}`,
      title: '',
      subtitle: '',
      description: '',
      category: parentCourse?.category || 'Pembinaan Statistik Sektoral',
      estimatedDuration: '90 Menit',
      passingScore: 75,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoTitle: '',
      videoDuration: '15 Menit',
      summary: '',
      learningPoints: '',
      resources: [],
    });
    setIsModuleModalOpen(true);
  };

  // Open Module Edit Modal
  const handleOpenEditModuleModal = (courseId: string, mod: ModuleData) => {
    setTargetCourseId(courseId);
    setEditingModule(mod);
    setShowAddUrlForm(false);
    setModuleFormData({
      number: mod.number,
      code: mod.code,
      title: mod.title,
      subtitle: mod.subtitle,
      description: mod.description,
      category: mod.category,
      estimatedDuration: mod.estimatedDuration,
      passingScore: mod.passingScore,
      videoUrl: mod.material?.videoUrl || '',
      videoTitle: mod.material?.videoTitle || '',
      videoDuration: mod.material?.videoDuration || '15 Menit',
      summary: mod.material?.summary || '',
      learningPoints: mod.material?.learningPoints?.join('\n') || '',
      resources: mod.material?.resources || [],
    });
    setIsModuleModalOpen(true);
  };

  // Upload Local File Handler (PDF, PPT, Word, Excel)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Detect format
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    let format: ResourceFormat = 'PDF';
    let badgeColor: 'red' | 'orange' | 'blue' | 'emerald' = 'red';

    if (ext === 'PPT' || ext === 'PPTX') {
      format = ext as ResourceFormat;
      badgeColor = 'orange';
    } else if (ext === 'DOC' || ext === 'DOCX') {
      format = ext as ResourceFormat;
      badgeColor = 'blue';
    } else if (ext === 'XLS' || ext === 'XLSX' || ext === 'CSV') {
      format = ext === 'XLS' ? 'XLSX' : (ext as ResourceFormat);
      badgeColor = 'emerald';
    } else if (ext === 'ZIP') {
      format = 'ZIP';
      badgeColor = 'blue';
    } else {
      format = 'PDF';
      badgeColor = 'red';
    }

    // Format size
    const sizeInMB = file.size / (1024 * 1024);
    const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

    let fileUrl = '';
    if (isSupabaseConfigured() && supabase) {
      try {
        setIsUploadingFile(true);
        const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('course-materials')
          .upload(`modules/${targetCourseId}/${cleanName}`, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage
            .from('course-materials')
            .getPublicUrl(uploadData.path);
          fileUrl = urlData.publicUrl;
        } else {
          fileUrl = URL.createObjectURL(file);
        }
      } catch (err) {
        console.warn('[Supabase Storage] Fallback to local URL:', err);
        fileUrl = URL.createObjectURL(file);
      } finally {
        setIsUploadingFile(false);
      }
    } else {
      fileUrl = URL.createObjectURL(file);
    }

    const newResource: DownloadableResource = {
      id: `res-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      format,
      size: sizeStr,
      url: fileUrl,
      badgeColor,
      description: `Berkas materi pembelajaran ${format}`,
    };

    setModuleFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, newResource],
    }));

    showToast('success', 'Berkas Dilampirkan', `Berkas "${file.name}" (${sizeStr}) berhasil ditambahkan ke modul.`);
    e.target.value = '';
  };

  // Add External Document Link (JDIH, Drive, Cloud Link)
  const handleAddExternalResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrlForm.title.trim() || !externalUrlForm.url.trim()) {
      showToast('error', 'Validasi Gagal', 'Judul dan URL dokumen wajib diisi.');
      return;
    }

    let badgeColor: 'red' | 'orange' | 'blue' | 'emerald' = 'red';
    if (externalUrlForm.format === 'PPT' || externalUrlForm.format === 'PPTX') badgeColor = 'orange';
    else if (externalUrlForm.format === 'DOC' || externalUrlForm.format === 'DOCX') badgeColor = 'blue';
    else if (externalUrlForm.format === 'XLSX' || externalUrlForm.format === 'CSV') badgeColor = 'emerald';

    const newRes: DownloadableResource = {
      id: `res-${Date.now()}`,
      title: externalUrlForm.title.trim(),
      format: externalUrlForm.format,
      size: externalUrlForm.size.trim() || '1.0 MB',
      url: externalUrlForm.url.trim(),
      badgeColor,
      description: externalUrlForm.description.trim() || 'Dokumen rujukan / regulasi resmi',
    };

    setModuleFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, newRes],
    }));

    setExternalUrlForm({
      title: '',
      url: '',
      format: 'PDF',
      size: '1.5 MB',
      description: '',
    });
    setShowAddUrlForm(false);
    showToast('success', 'Tautan Berkas Ditambahkan', `Dokumen "${newRes.title}" berhasil dilampirkan.`);
  };

  // Remove Resource
  const handleRemoveResource = (resId: string, resTitle: string) => {
    setModuleFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== resId),
    }));
    showToast('info', 'Berkas Dihapus', `Lampiran "${resTitle}" dihapus dari modul.`);
  };

  // Save Module
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!moduleFormData.title || !moduleFormData.code) {
      showToast('error', 'Validasi Gagal', 'Kode dan Judul Modul wajib diisi.');
      return;
    }

    const pointsArray = moduleFormData.learningPoints
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (editingModule) {
      updateModule(editingModule.id, {
        number: moduleFormData.number,
        code: moduleFormData.code,
        title: moduleFormData.title,
        subtitle: moduleFormData.subtitle,
        description: moduleFormData.description,
        category: moduleFormData.category,
        estimatedDuration: moduleFormData.estimatedDuration,
        passingScore: moduleFormData.passingScore,
        material: {
          videoUrl: moduleFormData.videoUrl,
          videoTitle: moduleFormData.videoTitle || `Video Pembelajaran: ${moduleFormData.title}`,
          videoDuration: moduleFormData.videoDuration,
          summary: moduleFormData.summary,
          learningPoints: pointsArray,
          resources: moduleFormData.resources,
        },
      });
      showToast('success', 'Modul Diperbarui', `Modul ${moduleFormData.code} berhasil diperbarui.`);
    } else {
      addModule(targetCourseId, {
        number: moduleFormData.number,
        code: moduleFormData.code,
        title: moduleFormData.title,
        subtitle: moduleFormData.subtitle,
        description: moduleFormData.description,
        category: moduleFormData.category,
        estimatedDuration: moduleFormData.estimatedDuration,
        passingScore: moduleFormData.passingScore,
        preTestQuestions: [],
        postTestQuestions: [],
        material: {
          videoUrl: moduleFormData.videoUrl,
          videoTitle: moduleFormData.videoTitle || `Video Pembelajaran: ${moduleFormData.title}`,
          videoDuration: moduleFormData.videoDuration,
          summary: moduleFormData.summary,
          learningPoints: pointsArray,
          resources: moduleFormData.resources,
        },
      });
      showToast('success', 'Modul Ditambahkan', `Modul ${moduleFormData.code} berhasil dimasukkan ke silabus kelas.`);
    }

    setIsModuleModalOpen(false);
  };

  // Delete Module
  const handleDeleteModule = (moduleId: number, moduleCode: string) => {
    if (confirm(`Hapus modul "${moduleCode}" dari silabus kelas? Seluruh butir soal pre-test dan post-test modul ini akan terhapus.`)) {
      deleteModule(moduleId);
      showToast('info', 'Modul Dihapus', `Modul ${moduleCode} berhasil dihapus.`);
    }
  };

  // Resource format helper styling
  const getFormatBadgeStyle = (fmt: string) => {
    switch (fmt) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PPT':
      case 'PPTX':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DOC':
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'XLSX':
      case 'CSV':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Manajemen Kelas & Silabus Modul
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola kurikulum program pelatihan statistik sektoral, silabus modul materi, dan dokumen bahan ajar (PDF, PPT, Word, Excel).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddCourseModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course) => {
          const isExpanded = expandedCourseId === course.id;
          const courseModules = modules
            .filter((m) => m.courseId === course.id || course.moduleIds.includes(m.id))
            .sort((a, b) => a.number - b.number);

          return (
            <div
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all"
            >
              {/* Course Header Row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                      {course.badge}
                    </span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs text-slate-500">{course.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{courseModules.length} Modul Terbit</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.estimatedDuration}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>KKM Ujian: {course.finalExam?.passingScore || 80}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCourseModal(course)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                    title="Edit Informasi Kelas"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course.id, course.code)}
                    className="p-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 transition-colors shadow-2xs"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                  >
                    <span>{isExpanded ? 'Tutup Silabus' : 'Kelola Modul'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Modules List */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 space-y-3 bg-slate-50/50 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                      <span>Silabus Modul Berjenjang ({courseModules.length} Modul)</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenAddModuleModal(course.id, courseModules.length + 1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors shadow-2xs self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Modul ke Kelas Ini</span>
                    </button>
                  </div>

                  {courseModules.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200 space-y-2">
                      <p className="font-semibold text-slate-700">Belum ada modul yang terdaftar pada kelas ini.</p>
                      <p className="text-slate-500 text-[11px]">
                        Klik tombol <strong>"Tambah Modul ke Kelas Ini"</strong> di atas untuk mulai memasukkan silabus, materi pembelajaran, dan berkas ajar (PDF/PPT/Word/Excel).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {courseModules.map((mod) => (
                        <div
                          key={mod.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">
                                Modul {mod.number}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="font-mono text-slate-500">
                                {mod.code}
                              </span>
                              <span className="px-2 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                                KKM Post-Test: {mod.passingScore}
                              </span>
                              {mod.material?.resources && mod.material.resources.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] bg-blue-50 text-blue-800 font-medium border border-blue-200">
                                  <Paperclip className="w-2.5 h-2.5" />
                                  <span>{mod.material.resources.length} Berkas Ajar</span>
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900 truncate">
                              {mod.title}
                            </h4>
                            <p className="text-slate-500 text-[11px] truncate">
                              {mod.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              {mod.estimatedDuration}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModuleModal(course.id, mod)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                              title="Edit Modul & Berkas"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteModule(mod.id, mod.code)}
                              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors shadow-2xs"
                              title="Hapus Modul"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah / Edit Kelas */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingCourse ? 'Edit Informasi Kelas' : 'Tambah Kelas Baru SDI'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi spesifikasi kurikulum dan standar kompetensi kelas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDI-KUALITAS-2026"
                    value={courseFormData.code}
                    onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lencana / Label Program
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spesialisasi Teknis SDI"
                    value={courseFormData.badge}
                    onChange={(e) => setCourseFormData({ ...courseFormData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Lengkap Kelas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evaluasi & Penjaminan Kualitas Data Statistik Daerah"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subjudul Ringkas
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standar Operasional Pembersihan, Validasi, dan Verifikasi Data Sektoral"
                  value={courseFormData.subtitle}
                  onChange={(e) => setCourseFormData({ ...courseFormData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    KKM Ujian Akhir
                  </label>
                  <input
                    type="number"
                    min={60}
                    max={100}
                    value={courseFormData.passingScore}
                    onChange={(e) => setCourseFormData({ ...courseFormData, passingScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Durasi Ujian (Menit)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={courseFormData.durationMinutes}
                    onChange={(e) => setCourseFormData({ ...courseFormData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Lengkap Kurikulum
                </label>
                <textarea
                  rows={3}
                  placeholder="Uraian materi, tujuan kompetensi, dan instrumen pembinaan..."
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingCourse ? 'Simpan Perubahan' : 'Buat Kelas'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah / Edit Modul */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleIn max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingModule ? 'Edit Modul Pembelajaran' : 'Tambah Modul ke Silabus Kelas'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi rincian materi, durasi belajar, KKM post-test, video, serta berkas bahan bacaan (PDF, PPT, Word, Excel).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Urut Modul *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={moduleFormData.number}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, number: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Modul *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PSS-MOD-05"
                    value={moduleFormData.code}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimasi Waktu Belajar
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 90 Menit"
                    value={moduleFormData.estimatedDuration}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, estimatedDuration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Lengkap Modul *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verifikasi dan Pengolahan Diseminasi Statistik Daerah"
                  value={moduleFormData.title}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subjudul Ringkas Modul
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pedoman praktis pengawasan kualitas data sebelum publikasi resmi"
                  value={moduleFormData.subtitle}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nilai KKM Post-Test (Minimal Kelulusan)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={moduleFormData.passingScore}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, passingScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Modul
                  </label>
                  <input
                    type="text"
                    value={moduleFormData.category}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Video Info */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-900" />
                  <span>Media Pembelajaran Video</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      URL Video (YouTube / MP4)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={moduleFormData.videoUrl}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Durasi Video
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Menit"
                      value={moduleFormData.videoDuration}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, videoDuration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* ─── DOKUMEN & BERKAS BAHAN AJAR (PDF, PPT, WORD, EXCEL) ─── */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-900" />
                    <span>Dokumen & Bahan Bacaan (PDF, PPT, Word, Excel)</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                    {moduleFormData.resources.length} berkas terlampir
                  </span>
                </div>

                {/* Upload File Box */}
                <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-300 bg-white hover:border-blue-800 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                        {isUploadingFile ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {isUploadingFile ? 'Mengunggah ke Supabase Storage...' : 'Unggah Berkas Materi Langsung'}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Mendukung berkas <strong>PDF</strong>, <strong>PowerPoint (.ppt, .pptx)</strong>, <strong>Word (.doc, .docx)</strong>, dan <strong>Excel (.xls, .xlsx)</strong>.
                        </p>
                      </div>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors cursor-pointer shrink-0 shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Berkas</span>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,.zip"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Alternative: Add External Link Form Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddUrlForm(!showAddUrlForm)}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-900 hover:text-blue-950 font-semibold"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{showAddUrlForm ? 'Tutup Formulir Tautan' : '+ Tambah Tautan Berkas / Regulasi JDIH Eksternal'}</span>
                  </button>
                </div>

                {/* External Link Inline Form */}
                {showAddUrlForm && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="font-semibold text-slate-800 text-[11px]">
                      Lampirkan Berkas via URL / Repositori Regulasi:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Judul Dokumen *</label>
                        <input
                          type="text"
                          placeholder="e.g. Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia"
                          value={externalUrlForm.title}
                          onChange={(e) => setExternalUrlForm({ ...externalUrlForm, title: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Format Berkas</label>
                        <select
                          value={externalUrlForm.format}
                          onChange={(e) => setExternalUrlForm({ ...externalUrlForm, format: e.target.value as ResourceFormat })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-900 bg-white"
                        >
                          <option value="PDF">PDF (Dokumen Resmi)</option>
                          <option value="PPTX">PPTX (Presentasi PowerPoint)</option>
                          <option value="DOCX">DOCX (Dokumen Word)</option>
                          <option value="XLSX">XLSX (Tabel Kerja Excel)</option>
                          <option value="ZIP">ZIP (Paket Data)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Tautan URL Berkas *</label>
                        <input
                          type="text"
                          placeholder="https://jdih.bps.go.id/.../dokumen.pdf"
                          value={externalUrlForm.url}
                          onChange={(e) => setExternalUrlForm({ ...externalUrlForm, url: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Estimasi Ukuran</label>
                        <input
                          type="text"
                          placeholder="e.g. 2.4 MB"
                          value={externalUrlForm.size}
                          onChange={(e) => setExternalUrlForm({ ...externalUrlForm, size: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddExternalResource}
                        className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-[11px] transition-colors"
                      >
                        Simpan Tautan Berkas
                      </button>
                    </div>
                  </div>
                )}

                {/* List of Attached Resources */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Daftar Berkas Terlampir Pada Modul:
                  </div>

                  {moduleFormData.resources.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      Belum ada berkas materi (PDF, PPT, Word, Excel) yang dilampirkan. Silakan unggah berkas di atas.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {moduleFormData.resources.map((res) => (
                        <div
                          key={res.id}
                          className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border shrink-0 ${getFormatBadgeStyle(
                                res.format
                              )}`}
                            >
                              {res.format}
                            </span>
                            <div className="min-w-0">
                              <h5 className="font-semibold text-slate-900 truncate text-xs">
                                {res.title}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                <span>{res.size}</span>
                                {res.description && (
                                  <>
                                    <span>·</span>
                                    <span className="font-sans text-slate-500 truncate">{res.description}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            {res.url && (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                                title="Pratinjau / Unduh Berkas"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveResource(res.id, res.title)}
                              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                              title="Hapus Berkas dari Modul"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary / Reading Material */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Materi Bacaan / Ringkasan Edukasi (Markdown)
                </label>
                <textarea
                  rows={4}
                  placeholder="Ringkasan konsep pokok, dasar hukum, dan instruksi teknis..."
                  value={moduleFormData.summary}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-sans leading-relaxed"
                />
              </div>

              {/* Learning Points */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Capaian Pembelajaran (Satu poin per baris)
                </label>
                <textarea
                  rows={3}
                  placeholder="Memahami prinsip Satu Data Indonesia&#10;Mampu menyusun metadata variabel statistik&#10;Melakukan validasi data sektoral"
                  value={moduleFormData.learningPoints}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, learningPoints: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingModule ? 'Simpan Perubahan' : 'Masukkan ke Silabus'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
