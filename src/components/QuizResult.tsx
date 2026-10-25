import React, { useState, useRef } from 'react';
import { Question, QuizConfig } from '../types';
import { LESSONS } from '../data/curriculumData';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Printer,
  Sparkles,
  Bot,
  BookOpen,
  Calendar,
  Share2,
} from 'lucide-react';

interface QuizResultProps {
  config: QuizConfig;
  questions: Question[];
  userAnswers: Record<number, number>;
  timeTakenSeconds: number;
  onRetryQuiz: () => void;
  onNewQuiz: () => void;
  onAskAiAboutQuestion: (question: Question, userAnswerText: string) => void;
  onOpenScoreboard?: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  config,
  questions,
  userAnswers,
  timeTakenSeconds,
  onRetryQuiz,
  onNewQuiz,
  onAskAiAboutQuestion,
  onOpenScoreboard,
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'review'>('certificate');
  const certificateRef = useRef<HTMLDivElement>(null);

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    }
  });

  const total = questions.length;
  const rawScore = (correctCount / total) * 10;
  const score = Math.round(rawScore * 10) / 10; // round to 1 decimal
  const percentage = Math.round((correctCount / total) * 100);

  // Evaluation & Rank
  let rank = 'Khá';
  let message = 'Em đã làm rất tốt! Hãy tiếp tục phát huy nhé!';
  let badgeColor = 'bg-blue-600 text-white';

  if (score >= 9.0) {
    rank = 'Xuất Sắc';
    message = 'Tuyệt vời! Em nắm rất chắc toàn bộ kiến thức Tin học 7!';
    badgeColor = 'bg-amber-500 text-slate-950';
  } else if (score >= 8.0) {
    rank = 'Giỏi';
    message = 'Rất giỏi! Em chỉ cần ôn lại một vài câu là đạt điểm 10!';
    badgeColor = 'bg-emerald-600 text-white';
  } else if (score < 5.0) {
    rank = 'Cần Cố Gắng';
    message = 'Đừng buồn nhé! Hãy đọc lại phần Lý thuyết SGK và thử lại lần nữa!';
    badgeColor = 'bg-rose-600 text-white';
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const selectedLesson = config.selectedLessonId === 'all'
    ? 'Ôn Tập Tổng Hợp Tin Học 7 (Toàn Bộ 5 Chủ Đề - 16 Bài)'
    : LESSONS.find((l) => l.id === config.selectedLessonId)?.title || 'Bài Học Tin Học 7';

  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Hero Summary Card */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-emerald-950">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              BẢNG TỔNG KẾT KẾT QUẢ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Chúc mừng em {config.studentName}!
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl">
              {message}
            </p>
          </div>

          {/* Big Score Box */}
          <div className="flex items-center gap-4 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-400/30 self-start sm:self-center">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Điểm số</div>
              <div className="text-3xl sm:text-4xl font-black text-amber-300">
                {score} <span className="text-lg font-normal text-emerald-200">/ 10</span>
              </div>
            </div>
            <div className="h-10 w-px bg-emerald-700/80" />
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${badgeColor}`}>
                {rank}
              </span>
              <div className="text-xs text-emerald-200 font-medium mt-1">
                Đúng: {correctCount}/{total} ({percentage}%)
              </div>
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div className="pt-2 border-t border-emerald-600/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-emerald-100">
          <div>
            <span className="opacity-70">Nội dung ôn tập:</span>
            <p className="font-semibold text-white truncate">{selectedLesson}</p>
          </div>
          <div>
            <span className="opacity-70">Thời gian làm bài:</span>
            <p className="font-semibold text-white">{formatTime(timeTakenSeconds)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="opacity-70">Gia sư đánh giá:</span>
            <p className="font-semibold text-amber-300">Cô Ra AI</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`pb-3 px-4 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'certificate'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-5 h-5 text-amber-500" />
            <span>Giấy Chứng Nhận Cô Ra AI</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`pb-3 px-4 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Xem Lại Câu Hỏi & Giải Thích ({questions.length})</span>
          </button>
        </div>

        {activeTab === 'certificate' && (
          <button
            onClick={handlePrintCertificate}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer mb-2"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>In / Lưu PDF</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT 1: CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="space-y-4">
          <div
            ref={certificateRef}
            className="bg-radial from-amber-50/40 via-white to-amber-50/20 rounded-3xl p-6 sm:p-12 border-8 border-amber-300/80 shadow-md relative overflow-hidden"
          >
            {/* Certificate Decorative Corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500" />

            <div className="text-center space-y-6 max-w-2xl mx-auto">
              {/* Header Title */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  HỆ THỐNG GIA SƯ THÔNG MINH TIN HỌC LỚP 7
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 uppercase tracking-wide pt-2">
                  GIẤY CHỨNG NHẬN
                </h3>
                <p className="text-xs sm:text-sm font-medium tracking-widest text-slate-500 uppercase">
                  HOÀN THÀNH XUẤT SẮC BÀI ÔN TẬP KIẾN THỨC
                </p>
              </div>

              {/* Student Name Display */}
              <div className="py-2 space-y-1 border-b-2 border-dashed border-amber-200 inline-block px-8">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Trân trọng chứng nhận em:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-wide font-serif">
                  {config.studentName}
                </span>
              </div>

              {/* Course & Lesson info */}
              <div className="space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Đã hoàn thành xuất sắc bài kiểm tra trắc nghiệm môn{' '}
                  <strong className="text-slate-900">TIN HỌC 7</strong>
                </p>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  Bộ sách giáo khoa: <strong>Kết nối tri thức với cuộc sống</strong> (NXB Giáo dục Việt Nam)
                </p>
                <p className="text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50/80 py-1.5 px-4 rounded-xl border border-emerald-200 inline-block">
                  {selectedLesson}
                </p>
              </div>

              {/* Score & Rank */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="text-center">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Điểm số</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 font-serif">
                    {score} / 10
                  </div>
                </div>
                <div className="h-8 w-px bg-amber-300" />
                <div className="text-center">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Xếp loại</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-serif">
                    {rank}
                  </div>
                </div>
              </div>

              {/* Stamp & Signature Section */}
              <div className="pt-6 flex items-end justify-between px-4 sm:px-12 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ngày cấp: {todayStr}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mã xác thực: CORA-7-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                  </div>
                </div>

                {/* Stamp with Cô Ra AI */}
                <div className="text-center space-y-1">
                  <div className="text-xs font-semibold text-slate-600">
                    Gia sư đại diện cấp bằng
                  </div>
                  {/* Digital Stamp */}
                  <div className="inline-block p-2 rounded-2xl border-2 border-dashed border-red-500 bg-red-50/40 text-red-600 rotate-[-4deg] shadow-xs">
                    <div className="text-[10px] uppercase font-bold tracking-wider">CHỨNG NHẬN ĐẠT CHUẨN SGK</div>
                    <div className="text-base font-black tracking-widest uppercase text-red-700">CÔ RA AI</div>
                    <div className="text-[9px] font-semibold">TIN HỌC LỚP 7</div>
                  </div>
                  <div className="font-serif italic font-bold text-slate-800 text-sm">Cô Ra AI</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handlePrintCertificate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Giấy Chứng Nhận Ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: REVIEW QUESTIONS */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 pb-2">
            <span>Chi tiết từng câu hỏi & trích dẫn sách giáo khoa:</span>
            <span>
              Đúng: <strong className="text-emerald-600">{correctCount}</strong> / Sai:{' '}
              <strong className="text-rose-600">{total - correctCount}</strong>
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const selectedOpt = userAnswers[idx];
              const isCorrect = selectedOpt === q.correctAnswerIndex;
              const lessonInfo = LESSONS.find((l) => l.id === q.lessonId);

              return (
                <div
                  key={q.id || idx}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all space-y-4 ${
                    isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {lessonInfo?.shortTitle} (Trang {q.pageReference || lessonInfo?.page})
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Chưa đúng
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 leading-relaxed">
                    {q.question}
                  </h4>

                  {/* Options display */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isUserChoice = selectedOpt === optIdx;
                      const isCorrectChoice = q.correctAnswerIndex === optIdx;

                      let optClass = 'bg-slate-50 border-slate-200 text-slate-700';
                      if (isCorrectChoice) {
                        optClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isUserChoice && !isCorrect) {
                        optClass = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${optClass}`}
                        >
                          <span className="font-bold shrink-0">{letter}.</span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectChoice && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              Đáp án chuẩn SGK
                            </span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                              Em đã chọn
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* SGK Explanation */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-slate-700 space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Giải thích chi tiết theo SGK Tin học 7:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>

                  {/* Ask AI Tutor button for this question */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const userText = selectedOpt !== undefined ? q.options[selectedOpt] : 'Chưa trả lời';
                        onAskAiAboutQuestion(q, userText);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hỏi Cô Ra AI giải thích thêm câu này</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onNewQuiz}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Về trang chủ</span>
          </button>

          {onOpenScoreboard && (
            <button
              onClick={onOpenScoreboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>Xem Bảng Điểm Học Sinh</span>
            </button>
          )}
        </div>

        <button
          onClick={onRetryQuiz}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm lại bài này</span>
        </button>
      </div>
    </div>
  );
};
