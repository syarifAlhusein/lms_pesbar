import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ModuleData,
  CourseData,
  ModuleUserProgress,
  FinalExamProgress,
  UserProfile,
  CertificateInfo,
  StepType,
  ActiveView,
  AttemptRecord,
  ActiveExamSession,
  Question,
  UserRole
} from '../types/lms';
import { MODULES_DATA, COURSES_DATA, INITIAL_USER_PROFILE, DEMO_USERS } from '../data/modulesData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
}

interface LMSContextType {
  // Authentication & RBAC
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (credentials: { identifier: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  courses: CourseData[];
  activeCourseId: string;
  setActiveCourseId: (id: string) => void;
  modules: ModuleData[];
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  moduleProgresses: Record<number, ModuleUserProgress>;
  courseFinalExamProgress: Record<string, FinalExamProgress>;
  finalExamProgress: FinalExamProgress;
  certificateInfo: CertificateInfo | null;
  activeModuleId: number;
  setActiveModuleId: (id: number) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: (open: boolean) => void;

  // Active Exam Session (Full-Viewport Mode)
  activeExamSession: ActiveExamSession | null;
  startExamSession: (session: ActiveExamSession) => void;
  endExamSession: () => void;
  
  // Workspace Actions
  setAttendance: (moduleId: number, checked: boolean) => void;
  savePreTestDraft: (moduleId: number, questionId: number, answer: string) => void;
  submitPreTest: (moduleId: number) => void;
  completeMaterial: (moduleId: number) => void;
  savePostTestDraft: (moduleId: number, questionId: number, answer: string) => void;
  submitPostTest: (moduleId: number) => void;
  retakePostTest: (moduleId: number) => void;
  goToStep: (moduleId: number, step: StepType) => void;
  
  // Final Exam Actions
  saveFinalExamDraft: (questionId: number, answer: string) => void;
  submitFinalExam: () => void;
  retakeFinalExam: () => void;

  // Preset & Reset Helpers
  resetProgress: () => void;
  applyPreset: (preset: 'fresh' | 'module2' | 'module4' | 'ready-final' | 'completed') => void;

  // Stats calculation
  completedModulesCount: number;
  averagePostTestScore: number;
  overallProgressPercent: number;

  // Toasts
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, description: string) => void;

  // Admin & Data Mutators
  addCourse: (course: CourseData) => void;
  updateCourse: (courseId: string, updated: Partial<CourseData>) => void;
  deleteCourse: (courseId: string) => void;
  addModule: (courseId: string, moduleData: Omit<ModuleData, 'id' | 'courseId'> & { id?: number }) => ModuleData;
  updateModule: (moduleId: number, updated: Partial<ModuleData>) => void;
  deleteModule: (moduleId: number) => void;
  addQuestion: (params: { courseId: string; moduleId?: number; testType: 'pretest' | 'posttest' | 'final-exam'; question: Question }) => void;
  updateQuestion: (params: { questionId: number; courseId: string; moduleId?: number; testType: 'pretest' | 'posttest' | 'final-exam'; question: Partial<Question> }) => void;
  deleteQuestion: (params: { questionId: number; courseId: string; moduleId?: number; testType: 'pretest' | 'posttest' | 'final-exam' }) => void;
}

const STORAGE_KEY_PROGRESS = 'lms_sdi_module_progress_v1';
const STORAGE_KEY_FINAL = 'lms_sdi_final_exam_v1';
const STORAGE_KEY_USER = 'lms_sdi_user_profile_v1';
const STORAGE_KEY_COURSES = 'lms_sdi_courses_v1';
const STORAGE_KEY_MODULES = 'lms_sdi_modules_v1';
const STORAGE_KEY_AUTH = 'lms_sdi_auth_v1';

const createDefaultModuleProgress = (): Record<number, ModuleUserProgress> => {
  const result: Record<number, ModuleUserProgress> = {};
  MODULES_DATA.forEach((mod) => {
    result[mod.id] = {
      moduleId: mod.id,
      status: mod.number === 1 ? 'ACTIVE' : 'LOCKED',
      currentStep: 'attendance',
      attendanceChecked: false,
      preTestSubmitted: false,
      preTestAnswers: {},
      materialCompleted: false,
      postTestSubmitted: false,
      postTestAnswers: {},
      postTestPassed: false,
      postTestAttempts: [],
      activePreTestDraft: {},
      activePostTestDraft: {},
    };
  });
  return result;
};

const createDefaultFinalExam = (): FinalExamProgress => ({
  status: 'LOCKED',
  submitted: false,
  passed: false,
  attempts: [],
  currentAnswers: {},
});

const createDefaultCourseFinalExams = (): Record<string, FinalExamProgress> => ({
  'pss-2026': createDefaultFinalExam(),
  'meta-2026': createDefaultFinalExam(),
});

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<CourseData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COURSES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved courses', e);
      }
    }
    return COURSES_DATA;
  });
  const [activeCourseId, setActiveCourseId] = useState<string>('pss-2026');
  const [modules, setModules] = useState<ModuleData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODULES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved modules', e);
      }
    }
    return MODULES_DATA;
  });
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeExamSession, setActiveExamSession] = useState<ActiveExamSession | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [activeViewRaw, setActiveViewRaw] = useState<ActiveView>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'admin') return 'admin';
      } catch (e) {}
    }
    return 'dashboard';
  });

  const setActiveView = (view: ActiveView) => {
    // Total Role Isolation: Administrator is locked to 'admin'
    if (userProfile.role === 'admin' && view !== 'admin') {
      return;
    }
    // Student is prohibited from accessing 'admin'
    if (view === 'admin' && userProfile.role !== 'admin') {
      showToast('error', 'Akses Terbatas', 'Halaman Admin hanya dapat diakses oleh Administrator resmi.');
      return;
    }
    setActiveViewRaw(view);
  };

  const activeView = activeViewRaw;

  const startExamSession = (session: ActiveExamSession) => {
    setActiveExamSession(session);
  };

  const endExamSession = () => {
    setActiveExamSession(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const login = async (
    credentials: { identifier: string; password: string }
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanIdent = credentials.identifier.trim();
    const cleanPass = credentials.password.trim();

    if (!cleanIdent || !cleanPass) {
      const msg = 'Email/NIP dan kata sandi wajib diisi.';
      showToast('error', 'Login Gagal', msg);
      return { success: false, message: msg };
    }

    // =====================================================================
    // 1. JIKA SUPABASE TERKONFIGURASI: VALIDASI REAL-TIME MELALUI DATABASE
    // =====================================================================
    if (isSupabaseConfigured() && supabase) {
      try {
        let emailToAuth = cleanIdent;

        // Jika user menginput NIP (hanya angka), cari email terkait di tabel public.profiles
        if (!cleanIdent.includes('@')) {
          const { data: matchedProfile } = await supabase
            .from('profiles')
            .select('id, nip, email')
            .eq('nip', cleanIdent.replace(/\s+/g, ''))
            .maybeSingle();

          if (matchedProfile?.email) {
            emailToAuth = matchedProfile.email;
          }
        }

        // Eksekusi Autentikasi Resmi Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: emailToAuth,
          password: cleanPass,
        });

        // JIKA KREDENSIAL SALAH: TOLAK DAN HENTIKAN PROSES LOGIN!
        if (authErr) {
          console.warn('[Supabase Auth] Login gagal:', authErr.message);
          const errorMsg =
            authErr.message === 'Invalid login credentials'
              ? 'Email atau kata sandi tidak sesuai dengan database. Silakan periksa kembali.'
              : `Gagal masuk: ${authErr.message}`;

          showToast('error', 'Autentikasi Gagal', errorMsg);
          return { success: false, message: errorMsg };
        }

        // JIKA AUTENTIKASI BERHASIL: BACA PERAN DARI DATABASE
        if (authData.user) {
          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          const roleStr = (dbProfile?.role || '').toUpperCase();
          const detectedRole: UserRole = roleStr === 'ADMIN' ? 'admin' : 'student';

          const authenticatedProfile: UserProfile = {
            id: authData.user.id,
            name: dbProfile?.full_name || authData.user.email?.split('@')[0] || 'Pengguna SDI',
            nip: dbProfile?.nip || cleanIdent,
            agency: dbProfile?.agency || (detectedRole === 'admin' ? 'Bappeda SDI' : 'Pemerintah Daerah'),
            role: detectedRole,
            jobTitle: dbProfile?.role || (detectedRole === 'admin' ? 'Administrator LMS' : 'Aparatur Walidata'),
            email: authData.user.email || emailToAuth,
            avatarUrl: dbProfile?.avatar_url || (detectedRole === 'admin' ? DEMO_USERS.admin.avatarUrl : DEMO_USERS.student.avatarUrl),
          };

          // Simpan Sesi Resmi
          setUserProfile(authenticatedProfile);
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEY_AUTH, 'true');
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedProfile));

          if (detectedRole === 'admin') {
            setActiveViewRaw('admin');
            showToast('success', 'Selamat Datang, Administrator!', `Masuk ke Admin Workspace sebagai ${authenticatedProfile.name}.`);
          } else {
            setActiveViewRaw('dashboard');
            showToast('success', 'Selamat Datang Kembali!', `Masuk sebagai ${authenticatedProfile.name} (${authenticatedProfile.agency}).`);
          }

          return { success: true };
        }
      } catch (err) {
        console.error('[Supabase Auth] Kesalahan koneksi:', err);
        const errorMsg = 'Terjadi gangguan saat menghubungi server Supabase. Silakan coba lagi.';
        showToast('error', 'Gangguan Koneksi', errorMsg);
        return { success: false, message: errorMsg };
      }
    }

    // =====================================================================
    // 2. JIKA MODE LOKAL / OFFLINE (SUPABASE BELUM AKTIF):
    // VALIDASI KETAT DENGAN AKUN TERDAFTAR (TIDAK BOLEH ASAL KREDENSIAL)
    // =====================================================================
    const isMockAdmin =
      cleanIdent === DEMO_USERS.admin.email ||
      cleanIdent === DEMO_USERS.admin.nip.replace(/\s+/g, '') ||
      cleanIdent.toLowerCase() === 'admin';

    const isMockStudent =
      cleanIdent === DEMO_USERS.student.email ||
      cleanIdent === DEMO_USERS.student.nip.replace(/\s+/g, '') ||
      cleanIdent.toLowerCase() === 'peserta';

    if (isMockAdmin) {
      setUserProfile(DEMO_USERS.admin);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USERS.admin));
      setActiveViewRaw('admin');
      showToast('success', 'Selamat Datang, Administrator!', `Masuk sebagai ${DEMO_USERS.admin.name} (Administrator LMS).`);
      return { success: true };
    }

    if (isMockStudent) {
      setUserProfile(DEMO_USERS.student);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USERS.student));
      setActiveViewRaw('dashboard');
      showToast('success', 'Selamat Datang Kembali!', `Masuk sebagai ${DEMO_USERS.student.name} (${DEMO_USERS.student.agency}).`);
      return { success: true };
    }

    // Jika kredensial tidak cocok dengan akun manapun: TOLAK!
    const rejectMsg = 'Akun tidak terdaftar atau kata sandi salah. Silakan periksa kembali.';
    showToast('error', 'Login Ditolak', rejectMsg);
    return { success: false, message: rejectMsg };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setActiveViewRaw('dashboard');
    showToast('info', 'Sesi Berakhir', 'Anda telah berhasil keluar dari akun.');
  };

  // Module Progresses (with fallback merging for new modules)
  const [moduleProgresses, setModuleProgresses] = useState<Record<number, ModuleUserProgress>>(() => {
    const defaults = createDefaultModuleProgress();
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error('Failed to parse module progresses', e);
      }
    }
    return defaults;
  });

  // Course Final Exam Progresses
  const [courseFinalExamProgress, setCourseFinalExamProgress] = useState<Record<string, FinalExamProgress>>(() => {
    const defaults = createDefaultCourseFinalExams();
    const saved = localStorage.getItem('lms_sdi_course_final_v1');
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse course final exam progress', e);
      }
    }
    const legacy = localStorage.getItem(STORAGE_KEY_FINAL);
    if (legacy) {
      try {
        return { ...defaults, 'pss-2026': JSON.parse(legacy) };
      } catch (e) {}
    }
    return defaults;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(moduleProgresses));
  }, [moduleProgresses]);

  useEffect(() => {
    localStorage.setItem('lms_sdi_course_final_v1', JSON.stringify(courseFinalExamProgress));
    if (courseFinalExamProgress['pss-2026']) {
      localStorage.setItem(STORAGE_KEY_FINAL, JSON.stringify(courseFinalExamProgress['pss-2026']));
    }
  }, [courseFinalExamProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODULES, JSON.stringify(modules));
  }, [modules]);

  // Sync / Load initial data from Supabase if configured
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured() || !client) return;

    const loadSupabaseData = async () => {
      try {
        const { data: dbCourses, error: cErr } = await client.from('courses').select('*').order('order_index', { ascending: true });
        const { data: dbModules, error: mErr } = await client.from('modules').select('*').order('number', { ascending: true });
        const { data: dbQuestions } = await client.from('questions').select('*').order('order_index', { ascending: true });

        if (!cErr && dbCourses && dbCourses.length > 0) {
          const mappedCourses: CourseData[] = dbCourses.map((c) => {
            const examQuestions = (dbQuestions || [])
              .filter((q) => q.target_type === 'COURSE_FINAL_EXAM' && q.course_id === c.id)
              .map((q) => ({
                id: q.id,
                question: q.question_text,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                correctAnswer: q.correct_answer,
                explanation: q.explanation || '',
              }));

            const courseModules = (dbModules || []).filter((m) => m.course_id === c.id);

            return {
              id: c.id,
              code: c.code,
              title: c.title,
              subtitle: c.subtitle || '',
              description: c.description || '',
              category: c.category || 'Statistik Sektoral',
              badge: c.badge || 'Program Resmi SDI',
              estimatedDuration: c.estimated_duration || '6 Jam Pembelajaran',
              moduleIds: courseModules.map((m) => m.id),
              finalExam: {
                id: `exam-${c.id}`,
                title: `Ujian Akhir Komprehensif: ${c.title}`,
                description: `Evaluasi pemahaman terpadu kurikulum ${c.title}. Ambang batas kelulusan minimal skor ${c.passing_score || 80}.`,
                passingScore: c.passing_score || 80,
                durationMinutes: c.duration_minutes || 30,
                questions: examQuestions.length > 0 ? examQuestions : (c.id === 'pss-2026' ? COURSES_DATA[0].finalExam.questions : []),
              },
            };
          });

          setCourses(mappedCourses);
        }

        if (!mErr && dbModules && dbModules.length > 0) {
          const mappedModules: ModuleData[] = dbModules.map((m) => {
            const preQ = (dbQuestions || [])
              .filter((q) => q.target_type === 'MODULE_PRETEST' && q.module_id === m.id)
              .map((q) => ({
                id: q.id,
                question: q.question_text,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                correctAnswer: q.correct_answer,
                explanation: q.explanation || '',
              }));

            const postQ = (dbQuestions || [])
              .filter((q) => q.target_type === 'MODULE_POSTTEST' && q.module_id === m.id)
              .map((q) => ({
                id: q.id,
                question: q.question_text,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                correctAnswer: q.correct_answer,
                explanation: q.explanation || '',
              }));

            const fallbackMod = MODULES_DATA.find((fm) => fm.id === m.id);

            return {
              id: m.id,
              courseId: m.course_id,
              number: m.number,
              code: m.code,
              title: m.title,
              subtitle: m.subtitle || '',
              description: m.description || '',
              category: m.category || 'Pembinaan Statistik Sektoral',
              estimatedDuration: m.estimated_duration || '90 Menit',
              passingScore: m.passing_score || 75,
              preTestQuestions: preQ.length > 0 ? preQ : (fallbackMod?.preTestQuestions || []),
              postTestQuestions: postQ.length > 0 ? postQ : (fallbackMod?.postTestQuestions || []),
              material: {
                videoUrl: m.video_url || fallbackMod?.material.videoUrl || '',
                videoTitle: m.video_title || fallbackMod?.material.videoTitle || '',
                videoDuration: m.video_duration || fallbackMod?.material.videoDuration || '15 Menit',
                summary: m.summary || fallbackMod?.material.summary || '',
                learningPoints: (typeof m.learning_points === 'string' ? JSON.parse(m.learning_points) : m.learning_points) || fallbackMod?.material.learningPoints || [],
                resources: (typeof m.resources === 'string' ? JSON.parse(m.resources) : m.resources) || fallbackMod?.material.resources || [],
              },
            };
          });

          setModules(mappedModules);
        }
      } catch (err) {
        console.warn('[Supabase] Gagal memuat data dari server:', err);
      }
    };

    loadSupabaseData();
  }, []);

  const finalExamProgress =
    courseFinalExamProgress[activeCourseId] ||
    courseFinalExamProgress['pss-2026'] ||
    createDefaultFinalExam();

  // Check if all modules of a course are completed to unlock Final Exam
  useEffect(() => {
    let hasChanges = false;
    const nextCourseFinal = { ...courseFinalExamProgress };

    courses.forEach(c => {
      const courseModulesCompleted = c.moduleIds.every(
        mId => moduleProgresses[mId]?.status === 'COMPLETED'
      );
      const curProg = nextCourseFinal[c.id] || createDefaultFinalExam();
      if (courseModulesCompleted && curProg.status === 'LOCKED') {
        nextCourseFinal[c.id] = { ...curProg, status: 'AVAILABLE' };
        hasChanges = true;
        showToast('info', `Ujian Akhir Terbuka: ${c.code}!`, `Seluruh modul kelas "${c.title}" telah diselesaikan. Anda kini dapat mengikuti Ujian Akhir.`);
      }
    });

    if (hasChanges) {
      setCourseFinalExamProgress(nextCourseFinal);
    }
  }, [moduleProgresses, courses, courseFinalExamProgress]);

  const showToast = (type: 'success' | 'warning' | 'info' | 'error', title: string, description: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  // Checkbox attendance
  const setAttendance = (moduleId: number, checked: boolean) => {
    const timestamp = checked ? new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }) : undefined;

    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        attendanceChecked: checked,
        attendanceTimestamp: timestamp,
      }
    }));
  };

  // Pre-test draft save
  const savePreTestDraft = (moduleId: number, questionId: number, answer: string) => {
    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        activePreTestDraft: {
          ...prev[moduleId]?.activePreTestDraft,
          [questionId]: answer,
        }
      }
    }));
  };

  // Submit Pre-test
  const submitPreTest = (moduleId: number) => {
    const mod = MODULES_DATA.find(m => m.id === moduleId);
    if (!mod) return;

    const draft = moduleProgresses[moduleId]?.activePreTestDraft || {};
    let correct = 0;
    mod.preTestQuestions.forEach(q => {
      if (draft[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / mod.preTestQuestions.length) * 100);

    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        preTestSubmitted: true,
        preTestAnswers: { ...draft },
        preTestScore: score,
        currentStep: 'material', // automatically open material step
      }
    }));

    showToast('success', 'Pre-Test Disimpan', `Presensi tercatat & Pre-Test selesai dengan skor ${score}. Tahap Materi Pembelajaran kini terbuka.`);
  };

  // Complete Material
  const completeMaterial = (moduleId: number) => {
    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        materialCompleted: true,
        currentStep: 'posttest', // proceed to post-test
      }
    }));

    showToast('info', 'Materi Selesai', 'Anda telah menyelesaikan materi pembelajaran. Silakan lanjutkan ke Post-Test.');
  };

  // Post-test draft save
  const savePostTestDraft = (moduleId: number, questionId: number, answer: string) => {
    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        activePostTestDraft: {
          ...prev[moduleId]?.activePostTestDraft,
          [questionId]: answer,
        }
      }
    }));
  };

  // Submit Post-test
  const submitPostTest = (moduleId: number) => {
    const mod = MODULES_DATA.find(m => m.id === moduleId);
    if (!mod) return;

    const currentProg = moduleProgresses[moduleId];
    const draft = currentProg?.activePostTestDraft || {};
    let correct = 0;
    mod.postTestQuestions.forEach(q => {
      if (draft[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / mod.postTestQuestions.length) * 100);
    const passed = score >= mod.passingScore;
    const attemptNumber = (currentProg.postTestAttempts?.length || 0) + 1;

    const attemptRecord: AttemptRecord = {
      attemptNumber,
      score,
      passed,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      totalQuestions: mod.postTestQuestions.length,
      correctCount: correct,
    };

    const nextAttempts = [...(currentProg.postTestAttempts || []), attemptRecord];

    setModuleProgresses(prev => {
      const updated: Record<number, ModuleUserProgress> = {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          postTestSubmitted: true,
          postTestAnswers: { ...draft },
          postTestScore: passed ? score : (prev[moduleId]?.postTestScore ?? score),
          postTestPassed: passed,
          postTestAttempts: nextAttempts,
          status: passed ? 'COMPLETED' : 'ACTIVE',
        }
      };

      // If passed, unlock next module within the same course!
      if (passed) {
        const currentMod = MODULES_DATA.find(m => m.id === moduleId);
        const nextModInCourse = MODULES_DATA.find(
          m => m.courseId === currentMod?.courseId && m.number === (currentMod?.number || 0) + 1
        );
        if (nextModInCourse) {
          if (updated[nextModInCourse.id].status === 'LOCKED') {
            updated[nextModInCourse.id] = {
              ...updated[nextModInCourse.id],
              status: 'ACTIVE',
            };
          }
        }
      }

      return updated;
    });

    if (passed) {
      const currentMod = MODULES_DATA.find(m => m.id === moduleId);
      const nextModInCourse = MODULES_DATA.find(
        m => m.courseId === currentMod?.courseId && m.number === (currentMod?.number || 0) + 1
      );
      if (nextModInCourse) {
        showToast('success', `Lulus Modul ${currentMod?.number}!`, `Selamat! Anda lulus dengan nilai ${score}. Modul ${nextModInCourse.number} (${nextModInCourse.title.substring(0, 30)}...) berhasil dibuka!`);
      } else {
        showToast('success', 'Semua Modul Tuntas!', `Selamat! Anda lulus seluruh modul pada kelas ini. Akses Ujian Akhir telah dibuka!`);
      }
    } else {
      showToast('warning', 'Belum Mencapai Ambang Batas', `Skor Anda ${score} (KKM ${mod.passingScore}). Silakan pelajari ulang materi atau ulangi Post-Test.`);
    }
  };

  // Retake Post-test
  const retakePostTest = (moduleId: number) => {
    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        postTestSubmitted: false,
        activePostTestDraft: {}, // reset draft for fresh attempt
      }
    }));
  };

  // Step navigation within module
  const goToStep = (moduleId: number, step: StepType) => {
    setActiveModuleId(moduleId);
    setActiveView('workspace');
    setModuleProgresses(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        currentStep: step,
      }
    }));
  };

  // Final Exam
  const saveFinalExamDraft = (questionId: number, answer: string) => {
    const targetCourseId = activeExamSession?.courseId || activeCourseId || 'pss-2026';
    setCourseFinalExamProgress(prev => {
      const cur = prev[targetCourseId] || createDefaultFinalExam();
      return {
        ...prev,
        [targetCourseId]: {
          ...cur,
          currentAnswers: {
            ...cur.currentAnswers,
            [questionId]: answer,
          }
        }
      };
    });
  };

  const submitFinalExam = () => {
    const targetCourseId = activeExamSession?.courseId || activeCourseId || 'pss-2026';
    const targetCourse = courses.find(c => c.id === targetCourseId) || courses[0];
    const examData = targetCourse.finalExam;
    const currentProg = courseFinalExamProgress[targetCourseId] || createDefaultFinalExam();
    const draft = currentProg.currentAnswers;

    let correct = 0;
    examData.questions.forEach(q => {
      if (draft[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / examData.questions.length) * 100);
    const passed = score >= examData.passingScore;
    const attemptNumber = (currentProg.attempts?.length || 0) + 1;

    const attemptRecord: AttemptRecord = {
      attemptNumber,
      score,
      passed,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      totalQuestions: examData.questions.length,
      correctCount: correct,
    };

    setCourseFinalExamProgress(prev => {
      const cur = prev[targetCourseId] || createDefaultFinalExam();
      return {
        ...prev,
        [targetCourseId]: {
          ...cur,
          submitted: true,
          passed,
          score: passed ? score : (cur.score ?? score),
          status: passed ? 'PASSED' : 'FAILED',
          attempts: [...cur.attempts, attemptRecord],
          lastSubmittedDate: new Date().toISOString(),
        }
      };
    });

    if (passed) {
      showToast('success', 'Selamat! Anda Lulus Ujian Akhir!', `Nilai akhir: ${score}. Selamat atas kelulusan kelas ${targetCourse.title.substring(0, 25)}...!`);
    } else {
      showToast('warning', 'Belum Lolos Ujian Akhir', `Nilai Anda ${score} (KKM minimal ${examData.passingScore}). Anda dapat mencoba kembali.`);
    }
  };

  const retakeFinalExam = () => {
    const targetCourseId = activeExamSession?.courseId || activeCourseId || 'pss-2026';
    setCourseFinalExamProgress(prev => {
      const cur = prev[targetCourseId] || createDefaultFinalExam();
      return {
        ...prev,
        [targetCourseId]: {
          ...cur,
          submitted: false,
          currentAnswers: {},
        }
      };
    });
  };

  // Presets and Reset
  const resetProgress = () => {
    const initialProg = createDefaultModuleProgress();
    const initialCourseFinal = createDefaultCourseFinalExams();
    setModuleProgresses(initialProg);
    setCourseFinalExamProgress(initialCourseFinal);
    setActiveCourseId('pss-2026');
    setActiveModuleId(1);
    setActiveView('dashboard');
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_FINAL);
    localStorage.removeItem('lms_sdi_course_final_v1');
    showToast('info', 'Reset Selesai', 'Seluruh progres belajar telah dikembalikan ke kondisi awal (Modul 1 Aktif).');
  };

  const applyPreset = (preset: 'fresh' | 'module2' | 'module4' | 'ready-final' | 'completed') => {
    if (preset === 'fresh') {
      resetProgress();
      return;
    }

    const newProg = createDefaultModuleProgress();
    const dateStr = new Date().toLocaleDateString('id-ID');

    if (preset === 'module2' || preset === 'module4' || preset === 'ready-final' || preset === 'completed') {
      // Modul 1 done
      newProg[1] = {
        moduleId: 1,
        status: 'COMPLETED',
        currentStep: 'posttest',
        attendanceChecked: true,
        attendanceTimestamp: dateStr + ' 09:15',
        preTestSubmitted: true,
        preTestAnswers: { 101: 'B', 102: 'C', 103: 'D', 104: 'A' },
        preTestScore: 100,
        materialCompleted: true,
        postTestSubmitted: true,
        postTestAnswers: { 111: 'B', 112: 'C', 113: 'B', 114: 'A' },
        postTestScore: 100,
        postTestPassed: true,
        postTestAttempts: [{ attemptNumber: 1, score: 100, passed: true, date: dateStr, totalQuestions: 4, correctCount: 4 }],
        activePreTestDraft: {},
        activePostTestDraft: {},
      };
      newProg[2].status = 'ACTIVE';
    }

    if (preset === 'module4' || preset === 'ready-final' || preset === 'completed') {
      // Modul 2 done
      newProg[2] = {
        moduleId: 2,
        status: 'COMPLETED',
        currentStep: 'posttest',
        attendanceChecked: true,
        attendanceTimestamp: dateStr + ' 10:20',
        preTestSubmitted: true,
        preTestAnswers: { 201: 'B', 202: 'B', 203: 'C', 204: 'A' },
        preTestScore: 100,
        materialCompleted: true,
        postTestSubmitted: true,
        postTestAnswers: { 211: 'A', 212: 'A', 213: 'B', 214: 'A' },
        postTestScore: 100,
        postTestPassed: true,
        postTestAttempts: [{ attemptNumber: 1, score: 100, passed: true, date: dateStr, totalQuestions: 4, correctCount: 4 }],
        activePreTestDraft: {},
        activePostTestDraft: {},
      };
      // Modul 3 done
      newProg[3] = {
        moduleId: 3,
        status: 'COMPLETED',
        currentStep: 'posttest',
        attendanceChecked: true,
        attendanceTimestamp: dateStr + ' 11:30',
        preTestSubmitted: true,
        preTestAnswers: { 301: 'B', 302: 'A', 303: 'A', 304: 'B' },
        preTestScore: 100,
        materialCompleted: true,
        postTestSubmitted: true,
        postTestAnswers: { 311: 'B', 312: 'A', 313: 'B', 314: 'A' },
        postTestScore: 100,
        postTestPassed: true,
        postTestAttempts: [{ attemptNumber: 1, score: 100, passed: true, date: dateStr, totalQuestions: 4, correctCount: 4 }],
        activePreTestDraft: {},
        activePostTestDraft: {},
      };
      newProg[4].status = 'ACTIVE';
    }

    let finalProg: FinalExamProgress = createDefaultFinalExam();

    if (preset === 'ready-final' || preset === 'completed') {
      // Modul 4 done
      newProg[4] = {
        moduleId: 4,
        status: 'COMPLETED',
        currentStep: 'posttest',
        attendanceChecked: true,
        attendanceTimestamp: dateStr + ' 13:40',
        preTestSubmitted: true,
        preTestAnswers: { 401: 'B', 402: 'A', 403: 'B', 404: 'A' },
        preTestScore: 100,
        materialCompleted: true,
        postTestSubmitted: true,
        postTestAnswers: { 411: 'C', 412: 'A', 413: 'B', 414: 'A' },
        postTestScore: 100,
        postTestPassed: true,
        postTestAttempts: [{ attemptNumber: 1, score: 100, passed: true, date: dateStr, totalQuestions: 4, correctCount: 4 }],
        activePreTestDraft: {},
        activePostTestDraft: {},
      };
      finalProg = {
        status: 'AVAILABLE',
        submitted: false,
        passed: false,
        attempts: [],
        currentAnswers: {},
      };
    }

    if (preset === 'completed') {
      finalProg = {
        status: 'PASSED',
        submitted: true,
        passed: true,
        score: 90,
        attempts: [{ attemptNumber: 1, score: 90, passed: true, date: dateStr, totalQuestions: 10, correctCount: 9 }],
        currentAnswers: { 501: 'B', 502: 'A', 503: 'A', 504: 'B', 505: 'A', 506: 'C', 507: 'A', 508: 'A', 509: 'A', 510: 'A' },
        lastSubmittedDate: new Date().toISOString(),
      };
    }

    setModuleProgresses(newProg);
    setCourseFinalExamProgress(prev => ({
      ...prev,
      [activeCourseId]: finalProg,
    }));
    showToast('info', 'Preset Diterapkan', `Mode preset: ${preset} berhasil dimuat.`);
  };

  // ─── ADMIN & DATA MUTATORS ──────────────────────────────────────────

  const addCourse = (newCourseData: CourseData) => {
    setCourses((prev) => [...prev, newCourseData]);
    if (isSupabaseConfigured() && supabase) {
      supabase.from('courses').insert({
        id: newCourseData.id,
        code: newCourseData.code,
        title: newCourseData.title,
        subtitle: newCourseData.subtitle,
        description: newCourseData.description,
        category: newCourseData.category,
        badge: newCourseData.badge,
        estimated_duration: newCourseData.estimatedDuration,
        passing_score: newCourseData.finalExam?.passingScore || 80,
        duration_minutes: newCourseData.finalExam?.durationMinutes || 30
      }).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal menyimpan kelas baru:', error);
      });
    }
  };

  const updateCourse = (courseId: string, updated: Partial<CourseData>) => {
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...updated } : c)));
    if (isSupabaseConfigured() && supabase) {
      const payload: Record<string, unknown> = {};
      if (updated.title) payload.title = updated.title;
      if (updated.subtitle) payload.subtitle = updated.subtitle;
      if (updated.description) payload.description = updated.description;
      if (updated.category) payload.category = updated.category;
      if (updated.badge) payload.badge = updated.badge;
      if (updated.estimatedDuration) payload.estimated_duration = updated.estimatedDuration;
      if (updated.finalExam?.passingScore) payload.passing_score = updated.finalExam.passingScore;
      if (updated.finalExam?.durationMinutes) payload.duration_minutes = updated.finalExam.durationMinutes;

      supabase.from('courses').update(payload).eq('id', courseId).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal memperbarui kelas:', error);
      });
    }
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setModules((prev) => prev.filter((m) => m.courseId !== courseId));
    if (isSupabaseConfigured() && supabase) {
      supabase.from('courses').delete().eq('id', courseId).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal menghapus kelas:', error);
      });
    }
  };

  const addModule = (courseId: string, newMod: Omit<ModuleData, 'id' | 'courseId'> & { id?: number }): ModuleData => {
    const maxId = modules.reduce((max, m) => Math.max(max, m.id), 0);
    const newId = newMod.id || (maxId + 1);
    const createdModule: ModuleData = {
      ...newMod,
      id: newId,
      courseId,
      preTestQuestions: newMod.preTestQuestions || [],
      postTestQuestions: newMod.postTestQuestions || [],
      material: newMod.material || {
        videoUrl: '',
        videoTitle: '',
        videoDuration: '',
        summary: '',
        learningPoints: [],
        resources: []
      }
    };

    setModules((prev) => [...prev, createdModule]);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, moduleIds: [...(c.moduleIds || []), newId] }
          : c
      )
    );

    setModuleProgresses((prev) => ({
      ...prev,
      [newId]: {
        moduleId: newId,
        status: 'ACTIVE',
        currentStep: 'attendance',
        attendanceChecked: false,
        preTestSubmitted: false,
        preTestAnswers: {},
        materialCompleted: false,
        postTestSubmitted: false,
        postTestAnswers: {},
        postTestPassed: false,
        postTestAttempts: [],
        activePreTestDraft: {},
        activePostTestDraft: {},
      }
    }));

    if (isSupabaseConfigured() && supabase) {
      supabase.from('modules').insert({
        id: newId,
        course_id: courseId,
        number: createdModule.number,
        code: createdModule.code,
        title: createdModule.title,
        subtitle: createdModule.subtitle,
        description: createdModule.description,
        category: createdModule.category,
        estimated_duration: createdModule.estimatedDuration,
        passing_score: createdModule.passingScore,
        video_url: createdModule.material?.videoUrl || '',
        video_title: createdModule.material?.videoTitle || '',
        video_duration: createdModule.material?.videoDuration || '',
        summary: createdModule.material?.summary || '',
        learning_points: JSON.stringify(createdModule.material?.learningPoints || []),
        resources: JSON.stringify(createdModule.material?.resources || [])
      }).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal menyimpan modul:', error);
      });
    }

    return createdModule;
  };

  const updateModule = (moduleId: number, updated: Partial<ModuleData>) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, ...updated } : m)));
    if (isSupabaseConfigured() && supabase) {
      const payload: Record<string, unknown> = {};
      if (updated.title) payload.title = updated.title;
      if (updated.subtitle) payload.subtitle = updated.subtitle;
      if (updated.code) payload.code = updated.code;
      if (updated.number) payload.number = updated.number;
      if (updated.passingScore !== undefined) payload.passing_score = updated.passingScore;
      if (updated.estimatedDuration) payload.estimated_duration = updated.estimatedDuration;
      if (updated.material?.summary) payload.summary = updated.material.summary;
      if (updated.material?.videoUrl) payload.video_url = updated.material.videoUrl;
      if (updated.material?.learningPoints) payload.learning_points = JSON.stringify(updated.material.learningPoints);
      if (updated.material?.resources) payload.resources = JSON.stringify(updated.material.resources);

      supabase.from('modules').update(payload).eq('id', moduleId).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal memperbarui modul:', error);
      });
    }
  };

  const deleteModule = (moduleId: number) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        moduleIds: c.moduleIds.filter((id) => id !== moduleId)
      }))
    );
    if (isSupabaseConfigured() && supabase) {
      supabase.from('modules').delete().eq('id', moduleId).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal menghapus modul:', error);
      });
    }
  };

  const addQuestion = ({
    courseId,
    moduleId,
    testType,
    question
  }: {
    courseId: string;
    moduleId?: number;
    testType: 'pretest' | 'posttest' | 'final-exam';
    question: Question;
  }) => {
    if (testType === 'final-exam') {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                finalExam: {
                  ...c.finalExam,
                  questions: [...(c.finalExam?.questions || []), question]
                }
              }
            : c
        )
      );
    } else if (moduleId) {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m;
          if (testType === 'pretest') {
            return {
              ...m,
              preTestQuestions: [...(m.preTestQuestions || []), question]
            };
          } else {
            return {
              ...m,
              postTestQuestions: [...(m.postTestQuestions || []), question]
            };
          }
        })
      );
    }

    if (isSupabaseConfigured() && supabase) {
      const targetType =
        testType === 'pretest'
          ? 'MODULE_PRETEST'
          : testType === 'posttest'
          ? 'MODULE_POSTTEST'
          : 'COURSE_FINAL_EXAM';

      supabase.from('questions').insert({
        id: question.id,
        target_type: targetType,
        module_id: moduleId || null,
        course_id: courseId,
        question_text: question.question,
        options: JSON.stringify(question.options),
        correct_answer: question.correctAnswer,
        explanation: question.explanation
      }).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal menyimpan butir soal:', error);
      });
    }
  };

  const updateQuestion = ({
    questionId,
    courseId,
    moduleId,
    testType,
    question
  }: {
    questionId: number;
    courseId: string;
    moduleId?: number;
    testType: 'pretest' | 'posttest' | 'final-exam';
    question: Partial<Question>;
  }) => {
    if (testType === 'final-exam') {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                finalExam: {
                  ...c.finalExam,
                  questions: c.finalExam.questions.map((q) =>
                    q.id === questionId ? { ...q, ...question } : q
                  )
                }
              }
            : c
        )
      );
    } else if (moduleId) {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m;
          if (testType === 'pretest') {
            return {
              ...m,
              preTestQuestions: (m.preTestQuestions || []).map((q) =>
                q.id === questionId ? { ...q, ...question } : q
              )
            };
          } else {
            return {
              ...m,
              postTestQuestions: (m.postTestQuestions || []).map((q) =>
                q.id === questionId ? { ...q, ...question } : q
              )
            };
          }
        })
      );
    }

    if (isSupabaseConfigured() && supabase) {
      const payload: Record<string, unknown> = {};
      if (question.question) payload.question_text = question.question;
      if (question.options) payload.options = JSON.stringify(question.options);
      if (question.correctAnswer) payload.correct_answer = question.correctAnswer;
      if (question.explanation) payload.explanation = question.explanation;

      supabase.from('questions').update(payload).eq('id', questionId).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal memperbarui soal:', error);
      });
    }
  };

  const deleteQuestion = ({
    questionId,
    courseId,
    moduleId,
    testType
  }: {
    questionId: number;
    courseId: string;
    moduleId?: number;
    testType: 'pretest' | 'posttest' | 'final-exam';
  }) => {
    if (testType === 'final-exam') {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                finalExam: {
                  ...c.finalExam,
                  questions: c.finalExam.questions.filter((q) => q.id !== questionId)
                }
              }
            : c
        )
      );
    } else if (moduleId) {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m;
          if (testType === 'pretest') {
            return {
              ...m,
              preTestQuestions: (m.preTestQuestions || []).filter((q) => q.id !== questionId)
            };
          } else {
            return {
              ...m,
              postTestQuestions: (m.postTestQuestions || []).filter((q) => q.id !== questionId)
            };
          }
        })
      );
    }

    if (isSupabaseConfigured() && supabase) {
      supabase.from('questions').delete().eq('id', questionId).then(({ error }) => {
        if (error) console.error('[Supabase] Gagal menghapus soal:', error);
      });
    }
  };

  // Metrics
  const completedModulesCount = modules.filter(m => moduleProgresses[m.id]?.status === 'COMPLETED').length;

  const passedScores = modules
    .map(m => moduleProgresses[m.id]?.postTestScore)
    .filter((s): s is number => s !== undefined && s !== null);

  const averagePostTestScore = passedScores.length > 0
    ? Math.round((passedScores.reduce((a, b) => a + b, 0) / passedScores.length) * 10) / 10
    : 0;

  // Global Progress Percentage: 4 modules (each 20%) + Final Exam (20%) = 100%
  const modulePoints = completedModulesCount * 20;
  const examPoints = finalExamProgress.passed ? 20 : (finalExamProgress.status === 'AVAILABLE' ? 5 : 0);
  const overallProgressPercent = Math.min(100, modulePoints + examPoints);

  // Certificate Info
  const certSuffix = userProfile.nip.replace(/\D/g, '').substring(0, 6) || '98271';
  const certificateInfo: CertificateInfo | null = finalExamProgress.passed ? {
    certificateNumber: `PSS/2026/SDI-${certSuffix}`,
    issueDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    recipientName: userProfile.name,
    recipientNip: userProfile.nip,
    recipientAgency: userProfile.agency,
    finalScore: finalExamProgress.score || 90,
    signeeName: "Dr. H. M. Firmansyah, M.Stat.",
    signeeTitle: "Kepala Pusat Pembinaan & Pengembangan Statistik Sektoral",
    qrVerificationUrl: `https://satudata.go.id/verifikasi-sertifikat?id=PSS-2026-${certSuffix}`,
  } : null;

  return (
    <LMSContext.Provider
      value={{
        isAuthenticated,
        userRole: userProfile.role,
        login,
        logout,
        courses,
        activeCourseId,
        setActiveCourseId,
        courseFinalExamProgress,
        modules,
        userProfile,
        updateUserProfile,
        moduleProgresses,
        finalExamProgress,
        certificateInfo,
        activeModuleId,
        setActiveModuleId,
        activeView,
        setActiveView,
        isSidebarOpen,
        toggleSidebar,
        setIsSidebarOpen,
        activeExamSession,
        startExamSession,
        endExamSession,
        setAttendance,
        savePreTestDraft,
        submitPreTest,
        completeMaterial,
        savePostTestDraft,
        submitPostTest,
        retakePostTest,
        goToStep,
        saveFinalExamDraft,
        submitFinalExam,
        retakeFinalExam,
        resetProgress,
        applyPreset,
        completedModulesCount,
        averagePostTestScore,
        overallProgressPercent,
        toasts,
        dismissToast,
        showToast,
        addCourse,
        updateCourse,
        deleteCourse,
        addModule,
        updateModule,
        deleteModule,
        addQuestion,
        updateQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = (): LMSContextType => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
