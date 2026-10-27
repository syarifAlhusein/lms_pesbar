import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Question } from '../../types/lms';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  X,
  Check,
  Award,
  Layers,
  BookOpen,
  HelpCircle,
  Clock
} from 'lucide-react';

interface QuestionContext {
  questionId: number;
  courseId: string;
  moduleId?: number;
  testType: 'pretest' | 'posttest' | 'final-exam';
}

export const AdminQuestionBank: React.FC = () => {
  const {
    courses,
    modules,
    showToast,
    addQuestion,
    updateQuestion,
    deleteQuestion
  } = useLMS();

  // Active selected course (Class-Centric navigation)
  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0]?.id || 'pss-2026');
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'final-exam'>('modules');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<QuestionContext | null>(null);

  const [formData, setFormData] = useState({
    courseId: activeCourseId,
    testType: 'posttest' as 'pretest' | 'posttest' | 'final-exam',
    moduleId: 1,
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
  });

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const courseModules = modules
    .filter((m) => m.courseId === activeCourseId || activeCourse?.moduleIds.includes(m.id))
    .sort((a, b) => a.number - b.number);

  // Calculate questions for active course
  const totalModuleQuestions = courseModules.reduce(
    (sum, m) => sum + (m.preTestQuestions?.length || 0) + (m.postTestQuestions?.length || 0),
    0
  );
  const totalFinalExamQuestions = activeCourse?.finalExam?.questions?.length || 0;
  const totalCourseQuestions = totalModuleQuestions + totalFinalExamQuestions;

  // Open Add Modal
  const handleOpenAddModal = (
    testType: 'pretest' | 'posttest' | 'final-exam' = 'posttest',
    moduleId?: number
  ) => {
    setEditingContext(null);
    setFormData({
      courseId: activeCourseId,
      testType,
      moduleId: moduleId || (courseModules[0]?.id || 1),
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (
    q: Question,
    testType: 'pretest' | 'posttest' | 'final-exam',
    moduleId?: number
  ) => {
    setEditingContext({
      questionId: q.id,
      courseId: activeCourseId,
      moduleId,
      testType,
    });

    const getOpt = (letter: string) =>
      q.options.find((o) => o.id.toUpperCase() === letter.toUpperCase())?.text || '';

    setFormData({
      courseId: activeCourseId,
      testType,
      moduleId: moduleId || (courseModules[0]?.id || 1),
      question: q.question,
      optionA: getOpt('A'),
      optionB: getOpt('B'),
      optionC: getOpt('C'),
      optionD: getOpt('D'),
      correctAnswer: q.correctAnswer || 'A',
      explanation: q.explanation || '',
    });
    setIsModalOpen(true);
  };

  // Save Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      showToast('error', 'Validasi Gagal', 'Teks pertanyaan wajib diisi.');
      return;
    }
    if (!formData.optionA.trim() || !formData.optionB.trim()) {
      showToast('error', 'Validasi Gagal', 'Minimal Opsi A dan Opsi B wajib diisi.');
      return;
    }

    const options = [
      { id: 'A', text: formData.optionA.trim() },
      { id: 'B', text: formData.optionB.trim() },
      { id: 'C', text: formData.optionC.trim() },
      { id: 'D', text: formData.optionD.trim() },
    ].filter((o) => o.text.length > 0);

    if (editingContext) {
      updateQuestion({
        questionId: editingContext.questionId,
        courseId: editingContext.courseId,
        moduleId: editingContext.moduleId,
        testType: editingContext.testType,
        question: {
          question: formData.question.trim(),
          options,
          correctAnswer: formData.correctAnswer,
          explanation: formData.explanation.trim(),
        },
      });
      showToast('success', 'Soal Diperbarui', 'Butir soal evaluasi berhasil diperbarui.');
    } else {
      const newQuestionId = Date.now();
      addQuestion({
        courseId: formData.courseId,
        moduleId: formData.testType === 'final-exam' ? undefined : formData.moduleId,
        testType: formData.testType,
        question: {
          id: newQuestionId,
          question: formData.question.trim(),
          options,
          correctAnswer: formData.correctAnswer,
          explanation: formData.explanation.trim(),
        },
      });
      showToast('success', 'Soal Ditambahkan', 'Butir soal baru berhasil disimpan.');
    }

    setIsModalOpen(false);
  };

  // Delete Question
  const handleDeleteQuestion = (
    questionId: number,
    testType: 'pretest' | 'posttest' | 'final-exam',
    moduleId?: number
  ) => {
    if (confirm('Apakah Anda yakin ingin menghapus butir soal evaluasi ini?')) {
      deleteQuestion({
        questionId,
        courseId: activeCourseId,
        moduleId,
        testType,
      });
      showToast('info', 'Soal Dihapus', 'Butir soal berhasil dihapus dari bank soal.');
    }
  };

  // Render question card
  const renderQuestionCard = (
    q: Question,
    index: number,
    testType: 'pretest' | 'posttest' | 'final-exam',
    moduleId?: number
  ) => {
    // Filter by search query
    if (searchQuery.trim()) {
      const matchText =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((opt) => opt.text.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchText) return null;
    }

    return (
      <div
        key={q.id}
        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center text-[11px]">
              {index + 1}
            </span>
            <p className="font-semibold text-slate-900 leading-relaxed">
              {q.question}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenEditModal(q, testType, moduleId)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Edit Butir Soal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteQuestion(q.id, testType, moduleId)}
              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
              title="Hapus Butir Soal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {q.options.map((opt) => {
            const isCorrect = opt.id.toUpperCase() === q.correctAnswer?.toUpperCase();
            return (
              <div
                key={opt.id}
                className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 transition-colors ${
                  isCorrect
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-medium'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md font-mono font-bold shrink-0 flex items-center justify-center text-[10px] ${
                    isCorrect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="leading-snug">{opt.text}</span>
                {isCorrect && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {q.explanation && (
          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-950 leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900 font-semibold">Rasional Jawaban:</strong>{' '}
              {q.explanation}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Bank Soal Evaluasi & Ujian Akhir
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola butir soal Pre-Test, Post-Test, dan Ujian Akhir Komprehensif terstruktur per program kelas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddModal(activeSubTab === 'final-exam' ? 'final-exam' : 'posttest')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Butir Soal</span>
        </button>
      </div>

      {/* ─── LEVEL 1: COURSE SELECTOR TABS ─── */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
          Pilih Program Kelas:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((course) => {
            const isSelected = activeCourseId === course.id;
            const cMods = modules.filter(
              (m) => m.courseId === course.id || course.moduleIds.includes(m.id)
            );
            const qCount =
              cMods.reduce(
                (sum, m) =>
                  sum + (m.preTestQuestions?.length || 0) + (m.postTestQuestions?.length || 0),
                0
              ) + (course.finalExam?.questions?.length || 0);

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setActiveCourseId(course.id);
                  setSearchQuery('');
                }}
                className={`p-3.5 rounded-xl text-left border transition-all text-xs space-y-1.5 ${
                  isSelected
                    ? 'border-blue-900 bg-blue-950 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {course.code}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {qCount} Butir Soal
                  </span>
                </div>
                <h3
                  className={`font-bold truncate text-sm ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {course.title}
                </h3>
                <p
                  className={`text-[11px] line-clamp-1 ${
                    isSelected ? 'text-blue-200' : 'text-slate-500'
                  }`}
                >
                  {course.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── LEVEL 2: SELECTED COURSE WORKSPACE ─── */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
        
        {/* Course Info & Sub-Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                {activeCourse?.code}
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                {activeCourse?.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Total {totalCourseQuestions} butir soal terdistribusi pada {courseModules.length} modul dan ujian akhir komprehensif.
            </p>
          </div>

          {/* Sub Tabs: Modules vs Final Exam */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSubTab('modules')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'modules'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-900" />
              <span>Evaluasi Modul ({totalModuleQuestions})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('final-exam')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'final-exam'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Ujian Akhir ({totalFinalExamQuestions})</span>
            </button>
          </div>
        </div>

        {/* Search Bar for this Course */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Cari teks soal atau pilihan jawaban pada kelas ${activeCourse?.code}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-900 text-xs"
          />
        </div>

        {/* ─── TAB CONTENT A: EVALUASI MODUL (PRE-TEST & POST-TEST) ─── */}
        {activeSubTab === 'modules' && (
          <div className="space-y-6">
            {courseModules.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <p className="font-semibold text-slate-700">Belum ada modul di kelas ini.</p>
                <p className="text-slate-500 text-[11px]">
                  Buka tab <strong>"Manajemen Kelas"</strong> untuk menambahkan modul materi terlebih dahulu.
                </p>
              </div>
            ) : (
              courseModules.map((mod) => {
                const preQuestions = mod.preTestQuestions || [];
                const postQuestions = mod.postTestQuestions || [];

                return (
                  <div
                    key={mod.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                  >
                    {/* Module Title Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            Modul {mod.number}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-slate-500 text-xs">
                            {mod.code}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          {mod.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          KKM Post-Test: {mod.passingScore}
                        </span>
                      </div>
                    </div>

                    {/* Pre-Test & Post-Test Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      
                      {/* Pre-Test Column */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Entry Test (Pre-Test)
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {preQuestions.length} Soal
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenAddModal('pretest', mod.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-[11px] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Soal</span>
                          </button>
                        </div>

                        {preQuestions.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                            Belum ada soal Pre-Test.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {preQuestions.map((q, idx) =>
                              renderQuestionCard(q, idx, 'pretest', mod.id)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Post-Test Column */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Evaluasi Modul (Post-Test)
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {postQuestions.length} Soal
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenAddModal('posttest', mod.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-[11px] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Soal</span>
                          </button>
                        </div>

                        {postQuestions.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                            Belum ada soal Post-Test.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {postQuestions.map((q, idx) =>
                              renderQuestionCard(q, idx, 'posttest', mod.id)
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── TAB CONTENT B: UJIAN AKHIR KOMPREHENSIF ─── */}
        {activeSubTab === 'final-exam' && (
          <div className="space-y-4">
            {/* Final Exam Card Header */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    FINAL EXAM
                  </span>
                  <span className="font-bold text-amber-950 text-sm">
                    {activeCourse?.finalExam?.title || `Ujian Akhir Komprehensif: ${activeCourse?.title}`}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-amber-800 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>KKM Kelulusan: {activeCourse?.finalExam?.passingScore || 80}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Durasi: {activeCourse?.finalExam?.durationMinutes || 30} Menit</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>Total {totalFinalExamQuestions} Butir Soal Terdaftar</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAddModal('final-exam')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal Ujian Akhir</span>
              </button>
            </div>

            {/* Questions List */}
            {totalFinalExamQuestions === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <p className="font-semibold text-slate-700">Belum ada butir soal Ujian Akhir untuk kelas ini.</p>
                <p className="text-slate-500 text-[11px]">
                  Klik tombol <strong>"Tambah Soal Ujian Akhir"</strong> di atas untuk menambahkan butir evaluasi komprehensif.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCourse?.finalExam?.questions.map((q, idx) =>
                  renderQuestionCard(q, idx, 'final-exam')
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ─── MODAL: TAMBAH / EDIT BUTIR SOAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingContext ? 'Edit Butir Soal Evaluasi' : 'Tambah Butir Soal Evaluasi'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Program Kelas: <strong className="text-slate-800">{activeCourse?.title}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 space-y-4 text-xs overflow-y-auto">
              
              {/* Context Selector: Test Type & Module */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Evaluasi *
                  </label>
                  <select
                    value={formData.testType}
                    disabled={editingContext !== null}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        testType: e.target.value as 'pretest' | 'posttest' | 'final-exam',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 bg-white disabled:bg-slate-100"
                  >
                    <option value="pretest">Entry Test (Pre-Test)</option>
                    <option value="posttest">Evaluasi Modul (Post-Test)</option>
                    <option value="final-exam">Ujian Akhir Komprehensif (Final Exam)</option>
                  </select>
                </div>

                {formData.testType !== 'final-exam' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Target Modul Materi *
                    </label>
                    <select
                      value={formData.moduleId}
                      disabled={editingContext !== null}
                      onChange={(e) =>
                        setFormData({ ...formData, moduleId: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 bg-white disabled:bg-slate-100"
                    >
                      {courseModules.map((m) => (
                        <option key={m.id} value={m.id}>
                          Modul {m.number}: {m.title.substring(0, 35)}...
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Teks Pertanyaan *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ketik butir pertanyaan evaluasi kompetensi..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 leading-relaxed font-sans"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2.5">
                <label className="block font-semibold text-slate-700">
                  Pilihan Jawaban (A, B, C, D) & Kunci Jawaban Benar *
                </label>

                {[
                  { id: 'A', val: formData.optionA, setVal: (v: string) => setFormData({ ...formData, optionA: v }) },
                  { id: 'B', val: formData.optionB, setVal: (v: string) => setFormData({ ...formData, optionB: v }) },
                  { id: 'C', val: formData.optionC, setVal: (v: string) => setFormData({ ...formData, optionC: v }) },
                  { id: 'D', val: formData.optionD, setVal: (v: string) => setFormData({ ...formData, optionD: v }) },
                ].map((opt) => {
                  const isCorrect = formData.correctAnswer === opt.id;
                  return (
                    <div key={opt.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, correctAnswer: opt.id })}
                        className={`w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                          isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Tandai sebagai Kunci Jawaban Benar"
                      >
                        {opt.id}
                      </button>

                      <input
                        type="text"
                        required={opt.id === 'A' || opt.id === 'B'}
                        placeholder={`Teks pilihan jawaban ${opt.id}...`}
                        value={opt.val}
                        onChange={(e) => opt.setVal(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                          isCorrect
                            ? 'border-emerald-400 bg-emerald-50/40 focus:border-emerald-600 font-medium'
                            : 'border-slate-300 focus:border-blue-900'
                        }`}
                      />

                      {isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 shrink-0 px-2 py-0.5 rounded bg-emerald-100">
                          Kunci Benar
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pembahasan / Rasional Ilmiah
                </label>
                <textarea
                  rows={2}
                  placeholder="Uraian alasan mengapa pilihan jawaban di atas benar berdasarkan regulasi SDI..."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-900 font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingContext ? 'Simpan Perubahan' : 'Simpan Butir Soal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
