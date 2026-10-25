import React, { useState, useEffect } from 'react';
import { Question, QuizConfig } from '../types';
import { LESSONS } from '../data/curriculumData';
import { Clock, ArrowLeft, ArrowRight, Send, AlertTriangle, Check, HelpCircle } from 'lucide-react';

interface QuizActiveProps {
  config: QuizConfig;
  questions: Question[];
  userAnswers: Record<number, number>;
  onSelectAnswer: (questionIndex: number, optionIndex: number) => void;
  onSubmitQuiz: () => void;
  onCancelQuiz: () => void;
}

export const QuizActive: React.FC<QuizActiveProps> = ({
  config,
  questions,
  userAnswers,
  onSelectAnswer,
  onSubmitQuiz,
  onCancelQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    return config.timeLimitMinutes > 0 ? config.timeLimitMinutes * 60 : null;
  });
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // Timer effect
  useEffect(() => {
    // In practice mode, don't force countdown timer expiration
    if (config.mode === 'practice' || timeLeft === null) return;
    if (timeLeft <= 0) {
      onSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onSubmitQuiz, config.mode]);

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isPracticeMode = config.mode === 'practice';
  const hasAnsweredCurrent = userAnswers[currentIndex] !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && userAnswers[currentIndex] === currentQ.correctAnswerIndex;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentLesson = LESSONS.find((l) => l.id === currentQ.lessonId);

  const difficultyLabels: Record<string, { label: string; color: string }> = {
    easy: { label: 'Nhận biết', color: 'bg-blue-100 text-blue-700' },
    medium: { label: 'Thông hiểu', color: 'bg-emerald-100 text-emerald-700' },
    hard: { label: 'Vận dụng', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Bar: Progress, Timer & Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Student info & Progress */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Học sinh:</span>
            <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {config.studentName}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isPracticeMode ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {isPracticeMode ? 'Chế độ Luyện Tập' : 'Chế độ Thi Thử'}
            </span>
          </div>
          <div className="text-xs font-medium text-slate-500">
            Đã trả lời: <strong className="text-emerald-600">{answeredCount}</strong> / {questions.length} câu
          </div>
        </div>

        {/* Center: Countdown Timer or Practice Indicator */}
        {isPracticeMode ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-xs sm:text-sm">
            <span className="text-base">💡</span>
            <span>Luyện tập tự do • Không áp lực thời gian</span>
          </div>
        ) : (
          timeLeft !== null && (
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-base font-bold shadow-sm ${
                timeLeft < 120
                  ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfirmCancel(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bài
          </button>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isPracticeMode ? 'Xem kết quả' : 'Nộp bài'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
        {/* Question Metadata */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            {currentLesson && (
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {currentLesson.shortTitle} (Trang {currentLesson.page})
              </span>
            )}
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                difficultyLabels[currentQ.difficulty]?.color || 'bg-slate-100 text-slate-600'
              }`}
            >
              {difficultyLabels[currentQ.difficulty]?.label}
            </span>
          </div>

          <span className="text-xs text-slate-400">
            {isPracticeMode ? 'Chọn đáp án để xem giải thích SGK ngay' : 'Chọn 1 đáp án đúng nhất'}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = userAnswers[currentIndex] === idx;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isCorrectOption = idx === currentQ.correctAnswerIndex;

            // In Practice Mode styling
            let optionStyle = 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60 text-slate-700';
            let badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200';

            if (isPracticeMode && hasAnsweredCurrent) {
              if (isCorrectOption) {
                optionStyle = 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-300 font-semibold';
                badgeStyle = 'bg-emerald-600 text-white font-bold';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-medium';
                badgeStyle = 'bg-rose-600 text-white font-bold';
              } else {
                optionStyle = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400';
              }
            } else if (isSelected) {
              optionStyle = 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm';
              badgeStyle = 'bg-emerald-600 text-white';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAnswer(currentIndex, idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer active:scale-[0.99] ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                >
                  {isPracticeMode && hasAnsweredCurrent ? (
                    isCorrectOption ? <Check className="w-4 h-4" /> : isSelected ? '✕' : letter
                  ) : isSelected ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    letter
                  )}
                </span>

                <span className="text-sm sm:text-base font-medium leading-relaxed pt-0.5">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Practice Mode: Immediate SGK Explanation Card */}
        {isPracticeMode && hasAnsweredCurrent && (
          <div className={`p-5 rounded-2xl border transition-all space-y-2 animate-fade-in ${
            isCurrentCorrect
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-lg">{isCurrentCorrect ? '🎉' : '💡'}</span>
              <span>
                {isCurrentCorrect ? 'Chính xác!' : 'Chưa chính xác!'} Lời giải chi tiết từ SGK Tin học 7:
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 pl-6">
              {currentQ.explanation}
            </p>
            {currentLesson && (
              <div className="pl-6 text-xs text-slate-500 font-medium italic">
                Trích từ: {currentLesson.title} (SGK Tin học 7 Kết nối tri thức, trang {currentLesson.page})
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition-all active:scale-95 cursor-pointer"
            >
              <span>Câu kế tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmSubmit(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Hoàn thành & Xem kết quả</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Matrix */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-100 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Bảng điều hướng câu hỏi:</span>
          {isPracticeMode ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Đúng
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Chưa đúng
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Chưa làm
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Đã làm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Chưa làm
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers[idx] !== undefined;
            const isCurrent = currentIndex === idx;
            const isCorrect = isAnswered && userAnswers[idx] === q.correctAnswerIndex;

            let btnStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
            if (isAnswered) {
              if (isPracticeMode) {
                btnStyle = isCorrect ? 'bg-emerald-600 text-white shadow-xs' : 'bg-rose-500 text-white shadow-xs';
              } else {
                btnStyle = 'bg-emerald-600 text-white shadow-xs';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-emerald-600 ring-offset-2 scale-105'
                    : ''
                } ${btnStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-xl font-extrabold text-slate-800">
                Xác nhận nộp bài?
              </h4>
              <p className="text-slate-600 text-sm">
                Em đã hoàn thành <strong className="text-emerald-600">{answeredCount}</strong> / {questions.length} câu hỏi.
                {answeredCount < questions.length && (
                  <span className="block text-amber-600 font-semibold mt-1">
                    ⚠️ Còn {questions.length - answeredCount} câu em chưa trả lời!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Tiếp tục làm
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  onSubmitQuiz();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition-all active:scale-95 cursor-pointer"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-xl font-extrabold text-slate-800">
                Hủy bài kiểm tra?
              </h4>
              <p className="text-slate-600 text-sm">
                Kết quả bài làm hiện tại sẽ không được lưu lại. Em có chắc chắn muốn quay về trang chính?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Ở lại làm tiếp
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmCancel(false);
                  onCancelQuiz();
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow transition-all active:scale-95 cursor-pointer"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
