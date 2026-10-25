import React from 'react';
import { Sparkles, BookOpen, History, Bot, GraduationCap, Menu, PanelLeft, Trophy, HelpCircle } from 'lucide-react';

interface HeaderBannerProps {
  currentSubtitle: string;
  onOpenHistory: () => void;
  onOpenTheory: () => void;
  onOpenScoreboard: () => void;
  onOpenQuestionBank?: () => void;
  onOpenAiTutor: () => void;
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapseDesktop?: () => void;
  activeTab?: 'home' | 'quiz' | 'result' | 'scoreboard' | 'question-bank';
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  currentSubtitle,
  onOpenHistory,
  onOpenTheory,
  onOpenScoreboard,
  onOpenQuestionBank,
  onOpenAiTutor,
  onToggleMobileSidebar,
  isSidebarCollapsed,
  onToggleCollapseDesktop,
  activeTab,
}) => {
  return (
    <header className="w-full text-white shadow-md">
      {/* Top narrow sub-bar */}
      <div className="bg-emerald-900/90 text-emerald-100 text-xs sm:text-sm py-1.5 px-4 text-center font-medium border-b border-emerald-800/60 flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>
          Tác giả: <strong className="text-amber-300 font-bold tracking-wide">CÔ RA AI</strong>
        </span>
        <span className="hidden sm:inline text-emerald-400">•</span>
        <span className="hidden sm:inline">Hệ Thống Ôn Tập & Gia Sư Tin Học Lớp 7 Thông Minh</span>
      </div>

      {/* Main hero banner matching template */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-700 py-5 px-4 sm:px-6 border-b-4 border-emerald-600">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left Title & Badges with Hamburger Button */}
          <div className="flex items-start gap-3">
            {/* Hamburger button for mobile / collapse toggle */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white shadow transition-all active:scale-95 cursor-pointer"
                title="Mở thanh phân hệ chọn bài học"
              >
                <Menu className="w-5 h-5 text-amber-300" />
              </button>
              {onToggleCollapseDesktop && (
                <button
                  type="button"
                  onClick={onToggleCollapseDesktop}
                  className="hidden md:flex p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-all cursor-pointer"
                  title={isSidebarCollapsed ? 'Mở rộng thanh phân hệ bên trái' : 'Thu gọn thanh phân hệ'}
                >
                  <PanelLeft className="w-5 h-5 text-amber-300" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-emerald-950 shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5" />
                  TÁC GIẢ: CÔ RA AI
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-100 border border-emerald-500/40">
                  Tin học 7 • KNTT
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                GIA SƯ TIN HỌC LỚP 7
              </h1>

              <p className="text-emerald-100 text-xs sm:text-sm font-normal line-clamp-1 opacity-90 max-w-xl">
                {currentSubtitle || 'Sách giáo khoa Tin học 7 - Kết nối tri thức với cuộc sống'}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
            {onOpenQuestionBank && (
              <button
                onClick={onOpenQuestionBank}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow transition-all active:scale-95 cursor-pointer ${
                  activeTab === 'question-bank'
                    ? 'bg-blue-600 text-white ring-2 ring-white/50'
                    : 'bg-[#141b31] hover:bg-[#1c2545] text-sky-300 border border-sky-400/30'
                }`}
                title="Tra cứu ngân hàng 200 câu hỏi SGK Tin học 7"
              >
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>Ngân Hàng Câu Hỏi</span>
              </button>
            )}

            <button
              onClick={onOpenScoreboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow transition-all active:scale-95 cursor-pointer"
              title="Xem bảng điểm học sinh & xếp hạng"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>Bảng Điểm</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow transition-all active:scale-95 cursor-pointer"
              title="Xem lịch sử làm bài"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Lịch Sử</span>
            </button>

            <button
              onClick={onOpenTheory}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/95 hover:bg-white text-emerald-900 shadow transition-all active:scale-95 cursor-pointer"
              title="Mở tóm tắt lý thuyết SGK Tin học 7"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Lý Thuyết SGK</span>
            </button>

            <button
              onClick={onOpenAiTutor}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-950/80 hover:bg-emerald-950 text-emerald-200 border border-emerald-400/40 shadow transition-all active:scale-95 cursor-pointer"
              title="Hỏi gia sư Cô Ra AI"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Gia Sư Cô Ra AI</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
