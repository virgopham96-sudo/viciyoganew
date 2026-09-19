/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/health
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;
  const hasGeminiKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel_serverless' : 'node_server',
    timestamp: new Date().toISOString(),
    geminiAvailable: hasGeminiKey,
    hasApiKeyConfigured: hasGeminiKey,
    configuredKeyName: process.env.GEMINI_API_KEY
      ? 'GEMINI_API_KEY'
      : process.env.VITE_GEMINI_API_KEY
      ? 'VITE_GEMINI_API_KEY'
      : process.env.GOOGLE_API_KEY
      ? 'GOOGLE_API_KEY'
      : null,
    notice: hasGeminiKey
      ? 'Gemini AI API Key đã được thiết lập thành công.'
      : 'Chưa cấu hình GEMINI_API_KEY trong Environment Variables. Vui lòng thêm trong Vercel Settings.'
  });
}
