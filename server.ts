import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { processChatConsultation, generateConsultationReport } from './src/services/aiAdvisorService';
import { getViciConsultation } from './src/data/viciAdvisor';
import {
  getLeadsDatabase,
  reloadLeadsFromDisk,
  saveOrUpdateLead,
  updateLeadById,
  deleteLeadById,
  exportDatabaseBackup,
  restoreDatabaseBackup
} from './src/services/leadStorage';
import { analyzeCustomerSegmentAndSchedule, sanitizeGoalsForSegment } from './src/utils/customerSegmentation';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasGeminiKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiAvailable: hasGeminiKey,
    hasApiKeyConfigured: hasGeminiKey,
    environment: 'node_server'
  });
});

// GET all leads
app.get('/api/leads', (req, res) => {
  if (req.query.reload === 'true') {
    reloadLeadsFromDisk();
  }
  const leads = getLeadsDatabase();
  res.json({
    success: true,
    leads: leads,
    total: leads.length
  });
});

// POST create or update lead with conversation history and needs
app.post('/api/leads', (req, res) => {
  const {
    name,
    phone,
    email,
    source,
    interest,
    category,
    experience,
    goals,
    preferredTime,
    preferredFormat,
    recommendedCourse,
    leadScore,
    conversationSummary,
    chatSummary,
    aiReport,
    conversationHistory,
    staffNotes,
    nextAction,
    assignedTo
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Họ tên và Số điện thoại là bắt buộc' });
  }

  // Derive accurate customer segment, schedule and course from all provided information
  const userSpeechOnly = Array.isArray(conversationHistory) && conversationHistory.length > 0
    ? conversationHistory
        .filter((c: any) => (c.sender || '').toLowerCase() === 'user')
        .map((c: any) => c.text || '')
        .join(' ')
    : '';

  const contextForAnalysis = userSpeechOnly.trim()
    ? `${userSpeechOnly} ${interest || ''}`
    : `${conversationSummary || ''} ${chatSummary || ''} ${interest || ''}`;

  const analyzed = analyzeCustomerSegmentAndSchedule(contextForAnalysis, interest, preferredTime, goals);

  let finalCategory = analyzed.category;
  // If analysis detects specific therapy pathology, it MUST NOT be overwritten by a stale category
  if (analyzed.category === 'THERAPY_INTEREST') {
    finalCategory = 'THERAPY_INTEREST';
  } else if (category && category !== 'GENERAL_INQUIRY') {
    finalCategory = category;
  }

  // Ensure interest matches genuine detected intent
  let finalInterest = analyzed.interest || interest || 'Chưa xác định';
  if (finalCategory === 'THERAPY_INTEREST' && analyzed.interest) {
    finalInterest = analyzed.interest;
  } else if (finalCategory === 'TRAINER_EDUCATION') {
    finalInterest = analyzed.interest || 'Đào tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)';
  } else if (finalCategory === 'ADVANCED') {
    finalInterest = analyzed.interest || 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 Chuyên Đề)';
  }

  const hasUserTime =
    preferredTime &&
    preferredTime.trim() !== '' &&
    preferredTime !== 'Linh hoạt' &&
    preferredTime !== 'Linh hoạt theo nhu cầu' &&
    preferredTime !== 'Chưa xác định' &&
    !preferredTime.includes('Sáng 05:00 / Tan ca 17:45 / Tối 19:00');
  const finalTime = hasUserTime ? preferredTime.trim() : (analyzed.preferredTime || 'Linh hoạt theo nhu cầu');
  const finalCourse = (analyzed.recommendedCourse && finalCategory === analyzed.category)
    ? analyzed.recommendedCourse
    : (recommendedCourse || analyzed.recommendedCourse || finalInterest || 'Gói Yoga Trị Liệu Cá Nhân Hóa');

  // Trainer assignment
  let finalAssignedTo = analyzed.assignedTo;
  if (finalCategory === 'TRAINER_EDUCATION' || finalCategory === 'ADVANCED') {
    finalAssignedTo = 'Master Henry Phan';
  } else if (assignedTo) {
    finalAssignedTo = assignedTo;
  }

  // Strict goal sanitization per segment
  const rawGoals = Array.isArray(goals) && goals.length > 0 && finalCategory !== 'THERAPY_INTEREST'
    ? goals
    : analyzed.goals;
  const finalGoals = sanitizeGoalsForSegment(finalCategory, rawGoals, contextForAnalysis);

  // Professional clinical intake notes
  const conditionNotes = analyzed.detectedConditions?.length > 0
    ? analyzed.detectedConditions.join('; ')
    : finalInterest;
  const finalStaffNotes = `[Phân khúc CRM: ${analyzed.categoryLabel}] Tình trạng & Thể trạng: ${conditionNotes}. Khung giờ mong muốn: ${finalTime}. Khóa đề xuất: ${finalCourse}.`;

  const savedLead = saveOrUpdateLead({
    name,
    phone,
    email,
    source: source || 'VICI AI Chatbot',
    interest: finalInterest,
    category: finalCategory,
    experience: experience || 'Chưa xác định',
    goals: finalGoals,
    preferredTime: finalTime,
    preferredFormat: preferredFormat || 'Trực tiếp tại Studio',
    recommendedCourse: finalCourse,
    leadScore: leadScore || (phone ? 'HOT' : 'WARM'),
    assignedTo: finalAssignedTo,
    conversationSummary: conversationSummary || chatSummary,
    chatSummary: chatSummary || conversationSummary,
    aiReport,
    conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : [],
    staffNotes: finalStaffNotes,
    nextAction: nextAction || `${finalAssignedTo} liên hệ tư vấn chuyên môn và xác nhận lịch hẹn`
  });

  res.status(201).json({
    success: true,
    lead: savedLead,
    message: 'Lưu thông tin và hội thoại Lead thành công'
  });
});

// PATCH update lead status or staff notes
app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status, staffNotes, nextAction, assignedTo, leadScore, category, preferredTime } = req.body;

  const updatedLead = updateLeadById(id, {
    ...(status ? { status } : {}),
    ...(staffNotes !== undefined ? { staffNotes } : {}),
    ...(nextAction !== undefined ? { nextAction } : {}),
    ...(assignedTo ? { assignedTo } : {}),
    ...(leadScore ? { leadScore } : {}),
    ...(category ? { category } : {}),
    ...(preferredTime ? { preferredTime } : {})
  });

  if (!updatedLead) {
    return res.status(404).json({ success: false, error: 'Lead không tồn tại' });
  }

  res.json({
    success: true,
    lead: updatedLead
  });
});

// DELETE delete lead by id
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const deleted = deleteLeadById(id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Lead không tồn tại' });
  }

  res.json({
    success: true,
    message: 'Đã xóa thông tin lead thành công',
    deletedId: id
  });
});

// GET Backup Database JSON
app.get('/api/leads/backup', (req, res) => {
  const backup = exportDatabaseBackup();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=vici-crm-leads-backup-${new Date().toISOString().slice(0,10)}.json`);
  res.json(backup);
});

// POST Restore Database JSON
app.post('/api/leads/restore', (req, res) => {
  const { leads, data, mode = 'merge' } = req.body;
  const payloadToRestore = leads || data || req.body;

  const result = restoreDatabaseBackup(payloadToRestore, mode);
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({
    ...result,
    total: getLeadsDatabase().length,
    leads: getLeadsDatabase()
  });
});

// POST Chatbot endpoint with multi-model resilience and deep expert fallback
app.post('/api/chat', async (req, res) => {
  const { message, history, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Tin nhắn không được để trống' });
  }

  try {
    const rawHistory = Array.isArray(conversationHistory)
      ? conversationHistory
      : Array.isArray(history)
      ? history
      : [];

    const chatPromise = processChatConsultation(message, rawHistory);
    const timeoutPromise = new Promise<{
      reply: string;
      source: 'local_expert';
      isAiActive: boolean;
      model?: string;
      notice?: string;
    }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            reply: getViciConsultation(message),
            source: 'local_expert',
            isAiActive: false,
          }),
        20000
      )
    );

    const result = await Promise.race([chatPromise, timeoutPromise]);
    res.json({
      success: true,
      reply: result.reply,
      source: result.source,
      model: result.model,
      isAiActive: result.isAiActive,
      notice: result.notice,
      capturedLead: (result as any).capturedLead,
      toolCalled: (result as any).toolCalled,
    });
  } catch (err: any) {
    console.error('Lỗi API /api/chat trên server:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi xử lý tư vấn',
      source: 'error'
    });
  }
});

// POST Generate Clinical Consultation & Intake Summary Report
app.post('/api/chat/report', async (req, res) => {
  const { messages, customerInfo } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, error: 'Cần cung cấp danh sách tin nhắn để lập báo cáo' });
  }

  try {
    const report = await generateConsultationReport(messages, customerInfo);
    res.json({
      success: true,
      report
    });
  } catch (err: any) {
    console.error('Lỗi tạo báo cáo tư vấn:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi tạo báo cáo tư vấn'
    });
  }
});

// POST Proxy synchronization to Google Sheets Webhook
const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyMpLlYJAmNVas-9jCnQ6yy_i3B2Hg24HkCB-35baER3WSilj0gm-gS6ijESz0IbG1D/exec';

app.post('/api/chat/sync-sheet', async (req, res) => {
  const { payload, webhookUrl } = req.body;
  const targetUrl = (webhookUrl && typeof webhookUrl === 'string' && webhookUrl.trim())
    ? webhookUrl.trim()
    : DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;

  try {
    const fetchResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    res.json({
      success: true,
      status: fetchResponse.status,
      message: 'Đã gửi dữ liệu sang Google Sheet thành công'
    });
  } catch (err: any) {
    console.warn('Lỗi gửi Webhook Google Sheet từ server:', err);
    res.status(502).json({
      success: false,
      error: err?.message || 'Không thể kết nối với Webhook Google Sheet'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VICI Yoga Therapy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
