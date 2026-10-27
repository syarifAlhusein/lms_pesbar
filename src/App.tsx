import React from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Navbar } from './components/layout/Navbar';
import { AppSidebar } from './components/layout/AppSidebar';
import { ClassroomSidebar } from './components/layout/ClassroomSidebar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProgressLearningPage } from './components/progress/ProgressLearningPage';
import { ModuleWorkspace } from './components/workspace/ModuleWorkspace';
import { FinalExamWorkspace } from './components/final-exam/FinalExamWorkspace';
import { CertificateView } from './components/certificate/CertificateView';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { ToastContainer } from './components/ui/Toast';
import { CBTExamRoom } from './components/workspace/CBTExamRoom';
import { LoginPage } from './components/auth/LoginPage';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    userRole,
    activeView,
    setActiveView,
    activeExamSession,
    moduleProgresses,
    finalExamProgress,
    savePreTestDraft,
    savePostTestDraft,
    saveFinalExamDraft,
    submitPreTest,
    submitPostTest,
    submitFinalExam,
    endExamSession,
  } = useLMS();

  // Route Guard: Total Isolation between Administrator and Student
  React.useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin' && activeView !== 'admin') {
        setActiveView('admin');
      } else if (userRole !== 'admin' && activeView === 'admin') {
        setActiveView('dashboard');
      }
    }
  }, [isAuthenticated, userRole, activeView, setActiveView]);

  // 0. AUTHENTICATION GATE (Login Page as Entry Point)
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  // 1. PURE FULL-PAGE CBT MODE (Zero Navbar, Zero Sidebar, Zero Distraction)
  if (activeExamSession) {
    const draftAnswers =
      activeExamSession.testType === 'pretest'
        ? moduleProgresses[activeExamSession.moduleId!]?.activePreTestDraft || {}
        : activeExamSession.testType === 'posttest'
        ? moduleProgresses[activeExamSession.moduleId!]?.activePostTestDraft || {}
        : finalExamProgress.currentAnswers || {};

    const handleSelectOption = (questionId: number, optionId: string) => {
      if (activeExamSession.testType === 'pretest') {
        savePreTestDraft(activeExamSession.moduleId!, questionId, optionId);
      } else if (activeExamSession.testType === 'posttest') {
        savePostTestDraft(activeExamSession.moduleId!, questionId, optionId);
      } else {
        saveFinalExamDraft(questionId, optionId);
      }
    };

    const handleSubmitExam = () => {
      if (activeExamSession.testType === 'pretest') {
        submitPreTest(activeExamSession.moduleId!);
      } else if (activeExamSession.testType === 'posttest') {
        submitPostTest(activeExamSession.moduleId!);
      } else {
        submitFinalExam();
      }
      endExamSession();
    };

    return (
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
        <CBTExamRoom
          title={activeExamSession.title}
          category={activeExamSession.category}
          questions={activeExamSession.questions}
          draftAnswers={draftAnswers}
          onSelectOption={handleSelectOption}
          onSubmitExam={handleSubmitExam}
          onExitExam={endExamSession}
          durationMinutes={activeExamSession.durationMinutes}
        />
        <ToastContainer />
      </div>
    );
  }

  // 2. STANDARD LMS LAYOUT (Navbar + Sidebar + Canvas + Footer)
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-primary font-sans antialiased">
      {/* Minimalist Top Navbar */}
      <Navbar />

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-row w-full">
        {/* Dynamic Context Sidebar: Classroom Sidebar for workspace, None for Admin workspace, App Sidebar for others */}
        {activeView === 'admin' ? null : activeView === 'workspace' ? <ClassroomSidebar /> : <AppSidebar />}

        {/* Right Main Content Canvas */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-7xl mx-auto">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'progress' && <ProgressLearningPage />}
            {activeView === 'workspace' && <ModuleWorkspace />}
            {activeView === 'final-exam' && <FinalExamWorkspace />}
            {activeView === 'certificate' && <CertificateView />}
            {activeView === 'admin' && <AdminWorkspace />}
          </div>
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LMSProvider>
      <AppContent />
    </LMSProvider>
  );
};

export default App;
