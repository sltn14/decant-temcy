import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "./ChatbotWidget.css";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

<<<<<<< HEAD
interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const CHAT_HISTORY_KEY = "decant_chat_history";

=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
const INITIAL_MESSAGE: Message = {
  id: 0,
  text: "Halo! Saya asisten Decant Temcy. Ketik \"rekomendasi\" untuk mendapat saran parfum.",
  sender: "bot",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();

  if (lower.includes("rekomendasi") || lower.includes("rekomendasi:") || lower.includes("rekomend")) {
    return "Berdasarkan preferensi, kami merekomendasikan: Above The Cloud (HMNS) atau Turathi Electric (Afnan).";
  }
  if (lower.includes("harga") || lower.includes("berapa")) {
    return "Harga decant kami mulai dari Rp 9.400 untuk ukuran 1ml. Tersedia dalam ukuran 1ml, 2ml, 3ml, dan 5ml.";
  }
  if (lower.includes("pengiriman") || lower.includes("ongkir") || lower.includes("kirim")) {
    return "Ongkos kirim flat Rp 10.000 ke seluruh Indonesia. Estimasi pengiriman 2-5 hari kerja.";
  }
  if (lower.includes("halo") || lower.includes("hai") || lower.includes("hi")) {
    return "Halo! Ada yang bisa saya bantu? Coba tanyakan tentang rekomendasi parfum, harga, atau pengiriman.";
  }
  if (lower.includes("terima kasih") || lower.includes("makasih")) {
    return "Sama-sama! Senang bisa membantu. Selamat berbelanja di Decant Temcy!";
  }
  return "Maaf, saya belum bisa memahami pertanyaan itu. Coba tanyakan tentang rekomendasi parfum, harga, atau pengiriman.";
}

<<<<<<< HEAD
function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatSession[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    return parsed.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
}

=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
<<<<<<< HEAD
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load latest session from shared storage on mount
  useEffect(() => {
    const sessions = loadSessions();
    if (sessions.length > 0) {
      const latest = sessions[0];
      setActiveSessionId(latest.id);
      setMessages(latest.messages);
    }
  }, []);

  // Listen for storage changes from ChatbotPage
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== CHAT_HISTORY_KEY) return;
      const sessions = loadSessions();
      if (sessions.length === 0) return;
      const current = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
      setActiveSessionId(current.id);
      setMessages(current.messages);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [activeSessionId]);

=======
  const messagesEndRef = useRef<HTMLDivElement>(null);

>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), text, sender: "user" };
<<<<<<< HEAD
    const sessionTitle = text.length > 28 ? `${text.slice(0, 28)}...` : text;

=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

<<<<<<< HEAD
    // Update shared localStorage
    const sessions = loadSessions();
    let updatedSessions: ChatSession[];

    if (activeSessionId) {
      updatedSessions = sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.title === "Chat Baru" ? sessionTitle : s.title,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, userMsg],
            }
          : s
      );
    } else {
      const newSession: ChatSession = {
        id: Date.now(),
        title: sessionTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [INITIAL_MESSAGE, userMsg],
      };
      setActiveSessionId(newSession.id);
      updatedSessions = [newSession, ...sessions];
    }

    saveSessions(updatedSessions);

=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: Message = { id: Date.now() + 1, text: reply, sender: "bot" };
      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
<<<<<<< HEAD

      // Save bot reply to shared storage
      const currentSessions = loadSessions();
      const sessionId = activeSessionId ?? Date.now();
      const finalSessions = currentSessions
        .map((s) =>
          s.id === sessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, botMsg],
              }
            : s
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      saveSessions(finalSessions);
=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">DT</div>
              <div className="chatbot-header-text">
                <h3>Decant Temcy</h3>
                <span>Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="chatbot-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chatbot-send" onClick={sendMessage} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button className={`chatbot-toggle ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
