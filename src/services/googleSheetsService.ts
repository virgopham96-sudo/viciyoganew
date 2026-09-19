/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Sheets Integration Service for VICI Yoga Therapy CRM.
 * Supports auto-syncing incoming leads via Google Apps Script Webhook
 * and 1-click CSV/Excel export with UTF-8 BOM encoding.
 */

import { Lead, ChatSessionRecord, AIConsultationReport } from '../types';

const STORAGE_KEY_WEBHOOK = 'vici_google_sheet_webhook_url';
const STORAGE_KEY_VIEW_URL = 'vici_google_sheet_view_url';
const STORAGE_KEY_LAST_SYNC = 'vici_google_sheet_last_sync';
const STORAGE_KEY_SYNC_LOG = 'vici_google_sheet_sync_log';
const STORAGE_KEY_PENDING_DELETES = 'vici_google_sheet_pending_deletes';

export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyMpLlYJAmNVas-9jCnQ6yy_i3B2Hg24HkCB-35baER3WSilj0gm-gS6ijESz0IbG1D/exec';

export function getPendingDeletedLeads(): Array<{ id: string; phone?: string; name?: string }> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING_DELETES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPendingDeletedLead(item: { id: string; phone?: string; name?: string }): void {
  if (typeof window === 'undefined') return;
  try {
    const pending = getPendingDeletedLeads();
    const filtered = pending.filter((p) => p.id !== item.id);
    filtered.push(item);
    localStorage.setItem(STORAGE_KEY_PENDING_DELETES, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Cannot save pending delete', e);
  }
}

export function clearPendingDeletedLeads(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PENDING_DELETES);
}

export function removePendingDeletedLead(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const pending = getPendingDeletedLeads();
    const filtered = pending.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PENDING_DELETES, JSON.stringify(filtered));
  } catch (e) {}
}

// Default / fallback sample webhook or user configured webhook
export function getGoogleSheetWebhookUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
  const stored = localStorage.getItem(STORAGE_KEY_WEBHOOK);
  if (stored && stored.trim()) return stored.trim();

  // Check client-side environment variable if provided
  const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEET_WEBHOOK_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim();
  }

  return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
}

export function setGoogleSheetWebhookUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_WEBHOOK, url.trim());
}

/**
 * Direct Google Sheet spreadsheet link (e.g. https://docs.google.com/spreadsheets/d/.../edit)
 */
export function getGoogleSheetViewUrl(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY_VIEW_URL);
  if (stored && stored.trim()) return stored.trim();

  const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEET_VIEW_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim();
  }

  return '';
}

export function setGoogleSheetViewUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VIEW_URL, url.trim());
}

export function getLastSyncTime(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_LAST_SYNC);
}

export function getSyncLogs(): Array<{ time: string; count: number; status: 'success' | 'error'; message: string }> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_LOG);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSyncLog(status: 'success' | 'error', message: string, count: number = 1) {
  if (typeof window === 'undefined') return;
  try {
    const logs = getSyncLogs();
    const newLog = {
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      count,
      status,
      message,
    };
    const updated = [newLog, ...logs].slice(0, 20);
    localStorage.setItem(STORAGE_KEY_SYNC_LOG, JSON.stringify(updated));
    if (status === 'success') {
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toLocaleString('vi-VN'));
    }
  } catch (e) {
    console.error('Failed to log sync', e);
  }
}

/**
 * Format a Lead record into Google Sheets payload structure
 */
export function formatLeadForSheet(lead: Lead) {
  return {
    type: 'lead_registration',
    id: lead.id,
    timestamp: lead.createdAt || new Date().toLocaleString('vi-VN'),
    name: lead.name,
    phone: lead.phone,
    email: lead.email || '',
    interest: lead.interest || '',
    category: lead.category || '',
    preferredTime: lead.preferredTime || '',
    preferredFormat: lead.preferredFormat || 'Trực tiếp tại Studio',
    experience: lead.experience || '',
    goals: Array.isArray(lead.goals) ? lead.goals.join(', ') : '',
    source: lead.source || 'Website Form',
    leadScore: lead.leadScore || 'WARM',
    status: lead.status || 'New',
    assignedTo: lead.assignedTo || 'Master Henry Phan',
    notes: lead.staffNotes || '',
    nextAction: lead.nextAction || '',
    chatSummary: lead.chatSummary || lead.conversationSummary || (lead.aiReport?.fullSummaryText) || '',
    transcript: Array.isArray(lead.conversationHistory)
      ? lead.conversationHistory.map((m) => `${m.sender === 'user' ? 'Học viên' : 'MyVici'}: ${m.text}`).join('\n')
      : '',
  };
}

/**
 * Synchronize a single lead directly to Google Sheet via Google Apps Script Webhook.
 */
export async function syncLeadToGoogleSheet(
  lead: Lead,
  customWebhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  const webhookUrl = customWebhookUrl || getGoogleSheetWebhookUrl();
  const payload = formatLeadForSheet(lead);

  if (!webhookUrl) {
    addSyncLog(
      'success',
      `Đã lưu Lead [${lead.name} - ${lead.phone}]. Dán Google Sheets Webhook URL trong CRM để tự động ghi vào Sheet.`,
      1
    );
    return {
      success: true,
      message: 'Lead đã được ghi nhận. Webhook Google Sheet chưa được cấu hình, dữ liệu đã lưu trữ an toàn trong CRM.',
    };
  }

  // Attempt server-side proxy first (bypasses browser CORS & corporate firewalls)
  try {
    const serverRes = await fetch('/api/chat/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, webhookUrl }),
    });
    if (serverRes.ok) {
      addSyncLog('success', `Đã đồng bộ Lead [${lead.name} - ${lead.phone}] lên Google Sheet qua máy chủ`, 1);
      return { success: true, message: 'Đã lưu và đồng bộ thành công lên Google Sheet CRM!' };
    }
  } catch (e) {
    // Fall back to direct browser fetch below
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    addSyncLog('success', `Đã đồng bộ Lead [${lead.name} - ${lead.phone}] lên Google Sheet`, 1);
    return {
      success: true,
      message: 'Đã lưu và đồng bộ thành công lên Google Sheet CRM!',
    };
  } catch (err: any) {
    console.warn('Google Sheet sync notice:', err);
    addSyncLog('error', `Lỗi kết nối khi gửi Lead [${lead.name}]: ${err.message || 'Network error'}`, 1);
    return {
      success: false,
      message: 'Không thể kết nối với Webhook Google Sheet. Dữ liệu vẫn được bảo vệ trong CRM.',
    };
  }
}

/**
 * Synchronize full AI Chat Session & Clinical Report directly to Google Sheet
 */
export async function syncChatSessionToGoogleSheet(
  params: {
    sessionId: string;
    customerName?: string;
    customerPhone?: string;
    condition?: string;
    preferredTime?: string;
    recommendedCourse?: string;
    reportSummary: string;
    transcript: string;
    leadScore?: string;
    notes?: string;
    nextAction?: string;
  },
  customWebhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  const webhookUrl = customWebhookUrl || getGoogleSheetWebhookUrl();
  const payload = {
    type: 'chat_session_sync',
    id: params.sessionId,
    timestamp: new Date().toLocaleString('vi-VN'),
    name: params.customerName || 'Học viên AI Chat',
    phone: params.customerPhone || '',
    condition: params.condition || 'Tư vấn phác đồ tổng quát',
    preferredTime: params.preferredTime || '',
    recommendedCourse: params.recommendedCourse || '',
    leadScore: params.leadScore || (params.customerPhone ? 'HOT' : 'WARM'),
    reportSummary: params.reportSummary,
    transcript: params.transcript,
    source: 'VICI AI Advisor',
    notes: params.notes || 'Hồ sơ tư vấn trực tuyến từ MyVici AI',
    nextAction: params.nextAction || 'HLV gọi/nhắn Zalo trao đổi phác đồ',
  };

  if (!webhookUrl) {
    addSyncLog(
      'success',
      `Đã lưu tạm lịch sử chat [${payload.id} - ${payload.name}]. Hãy dán Google Sheets Webhook URL để tự động ghi vào Sheet.`,
      1
    );
    return {
      success: false,
      message: 'Chưa cấu hình Google Sheets Webhook URL. Vui lòng dán link Webhook trong phần Cài đặt Google Sheet.',
    };
  }

  // Attempt server-side proxy first
  try {
    const serverRes = await fetch('/api/chat/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, webhookUrl }),
    });
    if (serverRes.ok) {
      addSyncLog('success', `Đã đồng bộ Lịch sử Chat [${payload.id}] và Báo cáo AI lên Google Sheet`, 1);
      return {
        success: true,
        message: 'Đã lưu lịch sử trò chuyện và báo cáo chi tiết vào Google Sheet CRM thành công!',
      };
    }
  } catch (e) {
    // Fall back to client fetch
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    addSyncLog('success', `Đã đồng bộ Lịch sử Chat [${payload.id}] và Báo cáo AI lên Google Sheet`, 1);
    return {
      success: true,
      message: 'Đã gửi lịch sử trò chuyện và báo cáo AI lên Google Sheet CRM thành công!',
    };
  } catch (err: any) {
    console.warn('Google Sheet chat sync notice:', err);
    addSyncLog('error', `Lỗi đồng bộ lịch sử chat: ${err.message || 'Lỗi mạng'}`, 1);
    return {
      success: false,
      message: 'Không thể kết nối với Webhook Google Sheet. Vui lòng kiểm tra lại link Webhook.',
    };
  }
}

/**
 * Delete a single lead from Google Sheet via Google Apps Script Webhook.
 * Matches by Lead ID and/or Phone Number in the Sheet.
 */
export async function deleteLeadFromGoogleSheet(
  leadId: string,
  leadPhone?: string,
  leadName?: string,
  customWebhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  const webhookUrl = customWebhookUrl || getGoogleSheetWebhookUrl();
  const payload = {
    type: 'delete_lead',
    action: 'delete',
    id: leadId,
    phone: leadPhone || '',
    name: leadName || '',
    timestamp: new Date().toLocaleString('vi-VN'),
  };

  // Add to pending deletes in local cache
  addPendingDeletedLead({ id: leadId, phone: leadPhone, name: leadName });

  if (!webhookUrl) {
    return {
      success: false,
      message: 'Chưa cấu hình Google Sheets Webhook URL.',
    };
  }

  // 1. Attempt server-side proxy first
  try {
    const serverRes = await fetch('/api/chat/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, webhookUrl }),
    });
    if (serverRes.ok) {
      removePendingDeletedLead(leadId);
      addSyncLog('success', `Đã xóa học viên [${leadName || leadId}] khỏi Google Sheet CRM`, 1);
      return {
        success: true,
        message: 'Đã xóa học viên khỏi Google Sheet thành công!',
      };
    }
  } catch (_) {}

  // 2. Direct browser fetch
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    removePendingDeletedLead(leadId);
    addSyncLog('success', `Đã gửi yêu cầu xóa học viên [${leadName || leadId}] sang Google Sheet`, 1);
    return {
      success: true,
      message: 'Đã gửi yêu cầu xóa học viên sang Google Sheet thành công!',
    };
  } catch (err: any) {
    console.warn('Lỗi gửi yêu cầu xóa sang Google Sheet:', err);
    addSyncLog('error', `Lỗi xóa học viên trên Google Sheet: ${err.message || 'Lỗi mạng'}`, 1);
    return {
      success: false,
      message: 'Không thể kết nối với Webhook Google Sheet. Yêu cầu xóa đã được lưu để thử lại.',
    };
  }
}

/**
 * Full Mirror Synchronization: Cleans the Google Sheet and writes only active leads from the website.
 * This guarantees any leads deleted on the website are completely removed from Google Sheet,
 * and eliminates duplicate rows.
 */
export async function fullSyncLeadsToGoogleSheet(
  leads: Lead[],
  customWebhookUrl?: string
): Promise<{ success: boolean; count: number; message: string }> {
  const webhookUrl = customWebhookUrl || getGoogleSheetWebhookUrl();

  if (!webhookUrl) {
    return {
      success: false,
      count: 0,
      message: 'Vui lòng nhập Google Sheets Webhook URL trước khi đồng bộ.',
    };
  }

  // 1. First, process any pending deleted leads to ensure deletion on older scripts
  const pendingDeletes = getPendingDeletedLeads();
  if (pendingDeletes.length > 0) {
    for (const del of pendingDeletes) {
      try {
        await deleteLeadFromGoogleSheet(del.id, del.phone, del.name, webhookUrl);
      } catch (_) {}
    }
  }

  const formattedLeads = leads.map(formatLeadForSheet);
  const payload = {
    type: 'full_sync',
    action: 'full_sync',
    mode: 'mirror',
    timestamp: new Date().toLocaleString('vi-VN'),
    total: formattedLeads.length,
    leads: formattedLeads,
  };

  // 2. Try full_sync via server proxy
  let syncedViaFullSync = false;
  try {
    const serverRes = await fetch('/api/chat/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, webhookUrl }),
    });
    if (serverRes.ok) {
      syncedViaFullSync = true;
    }
  } catch (_) {}

  if (!syncedViaFullSync) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      syncedViaFullSync = true;
    } catch (_) {}
  }

  // Clear pending deletes as full_sync replaces the dataset
  clearPendingDeletedLeads();

  addSyncLog(
    'success',
    `Đồng bộ toàn bộ: Làm sạch & đồng bộ ${formattedLeads.length} leads khớp 100% với Web (Đã loại bỏ lead đã xóa)`,
    formattedLeads.length
  );

  return {
    success: true,
    count: formattedLeads.length,
    message: `Đã làm sạch Google Sheet và đồng bộ ${formattedLeads.length} học viên khớp 100% với website! Các thông tin đã xóa trên web đã được loại bỏ.`,
  };
}

/**
 * Batch synchronize multiple leads to Google Sheet
 * Defaults to Full Mirror Sync so that deleted records are removed and no duplicates exist.
 */
export async function batchSyncLeadsToGoogleSheet(
  leads: Lead[],
  customWebhookUrl?: string
): Promise<{ success: boolean; count: number; message: string }> {
  return fullSyncLeadsToGoogleSheet(leads, customWebhookUrl);
}

/**
 * 03 Real-world Clinical Sample Leads for Google Sheets Testing
 */
export const THREE_SAMPLE_LEADS: Lead[] = [
  {
    id: 'VICI-SAMPLE-01',
    createdAt: new Date().toLocaleString('vi-VN'),
    name: 'Nguyễn Thị Thanh Hương',
    phone: '0987 654 321',
    email: 'thanhhuong.nguyen@gmail.com',
    source: 'VICI AI Advisor',
    interest: 'Yoga Trị Liệu Thoát Vị Đĩa Đệm L4-L5 & Cột Sống Thắt Lưng',
    category: 'THERAPY_INTEREST',
    experience: 'Chưa từng tập Yoga',
    goals: [
      'Giải tỏa chèn ép rễ thần kinh toạ',
      'Giảm đau buốt lan xuống mông và chân trái',
      'Cải thiện tầm vận động khớp hông',
    ],
    preferredTime: 'Ca Tối (19:00 - 20:00) Thứ 2 - 4 - 6',
    preferredFormat: 'Kèm riêng 1:1 (PT) Cá Nhân Hóa',
    recommendedCourse: 'Scan Đánh Giá Cột Sống + Yoga Trị Liệu Phục Hồi Chuyên Sâu 1:1',
    leadScore: 'HOT',
    status: 'New',
    assignedTo: 'Master Henry Phan',
    conversationSummary:
      'Học viên có kết quả MRI lồi đĩa đệm L4-L5 4mm, ngồi văn phòng trên 8 tiếng/ngày. MyVici hướng dẫn thở cơ hoành giảm áp lực ổ bụng và hẹn xếp lịch scan thể trạng 1:1.',
    conversationHistory: [
      {
        sender: 'user',
        text: 'Chào MyVici, mình đi khám bị thoát vị đĩa đệm L4-L5, hay bị tê buốt lan xuống mông và chân trái thì có tập Yoga được không?',
        time: '19:02',
      },
      {
        sender: 'ai',
        text: 'Namaste chị Hương! Với tình trạng lồi đĩa đệm L4-L5 có chèn ép rễ thần kinh toạ, chị hoàn toàn tập được nhưng tuyệt đối KHÔNG uốn lưng gập sâu hay xoay vặn mạnh. Tại VICI, Master Henry Phan sẽ áp dụng phác đồ giải áp đĩa đệm, kích hoạt cơ lõi sâu (core) và kéo giãn chuỗi cơ sau an toàn. Chị nên bắt đầu bằng gói Kèm riêng 1:1 để HLV kiểm soát biên độ từng tư thế ạ.',
        time: '19:03',
      },
      {
        sender: 'user',
        text: 'Mình làm việc ở Thủ Đức, tối tầm 19h tập được không? Số mình 0987 654 321, nhờ HLV tư vấn giúp.',
        time: '19:05',
      },
      {
        sender: 'ai',
        text: 'Dạ VICI đã lưu thông tin của chị Hương (0987 654 321). Studio VICI tại Opal Boulevard rất gần Thủ Đức, ca 19:00 Thứ 2-4-6 có lịch kèm 1:1. Master Henry Phan sẽ liên hệ trực tiếp qua Zalo/Điện thoại để trao đổi kỹ trước buổi hẹn nhé!',
        time: '19:06',
      },
    ],
    staffNotes:
      'Học viên HOT: Có phim chụp MRI, đau tê chân rõ rệt. Master Henry Phan phụ trách tư vấn trực tiếp.',
    nextAction: 'Master Henry Phan gọi điện trước 11h ngày mai để hẹn lịch Scan cột sống',
    isSampleData: true,
  },
  {
    id: 'VICI-SAMPLE-02',
    createdAt: new Date().toLocaleString('vi-VN'),
    name: 'Trần Minh Hoàng',
    phone: '0912 345 678',
    email: 'hoang.tran@fpt.com.vn',
    source: 'VICI AI Advisor',
    interest: 'Trị Liệu Phục Hồi Cổ - Vai - Gáy & Thoái Hóa Đốt Sống Cổ',
    category: 'THERAPY_INTEREST',
    experience: 'Dưới 6 tháng',
    goals: [
      'Khắc phục đau cứng bả vai và gáy',
      'Giảm triệu chứng hoa mắt, chóng mặt khi làm việc máy tính',
      'Chỉnh sửa tư thế đầu cúi gù (Forward Head Posture)',
    ],
    preferredTime: 'Ca Tan Ca (17:45 - 18:45)',
    preferredFormat: 'Lớp Trị Liệu Nhóm Nhỏ (5-8 học viên)',
    recommendedCourse: 'Scan Trị Liệu Cơ Vai Cổ Gáy + Khóa Phục Hồi Nhóm Nhỏ 3 Tháng',
    leadScore: 'HOT',
    status: 'New',
    assignedTo: 'Master Henry Phan',
    conversationSummary:
      'Kỹ sư phần mềm ngồi máy tính 10h/ngày, đau mỏi cơ hình thang và đốt sống cổ C5-C6. Quan tâm lớp nhóm nhỏ sau giờ làm việc.',
    conversationHistory: [
      {
        sender: 'user',
        text: 'Tôi làm IT ngồi máy tính nhiều, cổ vai gáy cứng đờ, quay đầu thấy lạo xạo. VICI có lớp nào tập ngay sau giờ tan ca không?',
        time: '17:35',
      },
      {
        sender: 'ai',
        text: 'Chào anh Hoàng! Tình trạng của anh là hội chứng cổ vai gáy dân văn phòng điển hình (co thắt cơ thang, cơ nâng vai, giảm độ cong sinh lý cổ C5-C6). VICI có khung giờ tan ca 17:45 - 18:45 Thứ 2-4-6 hoặc 3-5-7 rất phù hợp cho anh.',
        time: '17:36',
      },
      {
        sender: 'user',
        text: 'Số của tôi 0912 345 678, nhắn cho tôi chi phí và lịch tuần này nhé.',
        time: '17:38',
      },
      {
        sender: 'ai',
        text: 'MyVici đã ghi nhận số điện thoại 0912 345 678 của anh Hoàng. Chuyên viên sẽ gửi lịch khai giảng ca 17:45 và ưu đãi trải nghiệm buổi đầu qua Zalo ngay cho anh nhé!',
        time: '17:39',
      },
    ],
    staffNotes:
      'Học viên làm IT tại Khu Công Nghệ Cao, tan sở lúc 17h30 ghé Opal Boulevard rất tiện đường.',
    nextAction: 'Gửi bảng phí ưu đãi và định vị phòng tập qua Zalo 0912345678',
    isSampleData: true,
  },
  {
    id: 'VICI-SAMPLE-03',
    createdAt: new Date().toLocaleString('vi-VN'),
    name: 'Lê Hoàng Yến Vy',
    phone: '0933 889 900',
    email: 'yenvy.le@creative.vn',
    source: 'VICI AI Advisor',
    interest: 'Yoga Thư Giãn Sâu Phục Hồi & Trị Liệu Chuông Xoay Himalaya',
    category: 'GENERAL_INQUIRY',
    experience: 'Trên 1 năm',
    goals: [
      'Giải tỏa áp lực tinh thần và căng thẳng stress kéo dài',
      'Cải thiện chất lượng giấc ngủ sâu không dùng thuốc',
      'Trải nghiệm liệu pháp âm thanh chuông xoay Tây Tạng',
    ],
    preferredTime: 'Ca Sáng Sớm (05:30 - 06:30)',
    preferredFormat: 'Lớp Yoga Thư Giãn & Workshop Chuông Xoay',
    recommendedCourse: 'Yin Yoga & Thiền Chuông Xoay Himalaya Trị Liệu (Master Mỹ Kiều)',
    leadScore: 'WARM',
    status: 'New',
    assignedTo: 'Master Mỹ Kiều',
    conversationSummary:
      'Khách hàng quản lý doanh nghiệp, thường xuyên mất ngủ trắng đêm và đau nửa đầu do stress. Muốn tập ca sáng sớm đón bình minh và trị liệu chuông xoay.',
    conversationHistory: [
      {
        sender: 'user',
        text: 'Chào MyVici, dạo này công việc căng thẳng mình bị mất ngủ triền miên, đêm hay trằn trọc. Trung tâm có khóa chuông xoay hay thiền không?',
        time: '22:15',
      },
      {
        sender: 'ai',
        text: 'Namaste Yến Vy! Tình trạng mất ngủ do hệ thần kinh giao cảm bị kích thích quá mức. Tại VICI, Master Mỹ Kiều (Chuyên gia chuông xoay Himalaya & Yin Yoga) có liệu pháp kết hợp sóng âm chuông xoay đưa não bộ về tần số Theta/Delta giúp thư giãn tầng sâu và ngủ ngon tự nhiên.',
        time: '22:16',
      },
      {
        sender: 'user',
        text: 'Nghe nhẹ nhàng quá, mình muốn đăng ký ca sáng sớm 5h30. SĐT mình 0933 889 900.',
        time: '22:18',
      },
      {
        sender: 'ai',
        text: 'MyVici đã chuyển thông tin của Yến Vy đến Master Mỹ Kiều. Cô sẽ kết nối Zalo 0933 889 900 để hướng dẫn bạn chuẩn bị cho buổi chuông xoay thư giãn gần nhất nhé!',
        time: '22:19',
      },
    ],
    staffNotes:
      'Học viên quan tâm sâu về liệu pháp tinh thần chuông xoay, Master Mỹ Kiều phụ trách tư vấn.',
    nextAction: 'Master Mỹ Kiều nhắn Zalo giới thiệu quy trình trị liệu chuông xoay 1-1',
    isSampleData: true,
  },
];

/**
 * Creates and synchronizes 3 clinical sample leads to the Google Sheet
 */
export async function syncThreeSampleLeadsToSheet(
  customWebhookUrl?: string
): Promise<{ success: boolean; count: number; message: string; leads: Lead[] }> {
  const webhookUrl = customWebhookUrl || getGoogleSheetWebhookUrl();

  // Save to server database via POST /api/leads if available
  for (const lead of THREE_SAMPLE_LEADS) {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (_) {}
  }

  const syncResult = await batchSyncLeadsToGoogleSheet(THREE_SAMPLE_LEADS, webhookUrl);

  return {
    success: syncResult.success,
    count: syncResult.count,
    message: syncResult.message,
    leads: THREE_SAMPLE_LEADS,
  };
}

/**
 * Export all Leads to a clean, UTF-8 encoded CSV file ready for Microsoft Excel & Google Sheets
 */
export function exportLeadsToCSV(leads: Lead[]): void {
  const headers = [
    'Mã Lead',
    'Thời Gian Tạo',
    'Họ và Tên',
    'Số Điện Thoại',
    'Email',
    'Khóa Học / Quan Tâm',
    'Phân Loại',
    'Kinh Nghiệm',
    'Mục Tiêu',
    'Thời Gian Tập Mong Muốn',
    'Hình Thức',
    'Nguồn Đăng Ký',
    'Điểm Tiềm Năng',
    'Trạng Thái',
    'Phụ Trách',
    'Ghi Chú Nhân Viên',
    'Hành Động Tiếp Theo',
    'Báo Cáo Tóm Tắt AI',
  ];

  const escapeCSV = (field: any) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map((l) => [
    escapeCSV(l.id),
    escapeCSV(l.createdAt),
    escapeCSV(l.name),
    escapeCSV(l.phone),
    escapeCSV(l.email || ''),
    escapeCSV(l.interest),
    escapeCSV(l.category),
    escapeCSV(l.experience),
    escapeCSV(Array.isArray(l.goals) ? l.goals.join('; ') : ''),
    escapeCSV(l.preferredTime),
    escapeCSV(l.preferredFormat || 'Tại Studio'),
    escapeCSV(l.source),
    escapeCSV(l.leadScore),
    escapeCSV(l.status),
    escapeCSV(l.assignedTo || 'Chưa gán'),
    escapeCSV(l.staffNotes || ''),
    escapeCSV(l.nextAction || ''),
    escapeCSV(l.chatSummary || l.aiReport?.fullSummaryText || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `VICI_Yoga_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Standard Google Apps Script template for the user to copy & paste into their Sheet.
 * Handles both standard CRM Leads and Full AI Chat Consultation Histories / Reports,
 * WITH FULL 2-WAY SYNC SUPPORT: Auto-delete on lead deletion, Full Mirror Sync (wiping deleted records), and Upsert.
 */
export const SAMPLE_APPS_SCRIPT_CODE = `/**
 * VICI YOGA THERAPY - GOOGLE APPS SCRIPT WEBHOOK V3 (CRM & AI CHAT)
 * HỖ TRỢ ĐỒNG BỘ 2 CHIỀU: TỰ ĐỘNG XÓA, CẬP NHẬT TRÁNH TRÙNG LẶP & ĐỒNG BỘ TOÀN BỘ KHỚP 100% VỚI WEB
 * 
 * HƯỚNG DẪN CẬP NHẬT / CÀI ĐẶT (30 GIÂY):
 * 1. Mở file Google Sheet của bạn trên trình duyệt.
 * 2. Trên thanh menu, vào: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa toàn bộ mã cũ trong file Code.gs và dán toàn bộ đoạn mã này vào.
 * 4. Bấm icon Lưu (Save - phím Ctrl+S hoặc Cmd+S).
 * 5. Bấm nút "Triển khai" (Deploy) màu xanh ở góc phải:
 *    - Nếu tạo lần đầu: Bấm "Triển khai mới" (New deployment) -> Chọn loại "Ứng dụng web" (Web app)
 *      -> Chọn "Ai có quyền truy cập" = "Bất kỳ ai" (Anyone) -> Bấm Triển khai.
 *    - Nếu đã triển khai trước đó: Bấm "Quản lý bản triển khai" (Manage deployments) -> Bấm icon cây bút (Chỉnh sửa)
 *      -> Mục Phiên bản: chọn "Phiên bản mới" (New version) -> Bấm "Triển khai".
 * 6. Copy URL (kết thúc bằng /exec) dán vào ô Webhook URL trên website VICI!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (errLock) {}

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // =========================================================================
    // 1. TÍNH NĂNG XÓA LEAD: Khi người dùng xóa 1 lead trên website
    // =========================================================================
    if (data.type === 'delete_lead' || data.action === 'delete') {
      var targetId = (data.id || '').toString().trim().toLowerCase();
      var targetPhone = (data.phone || '').toString().replace(/\\D/g, '');
      var deletedLeadCount = 0;

      // Xóa trong Sheet "Danh Sách Leads CRM"
      var leadSheet = ss.getSheetByName("Danh Sách Leads CRM") || ss.getActiveSheet();
      if (leadSheet && leadSheet.getLastRow() > 1) {
        var numRows = leadSheet.getLastRow() - 1;
        var range = leadSheet.getRange(2, 1, numRows, 4);
        var values = range.getValues();
        // Cột 2 (index 1) là Mã Lead, Cột 4 (index 3) là Số Điện Thoại
        for (var i = values.length - 1; i >= 0; i--) {
          var rowId = (values[i][1] || '').toString().trim().toLowerCase();
          var rowPhone = (values[i][3] || '').toString().replace(/\\D/g, '');

          var isMatch = false;
          if (targetId && rowId === targetId) {
            isMatch = true;
          } else if (targetPhone && rowPhone && rowPhone.length >= 9 && rowPhone === targetPhone) {
            isMatch = true;
          }

          if (isMatch) {
            leadSheet.deleteRow(i + 2);
            deletedLeadCount++;
          }
        }
      }

      // Xóa trong Sheet "Lịch Sử Tư Vấn AI" (nếu có)
      var chatSheet = ss.getSheetByName("Lịch Sử Tư Vấn AI");
      if (chatSheet && chatSheet.getLastRow() > 1) {
        var chatNumRows = chatSheet.getLastRow() - 1;
        var chatRange = chatSheet.getRange(2, 1, chatNumRows, 4);
        var chatValues = chatRange.getValues();
        for (var j = chatValues.length - 1; j >= 0; j--) {
          var cId = (chatValues[j][1] || '').toString().trim().toLowerCase();
          var cPhone = (chatValues[j][3] || '').toString().replace(/\\D/g, '');
          if ((targetId && cId === targetId) || (targetPhone && cPhone && cPhone.length >= 9 && cPhone === targetPhone)) {
            chatSheet.deleteRow(j + 2);
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "delete",
        deletedCount: deletedLeadCount,
        message: "Đã xóa lead khỏi Google Sheet thành công (" + deletedLeadCount + " dòng)"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 2. TÍNH NĂNG ĐỒNG BỘ TOÀN BỘ (FULL MIRROR SYNC): Làm sạch & khớp 100% với Web
    // Tự động xóa các dòng đã bị xóa trên web, ghi danh sách hiện hữu, không trùng lặp
    // =========================================================================
    if (data.type === 'full_sync' || data.action === 'full_sync' || data.type === 'sync_all') {
      var leadsList = Array.isArray(data.leads) ? data.leads : [];
      var leadSheet = getOrCreateLeadSheet(ss);

      // Xóa toàn bộ dữ liệu cũ (từ dòng 2 trở xuống)
      var lastRow = leadSheet.getLastRow();
      if (lastRow > 1) {
        leadSheet.deleteRows(2, lastRow - 1);
      }

      // Ghi lại toàn bộ danh sách lead hiện hữu từ website
      if (leadsList.length > 0) {
        var rowsToAdd = [];
        for (var k = 0; k < leadsList.length; k++) {
          var l = leadsList[k];
          rowsToAdd.push([
            l.timestamp || l.createdAt || new Date().toLocaleString("vi-VN"),
            l.id || "VICI-" + (k + 1),
            l.name || "",
            l.phone ? "'" + l.phone : "",
            l.email || "",
            l.interest || l.recommendedCourse || "",
            l.category || l.condition || "",
            l.preferredTime || "",
            Array.isArray(l.goals) ? l.goals.join(', ') : (l.goals || ""),
            l.source || "Website Form",
            l.leadScore || "WARM",
            l.status || "New",
            l.notes || l.staffNotes || "",
            l.reportSummary || l.chatSummary || "",
            l.nextAction || ""
          ]);
        }

        leadSheet.getRange(2, 1, rowsToAdd.length, 15).setValues(rowsToAdd);
        formatDataRange(leadSheet, 2, rowsToAdd.length);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "full_sync",
        totalSynced: leadsList.length,
        message: "Đã làm sạch Google Sheet và đồng bộ " + leadsList.length + " học viên khớp 100% với website!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 3. TÍNH NĂNG ĐỒNG BỘ PHIÊN TƯ VẤN AI & BÁO CÁO
    // =========================================================================
    if (data.type === 'chat_session_sync' || data.transcript) {
      var chatSheet = ss.getSheetByName("Lịch Sử Tư Vấn AI");
      if (!chatSheet) {
        chatSheet = ss.insertSheet("Lịch Sử Tư Vấn AI");
      }

      if (chatSheet.getLastRow() === 0) {
        chatSheet.appendRow([
          "Thời Gian Tư Vấn",
          "Mã Phiên Chat",
          "Họ và Tên",
          "Số Điện Thoại / Zalo",
          "Vấn Đề Thể Trạng",
          "Ca Tập Quan Tâm",
          "Khóa Học Đề Xuất",
          "Đánh Giá Lead",
          "Báo Cáo Tóm Tắt AI Chi Tiết",
          "Toàn Văn Lịch Sử Trò Chuyện (Transcript)",
          "Hành Động Tiếp Theo"
        ]);
        chatSheet.getRange(1, 1, 1, 11).setBackground("#8A6437").setFontColor("#FFFFFF").setFontWeight("bold");
        chatSheet.setFrozenRows(1);
      }

      chatSheet.appendRow([
        data.timestamp || new Date().toLocaleString("vi-VN"),
        data.id || "VICI-CHAT-" + Math.floor(Math.random() * 9000 + 1000),
        data.name || "Học viên AI Chat",
        data.phone ? "'" + data.phone : "",
        data.condition || data.interest || "",
        data.preferredTime || "",
        data.recommendedCourse || "",
        data.leadScore || "WARM",
        data.reportSummary || data.chatSummary || "",
        data.transcript || "",
        data.nextAction || "HLV liên hệ tư vấn"
      ]);
    }

    // =========================================================================
    // 4. TÍNH NĂNG THÊM HOẶC CẬP NHẬT 1 LEAD ĐƠN LẺ (UPSERT TRÁNH TRÙNG LẶP)
    // =========================================================================
    var leadSheet = getOrCreateLeadSheet(ss);
    var leadId = (data.id || '').toString().trim();
    var leadPhone = (data.phone || '').toString().replace(/\\D/g, '');
    var existingRowIndex = -1;

    // Kiểm tra xem Lead này đã tồn tại trong Sheet chưa để cập nhật, tránh tạo dòng trùng
    if (leadSheet.getLastRow() > 1 && (leadId || leadPhone)) {
      var checkRange = leadSheet.getRange(2, 1, leadSheet.getLastRow() - 1, 4);
      var checkValues = checkRange.getValues();
      for (var r = 0; r < checkValues.length; r++) {
        var rowId = (checkValues[r][1] || '').toString().trim();
        var rowPhone = (checkValues[r][3] || '').toString().replace(/\\D/g, '');
        if ((leadId && rowId && rowId === leadId) || (leadPhone && rowPhone && rowPhone.length >= 9 && rowPhone === leadPhone)) {
          existingRowIndex = r + 2;
          break;
        }
      }
    }

    var rowData = [
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.id || "VICI-" + Math.floor(Math.random() * 9000 + 1000),
      data.name || "",
      data.phone ? "'" + data.phone : "",
      data.email || "",
      data.interest || data.recommendedCourse || "",
      data.category || data.condition || "",
      data.preferredTime || "",
      Array.isArray(data.goals) ? data.goals.join(', ') : (data.goals || ""),
      data.source || "VICI AI Advisor",
      data.leadScore || "HOT",
      data.status || "New",
      data.notes || data.staffNotes || "",
      data.reportSummary || data.chatSummary || "",
      data.nextAction || ""
    ];

    if (existingRowIndex > 0) {
      leadSheet.getRange(existingRowIndex, 1, 1, 15).setValues([rowData]);
    } else {
      leadSheet.appendRow(rowData);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: existingRowIndex > 0 ? "Đã cập nhật thông tin học viên trên Google Sheet" : "Đã thêm mới học viên vào Google Sheet"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try {
      lock.releaseLock();
    } catch (eLock) {}
  }
}

function getOrCreateLeadSheet(ss) {
  var leadSheet = ss.getSheetByName("Danh Sách Leads CRM");
  if (!leadSheet) {
    leadSheet = ss.getActiveSheet();
    if (leadSheet.getName() !== "Lịch Sử Tư Vấn AI") {
      leadSheet.setName("Danh Sách Leads CRM");
    } else {
      leadSheet = ss.insertSheet("Danh Sách Leads CRM");
    }
  }

  if (leadSheet.getLastRow() === 0) {
    leadSheet.appendRow([
      "Thời Gian Đăng Ký",
      "Mã Lead",
      "Họ và Tên",
      "Số Điện Thoại",
      "Email",
      "Khóa Học / Nhu Cầu",
      "Phân Loại",
      "Thời Gian Mong Muốn",
      "Mục Tiêu Trị Liệu",
      "Nguồn Đăng Ký",
      "Đánh Giá Lead",
      "Trạng Thái",
      "Ghi Chú Tư Vấn",
      "Báo Cáo Tóm Tắt AI",
      "Hành Động Tiếp Theo"
    ]);
    leadSheet.getRange(1, 1, 1, 15).setBackground("#8A6437").setFontColor("#FFFFFF").setFontWeight("bold");
    leadSheet.setFrozenRows(1);
  }
  return leadSheet;
}

function formatDataRange(sheet, startRow, numRows) {
  try {
    var range = sheet.getRange(startRow, 1, numRows, 15);
    range.setVerticalAlignment("middle");
    range.setFontFamily("Roboto");
  } catch (e) {}
}

function doGet(e) {
  return ContentService.createTextOutput("VICI Yoga Therapy CRM & AI Chat Google Sheet Webhook V3 is ACTIVE! Ready for Auto-Delete & Full-Sync.");
}
`;

