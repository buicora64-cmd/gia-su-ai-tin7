import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Gia Sư Tin Học Lớp 7 - Cô Ra AI" });
});

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Server-side AI endpoint for Cô Ra AI tutor
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context, lessonTitle } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Nội dung câu hỏi không được để trống." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Intelligent fallback answer if GEMINI_API_KEY is not configured
      const fallbackResponse = generateLocalTutorResponse(message, lessonTitle);
      return res.json({ reply: fallbackResponse, source: "local" });
    }

    const systemPrompt = `Bạn là "Cô Ra AI" - Gia sư thông minh, tận tâm và ân cần của môn Tin học lớp 7, theo bộ sách giáo khoa "Kết nối tri thức với cuộc sống" (Nhà xuất bản Giáo dục Việt Nam).
Nhiệm vụ của bạn là:
1. Giải đáp thắc mắc của học sinh lớp 7 về các bài học trong SGK Tin học 7 một cách dễ hiểu, chính xác, kèm ví dụ thực tế trực quan.
2. Khuyến khích, động viên học sinh học tốt, tự tin đạt điểm 10.
3. Ngôn từ thân thiện, xưng "Cô Ra" hoặc "Cô", gọi học sinh là "em" hoặc tên của em nếu có.
4. Bám sát nội dung SGK Tin học 7 gồm 5 chủ đề:
- Chủ đề 1: Máy tính và cộng đồng (Bài 1: Thiết bị vào - ra; Bài 2: Phần mềm máy tính; Bài 3: Quản lí dữ liệu trong máy tính)
- Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin (Bài 4: Mạng xã hội và một số kênh trao đổi thông tin trên Internet)
- Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số (Bài 5: Ứng xử trên mạng)
- Chủ đề 4: Ứng dụng tin học (Bài 6: Làm quen với phần mềm bảng tính; Bài 7: Tính toán tự động; Bài 8: Công cụ hỗ trợ tính toán SUM, AVERAGE, MIN, MAX, COUNT; Bài 9: Trình bày bảng tính; Bài 10: Hoàn thiện bảng tính; Bài 11: Tạo bài trình chiếu PowerPoint; Bài 12: Định dạng đối tượng trên trang chiếu; Bài 13: Hoàn thiện bài trình chiếu)
- Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính (Bài 14: Thuật toán tìm kiếm tuần tự; Bài 15: Thuật toán tìm kiếm nhị phân; Bài 16: Thuật toán sắp xếp nổi bọt và sắp xếp chọn).

${lessonTitle ? `Bài học hiện tại học sinh đang học/ôn tập: "${lessonTitle}".` : ""}
${context ? `Ngữ cảnh bổ sung: ${context}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Cô Ra AI rất vui được hỗ trợ em. Em có câu hỏi nào nữa về bài học không?";
    return res.json({ reply, source: "gemini" });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    // Fallback gracefully on API errors
    const fallbackResponse = generateLocalTutorResponse(req.body?.message || "", req.body?.lessonTitle);
    return res.json({ reply: fallbackResponse, source: "fallback", error: err.message });
  }
});

// Helper for local responses if key is missing or offline
function generateLocalTutorResponse(msg: string, lessonTitle?: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("thiết bị vào") || lower.includes("thiết bị ra") || lower.includes("bài 1")) {
    return `Chào em! Cô Ra AI giải thích nhé:\n\n• **Thiết bị vào** (Input devices): Dùng để đưa thông tin/dữ liệu vào máy tính như bàn phím, chuột, micro, máy quét (scanner), webcam.\n• **Thiết bị ra** (Output devices): Dùng để xuất dữ liệu từ máy tính ra ngoài cho con người nhận biết như màn hình, máy in, loa, máy chiếu.\n• Có một số thiết bị vừa là thiết bị vào vừa là thiết bị ra như màn hình cảm ứng, tai nghe có gắn micro!`;
  }
  if (lower.includes("hệ điều hành") || lower.includes("phần mềm") || lower.includes("bài 2")) {
    return `Chào em! Trong Tin học 7 Bài 2, em cần phân biệt:\n\n• **Hệ điều hành** (như Windows, Linux, macOS, Android, iOS): Phần mềm hệ thống quản lý, điều khiển mọi phần cứng và tạo môi trường cho các phần mềm khác chạy.\n• **Phần mềm ứng dụng** (như Word, Excel, PowerPoint, Google Chrome, Paint, Unikey): Công cụ giúp người dùng giải quyết công việc cụ thể (soạn thảo, tính toán, vẽ tranh, lướt web).`;
  }
  if (lower.includes("bảng tính") || lower.includes("excel") || lower.includes("hàm") || lower.includes("sum") || lower.includes("average")) {
    return `Chào em! Các hàm cơ bản trong phần mềm bảng tính lớp 7 rất quan trọng:\n\n1. \`=SUM(khối ô)\`: Tính tổng các ô số.\n2. \`=AVERAGE(khối ô)\`: Tính trung bình cộng.\n3. \`=MAX(khối ô)\`: Tìm giá trị lớn nhất.\n4. \`=MIN(khối ô)\`: Tìm giá trị nhỏ nhất.\n5. \`=COUNT(khối ô)\`: Đếm số lượng ô chứa dữ liệu số.\n*Lưu ý: Luôn bắt đầu công thức bằng dấu \`=\` nhé!*`;
  }
  if (lower.includes("nhị phân") || lower.includes("tìm kiếm") || lower.includes("tuần tự") || lower.includes("bài 14") || lower.includes("bài 15")) {
    return `Chào em! Hai thuật toán tìm kiếm lớp 7:\n\n• **Tìm kiếm tuần tự (Sequential Search)**: Xét lần lượt từng phần tử từ đầu đến cuối danh sách cho đến khi tìm thấy hoặc hết danh sách. Áp dụng cho danh sách bất kỳ (chưa sắp xếp).\n• **Tìm kiếm nhị phân (Binary Search)**: BẮT BUỘC danh sách phải ĐÃ ĐƯỢC SẮP XẾP. Mỗi bước xét phần tử ở giữa, thu hẹp phạm vi tìm kiếm đi một nửa. Nhanh hơn nhiều so với tìm kiếm tuần tự!`;
  }
  if (lower.includes("sắp xếp") || lower.includes("nổi bọt") || lower.includes("bài 16")) {
    return `Chào em! Bài 16 giới thiệu hai thuật toán sắp xếp:\n\n• **Sắp xếp nổi bọt (Bubble Sort)**: So sánh hai phần tử liền kề, nếu sai thứ tự thì hoán đổi. Qua mỗi lượt, phần tử lớn nhất (hoặc nhỏ nhất) sẽ nổi dần về đúng vị trí cuối dãy.\n• **Sắp xếp chọn (Selection Sort)**: Tìm phần tử nhỏ nhất trong dãy chưa sắp xếp rồi đổi chỗ về vị trí đầu tiên của đoạn đó!`;
  }
  return `Chào em! Cô Ra AI - Gia sư Tin học lớp 7 luôn sẵn sàng hỗ trợ em.\n\nVề câu hỏi của em: Trong môn Tin học 7 (bộ sách Kết nối tri thức với cuộc sống), các kiến thức trọng tâm gồm Thiết bị phần cứng, Phần mềm, Quản lý tệp & thư mục, An toàn trên mạng xã hội, Kỹ năng thực hành Bảng tính Excel & Trình chiếu PowerPoint, cùng các Thuật toán tìm kiếm và sắp xếp.\n\nEm hãy ôn kỹ lý thuyết và làm bài tập trắc nghiệm để đạt điểm 10 tuyệt đối nhé! Cố lên em!`;
}

// Vite middleware for development & static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
