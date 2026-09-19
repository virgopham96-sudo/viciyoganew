/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/leads
 * Handles persistent lead capture, conversation transcript storage, JSON backup and restore.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

let leadsStore: any[] = [
  {
    id: 'VICI-LEAD-101',
    createdAt: '2026-09-12 14:35',
    name: 'Nguyễn Thị Mai Lan',
    phone: '0912 345 678',
    email: 'mailan.nguyen@gmail.com',
    source: 'VICI AI Chatbot',
    interest: 'Trị liệu Cơ - Vai - Cổ - Gáy',
    category: 'THERAPY_INTEREST',
    experience: 'Dưới 6 tháng',
    goals: ['Giảm đau vai gáy', 'Cải thiện giấc ngủ', 'Chỉnh dáng ngồi văn phòng'],
    preferredTime: 'Tối (17:45 - 19:00)',
    preferredFormat: 'Trực tiếp tại Studio',
    recommendedCourse: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy + Gói 3 Tháng',
    leadScore: 'HOT',
    status: 'New',
    assignedTo: 'Master Mỹ Kiều',
    conversationSummary: 'Khách hàng làm lập trình viên, đau mỏi bả vai và cổ nhiều tháng nay do ngồi máy tính liên tục.',
    conversationHistory: [
      { sender: 'user', text: 'Chào VICI, mình bị đau cổ vai gáy mấy tháng nay rất khó chịu, nhờ tư vấn giúp', time: '14:30' },
      { sender: 'ai', text: 'Xin chào chị Mai Lan. VICI rất đồng cảm với tình trạng căng cứng cổ vai gáy của chị.', time: '14:31' }
    ],
    staffNotes: 'Khách có dấu hiệu mỏi cơ bả vai do ngồi máy tính nhiều. Đã đặt lịch sơ bộ chiều Thứ 3.',
    nextAction: 'Gọi xác nhận lịch hẹn Scan 1-1 lúc 18:00 Thứ 3',
    isSampleData: true
  },
  {
    id: 'VICI-LEAD-102',
    createdAt: '2026-09-12 11:20',
    name: 'Trần Minh Quang',
    phone: '0988 765 432',
    email: 'quang.tran@techcorp.vn',
    source: 'Website Form',
    interest: 'Khóa Yoga Nâng Cao Ashtanga (10 chuyên đề)',
    category: 'ADVANCED',
    experience: 'Trên 1 năm',
    goals: ['Chinh phục Handstand an toàn', 'Mở khớp hông và lưng trên'],
    preferredTime: 'Chiều Thứ 3 - Thứ 5 (14:00 - 15:30)',
    preferredFormat: 'Trực tiếp tại Studio',
    recommendedCourse: 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 buổi)',
    leadScore: 'HOT',
    status: 'Contacted',
    assignedTo: 'Master Henry Phan',
    conversationSummary: 'Đã tập Yoga được 2 năm, muốn theo học trực tiếp cùng Thầy Henry để căn chỉnh kỹ thuật.',
    conversationHistory: [],
    staffNotes: 'Đã gọi điện trao đổi, khách rất hào hứng với 10 chuyên đề của Thầy Henry.',
    nextAction: 'Gửi thông tin xác nhận chuyển khoản và vị trí phòng tập Opal Boulevard',
    isSampleData: true
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action as string;

  // Backup Export Action
  if (req.method === 'GET' && action === 'backup') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=vici-crm-leads-backup-${new Date().toISOString().slice(0,10)}.json`);
    return res.status(200).json({
      version: '1.0',
      system: 'VICI Lead Management CRM',
      exportedAt: new Date().toISOString(),
      totalLeads: leadsStore.length,
      leads: leadsStore
    });
  }

  // GET: Fetch all leads
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      leads: leadsStore,
      total: leadsStore.length
    });
  }

  // Restore Action
  if (req.method === 'POST' && (action === 'restore' || req.body?.action === 'restore')) {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }

    const { leads, data, mode = 'merge' } = body || {};
    const items = leads || data || (Array.isArray(body) ? body : body?.leads);

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu JSON sao lưu không hợp lệ' });
    }

    const validLeads = items.filter((l: any) => l && l.name && l.phone);
    if (mode === 'replace') {
      leadsStore = validLeads;
    } else {
      for (const item of validLeads) {
        const cleanPhone = item.phone.replace(/[\s.-]/g, '');
        const idx = leadsStore.findIndex((l) => l.phone.replace(/[\s.-]/g, '') === cleanPhone || l.id === item.id);
        if (idx !== -1) {
          leadsStore[idx] = { ...leadsStore[idx], ...item };
        } else {
          leadsStore.unshift(item);
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: leadsStore.length,
      total: leadsStore.length,
      leads: leadsStore,
      message: `Đã khôi phục thành công ${validLeads.length} hồ sơ vào hệ thống CRM.`
    });
  }

  // POST: Create or Update lead with full conversation
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }

    const {
      name,
      phone,
      email,
      source = 'Website Lead Form',
      interest = 'Tư vấn chung',
      category = 'GENERAL_INQUIRY',
      experience = 'Chưa tập bao giờ',
      goals = [],
      preferredTime = 'Chưa xác định',
      preferredFormat = 'Trực tiếp tại Studio',
      recommendedCourse,
      leadScore = 'WARM',
      conversationSummary = '',
      chatSummary = '',
      aiReport,
      conversationHistory = [],
      staffNotes,
      nextAction
    } = body || {};

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Tên và Số điện thoại là bắt buộc' });
    }

    const cleanPhone = phone.trim().replace(/[\s.-]/g, '');
    const existingIndex = leadsStore.findIndex((l) => l.phone.replace(/[\s.-]/g, '') === cleanPhone);

    if (existingIndex !== -1) {
      const existing = leadsStore[existingIndex];
      const updated = {
        ...existing,
        name: name.trim(),
        email: email ? email.trim() : existing.email,
        interest: interest || existing.interest,
        preferredTime: preferredTime || existing.preferredTime,
        conversationSummary: conversationSummary || chatSummary || existing.conversationSummary,
        chatSummary: chatSummary || conversationSummary || existing.chatSummary,
        aiReport: aiReport || existing.aiReport,
        conversationHistory: conversationHistory.length > 0 ? conversationHistory : existing.conversationHistory,
        leadScore: 'HOT',
        staffNotes: staffNotes ? `${existing.staffNotes || ''}\n[Cập nhật]: ${staffNotes}`.trim() : existing.staffNotes,
        nextAction: nextAction || existing.nextAction
      };
      leadsStore[existingIndex] = updated;
      return res.status(200).json({ success: true, lead: updated, message: 'Đã cập nhật hồ sơ lead' });
    }

    const newLead = {
      id: `VICI-LEAD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      source,
      interest,
      category,
      experience,
      goals,
      preferredTime,
      preferredFormat,
      recommendedCourse: recommendedCourse || 'Khóa Yoga Phục Hồi & Trị Liệu Cơ Bản',
      leadScore,
      status: 'New',
      assignedTo: (interest || '').toLowerCase().includes('hlv') ? 'Master Henry Phan' : 'Master Mỹ Kiều',
      conversationSummary: conversationSummary || chatSummary,
      chatSummary: chatSummary || conversationSummary,
      aiReport,
      conversationHistory,
      staffNotes: staffNotes || 'Khách hàng mới gửi thông tin từ AI Chatbot',
      nextAction: nextAction || 'Gọi điện thoại hoặc nhắn Zalo tư vấn sơ bộ trong 24h',
      isSampleData: false
    };

    leadsStore = [newLead, ...leadsStore];

    return res.status(201).json({
      success: true,
      lead: newLead,
      message: 'Tạo Lead thành công'
    });
  }

  // PATCH: Update lead
  if (req.method === 'PATCH') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }

    const id = (req.query.id as string) || body?.id;
    const leadIndex = leadsStore.findIndex((l) => l.id === id);

    if (leadIndex === -1) {
      return res.status(404).json({ success: false, error: 'Lead không tồn tại' });
    }

    const { status, staffNotes, nextAction, assignedTo, leadScore } = body || {};
    leadsStore[leadIndex] = {
      ...leadsStore[leadIndex],
      ...(status ? { status } : {}),
      ...(staffNotes !== undefined ? { staffNotes } : {}),
      ...(nextAction !== undefined ? { nextAction } : {}),
      ...(assignedTo ? { assignedTo } : {}),
      ...(leadScore ? { leadScore } : {})
    };

    return res.status(200).json({
      success: true,
      lead: leadsStore[leadIndex]
    });
  }

  // DELETE: Remove lead by id
  if (req.method === 'DELETE') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }

    const id = (req.query.id as string) || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Mã lead (id) là bắt buộc' });
    }

    const prevLength = leadsStore.length;
    leadsStore = leadsStore.filter((l) => l.id !== id);

    if (leadsStore.length === prevLength) {
      return res.status(404).json({ success: false, error: 'Lead không tồn tại' });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa thông tin lead thành công',
      deletedId: id
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
