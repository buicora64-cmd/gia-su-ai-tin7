import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonTitle?: string;
  initialQuestion?: string;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  currentLessonTitle,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'cora',
      text: 'Chào em! Cô là **Cô Ra AI** - Gia sư đồng hành cùng em trong môn Tin học 7 (bộ sách Kết nối tri thức với cuộc sống). Em có thắc mắc gì về bài học, công thức bảng tính hay các thuật toán không? Hãy nhắn cho cô nhé!',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If initialQuestion is passed, trigger it
  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Phân biệt thiết bị vào và thiết bị ra?',
    'Cách dùng hàm SUM và AVERAGE trong Excel?',
    'Khi nào dùng thuật toán tìm kiếm nhị phân?',
    'Giải thích thuật toán sắp xếp nổi bọt?',
    'Làm thế nào để phòng tránh nghiện Internet?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          lessonTitle: currentLessonTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi kết nối máy chủ.');
      }

      const data = await response.json();
      const coraMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'cora',
        text: data.reply || 'Cô Ra AI đã ghi nhận câu hỏi của em. Em kiểm tra lại nội dung nhé!',
        timestamp: Date.now(),
        source: data.source,
      };

      setMessages((prev) => [...prev, coraMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'cora',
        text: 'Cô Ra AI xin lỗi, vừa có sự cố kết nối nhẹ. Em có thể thử hỏi lại hoặc bấm vào các câu hỏi gợi ý bên dưới nhé!',
        timestamp: Date.now(),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                Gia Sư Cô Ra AI
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/70 border border-emerald-400/40 text-emerald-200">
                  Tin học 7
                </span>
              </h3>
              <p className="text-xs text-emerald-100 opacity-90">
                Sẵn sàng giải đáp & hướng dẫn giải bài tập SGK 24/7
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

        {/* Current Lesson Badge */}
        {currentLessonTitle && (
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Đang hỗ trợ bài: {currentLessonTitle}</span>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-xs flex items-center gap-2 text-xs text-slate-500 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Cô Ra AI đang suy nghĩ câu trả lời...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-medium shrink-0 pl-1">Gợi ý:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi về Tin học 7 gửi Cô Ra AI..."
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-xs sm:text-sm text-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
