import React, { useState, useMemo } from 'react';
import { Question } from '../types';
import { THEMES, LESSONS, QUESTION_BANK } from '../data/curriculumData';
import {
  Search,
  Eye,
  EyeOff,
  BookOpen,
  Bot,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileQuestion,
  Printer,
} from 'lucide-react';

interface QuestionBankViewProps {
  onStartPracticeWithLesson: (lessonId: number) => void;
  onAskAiAboutQuestion: (question: Question) => void;
  onBackToHome: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onStartPracticeWithLesson,
  onAskAiAboutQuestion,
  onBackToHome,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('all');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Track which questions have individual answers toggled open
  const [revealedQuestionIds, setRevealedQuestionIds] = useState<Record<string, boolean>>({});
  // Global show all state
  const [isAllRevealed, setIsAllRevealed] = useState<boolean>(false);

  // If theme changes, filter lessons
  const availableLessons = useMemo(() => {
    if (selectedThemeId === 'all') return LESSONS;
    return LESSONS.filter((l) => l.themeId === Number(selectedThemeId));
  }, [selectedThemeId]);

  // Handle theme dropdown change
  const handleThemeChange = (val: string) => {
    setSelectedThemeId(val);
    setSelectedLessonId('all');
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let list = QUESTION_BANK;

    // Filter by Theme
    if (selectedThemeId !== 'all') {
      const themeIdNum = Number(selectedThemeId);
      list = list.filter((q) => q.themeId === themeIdNum);
    }

    // Filter by Lesson
    if (selectedLessonId !== 'all') {
      const lessonIdNum = Number(selectedLessonId);
      list = list.filter((q) => q.lessonId === lessonIdNum);
    }

    // Filter by Difficulty
    if (selectedDifficulty !== 'all') {
      list = list.filter((q) => q.difficulty === selectedDifficulty);
    }

    // Filter by Keyword (search in question, options, explanation)
    if (searchKeyword.trim()) {
      const qLower = searchKeyword.toLowerCase().trim();
      list = list.filter((q) => {
        const questionMatch = q.question.toLowerCase().includes(qLower);
        const optionsMatch = q.options.some((opt) => opt.toLowerCase().includes(qLower));
        const explanationMatch = q.explanation.toLowerCase().includes(qLower);
        return questionMatch || optionsMatch || explanationMatch;
      });
    }

    return list;
  }, [selectedThemeId, selectedLessonId, selectedDifficulty, searchKeyword]);

  // Toggle individual question answer
  const toggleRevealAnswer = (id: string) => {
    setRevealedQuestionIds((prev) => {
      const current = isAllRevealed ? prev[id] !== false : !!prev[id];
      return {
        ...prev,
        [id]: !current,
      };
    });
  };

  // Show all answers
  const handleShowAll = () => {
    setIsAllRevealed(true);
    const newMap: Record<string, boolean> = {};
    QUESTION_BANK.forEach((q) => {
      newMap[q.id] = true;
    });
    setRevealedQuestionIds(newMap);
  };

  // Hide all answers
  const handleHideAll = () => {
    setIsAllRevealed(false);
    setRevealedQuestionIds({});
  };

  // Check if a question's answer is visible
  const isQuestionRevealed = (id: string) => {
    if (isAllRevealed) {
      return revealedQuestionIds[id] !== false;
    }
    return !!revealedQuestionIds[id];
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedThemeId('all');
    setSelectedLessonId('all');
    setSelectedDifficulty('all');
  };

  const difficultyMeta: Record<string, { label: string; badgeClass: string }> = {
    easy: { label: 'Nhận biết', badgeClass: 'bg-emerald-100 text-emerald-800' },
    medium: { label: 'Thông hiểu', badgeClass: 'bg-blue-100 text-blue-800' },
    hard: { label: 'Vận dụng', badgeClass: 'bg-amber-100 text-amber-800' },
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Title & Header matching image_37e4668e.png */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ngân Hàng Câu Hỏi Tin Học 7
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Tra cứu toàn bộ {QUESTION_BANK.length} câu hỏi chuẩn SGK Kết nối tri thức được phân loại theo 3 cấp độ
          </p>
        </div>

        {/* Global Show/Hide Answer Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShowAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Hiện Tất Cả Đáp Án</span>
          </button>

          <button
            type="button"
            onClick={handleHideAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <EyeOff className="w-4 h-4 text-slate-500" />
            <span>Ẩn Đáp Án</span>
          </button>
        </div>
      </div>

      {/* Filter Card matching exact fields of image_37e4668e.png */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm từ khóa câu hỏi, nội dung, đáp án (ví dụ: thiết bị vào ra, bảng tính, Excel, hàm SUM, mạng xã hội, bản quyền...)"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-slate-800 text-xs sm:text-sm font-medium transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Xóa
            </button>
          )}
        </div>

        {/* 3 Dropdown Filters: CHỦ ĐỀ, BÀI HỌC, CẤP ĐỘ NHẬN THỨC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* CHỦ ĐỀ */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              CHỦ ĐỀ
            </label>
            <select
              value={selectedThemeId}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 font-semibold text-xs transition-all cursor-pointer truncate"
            >
              <option value="all">Tất cả 5 chủ đề</option>
              {THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.title}
                </option>
              ))}
            </select>
          </div>

          {/* BÀI HỌC */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              BÀI HỌC
            </label>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 font-semibold text-xs transition-all cursor-pointer truncate"
            >
              <option value="all">Tất cả bài học</option>
              {availableLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title} (Trang {lesson.page})
                </option>
              ))}
            </select>
          </div>

          {/* CẤP ĐỘ NHẬN THỨC */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              CẤP ĐỘ NHẬN THỨC
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 font-semibold text-xs transition-all cursor-pointer"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="easy">Nhận biết (40%)</option>
              <option value="medium">Thông hiểu (30%)</option>
              <option value="hard">Vận dụng (30%)</option>
            </select>
          </div>
        </div>

        {/* Status Line: Tìm thấy [X] câu hỏi phù hợp */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="text-slate-600 font-medium">
            Tìm thấy <strong className="text-blue-600 font-extrabold text-sm">{filteredQuestions.length}</strong> câu hỏi phù hợp
          </div>

          {(searchKeyword || selectedThemeId !== 'all' || selectedLessonId !== 'all' || selectedDifficulty !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileQuestion className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">
                Không tìm thấy câu hỏi nào
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Không có câu hỏi nào khớp với từ khóa hoặc bộ lọc đã chọn. Em hãy thử chọn lại chủ đề hoặc xóa từ khóa tìm kiếm nhé!
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Xem toàn bộ {QUESTION_BANK.length} câu hỏi
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isRevealed = isQuestionRevealed(q.id);
            const lesson = LESSONS.find((l) => l.id === q.lessonId);
            const diffInfo = difficultyMeta[q.difficulty] || difficultyMeta.easy;

            return (
              <div
                key={q.id || idx}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Card Top Row matching image_37e4668e.png */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Blue number badge */}
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center border border-blue-200 shadow-2xs">
                      {idx + 1}
                    </span>

                    {/* Difficulty pill */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${diffInfo.badgeClass}`}>
                      {diffInfo.label}
                    </span>

                    {/* Lesson pill */}
                    {lesson && (
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        {lesson.shortTitle}
                      </span>
                    )}
                  </div>

                  {/* Toggle Answer Button */}
                  <button
                    type="button"
                    onClick={() => toggleRevealAnswer(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all cursor-pointer active:scale-95"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ẩn đáp án & giải thích</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem đáp án & giải thích</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bold Question Text */}
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-relaxed">
                  {q.question}
                </h3>

                {/* 4 Options in 2x2 Grid matching image_37e4668e.png */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrect = optIdx === q.correctAnswerIndex;

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 select-none ${
                          isRevealed && isCorrect
                            ? 'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold shadow-xs ring-2 ring-emerald-200'
                            : isRevealed && !isCorrect
                            ? 'border-slate-200 bg-slate-50/60 text-slate-500 opacity-70'
                            : 'border-slate-200 bg-white text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                            isRevealed && isCorrect
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isRevealed && isCorrect ? <CheckCircle2 className="w-4 h-4" /> : letter}
                        </span>

                        <span className="text-xs sm:text-sm leading-relaxed pt-0.5">
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card when answer is revealed */}
                {isRevealed && (
                  <div className="mt-3 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-slate-800 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-2 font-bold text-xs sm:text-sm text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Đáp án đúng: <strong className="text-emerald-700">{String.fromCharCode(65 + q.correctAnswerIndex)}</strong>. {q.options[q.correctAnswerIndex]}
                        </span>
                      </div>

                      {lesson && (
                        <span className="text-xs text-slate-500 font-normal italic">
                          (SGK Tin học 7 trang {q.pageReference || lesson.page})
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                      <strong>💡 Lời giải thích SGK:</strong> {q.explanation}
                    </p>

                    {/* Action buttons inside explanation */}
                    <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-emerald-200/60">
                      <button
                        type="button"
                        onClick={() => onAskAiAboutQuestion(q)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 fill-current" />
                        <span>Hỏi Cô Ra AI về câu này</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onStartPracticeWithLesson(q.lessonId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Luyện tập bài {q.lessonId}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
