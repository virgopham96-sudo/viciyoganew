/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Floating Right Actions:
 * Consolidates "Liên hệ Zalo" and "Hỏi MyVici" into a unified right-hand floating dock.
 */

import React from 'react';
import ZaloIcon from './ZaloIcon';
import { VICI_INFO } from '../data/viciData';
import { Sparkles } from 'lucide-react';

interface FloatingRightActionsProps {
  onOpenAIChat: () => void;
}

export default function FloatingRightActions({ onOpenAIChat }: FloatingRightActionsProps) {
  const rawPhone = VICI_INFO.hotline.replace(/\s/g, '');
  const zaloUrl = `https://zalo.me/${rawPhone}`;

  return (
    <div
      id="floating-right-actions-container"
      className="hidden lg:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3 pointer-events-none"
    >
      {/* 1. Liên hệ Zalo */}
      <a
        id="floating-right-zalo-btn"
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white hover:bg-blue-50 text-[#0068FF] shadow-lg hover:shadow-xl border border-blue-200/90 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={`Chat Zalo với VICI (${VICI_INFO.hotline})`}
      >
        {/* Animated pulse ring */}
        <span className="absolute -inset-0.5 rounded-full bg-blue-400/20 animate-ping pointer-events-none opacity-60" />

        <div className="relative shrink-0 flex items-center justify-center">
          <ZaloIcon size={24} className="drop-shadow-xs sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="flex flex-col text-left pr-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] sm:text-[11px] uppercase tracking-wider font-extrabold text-[#0068FF] leading-tight">
              Liên hệ Zalo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-[#1e293b] group-hover:text-[#0068FF] transition-colors leading-tight">
            {VICI_INFO.hotline}
          </span>
        </div>
      </a>

      {/* 2. Hỏi MyVici (AI) */}
      <button
        id="floating-right-ai-btn"
        type="button"
        onClick={onOpenAIChat}
        className="pointer-events-auto group relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4.5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#8A6437] via-[#9B6E32] to-[#B87A14] hover:from-[#75542C] hover:to-[#A06910] text-white shadow-xl hover:shadow-2xl border border-amber-300/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Hỏi MyVici AI Trợ lý tư vấn phục hồi"
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#F7DF94] group-hover:rotate-12 transition-transform drop-shadow-xs" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
        </div>

        <div className="flex flex-col text-left pr-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-xs font-bold text-white tracking-wide leading-tight">
              Hỏi MyVici
            </span>
            <span className="text-[9px] bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded-full font-medium border border-amber-400/30">
              AI 24/7
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-amber-100/90 font-medium leading-tight">
            Tư vấn phục hồi & liệu trình
          </span>
        </div>
      </button>
    </div>
  );
}
