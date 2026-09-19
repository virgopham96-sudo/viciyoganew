/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Floating Zalo Contact Widget for Web Version.
 * Connects visitors directly with VICI Yoga Therapy Center on Zalo.
 */

import React, { useState } from 'react';
import ZaloIcon from './ZaloIcon';
import { VICI_INFO } from '../data/viciData';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingZaloWidget() {
  const [isHovered, setIsHovered] = useState(false);
  const rawPhone = VICI_INFO.hotline.replace(/\s/g, '');
  const zaloUrl = `https://zalo.me/${rawPhone}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      <a
        id="web-floating-zalo-btn"
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-white hover:bg-blue-50/90 text-[#0068FF] shadow-xl hover:shadow-2xl border border-blue-200/80 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label={`Chat Zalo với VICI (${VICI_INFO.hotline})`}
      >
        {/* Animated pulse rings */}
        <span className="absolute -inset-1 rounded-full bg-blue-400/25 animate-ping pointer-events-none opacity-75" />
        
        {/* Zalo Icon */}
        <div className="relative shrink-0 flex items-center justify-center">
          <ZaloIcon size={28} className="drop-shadow-xs" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Text Details */}
        <div className="flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#0068FF]">
              Chat Zalo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-[#1e293b] group-hover:text-[#0068FF] transition-colors">
            {VICI_INFO.hotline}
          </span>
        </div>
      </a>
    </div>
  );
}
