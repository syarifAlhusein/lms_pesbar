export type StepType = 'attendance' | 'pretest' | 'material' | 'posttest';

export type ActiveView = 'dashboard' | 'progress' | 'workspace' | 'final-exam' | 'certificate' | 'admin';

export type AdminSubView = 'overview' | 'courses' | 'questions' | 'students' | 'certificates';

export type ModuleStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';
export type StepStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
}

export type ResourceFormat = 'PDF' | 'PPT' | 'PPTX' | 'DOC' | 'DOCX' | 'XLSX' | 'MP4' | 'ZIP' | 'CSV';

export interface DownloadableResource {
  id: string;
  title: string;
  format: ResourceFormat;
  size: string;
  url: string;
  badgeColor: 'red' | 'orange' | 'blue' | 'emerald';
  description?: string;
}

export interface ModuleMaterial {
  videoUrl: string;
  videoTitle: string;
  videoDuration: string;
  summary: string;
  learningPoints: string[];
  resources: DownloadableResource[];
}

export interface AttemptRecord {
  attemptNumber: number;
  score: number;
  passed: boolean;
  date: string;
  totalQuestions: number;
  correctCount: number;
}

export interface CourseData {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  badge: string;
  estimatedDuration: string;
  moduleIds: number[];
  finalExam: FinalExamData;
}

export interface ModuleData {
  id: number;
  courseId: string;
  number: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  estimatedDuration: string;
  passingScore: number; // KKM, typically 75
  preTestQuestions: Question[];
  material: ModuleMaterial;
  postTestQuestions: Question[];
}

export interface ModuleUserProgress {
  moduleId: number;
  status: ModuleStatus;
  currentStep: StepType;
  attendanceChecked: boolean;
  attendanceTimestamp?: string;
  preTestSubmitted: boolean;
  preTestAnswers: Record<number, string>;
  preTestScore?: number;
  materialCompleted: boolean;
  postTestSubmitted: boolean;
  postTestAnswers: Record<number, string>;
  postTestScore?: number;
  postTestPassed: boolean;
  postTestAttempts: AttemptRecord[];
  activePostTestDraft: Record<number, string>;
  activePreTestDraft: Record<number, string>;
}

export interface FinalExamData {
  id: string;
  title: string;
  description: string;
  passingScore: number; // typically 80
  durationMinutes?: number;
  questions: Question[];
}

export interface FinalExamProgress {
  status: 'LOCKED' | 'AVAILABLE' | 'PASSED' | 'FAILED';
  submitted: boolean;
  passed: boolean;
  score?: number;
  attempts: AttemptRecord[];
  currentAnswers: Record<number, string>;
  lastSubmittedDate?: string;
}

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id?: string;
  name: string;
  nip: string;
  agency: string; // Instansi / OPD
  role: UserRole;
  jobTitle?: string;
  email?: string;
  avatarUrl?: string;
}

export interface CertificateInfo {
  certificateNumber: string;
  issueDate: string;
  recipientName: string;
  recipientNip: string;
  recipientAgency: string;
  finalScore: number;
  signeeName: string;
  signeeTitle: string;
  qrVerificationUrl: string;
}

export interface ActiveExamSession {
  testType: 'pretest' | 'posttest' | 'final-exam';
  courseId?: string;
  moduleId?: number;
  title: string;
  category: string;
  questions: Question[];
  durationMinutes: number;
}
