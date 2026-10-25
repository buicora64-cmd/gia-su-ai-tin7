export interface Question {
  id: string;
  lessonId: number;
  themeId: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard'; // Nhận biết, Thông hiểu, Vận dụng
  pageReference?: number;
}

export interface Lesson {
  id: number;
  title: string;
  shortTitle: string;
  themeId: number;
  page: number;
  summary: string;
  keyPoints: string[];
  practicalTips: string[];
}

export interface Theme {
  id: number;
  title: string;
  color: string;
  lessonIds: number[];
}

export interface QuizConfig {
  studentName: string;
  selectedLessonId: number | 'all';
  questionCount: number;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  timeLimitMinutes: number; // 0 for unlimited
  mode: 'practice' | 'exam'; // 'practice' (Luyện tập) | 'exam' (Kiểm tra / Thi thử)
  shuffleOptions: boolean;   // Xáo trộn ngẫu nhiên thứ tự phương án A, B, C, D
}

export interface QuizHistoryItem {
  id: string;
  studentName: string;
  lessonTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  timeTakenSeconds: number;
  timestamp: number;
  questions: Question[];
  userAnswers: Record<number, number>;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  page: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'cora';
  text: string;
  timestamp: number;
  source?: 'gemini' | 'local' | 'fallback';
}
