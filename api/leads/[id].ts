/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Dynamic Route: /api/leads/[id]
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import leadsHandler from '../leads';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return leadsHandler(req, res);
}
