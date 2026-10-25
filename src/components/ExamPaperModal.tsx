import React, { useRef } from 'react';
import { Question, QuizConfig } from '../types';
import { LESSONS } from '../data/curriculumData';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface ExamPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QuizConfig;
  questions: Question[];
}

export const ExamPaperModal: React.FC<ExamPaperModalProps> = ({
  isOpen,
  onClose,
  config,
  questions,
}) => {
  const [showAnswerKey, setShowAnswerKey] = React.useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const lessonTitleStr =
    config.selectedLessonId === 'all'
      ? 'ÔN TẬP TỔNG HỢP TOÀN BỘ 5 CHỦ ĐỀ (16 BÀI HỌC)'
      : LESSONS.find((l) => l.id === config.selectedLessonId)?.title.toUpperCase() || 'BÀI KIỂM TRA TIN HỌC 7';

  const timeStr = config.timeLimitMinutes > 0 ? `${config.timeLimitMinutes} phút` : '45 phút';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                Xem Trước & In Đề Kiểm Tra Trắc Nghiệm
              </h3>
              <p className="text-xs text-emerald-100 opacity-90">
                Theo chuẩn SGK Tin học 7 (Kết nối tri thức) • {questions.length} câu hỏi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-emerald-100 mr-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAnswerKey}
                onChange={(e) => setShowAnswerKey(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-500 cursor-pointer"
              />
              <span>In kèm bảng đáp án</span>
            </label>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Đề Thi</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exam Paper Document */}
        <div
          ref={printRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white font-serif text-slate-900 space-y-6 print:p-0 print:overflow-visible"
        >
          {/* Header of Test Paper */}
          <div className="border-b-2 border-slate-900 pb-4 space-y-3">
            <div className="flex items-start justify-between text-xs sm:text-sm font-bold uppercase tracking-wider">
              <div className="text-center space-y-0.5">
                <div>TRƯỜNG THCS: ................................................</div>
                <div>LỚP 7: ....................</div>
              </div>
              <div className="text-center space-y-0.5">
                <div>ĐỀ KIỂM TRA TRẮC NGHIỆM TIN HỌC LỚP 7</div>
                <div className="font-normal normal-case italic text-xs">
                  Bộ sách: Kết nối tri thức với cuộc sống
                </div>
              </div>
            </div>

            <div className="text-center pt-2 space-y-1">
              <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900">
                {lessonTitleStr}
              </h2>
              <div className="text-xs sm:text-sm italic">
                Thời gian làm bài: <strong>{timeStr}</strong> (Không kể thời gian phát đề) • Số câu: <strong>{questions.length} câu</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm border-t border-slate-300 pt-2 gap-2">
              <div>
                Họ và tên học sinh: <strong className="font-bold underline">{config.studentName || '........................................................................'}</strong>
              </div>
              <div className="border border-slate-400 px-4 py-1 text-center font-bold">
                Điểm số: ............ / 10
              </div>
            </div>
          </div>

          {/* Educational Matrix Note */}
          <div className="text-xs italic text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            * Ma trận phân bố câu hỏi chuẩn giáo dục: Nhận biết 40% • Thông hiểu 30% • Vận dụng 30%. Học sinh khoanh tròn vào chữ cái A, B, C hoặc D đứng trước câu trả lời đúng nhất.
          </div>

          {/* Questions List */}
          <div className="space-y-6 pt-2">
            {questions.map((q, idx) => {
              return (
                <div key={q.id || idx} className="space-y-2 text-sm leading-relaxed break-inside-avoid">
                  <div className="font-bold text-slate-900">
                    Câu {idx + 1}: {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 text-slate-800">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      return (
                        <div key={optIdx} className="flex items-start gap-2">
                          <span className="font-bold">{letter}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Answer Key Table */}
          {showAnswerKey && (
            <div className="pt-8 border-t-2 border-slate-900 space-y-3 break-inside-avoid">
              <div className="font-bold text-sm uppercase text-slate-900 flex items-center justify-between">
                <span>BẢNG ĐÁP ÁN THAM KHẢO & ĐỐI CHIẾU (DÀNH CHO GIÁO VIÊN / HỌC SINH):</span>
                <span className="text-xs font-normal normal-case italic">Hệ thống Cô Ra AI</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {questions.map((q, idx) => {
                  const letter = String.fromCharCode(65 + q.correctAnswerIndex);
                  return (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-bold"
                    >
                      {idx + 1}: <span className="text-emerald-700">{letter}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center text-xs italic text-slate-500 pt-6">
            --- HẾT --- CÔ RA AI CHÚC CÁC EM ĐẠT ĐIỂM 10 TUYỆT ĐỐI ---
          </div>
        </div>
      </div>
    </div>
  );
};
