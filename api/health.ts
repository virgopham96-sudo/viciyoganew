/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/health
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasGeminiKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel_serverless' : 'node_server',
    timestamp: new Date().toISOString(),
    geminiAvailable: hasGeminiKey,
    hasApiKeyConfigured: hasGeminiKey,
    notice: hasGeminiKey
      ? 'Gemini AI API Key đã được thiết lập thành công.'
      : 'Chưa cấu hình GEMINI_API_KEY trong Environment Variables. Vui lòng thêm trong Vercel Settings.'
  });
}
