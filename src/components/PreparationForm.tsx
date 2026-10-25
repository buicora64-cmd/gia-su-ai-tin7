import React from 'react';
import { QuizConfig } from '../types';
import { THEMES, LESSONS, QUESTION_BANK } from '../data/curriculumData';
import { User, Zap, BookOpen, Sliders, CheckCircle2, AlertCircle, Sparkles, Clock, Trophy, Play, Info, FileText, HelpCircle } from 'lucide-react';

interface PreparationFormProps {
  config: QuizConfig;
  onChangeConfig: (newConfig: QuizConfig) => void;
  onStartQuiz: () => void;
  onOpenHistory: () => void;
  onOpenScoreboard?: () => void;
  onOpenExamPreview?: () => void;
  onOpenQuestionBank?: () => void;
}

export const PreparationForm: React.FC<PreparationFormProps> = ({
  config,
  onChangeConfig,
  onStartQuiz,
  onOpenHistory,
  onOpenScoreboard,
  onOpenExamPreview,
  onOpenQuestionBank,
}) => {
  const isNameEmpty = !config.studentName.trim();

  // Filter questions available for the current selection
  const availableCount = React.useMemo(() => {
    let pool = QUESTION_BANK;
    if (config.selectedLessonId !== 'all') {
      pool = pool.filter((q) => q.lessonId === config.selectedLessonId);
    }
    if (config.difficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    return pool.length;
  }, [config.selectedLessonId, config.difficulty]);

  const handleLessonChange = (val: string) => {
    const selectedLessonId = val === 'all' ? 'all' : Number(val);
    onChangeConfig({ ...config, selectedLessonId });
  };

  const selectedLessonObj = React.useMemo(() => {
    if (config.selectedLessonId === 'all') return null;
    return LESSONS.find((l) => l.id === config.selectedLessonId);
  }, [config.selectedLessonId]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Emerald Hero Card matching template */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-emerald-950">
              <Zap className="w-3.5 h-3.5 fill-current" />
              CHUẨN BỊ ÔN TẬP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tự Tin Đạt Điểm 10 Tin Học Lớp 7!
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
              Nhập tên học sinh, chọn bài học và mức độ khó để bắt đầu làm bài nhé!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-wrap">
            {onOpenScoreboard && (
              <button
                onClick={onOpenScoreboard}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Trophy className="w-4 h-4 fill-current" />
                <span>Bảng Điểm Học Sinh</span>
              </button>
            )}
            <button
              onClick={onOpenHistory}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Lịch Sử</span>
            </button>
            {onOpenQuestionBank ? (
              <button
                type="button"
                onClick={onOpenQuestionBank}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#141b31] hover:bg-[#1c2545] text-sky-300 font-bold text-xs sm:text-sm border border-sky-400/40 shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Mở ngân hàng 200 câu hỏi SGK"
              >
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>Ngân Hàng: <strong className="text-amber-300 font-bold">{QUESTION_BANK.length} câu</strong></span>
              </button>
            ) : (
              <div className="px-3 py-2 rounded-2xl bg-emerald-800/60 border border-emerald-400/30 text-emerald-100 text-xs font-medium">
                Kho câu hỏi: <strong className="text-amber-300 font-bold">{QUESTION_BANK.length} câu SGK</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Preparation Setup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-8">
        {/* STEP 1: Student Name */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-wide">
                Nhập tên học sinh tại đây:
              </h3>
            </div>

            {isNameEmpty && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Vui lòng nhập tên em trước khi làm bài
              </span>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5 text-amber-500" />
            </div>
            <input
              type="text"
              id="student-name-input"
              value={config.studentName}
              onChange={(e) => onChangeConfig({ ...config, studentName: e.target.value })}
              placeholder="Nhập đầy đủ họ và tên của học sinh (Ví dụ: Nguyễn Văn An)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-amber-300/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 font-medium text-base transition-all bg-amber-50/20 placeholder:text-slate-400"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 pt-1">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Tên học sinh sẽ được in trân trọng lên <strong>Bảng Tổng Kết & Giấy Chứng Nhận</strong> do <strong>Cô Ra AI</strong> cấp sau khi hoàn thành bài thi.
            </span>
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* STEP 2: Lesson Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                2
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-wide">
                Chọn bài học SGK Tin học 7 cần ôn tập:
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Bộ sách: Kết nối tri thức với cuộc sống
            </span>
          </div>

          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Thao tác nhanh:</strong> Em có thể click chọn ngay bài học ở <strong>Thanh phân hệ bên trái</strong> màn hình hoặc dùng danh mục thả xuống dưới đây!
            </span>
          </div>

          {/* Selector Dropdown */}
          <div className="space-y-3">
            <select
              id="lesson-select"
              value={String(config.selectedLessonId)}
              onChange={(e) => handleLessonChange(e.target.value)}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-800 font-semibold text-sm sm:text-base bg-white transition-all cursor-pointer"
            >
              <option value="all">🌟 TẤT CẢ CÁC BÀI HỌC (Đề ôn tập tổng hợp 5 chủ đề - 16 bài)</option>
              {THEMES.map((theme) => (
                <optgroup key={theme.id} label={theme.title}>
                  {LESSONS.filter((l) => l.themeId === theme.id).map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title} (Trang {lesson.page})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Quick theme pill filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              <span className="text-slate-400 font-medium shrink-0">Chọn nhanh theo chủ đề:</span>
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, selectedLessonId: 'all' })}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  config.selectedLessonId === 'all'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả chủ đề
              </button>
              {THEMES.map((theme) => {
                const firstLesson = theme.lessonIds[0];
                const isActive = config.selectedLessonId !== 'all' && LESSONS.find(l => l.id === config.selectedLessonId)?.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, selectedLessonId: firstLesson })}
                    className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white font-bold shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Chủ đề {theme.id}
                  </button>
                );
              })}
            </div>

            {/* Selected lesson summary card */}
            {selectedLessonObj && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-700 text-sm space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Trọng tâm {selectedLessonObj.title}:</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {selectedLessonObj.summary}
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* STEP 3: Configuration (Count, Difficulty, Timer) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
              3
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-wide">
              Cài đặt bài thi & độ khó:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Number of questions - Expanded to support maximum test questions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Số lượng câu hỏi:
                </label>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Có sẵn: {availableCount} câu
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { count: 5, label: '5 câu (Khởi động)' },
                  { count: 10, label: '10 câu (Chuẩn)' },
                  { count: 20, label: '20 câu (Toàn diện)' },
                  { count: 30, label: '30 câu (Ôn tập kì)' },
                  { count: 40, label: '40 câu (Thi thử)' },
                  { count: availableCount, label: `Tối đa (${availableCount} câu)` },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, questionCount: item.count })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer text-center ${
                      config.questionCount === item.count
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Mức độ phân hóa:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'all', label: 'Tất cả mức độ' },
                  { key: 'easy', label: 'Nhận biết (40%)' },
                  { key: 'medium', label: 'Thông hiểu (30%)' },
                  { key: 'hard', label: 'Vận dụng (30%)' },
                ].map((diff) => (
                  <button
                    key={diff.key}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, difficulty: diff.key as any })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer text-center ${
                      config.difficulty === diff.key
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Thời gian làm bài:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { minutes: 0, label: 'Không giới hạn' },
                  { minutes: 15, label: '15 phút' },
                  { minutes: 30, label: '30 phút' },
                  { minutes: 45, label: '45 phút (1 tiết)' },
                ].map((t) => (
                  <button
                    key={t.minutes}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, timeLimitMinutes: t.minutes })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer text-center ${
                      config.timeLimitMinutes === t.minutes
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ma trận phân bố câu hỏi theo chuẩn giáo dục Banner (As requested in screenshot) */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs sm:text-sm">
            <Info className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Ma trận phân bố câu hỏi theo chuẩn giáo dục:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Nhận biết: 40%
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-blue-800 border border-blue-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Thông hiểu: 30%
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-amber-800 border border-amber-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Vận dụng: 30%
            </span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* STEP 4: Chế Độ Làm Bài (Matching exact layout from user's screenshot) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-sm">
              4
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Chế Độ Làm Bài
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Luyện tập tự do hoặc thi thử có tính giờ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mode 1: Chế Độ Luyện Tập */}
            <div
              onClick={() => onChangeConfig({ ...config, mode: 'practice' })}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-4 select-none ${
                config.mode === 'practice'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-4 ring-indigo-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Chế Độ Luyện Tập
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Xem ngay đáp án đúng/sai và lời giải thích chi tiết trích từ SGK sau mỗi câu. Không áp lực thời gian.
                </p>
              </div>
            </div>

            {/* Mode 2: Chế Độ Kiểm Tra / Thi Thử */}
            <div
              onClick={() => onChangeConfig({ ...config, mode: 'exam' })}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-4 select-none ${
                config.mode === 'exam'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-4 ring-emerald-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Chế Độ Kiểm Tra / Thi Thử
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đồng hồ đếm ngược, nộp bài tính điểm thang 10 và xem báo cáo tổng kết chi tiết sau khi kết thúc.
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Bottom Bar: Checkbox + Actions matching user's screenshot */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Checkbox */}
          <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.shuffleOptions}
              onChange={(e) => onChangeConfig({ ...config, shuffleOptions: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
            <span>Xáo trộn ngẫu nhiên thứ tự phương án A, B, C, D</span>
          </label>

          {/* Right Buttons: Xem Trước / In Đề & Bắt Đầu Làm Bài */}
          <div className="flex items-center gap-3">
            {onOpenExamPreview && (
              <button
                type="button"
                onClick={onOpenExamPreview}
                className="py-3 px-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Xem Trước / In Đề</span>
              </button>
            )}

            <button
              id="start-quiz-btn"
              type="button"
              onClick={onStartQuiz}
              className="py-3.5 px-6 rounded-2xl bg-[#0070f3] hover:bg-blue-600 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt Đầu Làm Bài</span>
            </button>
          </div>
        </div>

        {isNameEmpty && (
          <p className="text-right text-xs text-amber-600 font-medium">
            * Vui lòng điền họ và tên của em trước khi bắt đầu làm bài nhé!
          </p>
        )}
      </div>
    </div>
  );
};
