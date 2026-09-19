/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/chat
 * Provides dynamic Gemini AI advisory for VICI Yoga Therapy on Vercel.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processChatConsultation } from '../src/services/aiAdvisorService';
import { getViciConsultation } from '../src/data/viciAdvisor';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Setup CORS headers for cross-origin or preview deployments
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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

    const message = body?.message;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Tin nhắn không được để trống' });
    }

    const conversationHistory = body?.conversationHistory || body?.history || [];
    
    // Allow adequate time for Gemini to generate response (up to 20s)
    const chatPromise = processChatConsultation(message, conversationHistory);
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

    return res.status(200).json({
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
    console.error('Error handling /api/chat on Vercel:', err);
    // Even in case of error, return high quality consultation so user never encounters errors
    const fallbackReply = req.body?.message ? getViciConsultation(req.body.message) : 'VICI luôn sẵn sàng hỗ trợ bạn.';
    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      source: 'local_expert',
      isAiActive: false
    });
  }
}
