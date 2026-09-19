import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  RotateCcw,
  ArrowRight,
  Calendar,
  Info,
} from 'lucide-react';
import { Lead } from '../types';
import { getViciConsultation, extractLeadFromText } from '../data/viciAdvisor';
import { syncLeadToGoogleSheet } from '../services/googleSheetsService';
import { saveLeadToFirestore } from '../services/firebase';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'local_expert' | 'error';
  model?: string;
  notice?: string;
  isStreaming?: boolean;
}

// Helper to render inline formatting like **bold**
function renderInlineStyles(str: string) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#8A6437]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Helper to render markdown-like structured text with typing cursor support
function renderMessageContent(text: string, isAI: boolean, isStreaming?: boolean) {
  if (!isAI) {
    return <span className="whitespace-pre-wrap leading-relaxed">{text}</span>;
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const isLastLine = idx === lines.length - 1;

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Heading 3 or 2
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4
              key={idx}
              className="font-bold text-[#8A6437] text-xs sm:text-sm pt-2 pb-0.5 border-b border-[#F0E6D2] font-serif-display"
            >
              {renderInlineStyles(headingText)}
              {isLastLine && isStreaming && (
                <span className="inline-block w-1.5 h-3.5 bg-[#D69A2D] animate-pulse ml-1 align-middle" />
              )}
            </h4>
          );
        }

        // Bullet points
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const bulletText = trimmed.replace(/^[\*\-•]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-[#2E332A]">
              <span className="text-[#D69A2D] font-bold text-xs mt-0.5 shrink-0">•</span>
              <div className="flex-1">
                {renderInlineStyles(bulletText)}
                {isLastLine && isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 bg-[#D69A2D] animate-pulse ml-1 align-middle" />
                )}
              </div>
            </div>
          );
        }

        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-[#2E332A]">
              <span className="text-[#8A6437] font-semibold text-xs mt-0.5 shrink-0 min-w-[16px]">
                {numMatch[1]}.
              </span>
              <div className="flex-1">
                {renderInlineStyles(numMatch[2])}
                {isLastLine && isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 bg-[#D69A2D] animate-pulse ml-1 align-middle" />
                )}
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-[#252822]">
            {renderInlineStyles(trimmed)}
            {isLastLine && isStreaming && (
              <span className="inline-block w-1.5 h-3.5 bg-[#D69A2D] animate-pulse ml-1 align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}

// Detect recommended course for 1-click CTA button
function detectCourseRecommendation(text: string): { label: string; courseName: string } | null {
  const lower = text.toLowerCase();
  if (lower.includes('rom test') || lower.includes('tầm vận động') || lower.includes('tập thử') || lower.includes('trải nghiệm')) {
    return {
      label: 'Đặt lịch Kiểm tra Tầm Vận Động (ROM Test)',
      courseName: 'Kiểm Tra Tầm Vận Động (ROM Test) & Trải Nghiệm Buổi Tập Thử',
    };
  }
  if (lower.includes('1:1') || lower.includes('pt') || lower.includes('cá nhân hóa')) {
    return {
      label: 'Đăng ký Lớp Kèm 1:1 Cá Nhân Hóa (PT)',
      courseName: 'Lớp Huấn Luyện Cá Nhân 1:1 (PT Trị Liệu)',
    };
  }
  if (lower.includes('scan trị liệu')) {
    return {
      label: 'Đặt lịch Scan Trị Liệu Cơ Vai Cổ Gáy (650k)',
      courseName: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy (45-60 phút)',
    };
  }
  if (lower.includes('ashtanga') || lower.includes('10 chuyên đề')) {
    return {
      label: 'Đăng ký Khóa Yoga Nâng Cao Ashtanga',
      courseName: 'Khóa Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 chuyên đề)',
    };
  }
  if (lower.includes('huấn luyện viên') || lower.includes('hlv')) {
    return {
      label: 'Nhận hồ sơ Khóa Đào Tạo HLV Quốc Tế',
      courseName: 'Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)',
    };
  }
  if (lower.includes('gói 3 tháng') || lower.includes('gói 6 tháng') || lower.includes('gói tập')) {
    return {
      label: 'Đăng ký Gói Yoga Trị Liệu Cá Nhân Hóa',
      courseName: 'Gói Yoga Cá Nhân Hóa 3 Tháng / 6 Tháng',
    };
  }
  if (lower.includes('chuông xoay')) {
    return {
      label: 'Đăng ký Workshop Chuông Xoay Trị Liệu',
      courseName: 'Workshop Chuông Xoay Trị Liệu & Mindfulness',
    };
  }
  return null;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onLeadCaptured?: (lead: Lead) => void;
  onOpenRegisterForm?: (courseName: string) => void;
}

export default function AIChatModal({
  isOpen,
  onClose,
  initialTopic,
  onLeadCaptured,
  onOpenRegisterForm,
}: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadFormInline, setShowLeadFormInline] = useState(false);

  // Quick form fields when AI asks for lead info
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadConsent, setLeadConsent] = useState(true);
  const [leadSaved, setLeadSaved] = useState(false);

  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [vercelNotice, setVercelNotice] = useState<string | null>(null);
  const [showVercelGuide, setShowVercelGuide] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamTimerRef = useRef<any>(null);

  // Check backend health & Gemini status on mount/open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => {
          if (data?.geminiAvailable) {
            setAiStatus('connected');
            setVercelNotice(null);
          } else {
            setAiStatus('offline');
            setVercelNotice(data?.notice || 'Chưa phát hiện GEMINI_API_KEY. Trợ lý đang dùng dữ liệu tri thức tĩnh.');
          }
        })
        .catch(() => {
          setAiStatus('offline');
          setVercelNotice('Đang chạy ở chế độ độc lập (Client Offline). Dữ liệu phản hồi từ bộ quy chuẩn VICI.');
        });
    }

    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, [isOpen]);

  const quickButtons = [
    { label: '🩺 Thoát vị đĩa đệm L4-L5 có tập được không?', prompt: 'Mình bị thoát vị đĩa đệm L4-L5 có tập yoga bên bạn được không? Có sợ đau thêm không?' },
    { label: '💻 Đau mỏi cổ vai gáy, tê cánh tay văn phòng', prompt: 'Ngồi máy tính nhiều bị nhức mỏi hai bên bả vai và tê tê cánh tay, bên mình có bài tập nào hỗ trợ không?' },
    { label: '💰 Học phí & ưu đãi buổi trải nghiệm', prompt: 'Học phí tại Vici Yoga bao nhiêu một tháng vậy?' },
    { label: '📋 Đặt lịch kiểm tra tầm vận động (ROM test)', prompt: 'Tôi muốn đăng ký kiểm tra tầm vận động ROM test và trải nghiệm buổi tập thử' },
    { label: '🧘 Lớp trị liệu nhóm nhỏ hay kèm PT 1:1?', prompt: 'Tôi nên chọn lớp trị liệu nhóm nhỏ hay lớp kèm PT 1:1 cá nhân hóa?' },
    { label: '⏰ Lớp cho người làm văn phòng 8h - 18h', prompt: 'Tôi là nhân viên văn phòng, làm từ 8h sáng đến 6h tối, có lớp nào phù hợp cho tôi không?' },
    { label: '🌿 Người mới bắt đầu, cơ thể cứng', prompt: 'Tôi chưa từng tập Yoga, cơ thể cứng thì có lớp nào phù hợp cho người mới?' },
    { label: '🔔 Chuông xoay & Trị liệu mất ngủ, lo âu', prompt: 'Tôi bị mất ngủ và căng thẳng kéo dài, liệu pháp Chuông xoay và Yoga phục hồi tác dụng ra sao?' },
    { label: '🔥 Ashtanga 10 chuyên đề Master Henry Phan', prompt: 'Cho tôi thông tin 10 chuyên đề Ashtanga nâng cao của Master Henry Phan' },
    { label: '🎓 Đào tạo HLV Quốc Tế E-RYT 500', prompt: 'Tôi quan tâm đến khóa Đào tạo Huấn Luyện Viên Yoga Quốc Tế E-RYT 500 cấp bằng Yoga Alliance' },
    { label: '📍 Địa chỉ Studio & Thời khóa biểu', prompt: 'Cho tôi xem địa chỉ Studio VICI và lịch các lớp học trong tuần' },
  ];

  // Initialize or reset chat on open
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        const welcomeMsg: Message = {
          id: 'welcome-msg',
          sender: 'ai',
          text: `Namaste! 🙏 Mình là **Vici Care** – Chuyên viên tư vấn phục hồi và trị liệu của Vici Yoga Therapy Center.

Mình luôn ở đây để lắng nghe, đồng hành và hỗ trợ bạn cải thiện các vấn đề về cơ xương khớp, đĩa đệm, giải tỏa căng thẳng và phục hồi cột sống theo phương châm:
* **"Tập đúng để chữa lành – Không ép dẻo quá đà – Tôn trọng giới hạn tự nhiên của cơ thể."**

Bạn đang gặp phải tình trạng đau mỏi ở vị trí nào (cổ vai gáy, thắt lưng, gối...) hay đang quan tâm đến lớp học nào? Hãy chia sẻ cùng Vici Care nhé!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([welcomeMsg]);

        if (initialTopic) {
          handleSendMessage(initialTopic, [welcomeMsg]);
        }
      } else if (initialTopic) {
        handleSendMessage(initialTopic, messages);
      }
    }
  }, [isOpen, initialTopic]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showLeadFormInline]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = async (textToSend?: string, currentHistory = messages) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...currentHistory, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for API (prior messages only)
      const apiHistory = currentHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      let aiReply = '';
      let replySource: 'gemini' | 'local_expert' = 'local_expert';
      let replyModel: string | undefined = undefined;
      let replyNotice: string | undefined = undefined;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            conversationHistory: apiHistory.slice(-8), // Keep recent turns
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiReply = (data.reply || '').trim();
          replySource = data.source === 'gemini' ? 'gemini' : 'local_expert';
          replyModel = data.model;
          replyNotice = data.notice;
          if (data.source === 'gemini') {
            setAiStatus('connected');
          }

          // Handle lead captured from function call or extraction
          const captured = data?.capturedLead || extractLeadFromText(query);
          if (captured && captured.phone && !leadSaved) {
            const leadObj: Lead = {
              id: `VICI-LEAD-${Date.now().toString().slice(-4)}`,
              createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              name: captured.fullName || 'Học viên tư vấn Vici Care',
              phone: captured.phone,
              source: 'Vici Care AI Advisor',
              interest: captured.serviceInterest || 'Kiểm tra tầm vận động (ROM test)',
              category: 'RECOVERY_THERAPY',
              experience: 'Khảo sát qua Vici Care AI',
              goals: [captured.healthCondition || 'Trị liệu phục hồi cột sống'],
              preferredTime: captured.preferredTime || 'Linh hoạt',
              preferredFormat: 'Trực tiếp tại Studio (Opal Boulevard)',
              recommendedCourse: 'Kiểm Tra Tầm Vận Động (ROM Test) & Tập Thử',
              leadScore: 'HOT',
              status: 'New',
              assignedTo: 'Master Mỹ Kiều',
              conversationSummary: `Vici Care trích xuất: ${captured.healthCondition || 'Tư vấn trị liệu'}. Đăng ký: ${captured.serviceInterest || 'ROM test'}.`,
              staffNotes: `Lead từ Vici Care AI. Số điện thoại: ${captured.phone}. Khung giờ mong muốn: ${captured.preferredTime || 'Linh hoạt'}.`,
              nextAction: 'Liên hệ trong 5-10 phút để xác nhận lịch kiểm tra ROM test',
              isSampleData: false,
            };

            if (onLeadCaptured) onLeadCaptured(leadObj);
            saveLeadToFirestore(leadObj).catch((e) => console.warn('Firestore sync notice:', e));
            syncLeadToGoogleSheet(leadObj).catch((err) => console.warn('Sheet sync notice:', err));
            setLeadSaved(true);
          }
        } else if (response.status === 404) {
          replyNotice = 'Hệ thống /api/chat chưa sẵn sàng trên Vercel. Trợ lý đang phản hồi từ phác đồ tri thức VICI.';
        }
      } catch (networkErr) {
        console.warn('Backend fetch notice, using local knowledge base:', networkErr);
        replyNotice = 'Mất kết nối máy chủ AI. Đang hiển thị giải pháp từ CSDL tri thức offline của VICI.';
      }

      // If reply is empty, use our comprehensive consultation engine
      if (!aiReply) {
        aiReply = getViciConsultation(query);
      }

      // Check offline lead extraction if not already saved
      if (!leadSaved) {
        const localCaptured = extractLeadFromText(query);
        if (localCaptured && localCaptured.phone) {
          const leadObj: Lead = {
            id: `VICI-LEAD-${Date.now().toString().slice(-4)}`,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            name: localCaptured.fullName || 'Học viên tư vấn Vici Care',
            phone: localCaptured.phone,
            source: 'Vici Care AI Advisor',
            interest: localCaptured.serviceInterest || 'Kiểm tra tầm vận động (ROM test)',
            category: 'RECOVERY_THERAPY',
            experience: 'Khảo sát qua Vici Care AI',
            goals: [localCaptured.healthCondition || 'Trị liệu phục hồi cột sống'],
            preferredTime: localCaptured.preferredTime || 'Linh hoạt',
            preferredFormat: 'Trực tiếp tại Studio (Opal Boulevard)',
            recommendedCourse: 'Kiểm Tra Tầm Vận Động (ROM Test) & Tập Thử',
            leadScore: 'HOT',
            status: 'New',
            assignedTo: 'Master Mỹ Kiều',
            conversationSummary: `Vici Care trích xuất: ${localCaptured.healthCondition || 'Tư vấn trị liệu'}. Đăng ký: ${localCaptured.serviceInterest || 'ROM test'}.`,
            staffNotes: `Lead từ Vici Care AI. Số điện thoại: ${localCaptured.phone}. Khung giờ mong muốn: ${localCaptured.preferredTime || 'Linh hoạt'}.`,
            nextAction: 'Liên hệ trong 5-10 phút để xác nhận lịch kiểm tra ROM test',
            isSampleData: false,
          };
          if (onLeadCaptured) onLeadCaptured(leadObj);
          saveLeadToFirestore(leadObj).catch((e) => console.warn('Firestore sync notice:', e));
          syncLeadToGoogleSheet(leadObj).catch((err) => console.warn('Sheet sync notice:', err));
          setLeadSaved(true);
        }
      }

      // Start realistic progressive typing reveal
      const aiMsgId = `ai-${Date.now()}`;
      const targetText = aiReply;
      const finalSource = replySource;
      const finalModel = replyModel;
      const finalNotice = replyNotice;

      setIsLoading(false);

      // Add placeholder message with cursor
      const initialAiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: finalSource,
        model: finalModel,
        notice: finalNotice,
        isStreaming: true,
      };

      setMessages([...newHistory, initialAiMsg]);

      // Stream text chunks for realistic AI consulting feel
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }

      let charIndex = 0;
      const chunkSize = Math.max(12, Math.floor(targetText.length / 32));

      streamTimerRef.current = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= targetText.length) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, text: targetText, isStreaming: false }
                : m
            )
          );
        } else {
          const currentChunk = targetText.slice(0, charIndex);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, text: currentChunk, isStreaming: true }
                : m
            )
          );
        }
      }, 22);

      // Only show inline lead form if the user explicitly asks to be contacted or called back
      const lowerQuery = query.toLowerCase();
      const explicitlyRequestsCallback =
        lowerQuery.includes('gọi lại cho tôi') ||
        lowerQuery.includes('gọi cho tôi') ||
        lowerQuery.includes('gọi điện thoại cho tôi') ||
        lowerQuery.includes('liên hệ tôi') ||
        lowerQuery.includes('số của tôi') ||
        lowerQuery.includes('gọi cho mình') ||
        lowerQuery.includes('để lại số điện thoại');

      if (explicitlyRequestsCallback && !leadSaved) {
        setShowLeadFormInline(true);
      }
    } catch (err) {
      const fallbackReply = getViciConsultation(query);
      const fallbackAiMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local_expert',
        notice: 'Đã chuyển sang CSDL tri thức nội bộ VICI.'
      };
      setMessages([...newHistory, fallbackAiMsg]);
      setIsLoading(false);
    }
  };

  const handleSaveInlineLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;

    setIsLoading(true);
    const leadPayload = {
      name: leadName.trim() || 'Học viên tư vấn qua VICI AI',
      phone: leadPhone.trim(),
      source: 'VICI AI Chatbot' as const,
      interest: 'Tư vấn lộ trình qua AI Chat',
      category: 'THERAPY_INTEREST' as const,
      experience: 'Đã trao đổi qua AI Chatbot',
      preferredTime: 'Linh hoạt',
      leadScore: 'HOT' as const,
      chatSummary: messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n'),
      staffNotes: `Thu thập tự động từ cuộc hội thoại AI. Khách quan tâm: ${messages[messages.length - 2]?.text || 'Tư vấn chung'}`,
      nextAction: 'Chuyên viên gọi điện xác nhận trong 24h',
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        if (onLeadCaptured) onLeadCaptured(data.lead);
        saveLeadToFirestore(data.lead).catch((e) => console.warn('Firebase sync notice:', e));
        syncLeadToGoogleSheet(data.lead).catch((err) => console.warn('Chat lead sheet sync notice:', err));
      }
    } catch (e) {
      // Ignored for UI flow
    } finally {
      setLeadSaved(true);
      setShowLeadFormInline(false);
      setIsLoading(false);

      const confirmMsg: Message = {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `Tuyệt vời! VICI đã ghi nhận số điện thoại **${leadPhone}** của bạn. Đội ngũ tư vấn sẽ liên hệ để xác nhận lịch học và phác đồ tập luyện tốt nhất cho bạn trong 24 giờ. Cảm ơn bạn! 🙏`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }
  };

  const handleResetChat = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setMessages([]);
    setLeadSaved(false);
    setShowLeadFormInline(false);
    const welcomeMsg: Message = {
      id: 'welcome-reset',
      sender: 'ai',
      text: `Namaste! 🙏 Mình là **Vici Care**. Bạn đang gặp tình trạng đau mỏi ở vị trí nào hay cần tư vấn lộ trình phục hồi, lớp nhóm nhỏ hay kèm PT 1:1?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: aiStatus === 'connected' ? 'gemini' : 'local_expert',
      model: aiStatus === 'connected' ? 'gemini-2.5-flash' : undefined,
    };
    setMessages([welcomeMsg]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden h-[92vh] sm:h-[85vh] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#8A6437] to-[#6A4B27] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-200 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-serif-display">
                  Vici Care
                </h3>
                {aiStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/25 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gemini AI Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVercelGuide(!showVercelGuide)}
                    className="inline-flex items-center gap-1 text-[10px] bg-amber-500/25 text-amber-100 px-2 py-0.5 rounded-full border border-amber-300/40 hover:bg-amber-500/35 transition-colors cursor-pointer"
                    title="Bấm xem hướng dẫn cấu hình AI trên Vercel"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    Vici Care Trị Liệu
                    <Info className="w-3 h-3 ml-0.5 opacity-80" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-amber-100/80">
                Chuyên viên tư vấn phục hồi & trị liệu VICI Yoga • Định tuyến an toàn & ROM test
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="Bắt đầu lại cuộc trò chuyện"
              className="p-2 rounded-full hover:bg-white/10 text-amber-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline-block text-[10px] bg-white/15 text-amber-100 px-1.5 py-0.5 rounded border border-white/20 font-mono select-none" title="Nhấn phím Esc để đóng">
                Esc
              </span>
              <button
                id="ai-chat-close-btn"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-amber-200 transition-colors cursor-pointer"
                aria-label="Đóng (Phím Esc)"
                title="Đóng (Phím Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Vercel Guidance Banner */}
        {showVercelGuide && (
          <div className="bg-[#FFF8EB] border-b border-amber-200 p-3 sm:p-4 text-xs text-[#5C451F] space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-[#8A6437]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D69A2D]" />
                <span>Kích hoạt Gemini AI khi deploy lên Vercel</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVercelGuide(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] leading-relaxed">
              Dự án đã tích hợp sẵn <strong>Vercel Serverless Functions</strong> tại <code className="bg-amber-200/50 px-1 py-0.5 rounded text-[10px] font-mono">/api/chat</code>. Để trợ lý kết nối trực tiếp với mô hình Gemini mới nhất:
            </p>
            <ol className="list-decimal list-inside text-[11px] space-y-1 pl-1">
              <li>Mở <strong>Vercel Dashboard</strong> &rarr; Chọn Project của bạn.</li>
              <li>Vào tab <strong>Settings</strong> &rarr; chọn mục <strong>Environment Variables</strong>.</li>
              <li>Thêm biến Key: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-emerald-800 font-bold">GEMINI_API_KEY</code> với giá trị API Key của bạn.</li>
              <li>Bấm <strong>Save</strong> rồi nhấn <strong>Redeploy</strong> bản mới nhất.</li>
            </ol>
            <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 font-medium">
              ✓ Sau khi thêm biến, huy hiệu trên header sẽ sáng xanh <strong>Gemini AI Active</strong> và câu trả lời sẽ được tạo động theo thời gian thực!
            </div>
          </div>
        )}

        {/* Medical disclaimer note bar */}
        <div className="bg-amber-50 px-4 py-1.5 border-b border-amber-200/60 flex items-center gap-2 text-[11px] text-[#6E5928]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#D69A2D] shrink-0" />
          <span className="truncate">
            Tư vấn mang tính giáo dục thể chất & định tuyến. Không thay thế phác đồ điều trị y khoa.
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#8A6437]/10 text-[#8A6437] flex items-center justify-center shrink-0 mt-0.5 border border-[#8A6437]/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    isAI
                      ? 'bg-white border border-[#E8DFC8] text-[#252822] shadow-2xs'
                      : 'bg-[#8A6437] text-white shadow-xs'
                  }`}
                >
                  {renderMessageContent(msg.text, isAI, msg.isStreaming)}

                  {/* Course recommendation 1-click CTA button */}
                  {isAI && msg.id !== 'welcome-msg' && msg.id !== 'welcome-reset' && !msg.isStreaming && (() => {
                    const recommendation = detectCourseRecommendation(msg.text);
                    if (!recommendation) return null;
                    return (
                      <div className="mt-3 pt-2.5 border-t border-[#F0E6D2]">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenRegisterForm) {
                              onOpenRegisterForm(recommendation.courseName);
                              onClose();
                            } else {
                              setShowLeadFormInline(true);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D69A2D] to-[#B87A14] text-white font-medium text-xs hover:shadow-md transition-all cursor-pointer shadow-2xs"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{recommendation.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })()}

                  {/* AI Source attribution tag */}
                  {isAI && msg.id !== 'welcome-msg' && msg.id !== 'welcome-reset' && (
                    <div className="mt-2.5 pt-2 border-t border-[#F0E6D2] flex flex-wrap items-center justify-between gap-1.5">
                      {msg.source === 'gemini' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Tư vấn trực tiếp bởi Google Gemini ({msg.model ? msg.model.replace('models/', '') : 'gemini-2.5-flash'})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8A6437] bg-[#FAF5EB] px-2 py-0.5 rounded-full border border-[#E2D4BD]">
                          📚 Phác đồ chuyên gia VICI E-RYT 500 (Offline Engine)
                        </span>
                      )}

                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Operational Notice if any */}
                  {isAI && msg.notice && !msg.isStreaming && (
                    <div className="mt-2 text-[10px] text-amber-900 bg-amber-50/90 p-2 rounded-xl border border-amber-200/70 leading-normal flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Lưu ý Vercel: </span>
                        <span>{msg.notice}</span>
                      </div>
                    </div>
                  )}

                  {!isAI && (
                    <div className="text-[10px] mt-2 text-right text-amber-200/70">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#8A6437] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-full bg-[#8A6437]/10 text-[#8A6437] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#E8DFC8] rounded-2xl px-4 py-3 text-xs text-[#717769] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D69A2D] animate-spin" />
                <span>VICI AI đang phân tích dữ liệu chuyên môn...</span>
              </div>
            </div>
          )}

          {/* Inline Lead Capture Form */}
          {showLeadFormInline && !leadSaved && (
            <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#D69A2D]/50 shadow-sm space-y-3 animate-in fade-in relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8A6437]">
                  <Sparkles className="w-4 h-4 text-[#D69A2D]" />
                  <span>Để lại thông tin để Master tư vấn trực tiếp (tùy chọn)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLeadFormInline(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors cursor-pointer"
                  title="Đóng form"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[#555A4E]">
                Nếu bạn muốn Master Henry Phan hoặc Master Mỹ Kiều gọi điện tư vấn phác đồ 1-1:
              </p>

              <form onSubmit={handleSaveInlineLead} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Họ và tên bạn"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại / Zalo *"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 text-[11px] text-[#555A4E] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={leadConsent}
                      onChange={(e) => setLeadConsent(e.target.checked)}
                      className="rounded text-[#D69A2D] accent-[#D69A2D]"
                    />
                    <span>Đồng ý nhận cuộc gọi tư vấn từ VICI</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#D69A2D] text-white font-bold text-xs hover:bg-[#B87A14] transition-all cursor-pointer shadow-2xs shrink-0"
                  >
                    Gửi ngay
                  </button>
                </div>
              </form>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#FAF7F0] border-t border-[#E8DFC8] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(btn.prompt)}
              className="px-3 py-1.5 rounded-full bg-white border border-[#DFCFAE] text-[11px] font-medium text-[#555A4E] hover:border-[#8A6437] hover:text-[#8A6437] transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E8DFC8]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="ai-chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập câu hỏi (Ví dụ: Tôi hay bị đau thắt lưng, tập lớp nào?)..."
              className="flex-1 px-4 py-3 rounded-full bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:ring-1 focus:ring-[#D69A2D] outline-none text-xs sm:text-sm text-[#252822] placeholder:text-gray-400"
            />
            <button
              type="submit"
              id="ai-chat-send-btn"
              disabled={isLoading || !inputValue.trim()}
              className="w-11 h-11 rounded-full bg-[#D69A2D] text-white flex items-center justify-center hover:bg-[#B87A14] transition-all cursor-pointer shadow-xs disabled:opacity-40 shrink-0"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
