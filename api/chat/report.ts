/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/chat/report
 * Generates clinical consultation intake and analysis report for trainers and CRM.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateConsultationReport } from '../../src/services/aiAdvisorService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }

    const { messages, customerInfo } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Cần cung cấp danh sách tin nhắn để lập báo cáo' });
    }

    const report = await generateConsultationReport(messages, customerInfo);

    return res.status(200).json({
      success: true,
      report
    });
  } catch (err: any) {
    console.error('Lỗi tạo báo cáo trên Vercel:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi tạo báo cáo tư vấn'
    });
  }
}
