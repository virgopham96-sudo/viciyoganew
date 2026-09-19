/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/chat/sync-sheet
 * Proxies Google Sheets webhook synchronization to prevent client-side CORS issues.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    const { payload, webhookUrl } = body || {};

    if (!webhookUrl || typeof webhookUrl !== 'string' || !webhookUrl.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp Google Sheets Webhook URL'
      });
    }

    const fetchResponse = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({
      success: true,
      statusCode: fetchResponse.status
    });
  } catch (err: any) {
    console.error('Lỗi sync Google Sheet qua Vercel:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi đồng bộ Google Sheets'
    });
  }
}
