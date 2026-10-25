import React from 'react';
import { QuizHistoryItem } from '../types';
import { X, History, Trash2, Trophy, Clock, Calendar, ArrowRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: QuizHistoryItem[];
  onClearHistory: () => void;
  onReviewPastTest?: (item: QuizHistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onReviewPastTest,
}) => {
  if (!isOpen) return null;

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <History className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold">
                Lịch Sử Làm Bài Ôn Tập
              </h3>
              <p className="text-xs text-emerald-100 opacity-90">
                Gia Sư Tin Học Lớp 7 - Cô Ra AI
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

        {/* Subheader */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-600 font-medium">
            Tổng số bài đã luyện tập: <strong className="text-emerald-700 font-bold">{history.length}</strong>
          </span>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lịch sử</span>
            </button>
          )}
        </div>

        {/* Body list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <History className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-700">Chưa có bài thi nào được lưu</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Hãy bắt đầu làm một bài kiểm tra trắc nghiệm để lưu kết quả và nhận Giấy Chứng Nhận từ Cô Ra AI nhé!
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isExcellent = item.score >= 8.5;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                        {item.studentName}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {item.percentage}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-1">
                      {item.lessonTitle}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Đúng: {item.correctCount ?? Math.round((item.score / 10) * item.totalQuestions)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        Sai: {item.incorrectCount ?? (item.totalQuestions - (item.correctCount ?? Math.round((item.score / 10) * item.totalQuestions)))}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {item.timeTakenSeconds}s
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-700">
                        {item.score} <span className="text-xs text-slate-400">/ 10</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.score >= 9 ? 'Xuất Sắc' : item.score >= 8 ? 'Giỏi' : item.score >= 5 ? 'Khá' : 'Cần Cố Gắng'}
                      </div>
                    </div>

                    {onReviewPastTest && (
                      <button
                        onClick={() => {
                          onReviewPastTest(item);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                        title="Xem lại kết quả"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
