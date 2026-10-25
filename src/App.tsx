import React, { useState, useEffect } from 'react';
import { QuizConfig, Question, QuizHistoryItem } from './types';
import { THEMES, LESSONS, QUESTION_BANK } from './data/curriculumData';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { PreparationForm } from './components/PreparationForm';
import { QuizActive } from './components/QuizActive';
import { QuizResult } from './components/QuizResult';
import { ScoreboardView } from './components/ScoreboardView';
import { TheoryModal } from './components/TheoryModal';
import { HistoryModal } from './components/HistoryModal';
import { AiTutorDrawer } from './components/AiTutorDrawer';
import { ExamPaperModal } from './components/ExamPaperModal';
import { QuestionBankView } from './components/QuestionBankView';

const LOCAL_STORAGE_KEY_HISTORY = 'cora_ai_tinhoc7_history';
const LOCAL_STORAGE_KEY_STUDENT = 'cora_ai_tinhoc7_student_name';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'result' | 'scoreboard' | 'question-bank'>('home');

  // Sidebar states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [selectedTheoryLessonId, setSelectedTheoryLessonId] = useState<number | undefined>(undefined);

  // Configuration state
  const [config, setConfig] = useState<QuizConfig>(() => {
    const savedName = localStorage.getItem(LOCAL_STORAGE_KEY_STUDENT) || '';
    return {
      studentName: savedName,
      selectedLessonId: 'all',
      questionCount: 10,
      difficulty: 'all',
      timeLimitMinutes: 15,
      mode: 'practice',
      shuffleOptions: true,
    };
  });

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);

  // Modals state
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isExamPreviewOpen, setIsExamPreviewOpen] = useState(false);
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string>('');

  // History state
  const [history, setHistory] = useState<QuizHistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history', e);
    }
  }, [history]);

  // Persist student name
  useEffect(() => {
    if (config.studentName.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY_STUDENT, config.studentName.trim());
    }
  }, [config.studentName]);

  // Dynamic Subtitle for Banner
  const currentSubtitle = React.useMemo(() => {
    if (config.selectedLessonId === 'all') {
      return 'Ôn tập toàn diện 16 bài học SGK Tin học 7 - Kết nối tri thức với cuộc sống';
    }
    const lesson = LESSONS.find((l) => l.id === config.selectedLessonId);
    if (!lesson) return 'Sách giáo khoa Tin học 7 - Kết nối tri thức';
    const theme = THEMES.find((t) => t.id === lesson.themeId);
    return `${lesson.title} (${theme?.title || 'Tin học 7'})`;
  }, [config.selectedLessonId]);

  // Start Quiz Handler
  const handleStartQuiz = () => {
    if (!config.studentName.trim()) {
      const inputEl = document.getElementById('student-name-input');
      inputEl?.focus();
      return;
    }

    // Filter questions
    let pool = [...QUESTION_BANK];
    if (config.selectedLessonId !== 'all') {
      pool = pool.filter((q) => q.lessonId === config.selectedLessonId);
    }
    if (config.difficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }

    // Fallback if pool is too small
    if (pool.length === 0) {
      pool = [...QUESTION_BANK];
    }

    // Shuffle questions
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

    // Shuffle options if config.shuffleOptions is enabled
    const finalQuestions = selected.map((q) => {
      if (!config.shuffleOptions) return q;
      const pairs = q.options.map((opt, i) => ({
        text: opt,
        isCorrect: i === q.correctAnswerIndex,
      }));
      const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffledPairs.map((p) => p.text),
        correctAnswerIndex: shuffledPairs.findIndex((p) => p.isCorrect),
      };
    });

    setActiveQuestions(finalQuestions);
    setUserAnswers({});
    setStartTime(Date.now());
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Memoized Preview Questions for Exam Paper Modal
  const previewQuestions = React.useMemo(() => {
    let pool = [...QUESTION_BANK];
    if (config.selectedLessonId !== 'all') {
      pool = pool.filter((q) => q.lessonId === config.selectedLessonId);
    }
    if (config.difficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    if (pool.length === 0) pool = [...QUESTION_BANK];
    const subset = pool.slice(0, Math.min(config.questionCount, pool.length));

    if (!config.shuffleOptions) return subset;
    return subset.map((q) => {
      const pairs = q.options.map((opt, i) => ({
        text: opt,
        isCorrect: i === q.correctAnswerIndex,
      }));
      const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffledPairs.map((p) => p.text),
        correctAnswerIndex: shuffledPairs.findIndex((p) => p.isCorrect),
      };
    });
  }, [config.selectedLessonId, config.difficulty, config.questionCount, config.shuffleOptions]);

  // Select Answer Handler
  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Submit Quiz Handler
  const handleSubmitQuiz = () => {
    const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setTimeTakenSeconds(duration);

    // Calculate score
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const total = activeQuestions.length;
    const scoreVal = Math.round(((correct / total) * 10) * 10) / 10;
    const pct = Math.round((correct / total) * 100);

    const lessonTitleStr =
      config.selectedLessonId === 'all'
        ? 'Ôn Tập Tổng Hợp Toàn Bộ Tin Học 7'
        : LESSONS.find((l) => l.id === config.selectedLessonId)?.title || 'Bài Học Tin Học 7';

    const historyItem: QuizHistoryItem = {
      id: String(Date.now()),
      studentName: config.studentName.trim(),
      lessonTitle: lessonTitleStr,
      score: scoreVal,
      totalQuestions: total,
      correctCount: correct,
      incorrectCount: total - correct,
      percentage: pct,
      timeTakenSeconds: duration,
      timestamp: Date.now(),
      questions: activeQuestions,
      userAnswers: userAnswers,
    };

    setHistory((prev) => [historyItem, ...prev]);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retry Quiz Handler
  const handleRetryQuiz = () => {
    setUserAnswers({});
    setStartTime(Date.now());
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Review a past test
  const handleReviewPastTest = (pastItem: QuizHistoryItem) => {
    setConfig((prev) => ({
      ...prev,
      studentName: pastItem.studentName,
    }));
    setActiveQuestions(pastItem.questions);
    setUserAnswers(pastItem.userAnswers);
    setTimeTakenSeconds(pastItem.timeTakenSeconds);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear history
  const handleClearHistory = () => {
    if (window.confirm('Em có chắc chắn muốn xóa toàn bộ bảng điểm & lịch sử làm bài?')) {
      setHistory([]);
    }
  };

  // Delete single history item
  const handleDeleteSingleHistory = (id: string) => {
    if (window.confirm('Em có chắc chắn muốn xóa lượt thi này khỏi bảng điểm?')) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Ask AI about specific question
  const handleAskAiAboutQuestion = (q: Question, userText: string) => {
    const correctLetter = String.fromCharCode(65 + q.correctAnswerIndex);
    const prompt = `Chào Cô Ra AI, em muốn hỏi về câu hỏi này trong SGK Tin học 7:
Câu hỏi: "${q.question}"
Lựa chọn của em: "${userText}"
Đáp án đúng theo SGK là: ${correctLetter}. ${q.options[q.correctAnswerIndex]}
Cô Ra giải thích chi tiết hơn giúp em vì sao lại chọn đáp án này và phương pháp ghi nhớ kiến thức này nhé!`;

    setAiInitialQuestion(prompt);
    setIsAiTutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-emerald-200">
      {/* Header Banner */}
      <HeaderBanner
        currentSubtitle={currentSubtitle}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenScoreboard={() => setCurrentView('scoreboard')}
        onOpenQuestionBank={() => setCurrentView('question-bank')}
        onOpenTheory={() => {
          setSelectedTheoryLessonId(undefined);
          setIsTheoryOpen(true);
        }}
        onOpenAiTutor={() => {
          setAiInitialQuestion('');
          setIsAiTutorOpen(true);
        }}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        isSidebarCollapsed={isDesktopSidebarCollapsed}
        onToggleCollapseDesktop={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
        activeTab={currentView}
      />

      {/* Main Body with Left Sidebar Navigation */}
      <div className="flex-1 flex w-full relative">
        {/* Left Subsystem Navigation Sidebar */}
        <Sidebar
          config={config}
          onChangeConfig={setConfig}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isDesktopSidebarCollapsed}
          onToggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
          onOpenTheory={(lessonId) => {
            setSelectedTheoryLessonId(lessonId);
            setIsTheoryOpen(true);
          }}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenScoreboard={() => setCurrentView('scoreboard')}
          onOpenQuestionBank={() => setCurrentView('question-bank')}
          onOpenAiTutor={() => {
            setAiInitialQuestion('');
            setIsAiTutorOpen(true);
          }}
          currentView={currentView}
          onNavigateHome={() => setCurrentView('home')}
          history={history}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 w-full max-w-5xl mx-auto p-3 sm:p-6 md:p-8">
            {currentView === 'home' && (
              <PreparationForm
                config={config}
                onChangeConfig={setConfig}
                onStartQuiz={handleStartQuiz}
                onOpenHistory={() => setIsHistoryOpen(true)}
                onOpenScoreboard={() => setCurrentView('scoreboard')}
                onOpenExamPreview={() => setIsExamPreviewOpen(true)}
                onOpenQuestionBank={() => setCurrentView('question-bank')}
              />
            )}

            {currentView === 'quiz' && (
              <QuizActive
                config={config}
                questions={activeQuestions}
                userAnswers={userAnswers}
                onSelectAnswer={handleSelectAnswer}
                onSubmitQuiz={handleSubmitQuiz}
                onCancelQuiz={() => setCurrentView('home')}
              />
            )}

            {currentView === 'result' && (
              <QuizResult
                config={config}
                questions={activeQuestions}
                userAnswers={userAnswers}
                timeTakenSeconds={timeTakenSeconds}
                onRetryQuiz={handleRetryQuiz}
                onNewQuiz={() => setCurrentView('home')}
                onOpenScoreboard={() => setCurrentView('scoreboard')}
                onAskAiAboutQuestion={handleAskAiAboutQuestion}
              />
            )}

            {currentView === 'scoreboard' && (
              <ScoreboardView
                history={history}
                onClearHistory={handleClearHistory}
                onDeleteSingleHistory={handleDeleteSingleHistory}
                onReviewPastTest={handleReviewPastTest}
                onBackToHome={() => setCurrentView('home')}
                studentNameFilter={config.studentName}
              />
            )}

            {currentView === 'question-bank' && (
              <QuestionBankView
                onStartPracticeWithLesson={(lessonId) => {
                  setConfig((prev) => ({
                    ...prev,
                    selectedLessonId: lessonId,
                    mode: 'practice',
                  }));
                  // Start quiz with this lesson
                  let pool = QUESTION_BANK.filter((q) => q.lessonId === lessonId);
                  if (pool.length === 0) pool = [...QUESTION_BANK];
                  const shuffled = [...pool].sort(() => Math.random() - 0.5);
                  const selected = shuffled.slice(0, Math.min(10, shuffled.length));
                  setActiveQuestions(selected);
                  setUserAnswers({});
                  setStartTime(Date.now());
                  setCurrentView('quiz');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAskAiAboutQuestion={(q) => {
                  const correctLetter = String.fromCharCode(65 + q.correctAnswerIndex);
                  const prompt = `Chào Cô Ra AI, em muốn hỏi về câu hỏi này trong Ngân hàng câu hỏi Tin học 7:
Câu hỏi: "${q.question}"
Đáp án đúng theo SGK là: ${correctLetter}. ${q.options[q.correctAnswerIndex]}
Lời giải thích: ${q.explanation}
Cô Ra giải thích chi tiết hơn cho em và hướng dẫn mẹo ghi nhớ nhé!`;
                  setAiInitialQuestion(prompt);
                  setIsAiTutorOpen(true);
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="w-full bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">
              Hệ Thống Gia Sư Tin Học Lớp 7 Thông Minh • Tác giả: <strong>CÔ RA AI</strong>
            </div>
            <p>
              Bám sát cấu trúc Chương trình Giáo dục phổ thông 2018 và SGK Tin học 7 (Bộ sách Kết nối tri thức với cuộc sống - NXB Giáo dục Việt Nam).
            </p>
          </footer>
        </div>
      </div>

      {/* Modals & Drawers */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        initialLessonId={selectedTheoryLessonId}
        onSelectLessonToPractice={(lessonId) => {
          setConfig((prev) => ({ ...prev, selectedLessonId: lessonId }));
        }}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onReviewPastTest={handleReviewPastTest}
      />

      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        currentLessonTitle={currentSubtitle}
        initialQuestion={aiInitialQuestion}
      />

      <ExamPaperModal
        isOpen={isExamPreviewOpen}
        onClose={() => setIsExamPreviewOpen(false)}
        config={config}
        questions={previewQuestions}
      />
    </div>
  );
}
