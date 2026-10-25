import React, { useState } from 'react';
import { THEMES, LESSONS, GLOSSARY } from '../data/curriculumData';
import { Lesson } from '../types';
import { X, BookOpen, Search, CheckCircle2, Lightbulb, Bookmark, ArrowRight } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLessonToPractice: (lessonId: number) => void;
  initialLessonId?: number;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  onSelectLessonToPractice,
  initialLessonId,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(initialLessonId || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary'>('lessons');

  React.useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
    }
  }, [initialLessonId, isOpen]);

  if (!isOpen) return null;

  const currentLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];

  const filteredLessons = LESSONS.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlossary = GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                Lý Thuyết Trọng Tâm SGK Tin Học 7
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 opacity-90">
                Bộ sách Kết nối tri thức với cuộc sống • Biên soạn bởi Cô Ra AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs sub-bar */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'lessons'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              16 Bài Học Theo 5 Chủ Đề
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'glossary'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bảng Giải Thích Thuật Ngữ (Trang 83)
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm kiến thức, thuật ngữ..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {activeTab === 'lessons' ? (
            <>
              {/* Left Lesson Navigation Sidebar */}
              <div className="w-full md:w-80 border-r border-slate-200 overflow-y-auto p-3 space-y-4 bg-slate-50/50">
                {THEMES.map((theme) => {
                  const themeLessons = filteredLessons.filter((l) => l.themeId === theme.id);
                  if (themeLessons.length === 0) return null;

                  return (
                    <div key={theme.id} className="space-y-1.5">
                      <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider px-2">
                        {theme.title}
                      </div>

                      <div className="space-y-1">
                        {themeLessons.map((lesson) => {
                          const isSelected = lesson.id === currentLesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLessonId(lesson.id)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className="truncate">{lesson.shortTitle}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                                  isSelected
                                    ? 'bg-emerald-800 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                Tr.{lesson.page}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Lesson Detail Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      SGK Tin học 7 • Trang {currentLesson.page}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 pt-2">
                      {currentLesson.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      onSelectLessonToPractice(currentLesson.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow transition-all active:scale-95 cursor-pointer self-start sm:self-center"
                  >
                    <span>Luyện tập bài này ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Mục tiêu bài học:</strong>
                  {currentLesson.summary}
                </div>

                {/* Key Points - Hộp Kiến Thức */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-base font-bold text-emerald-900">
                    <Bookmark className="w-5 h-5 text-emerald-600" />
                    <span>Hộp kiến thức trọng tâm (SGK):</span>
                  </div>

                  <div className="space-y-2.5">
                    {currentLesson.keyPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-slate-700 text-xs sm:text-sm flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Tips */}
                {currentLesson.practicalTips.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Lưu ý thực hành & ghi nhớ từ Cô Ra AI:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {currentLesson.practicalTips.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* TAB 2: GLOSSARY */
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 bg-white">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">
                  Bảng Giải Thích Thuật Ngữ Tin Học 7
                </h3>
                <p className="text-xs text-slate-500">
                  Trích từ Bảng tra cứu thuật ngữ SGK Tin học 7 trang 83 - 84
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-emerald-800 text-sm sm:text-base">
                        {item.term}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        Trang {item.page}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
