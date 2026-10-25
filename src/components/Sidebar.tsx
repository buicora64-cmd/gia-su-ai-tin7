import React, { useState } from 'react';
import { THEMES, LESSONS, QUESTION_BANK } from '../data/curriculumData';
import { QuizConfig, QuizHistoryItem } from '../types';
import {
  BookOpen,
  GraduationCap,
  History,
  Bot,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  ChevronLeft,
  X,
  Search,
  Trophy,
  User,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  config: QuizConfig;
  onChangeConfig: (newConfig: QuizConfig) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenTheory: (initialLessonId?: number) => void;
  onOpenHistory: () => void;
  onOpenScoreboard: () => void;
  onOpenQuestionBank: () => void;
  onOpenAiTutor: () => void;
  currentView: 'home' | 'quiz' | 'result' | 'scoreboard' | 'question-bank';
  onNavigateHome: () => void;
  history: QuizHistoryItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  onChangeConfig,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  onOpenTheory,
  onOpenHistory,
  onOpenScoreboard,
  onOpenQuestionBank,
  onOpenAiTutor,
  currentView,
  onNavigateHome,
  history,
}) => {
  // Keep track of which theme accordions are expanded (default: open all or current active theme)
  const activeThemeId = React.useMemo(() => {
    if (config.selectedLessonId === 'all') return 1;
    return LESSONS.find((l) => l.id === config.selectedLessonId)?.themeId || 1;
  }, [config.selectedLessonId]);

  const [expandedThemes, setExpandedThemes] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const [searchFilter, setSearchFilter] = useState('');

  const toggleTheme = (themeId: number) => {
    setExpandedThemes((prev) => ({
      ...prev,
      [themeId]: !prev[themeId],
    }));
  };

  const handleSelectLesson = (lessonId: number | 'all') => {
    onChangeConfig({
      ...config,
      selectedLessonId: lessonId,
    });
    if (currentView !== 'home') {
      onNavigateHome();
    }
    onCloseMobile();
  };

  // Stats calculation
  const totalCompleted = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map((h) => h.score)) : null;

  // Filter lessons if searching
  const filteredLessons = React.useMemo(() => {
    if (!searchFilter.trim()) return null;
    const q = searchFilter.toLowerCase();
    return LESSONS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.shortTitle.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 select-none overflow-hidden">
      {/* Top Sidebar Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-black shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  CÔ RA AI
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-emerald-900/80 text-emerald-200 border border-emerald-600/40 font-semibold">
                  Tin 7
                </span>
              </div>
              <h2 className="font-extrabold text-sm text-white truncate">
                Phân Hệ Ôn Tập SGK
              </h2>
            </div>
          )}
        </div>

        {/* Mobile close button or desktop collapse button */}
        <div className="flex items-center gap-1">
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer"
            title="Đóng thanh điều hướng"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Mở rộng thanh phân hệ' : 'Thu gọn thanh phân hệ'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Student Profile Quick View */}
      {!isCollapsed && (
        <div className="p-3 bg-emerald-50/80 border-b border-emerald-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-slate-500 uppercase">Học sinh</div>
              <div className="font-extrabold text-xs text-emerald-950 truncate">
                {config.studentName.trim() || 'Chưa nhập họ tên'}
              </div>
            </div>
            {bestScore !== null && (
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                  <Trophy className="w-3 h-3" />
                  <span>Điểm cao: {bestScore}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {totalCompleted} bài thi
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Core Subsystem Navigation Menu */}
      <div className="p-2 border-b border-slate-100 shrink-0 space-y-1.5">
        <button
          onClick={() => {
            onNavigateHome();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            currentView === 'home'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Luyện tập trắc nghiệm"
        >
          <Zap className={`w-4 h-4 shrink-0 ${currentView === 'home' ? 'text-amber-300 fill-amber-300' : 'text-emerald-600'}`} />
          {!isCollapsed && <span className="truncate">Luyện Tập Trắc Nghiệm</span>}
        </button>

        {/* Button: Ngân Hàng Câu Hỏi - Kho câu hỏi SGK (Exact match of image_61087815.png) */}
        <button
          onClick={() => {
            onOpenQuestionBank();
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer select-none text-left ${
            currentView === 'question-bank'
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
              : 'bg-[#141b31] hover:bg-[#1c2545] text-white shadow-sm'
          }`}
          title={`Ngân Hàng Câu Hỏi Tin Học 7 (${QUESTION_BANK.length} câu)`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              currentView === 'question-bank' ? 'bg-white/20 text-white' : 'bg-[#1e2a4f] text-[#38bdf8]'
            }`}>
              <HelpCircle className="w-5 h-5 text-[#38bdf8]" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <div className="font-extrabold text-xs sm:text-sm text-white truncate">
                  Ngân Hàng Câu ...
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate">
                  Kho câu hỏi SGK
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-sky-400 border border-sky-500/50 bg-sky-500/10 shrink-0">
              {QUESTION_BANK.length} câu
            </span>
          )}
        </button>

        <button
          onClick={() => {
            onOpenScoreboard();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            currentView === 'scoreboard'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
          }`}
          title="Bảng điểm học sinh & Xếp hạng"
        >
          <Trophy className={`w-4 h-4 shrink-0 ${currentView === 'scoreboard' ? 'text-amber-300 fill-amber-300' : 'text-amber-500'}`} />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 truncate">
              <span className="truncate">Bảng Điểm Học Sinh</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-extrabold">
                {totalCompleted}
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => {
            onOpenTheory();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all cursor-pointer"
          title="Lý thuyết 16 bài học SGK & Bảng thuật ngữ"
        >
          <BookOpen className="w-4 h-4 shrink-0 text-emerald-600" />
          {!isCollapsed && <span className="truncate">Kho Lý Thuyết SGK</span>}
        </button>

        <button
          onClick={() => {
            onOpenHistory();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-all cursor-pointer"
          title="Lịch sử làm bài & Bảng điểm"
        >
          <History className="w-4 h-4 shrink-0 text-amber-500" />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 truncate">
              <span className="truncate">Lịch Sử & Bằng Khen</span>
              {totalCompleted > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                  {totalCompleted}
                </span>
              )}
            </div>
          )}
        </button>

        <button
          onClick={() => {
            onOpenAiTutor();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 transition-all shadow-xs cursor-pointer"
          title="Hỏi đáp cùng Gia sư Cô Ra AI"
        >
          <Bot className="w-4 h-4 shrink-0 text-emerald-950" />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 truncate">
              <span className="truncate">Gia Sư Cô Ra AI</span>
              <span className="text-[10px] font-black uppercase text-emerald-900 bg-amber-200 px-1 rounded">
                24/7
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Curriculum Tree (5 Themes & 16 Lessons) */}
      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Quick search input */}
          <div className="relative px-1 pt-1 pb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Tìm bài học SGK..."
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* All Lessons Option */}
          <div className="px-1">
            <button
              onClick={() => handleSelectLesson('all')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                config.selectedLessonId === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className={`w-3.5 h-3.5 shrink-0 ${config.selectedLessonId === 'all' ? 'text-amber-300' : 'text-amber-500'}`} />
                <span className="truncate">🌟 Toàn Bộ 16 Bài Học (Tổng Hợp)</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ${
                config.selectedLessonId === 'all' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {QUESTION_BANK.length} câu
              </span>
            </button>
          </div>

          <div className="px-2 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>5 Chủ Đề SGK Tin Học 7</span>
            <span>16 Bài</span>
          </div>

          {/* If search filter active */}
          {filteredLessons ? (
            <div className="space-y-1 px-1">
              {filteredLessons.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  Không tìm thấy bài học nào phù hợp.
                </div>
              ) : (
                filteredLessons.map((lesson) => {
                  const isSelected = config.selectedLessonId === lesson.id;
                  const qCount = QUESTION_BANK.filter((q) => q.lessonId === lesson.id).length;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white font-bold shadow-xs'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{lesson.shortTitle}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                          Trang {lesson.page} • {qCount} câu hỏi
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            /* Theme Accordions */
            <div className="space-y-2 px-1">
              {THEMES.map((theme) => {
                const isExpanded = !!expandedThemes[theme.id];
                const themeLessons = LESSONS.filter((l) => l.themeId === theme.id);
                const hasSelectedLesson = themeLessons.some((l) => l.id === config.selectedLessonId);

                return (
                  <div
                    key={theme.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      hasSelectedLesson
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Theme header button */}
                    <button
                      type="button"
                      onClick={() => toggleTheme(theme.id)}
                      className="w-full text-left p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                          {theme.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {theme.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-slate-400">
                        <span className="text-[10px] font-semibold">{themeLessons.length} bài</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {/* Lessons list inside Theme */}
                    {isExpanded && (
                      <div className="p-1.5 pt-0 space-y-1 border-t border-slate-100/80 bg-slate-50/50">
                        {themeLessons.map((lesson) => {
                          const isSelected = config.selectedLessonId === lesson.id;
                          const qCount = QUESTION_BANK.filter((q) => q.lessonId === lesson.id).length;

                          return (
                            <div
                              key={lesson.id}
                              className={`group flex items-center justify-between gap-1 p-1.5 rounded-xl text-xs transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectLesson(lesson.id)}
                                className="flex-1 text-left truncate flex items-center gap-1.5 cursor-pointer py-0.5"
                                title={lesson.title}
                              >
                                <span className={`text-[10px] px-1 py-0.5 rounded font-mono shrink-0 ${
                                  isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  B.{lesson.id}
                                </span>
                                <span className="truncate">{lesson.shortTitle}</span>
                              </button>

                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[9px] px-1 py-0.5 rounded ${
                                  isSelected ? 'text-emerald-100 bg-emerald-700' : 'text-slate-400 bg-slate-100'
                                }`}>
                                  Tr.{lesson.page}
                                </span>

                                {/* Quick theory view icon */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenTheory(lesson.id);
                                  }}
                                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'text-white hover:bg-emerald-700'
                                      : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                                  }`}
                                  title={`Xem lý thuyết ${lesson.shortTitle}`}
                                >
                                  <BookOpen className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Collapsed Icon-Only View for Themes */
        <div className="flex-1 overflow-y-auto p-2 space-y-2 flex flex-col items-center">
          <button
            onClick={() => handleSelectLesson('all')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              config.selectedLessonId === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Tất cả 16 bài học"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onOpenQuestionBank}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'question-bank'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-[#141b31] text-[#38bdf8] hover:bg-[#1c2545]'
            }`}
            title={`Ngân Hàng Câu Hỏi (${QUESTION_BANK.length} câu)`}
          >
            <HelpCircle className="w-5 h-5 text-[#38bdf8]" />
          </button>

          {THEMES.map((theme) => {
            const hasSelectedLesson = LESSONS.filter((l) => l.themeId === theme.id).some(
              (l) => l.id === config.selectedLessonId
            );
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onToggleCollapse(); // expand to see details
                }}
                className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                  hasSelectedLesson
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
                title={`Chủ đề ${theme.id}: ${theme.title}`}
              >
                C{theme.id}
              </button>
            );
          })}
        </div>
      )}

      {/* Footer Support Info */}
      {!isCollapsed && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Gia Sư AI Sẵn Sàng Trợ Giúp</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            SGK Tin học 7 • Kết nối tri thức
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-16' : 'w-72 lg:w-80'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
