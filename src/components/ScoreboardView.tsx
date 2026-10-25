import React, { useState, useMemo } from 'react';
import { QuizHistoryItem } from '../types';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  ArrowLeft,
  RotateCcw,
  Award,
  Zap,
  User,
  GraduationCap,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface ScoreboardViewProps {
  history: QuizHistoryItem[];
  onClearHistory: () => void;
  onDeleteSingleHistory?: (id: string) => void;
  onReviewPastTest: (item: QuizHistoryItem) => void;
  onBackToHome: () => void;
  studentNameFilter?: string;
}

export const ScoreboardView: React.FC<ScoreboardViewProps> = ({
  history,
  onClearHistory,
  onDeleteSingleHistory,
  onReviewPastTest,
  onBackToHome,
  studentNameFilter = '',
}) => {
  const [searchName, setSearchName] = useState(studentNameFilter);
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'fastest'>('newest');

  // Format date helper
  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  // Format time taken helper
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} giây`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}p ${secs}s`;
  };

  // Rank helper
  const getRankInfo = (score: number) => {
    if (score >= 9.0) return { label: 'Xuất Sắc', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (score >= 8.0) return { label: 'Giỏi', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (score >= 5.0) return { label: 'Khá', color: 'bg-blue-100 text-blue-900 border-blue-300' };
    return { label: 'Cần Cố Gắng', color: 'bg-rose-100 text-rose-900 border-rose-300' };
  };

  // Filtered & Sorted list
  const filteredList = useMemo(() => {
    return history
      .filter((item) => {
        // Search by student name or lesson title
        const matchesQuery =
          !searchName.trim() ||
          item.studentName.toLowerCase().includes(searchName.toLowerCase()) ||
          item.lessonTitle.toLowerCase().includes(searchName.toLowerCase());

        // Filter by rank
        let matchesRank = true;
        if (selectedRank === 'xuat_sac') matchesRank = item.score >= 9.0;
        else if (selectedRank === 'gioi') matchesRank = item.score >= 8.0 && item.score < 9.0;
        else if (selectedRank === 'kha') matchesRank = item.score >= 5.0 && item.score < 8.0;
        else if (selectedRank === 'can_co_gang') matchesRank = item.score < 5.0;

        return matchesQuery && matchesRank;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp;
        if (sortBy === 'highest') return b.score - a.score || a.timeTakenSeconds - b.timeTakenSeconds;
        if (sortBy === 'fastest') return a.timeTakenSeconds - b.timeTakenSeconds || b.score - a.score;
        return 0;
      });
  }, [history, searchName, selectedRank, sortBy]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = history.length;
    if (total === 0) return { total: 0, avgScore: 0, highestScore: 0, topStudent: '—', totalCorrect: 0, totalQuestions: 0 };

    let totalScore = 0;
    let maxScore = -1;
    let topStudent = '—';
    let totalCorrect = 0;
    let totalQuestions = 0;

    history.forEach((h) => {
      totalScore += h.score;
      if (h.score > maxScore) {
        maxScore = h.score;
        topStudent = h.studentName;
      }
      const correct = h.correctCount ?? Math.round((h.score / 10) * h.totalQuestions);
      totalCorrect += correct;
      totalQuestions += h.totalQuestions;
    });

    const avgScore = Math.round((totalScore / total) * 10) / 10;
    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      total,
      avgScore,
      highestScore: maxScore >= 0 ? maxScore : 0,
      topStudent,
      avgAccuracy,
    };
  }, [history]);

  // Export to CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'STT',
      'Họ và tên học sinh',
      'Nội dung bài học',
      'Điểm số (thang 10)',
      'Số câu đúng',
      'Số câu sai',
      'Tổng số câu',
      'Thời gian làm bài (giây)',
      'Xếp loại',
      'Thời điểm hoàn thành',
    ];

    const rows = history.map((item, idx) => {
      const correct = item.correctCount ?? Math.round((item.score / 10) * item.totalQuestions);
      const incorrect = item.incorrectCount ?? (item.totalQuestions - correct);
      const rank = getRankInfo(item.score).label;
      const dateStr = formatDate(item.timestamp);

      return [
        idx + 1,
        `"${item.studentName.replace(/"/g, '""')}"`,
        `"${item.lessonTitle.replace(/"/g, '""')}"`,
        item.score,
        correct,
        incorrect,
        item.totalQuestions,
        item.timeTakenSeconds,
        `"${rank}"`,
        `"${dateStr}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Diem_Tin_Hoc_7_Co_Ra_AI_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-emerald-950 shadow-sm">
                <Trophy className="w-3.5 h-3.5 fill-current" />
                BẢNG ĐIỂM HỌC SINH
              </span>
              <span className="text-xs font-semibold bg-emerald-900/60 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Gia sư Cô Ra AI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bảng Ghi Điểm & Tiến Độ Làm Bài
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Lưu trữ chi tiết họ tên học sinh, điểm số đạt được, số câu đúng/sai và thời gian làm bài theo SGK Tin học 7.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-emerald-400/40 transition-all active:scale-95 cursor-pointer self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Màn Hình Ôn Tập</span>
          </button>
        </div>

        {/* Quick KPI Stats Row */}
        <div className="pt-3 border-t border-emerald-600/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/30">
            <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">Tổng Lượt Thi</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              {stats.total} <span className="text-xs font-normal text-emerald-300">lượt</span>
            </div>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/30">
            <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">Điểm Trung Bình</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
              {stats.avgScore} <span className="text-xs font-normal text-emerald-300">/ 10</span>
            </div>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/30">
            <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">Điểm Kỷ Lục</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
              {stats.highestScore} <span className="text-xs font-normal text-emerald-300">/ 10</span>
            </div>
            <div className="text-[10px] text-emerald-200 truncate mt-0.5">
              HS: <strong>{stats.topStudent}</strong>
            </div>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/30">
            <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">Độ Chính Xác TB</div>
            <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-0.5">
              {stats.avgAccuracy || 0}%
            </div>
            <div className="text-[10px] text-emerald-200 mt-0.5">
              Toàn bộ bài nộp
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sort & Actions */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="flex-1 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tìm theo họ tên học sinh hoặc bài học..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Middle: Rank filter & Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Tất cả xếp loại</option>
            <option value="xuat_sac">Xuất sắc (≥ 9.0)</option>
            <option value="gioi">Giỏi (8.0 - 8.9)</option>
            <option value="kha">Khá (5.0 - 7.9)</option>
            <option value="can_co_gang">Cần cố gắng (&lt; 5.0)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="newest">Thời gian: Mới nhất</option>
            <option value="highest">Điểm số: Cao nhất</option>
            <option value="fastest">Làm bài: Nhanh nhất</option>
          </select>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                title="Tải bảng điểm dạng file Excel / CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                title="In bảng điểm"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>In</span>
              </button>

              <button
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                title="Xóa tất cả kết quả đã lưu"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa hết</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Scoreboard Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-700">Chưa có bản ghi điểm nào</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Khi học sinh nhập họ tên và hoàn thành bài kiểm tra, kết quả (điểm số, số câu đúng/sai, thời gian làm bài) sẽ tự động được ghi nhận tại đây!
              </p>
            </div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Bắt Đầu Làm Bài Ngay</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4 w-12 text-center">STT</th>
                  <th className="py-3.5 px-4">Học Sinh</th>
                  <th className="py-3.5 px-4">Bài Học SGK Tin 7</th>
                  <th className="py-3.5 px-4 text-center">Điểm Số</th>
                  <th className="py-3.5 px-4 text-center">Đúng / Sai</th>
                  <th className="py-3.5 px-4 text-center">Thời Gian</th>
                  <th className="py-3.5 px-4">Ngày Hoàn Thành</th>
                  <th className="py-3.5 px-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item, idx) => {
                  const correct = item.correctCount ?? Math.round((item.score / 10) * item.totalQuestions);
                  const incorrect = item.incorrectCount ?? (item.totalQuestions - correct);
                  const rankInfo = getRankInfo(item.score);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Student Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {item.studentName.charAt(0).toUpperCase() || 'H'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {item.studentName}
                            </div>
                            <span
                              className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${rankInfo.color}`}
                            >
                              {rankInfo.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Lesson title */}
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                        <div className="font-medium truncate" title={item.lessonTitle}>
                          {item.lessonTitle}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Bộ sách Kết nối tri thức
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-block px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                          <span className="text-base sm:text-lg font-black text-emerald-800">
                            {item.score}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal"> /10</span>
                        </div>
                      </td>

                      {/* Correct / Incorrect */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md" title="Số câu trả lời đúng">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {correct}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md" title="Số câu trả lời chưa đúng">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            {incorrect}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tổng: {item.totalQuestions} câu
                        </div>
                      </td>

                      {/* Time taken */}
                      <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                        <div className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTime(item.timeTakenSeconds)}</span>
                        </div>
                      </td>

                      {/* Date timestamp */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(item.timestamp)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onReviewPastTest(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-colors shadow-xs cursor-pointer"
                            title="Xem lại bài thi & Giấy chứng nhận Cô Ra AI"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Xem bằng</span>
                          </button>

                          {onDeleteSingleHistory && (
                            <button
                              onClick={() => onDeleteSingleHistory(item.id)}
                              className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Xóa lượt thi này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
