import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Calendar,
  PhoneCall,
  Info,
  Check,
  Phone,
  ClipboardList,
} from 'lucide-react';
import { Lead, AIConsultationReport } from '../types';
import { getViciConsultation } from '../data/viciAdvisor';
import { analyzeCustomerSegmentAndSchedule } from '../utils/customerSegmentation';
import {
  syncLeadToGoogleSheet,
  syncChatSessionToGoogleSheet,
} from '../services/googleSheetsService';
import { saveLeadToFirestore } from '../services/firebase';
import { generateClientConsultationReport } from '../utils/consultationReportHelper';

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
  if (lower.includes('scan trị liệu') || lower.includes('vai gáy') || lower.includes('650.000') || lower.includes('650k')) {
    return {
      label: 'Đặt lịch Scan Trị Liệu Cơ Vai Cổ Gáy (650k)',
      courseName: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy (45-60 phút)',
    };
  }
  if (lower.includes('thoát vị') || lower.includes('thắt lưng') || lower.includes('cá nhân hóa 1-1') || lower.includes('l4-l5')) {
    return {
      label: 'Đăng ký Trị Liệu Cột Sống Cá Nhân Hóa 1-1',
      courseName: 'Trị Liệu Chuyên Sâu 1-1 Cá nhân hóa (60-75 phút)',
    };
  }
  if (lower.includes('newbie') || lower.includes('người mới') || lower.includes('chưa tập bao giờ')) {
    return {
      label: 'Đăng ký Lớp Yoga Cho Người Mới (Sáng 5h / Tối 19h)',
      courseName: 'Yoga Cho Người Mới Bắt Đầu (Newbie)',
    };
  }
  if (lower.includes('ashtanga') || lower.includes('10 chuyên đề')) {
    return {
      label: 'Đăng ký Khóa Ashtanga 10 Chuyên Đề (1.290k)',
      courseName: 'Khóa Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 chuyên đề)',
    };
  }
  if (lower.includes('huấn luyện viên') || lower.includes('hlv') || lower.includes('e-ryt 500')) {
    return {
      label: 'Nhận hồ sơ Khóa Đào Tạo HLV Quốc Tế E-RYT 500',
      courseName: 'Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)',
    };
  }
  if (lower.includes('chuông xoay') || lower.includes('mất ngủ') || lower.includes('sound healing')) {
    return {
      label: 'Đăng ký Lớp Yoga Tối & Chuông Xoay Trị Liệu',
      courseName: 'Workshop Chuông Xoay Trị Liệu & Mindfulness',
    };
  }
  if (lower.includes('gói 3 tháng') || lower.includes('gói 6 tháng') || lower.includes('gói tập') || lower.includes('hội viên')) {
    return {
      label: 'Đăng ký Gói Hội Viên Trị Liệu 3 - 6 Tháng',
      courseName: 'Gói Yoga Cá Nhân Hóa 3 Tháng / 6 Tháng',
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

  // Quick form fields when AI asks for lead info & trainer clinical intake
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCondition, setLeadCondition] = useState('Đau mỏi Cổ - Vai - Gáy');
  const [isConditionManuallySelected, setIsConditionManuallySelected] = useState(false);
  const [leadPreferredTime, setLeadPreferredTime] = useState('Linh hoạt theo nhu cầu');
  const [leadCustomNote, setLeadCustomNote] = useState('');
  const [leadConsent, setLeadConsent] = useState(true);
  const [leadSaved, setLeadSaved] = useState(false);

  // Auto-detect customer's preferred schedule and condition from conversation
  useEffect(() => {
    const userTexts = messages
      .filter((m) => m.sender === 'user')
      .map((m) => m.text)
      .join(' ');
    if (userTexts.trim()) {
      const analyzed = analyzeCustomerSegmentAndSchedule(userTexts);
      if (analyzed.preferredTime && analyzed.preferredTime !== 'Linh hoạt theo nhu cầu' && leadPreferredTime === 'Linh hoạt theo nhu cầu') {
        setLeadPreferredTime(analyzed.preferredTime);
      }
      if (analyzed.interest && !isConditionManuallySelected) {
        setLeadCondition(analyzed.interest);
      }
    }
  }, [messages, isConditionManuallySelected]);

  // Consultation Report State
  const [activeReport, setActiveReport] = useState<AIConsultationReport | null>(null);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [vercelNotice, setVercelNotice] = useState<string | null>(null);
  const [showVercelGuide, setShowVercelGuide] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamTimerRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    { label: '🩺 Thoát vị đĩa đệm L4-L5', prompt: 'Mình bị thoát vị đĩa đệm L4-L5 có tập yoga bên bạn được không? Có sợ đau thêm không?' },
    { label: '💻 Đau mỏi Cổ - Vai - Gáy', prompt: 'Ngồi máy tính nhiều bị nhức mỏi hai bên bả vai và tê tê cánh tay, bên mình có bài tập nào hỗ trợ không?' },
    { label: '💰 Học phí & Đặt lịch tập thử', prompt: 'Học phí tại Vici Yoga bao nhiêu một tháng vậy? Có ưu đãi trải nghiệm không?' },
    { label: '⏰ Lớp cho người làm 8h - 18h', prompt: 'Tôi là nhân viên văn phòng làm từ 8h đến 18h, có khung giờ nào phù hợp cho tôi?' },
    { label: '🌿 Người mới / Cơ thể cứng', prompt: 'Tôi chưa từng tập Yoga, cơ thể cứng thì có lớp nào an toàn cho người mới không?' },
    { label: '🧘 Đo biên độ cột sống (ROM test)', prompt: 'Tôi muốn đặt lịch kiểm tra tầm vận động cột sống (ROM test) và trải nghiệm buổi tập thử' },
    { label: '🔔 Chuông xoay & Trị liệu giấc ngủ', prompt: 'Tôi bị mất ngủ và căng thẳng kéo dài, liệu pháp Chuông xoay Tây Tạng có tác dụng ra sao?' },
    { label: '🔥 Ashtanga 10 chuyên đề', prompt: 'Cho tôi thông tin 10 chuyên đề Ashtanga nâng cao của Master Henry Phan' },
    { label: '🎓 Đào tạo HLV Quốc Tế E-RYT 500', prompt: 'Tôi quan tâm đến khóa Đào tạo Huấn Luyện Viên Yoga Quốc Tế cấp bằng Yoga Alliance Hoa Kỳ' },
    { label: '📍 Địa chỉ & Không gian studio', prompt: 'Studio Vici Yoga ở đâu, có chỗ đậu xe ô tô không và giờ mở cửa thế nào?' },
    { label: '📞 Yêu cầu tư vấn 1-1', prompt: 'Mình muốn để lại số điện thoại để chuyên viên MyVici gọi điện tư vấn phác đồ 1-1' },
  ];

  // Initialize or reset chat on open
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        const welcomeMsg: Message = {
          id: 'welcome-msg',
          sender: 'ai',
          text: `Namaste! 🙏 Chào mừng bạn đến với Vici Yoga Therapy Center.\n\nMình là **MyVici** – Chuyên viên tư vấn phục hồi và trị liệu của trung tâm.\n\nVới phương châm *"Tập đúng để chữa lành – Không ép dẻo quá đà – Tôn trọng giới hạn tự nhiên của cơ thể"*, mình luôn ở đây để lắng nghe, thấu cảm và đồng hành cùng bạn.\n\nBạn đang quan tâm đến cải thiện vấn đề cơ xương khớp (như đau mỏi cổ vai gáy, thoát vị đĩa đệm L4-L5) hay cần tư vấn lộ trình tập luyện phù hợp không ạ?`,
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
    if (!query) return;

    // If there is an active in-flight request, abort it to respond immediately to user's new message
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (_) {}
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Clear any active streaming animation timer
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

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
      // Build conversation history for API
      const apiHistory = newHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      let aiReply = '';
      let replySource: 'gemini' | 'local_expert' = 'local_expert';
      let replyModel: string | undefined = undefined;

      try {
        // Fetch timeout: allow up to 24 seconds for AI processing
        const timeoutId = setTimeout(() => {
          try {
            abortController.abort();
          } catch (_) {}
        }, 24000);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            conversationHistory: apiHistory.slice(-8), // Keep recent turns
          }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          aiReply = (data.reply || '').trim();
          replySource = data.source === 'gemini' ? 'gemini' : 'local_expert';
          replyModel = data.model;
          if (data.source === 'gemini') {
            setAiStatus('connected');
          }
          if (data.capturedLead) {
            setLeadSaved(true);
            if (onLeadCaptured) {
              onLeadCaptured(data.capturedLead);
            }
          }
        }
      } catch (networkErr: any) {
        if (networkErr?.name !== 'AbortError') {
          console.warn('Backend fetch note, using VICI clinical expert engine:', networkErr);
        }
      }

      // If reply is empty, instantly use our comprehensive consultation engine
      if (!aiReply) {
        aiReply = getViciConsultation(query);
      }

      // Start realistic and fast progressive typing reveal
      const aiMsgId = `ai-${Date.now()}`;
      const targetText = aiReply;
      const finalSource = replySource;
      const finalModel = replyModel;

      setIsLoading(false);

      // Add placeholder message with cursor
      const initialAiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: finalSource,
        model: finalModel,
        isStreaming: true,
      };

      setMessages([...newHistory, initialAiMsg]);

      let charIndex = 0;
      // High-performance chunk sizing: reveals answer quickly within ~200-300ms
      const chunkSize = Math.max(22, Math.ceil(targetText.length / 15));

      streamTimerRef.current = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= targetText.length) {
          if (streamTimerRef.current) {
            clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
          }
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
      }, 14);

      // Automatically capture phone number and optional name if user typed it into chat
      const phoneMatch = query.match(/(0\d{9,10}|\+84\d{9,10}|\d{4}[\s.-]?\d{3}[\s.-]?\d{3})/);
      if (phoneMatch && !leadSaved) {
        const extractedPhone = phoneMatch[0].replace(/[\s.-]/g, '');
        setLeadPhone(extractedPhone);
        setLeadSaved(true);

        // Extract customer name if written alongside phone (e.g. "My - 0853111997" or "Linh: 0988123456")
        let detectedName = leadName.trim();
        if (!detectedName) {
          const beforePhone = query.slice(0, phoneMatch.index || 0).replace(/[-:,\n\r]/g, ' ').trim();
          const cleanBefore = beforePhone
            .replace(/^(mình\s+tên\s+là|em\s+tên\s+là|tên\s+mình\s+là|tôi\s+tên\s+là|mình\s+là|em\s+là|tôi\s+là|tên:|sđt:|sđt\s+là)\s*/i, '')
            .trim();
          if (cleanBefore.length >= 2 && cleanBefore.length <= 30 && !cleanBefore.toLowerCase().includes('yoga') && !cleanBefore.toLowerCase().includes('khóa')) {
            detectedName = cleanBefore;
            setLeadName(detectedName);
          }
        }

        const allUserTexts = [...newHistory, { sender: 'user', text: query }]
          .filter((m) => m.sender === 'user')
          .map((m) => m.text)
          .join(' ');
        const analysis = analyzeCustomerSegmentAndSchedule(
          allUserTexts,
          isConditionManuallySelected ? leadCondition : undefined,
          leadPreferredTime
        );
        const effectiveTime = leadPreferredTime && leadPreferredTime !== 'Linh hoạt theo nhu cầu'
          ? leadPreferredTime
          : analysis.preferredTime;

        const autoLeadPayload = {
          name: detectedName || 'Học viên nhắn qua AI Chat',
          phone: extractedPhone,
          source: 'VICI AI Chatbot' as const,
          interest: analysis.interest || (isConditionManuallySelected ? leadCondition : 'Tư vấn phác đồ cơ xương khớp'),
          category: analysis.category,
          goals: analysis.goals,
          experience: 'Học viên gửi số điện thoại trong hội thoại AI',
          preferredTime: effectiveTime,
          recommendedCourse: analysis.recommendedCourse,
          assignedTo: analysis.assignedTo,
          leadScore: 'HOT' as const,
          chatSummary: [...newHistory].map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n'),
          conversationHistory: [...newHistory].map((m) => ({
            sender: m.sender,
            text: m.text,
            time: m.timestamp,
          })),
          staffNotes: `[Phân khúc CRM: ${analysis.categoryLabel}] Khách gửi SĐT: ${extractedPhone}. Tình trạng: ${analysis.interest}. Khung giờ: ${effectiveTime}. Khóa đề xuất: ${analysis.recommendedCourse}.`,
          nextAction: `${analysis.assignedTo} gọi điện tư vấn chuyên môn`,
        };

        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(autoLeadPayload),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.lead) {
              saveLeadToFirestore(data.lead).catch((e) => console.warn('Firebase auto-lead sync notice:', e));
              if (onLeadCaptured) onLeadCaptured(data.lead);
              syncLeadToGoogleSheet(data.lead).catch((err) => console.warn('Sync sheet notice:', err));
            }
          })
          .catch(() => {});
      }

      // Show inline trainer intake form if explicitly requested
      const lowerQuery = query.toLowerCase();
      const explicitlyRequestsCallback =
        lowerQuery.includes('gọi lại cho tôi') ||
        lowerQuery.includes('gọi cho tôi') ||
        lowerQuery.includes('gọi điện thoại cho tôi') ||
        lowerQuery.includes('liên hệ tôi') ||
        lowerQuery.includes('số của tôi') ||
        lowerQuery.includes('gọi cho mình') ||
        lowerQuery.includes('để lại số điện thoại') ||
        lowerQuery.includes('đặt lịch hẹn') ||
        lowerQuery.includes('đặt lịch tư vấn');

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

    // Generate clinical intake report for CRM
    let generatedReport: AIConsultationReport | null = activeReport;
    try {
      const transcriptPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp,
      }));
      generatedReport = generateClientConsultationReport(transcriptPayload, {
        name: leadName.trim(),
        phone: leadPhone.trim(),
        condition: isConditionManuallySelected ? leadCondition : undefined,
        preferredTime: leadPreferredTime,
        notes: leadCustomNote,
      });
      setActiveReport(generatedReport);
    } catch (err) {
      console.warn('Could not pre-generate report on form save:', err);
    }

    const userTexts = messages.map((m) => m.text).join(' ');
    const segmentResult = analyzeCustomerSegmentAndSchedule(
      `${userTexts} ${isConditionManuallySelected ? leadCondition : ''} ${leadCustomNote}`,
      isConditionManuallySelected ? leadCondition : undefined,
      leadPreferredTime
    );
    const effectiveTime = leadPreferredTime && leadPreferredTime.trim() && leadPreferredTime !== 'Linh hoạt theo nhu cầu'
      ? leadPreferredTime.trim()
      : (segmentResult.preferredTime || 'Linh hoạt theo nhu cầu');

    const finalGoals = generatedReport?.customerGoals && generatedReport.customerGoals.length > 0
      ? generatedReport.customerGoals
      : segmentResult.goals;

    const effectiveCondition = segmentResult.interest || (isConditionManuallySelected ? leadCondition : 'Tư vấn phác đồ qua AI Chat');

    const leadPayload = {
      name: leadName.trim() || 'Học viên tư vấn qua VICI AI',
      phone: leadPhone.trim(),
      source: 'VICI AI Chatbot' as const,
      interest: effectiveCondition,
      category: segmentResult.category,
      goals: finalGoals,
      experience: 'Học viên cung cấp hồ sơ thể trạng cho HLV',
      preferredTime: effectiveTime,
      recommendedCourse: segmentResult.recommendedCourse,
      assignedTo: segmentResult.assignedTo,
      leadScore: 'HOT' as const,
      chatSummary: generatedReport?.fullSummaryText || messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n'),
      conversationSummary: generatedReport?.fullSummaryText || messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n'),
      conversationHistory: messages.map((m) => ({
        sender: m.sender,
        text: m.text,
        time: m.timestamp,
      })),
      aiReport: generatedReport || undefined,
      staffNotes: `[Hồ sơ đầu vào cho HLV - Phân khúc: ${segmentResult.categoryLabel}] Tình trạng: ${effectiveCondition}. Khung giờ mong muốn: ${effectiveTime}. Khóa học đề xuất: ${segmentResult.recommendedCourse}. Ghi chú học viên: ${leadCustomNote || 'Không có'}.`,
      nextAction: `${segmentResult.assignedTo} gọi điện tư vấn phác đồ và xếp lịch trải nghiệm`,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        saveLeadToFirestore(data.lead).catch((e) => console.warn('Firebase inline lead sync notice:', e));
        if (onLeadCaptured) onLeadCaptured(data.lead);
        syncLeadToGoogleSheet(data.lead).catch((err) => console.warn('Chat lead sheet sync notice:', err));
      }
    } catch (e) {
      // Ignored for UI flow
    }

    // Automatically sync full chat transcript and report to Google Sheets
    if (generatedReport) {
      syncChatSessionToGoogleSheet({
        sessionId: generatedReport.sessionId,
        customerName: leadName.trim() || 'Học viên AI Chat',
        customerPhone: leadPhone.trim(),
        condition: effectiveCondition,
        preferredTime: effectiveTime,
        recommendedCourse: generatedReport.recommendedCourse,
        reportSummary: generatedReport.fullSummaryText,
        transcript: messages.map((m) => `${m.sender === 'user' ? 'Học viên' : 'MyVici'}: ${m.text}`).join('\n\n'),
        leadScore: 'HOT',
        nextAction: 'HLV liên hệ xác nhận phác đồ trị liệu',
      }).catch((err) => console.warn('Google Sheet chat sync error:', err));
    }

    setLeadSaved(true);
    setShowLeadFormInline(false);
    setIsLoading(false);

    const confirmMsg: Message = {
      id: `sys-${Date.now()}`,
      sender: 'ai',
      text: `Tuyệt vời! MyVici đã ghi nhận thông tin của bạn (**${leadName || 'Học viên'}** - SĐT: **${leadPhone}**).\n\n📋 **Thông tin chuyển giao cho Huấn luyện viên:**\n* **Tình trạng/Nhu cầu:** ${effectiveCondition}\n* **Khung giờ mong muốn:** ${effectiveTime}${leadCustomNote ? `\n* **Ghi chú riêng:** ${leadCustomNote}` : ''}\n\nMaster Henry Phan và đội ngũ chuyên gia VICI sẽ liên hệ trực tiếp qua Zalo/điện thoại để trao đổi phác đồ và xác nhận lịch hẹn sớm nhất cho bạn. Cảm ơn bạn! 🙏`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confirmMsg]);
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
      text: `Namaste! 🙏 Mình là MyVici. Bạn cần tư vấn về lớp học trị liệu, phục hồi cơ xương khớp hay đặt lịch đo tầm vận động (ROM test) ạ?`,
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
                  MyVici
                </h3>
                {aiStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/25 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gemini 2.5 Flash Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVercelGuide(!showVercelGuide)}
                    className="inline-flex items-center gap-1 text-[10px] bg-amber-500/25 text-amber-100 px-2 py-0.5 rounded-full border border-amber-300/40 hover:bg-amber-500/35 transition-colors cursor-pointer"
                    title="Bấm xem hướng dẫn kích hoạt Gemini 2.5 Flash trên Vercel"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    Chuyên gia MyVici
                    <Info className="w-3 h-3 ml-0.5 opacity-80" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-amber-100/80">
                Chuyên viên tư vấn phục hồi & trị liệu • Vici Yoga Therapy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              title="Bắt đầu lại cuộc trò chuyện"
              className="w-11 h-11 rounded-full hover:bg-white/10 text-amber-200 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline-block text-[10px] bg-white/15 text-amber-100 px-1.5 py-0.5 rounded border border-white/20 font-mono select-none" title="Nhấn phím Esc để đóng">
                Esc
              </span>
              <button
                id="ai-chat-close-btn"
                onClick={onClose}
                className="w-11 h-11 rounded-full hover:bg-white/10 text-amber-200 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                aria-label="Đóng (Phím Esc)"
                title="Đóng (Phím Esc)"
              >
                <X className="w-6 h-6" />
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

                  {/* Action Bar: Course recommendation & Direct Intake CTAs */}
                  {isAI && msg.id !== 'welcome-msg' && msg.id !== 'welcome-reset' && !msg.isStreaming && (
                    <div className="mt-3 pt-2.5 border-t border-[#F0E6D2] space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Course recommendation 1-click CTA button if matched */}
                        {(() => {
                          const recommendation = detectCourseRecommendation(msg.text);
                          if (!recommendation) return null;
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenRegisterForm) {
                                  onOpenRegisterForm(recommendation.courseName);
                                  onClose();
                                } else {
                                  setLeadCondition(recommendation.courseName);
                                  setShowLeadFormInline(true);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D69A2D] to-[#B87A14] text-white font-medium text-xs hover:shadow-md transition-all cursor-pointer shadow-2xs"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{recommendation.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          );
                        })()}

                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenRegisterForm) {
                              onOpenRegisterForm('Tư vấn phác đồ trị liệu 1-1');
                              onClose();
                            } else {
                              setShowLeadFormInline(true);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F0E4CE] text-[#8A6437] font-semibold text-xs border border-[#DFCFAE] transition-all cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#D69A2D]" />
                          <span>Đặt lịch hẹn tư vấn</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowLeadFormInline(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-all cursor-pointer"
                        >
                          <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Gửi thể trạng cho HLV</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Source attribution tag */}
                  {isAI && msg.id !== 'welcome-msg' && msg.id !== 'welcome-reset' && (
                    <div className="mt-2.5 pt-2 border-t border-[#F0E6D2] flex flex-wrap items-center justify-between gap-1.5">
                      {msg.source === 'gemini' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Tư vấn trực tiếp bởi Google Gemini ({msg.model || 'Gemini Flash'})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8A6437] bg-[#FAF5EB] px-2 py-0.5 rounded-full border border-[#E2D4BD]">
                          📚 Phác đồ chuyên gia VICI E-RYT 500
                        </span>
                      )}

                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
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

          {/* Inline Trainer Clinical Intake Form */}
          {showLeadFormInline && !leadSaved && (
            <div className="bg-[#FAF7F0] rounded-2xl p-4 sm:p-5 border-2 border-[#D69A2D]/60 shadow-md space-y-3.5 animate-in fade-in relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8A6437]">
                  <ClipboardList className="w-4 h-4 text-[#D69A2D]" />
                  <span>Phiếu Tiếp Nhận Thông Tin Thể Trạng Cho Huấn Luyện Viên</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLeadFormInline(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors cursor-pointer"
                  title="Đóng phiếu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#555A4E]">
                Thông tin được chuyển giao trực tiếp cho <strong>Master Henry Phan & đội ngũ HLV VICI</strong> để chuẩn bị hồ sơ phác đồ và hẹn lịch tư vấn 1-1 riêng cho bạn:
              </p>

              <form onSubmit={handleSaveInlineLead} className="space-y-3">
                {/* Condition Selector Pills */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#8A6437] mb-1.5">
                    1. Vấn đề cơ xương khớp hoặc mục tiêu của bạn:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Đau mỏi Cổ - Vai - Gáy',
                      'Thoát vị đĩa đệm L4-L5',
                      'Yoga Cho Người Mới',
                      'Chuông Xoay & Giấc Ngủ',
                      'Nâng Cao / Ashtanga',
                      'Đào Tạo HLV Quốc Tế',
                    ].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => {
                          setLeadCondition(cond);
                          setIsConditionManuallySelected(true);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          leadCondition === cond
                            ? 'bg-[#8A6437] text-white shadow-2xs'
                            : 'bg-white border border-[#D5C7AA] text-[#555A4E] hover:border-[#8A6437]'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Time Selector Pills */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#8A6437] mb-1.5">
                    2. Khung giờ bạn thuận tiện tập nhất:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Ca Sáng (05:00 - 06:00)',
                      'Sáng Trị Liệu (06:30 - 07:30)',
                      'Ca Chiều (14:00 - 15:30)',
                      'Ca Tan Ca (17:45 - 18:45)',
                      'Ca Tối (19:00 - 20:00)',
                      'Cuối Tuần (T7 & CN)',
                      'Linh hoạt theo nhu cầu',
                    ].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setLeadPreferredTime(time)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          leadPreferredTime === time
                            ? 'bg-[#D69A2D] text-white shadow-2xs'
                            : 'bg-white border border-[#D5C7AA] text-[#555A4E] hover:border-[#D69A2D]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-[#717769] mb-1">
                      Họ và tên bạn:
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Minh Anh"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#717769] mb-1">
                      Số điện thoại / Zalo <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="09xx xxx xxx"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#717769] mb-1">
                    Ghi chú chi tiết cho HLV (nếu có):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đã bị đau lưng 6 tháng, tê lan xuống chân trái..."
                    value={leadCustomNote}
                    onChange={(e) => setLeadCustomNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#555A4E] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={leadConsent}
                      onChange={(e) => setLeadConsent(e.target.checked)}
                      className="rounded text-[#D69A2D] accent-[#D69A2D]"
                    />
                    <span>HLV liên hệ tư vấn qua Zalo</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#8A6437] hover:bg-[#72522C] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Gửi hồ sơ cho HLV</span>
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
