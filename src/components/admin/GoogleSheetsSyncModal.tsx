/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Sheets Integration & Synchronization Panel for VICI Admin CRM.
 */

import { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Download,
  AlertCircle,
  X,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Lead } from '../../types';
import {
  getGoogleSheetWebhookUrl,
  setGoogleSheetWebhookUrl,
  getGoogleSheetViewUrl,
  setGoogleSheetViewUrl,
  syncLeadToGoogleSheet,
  syncChatSessionToGoogleSheet,
  batchSyncLeadsToGoogleSheet,
  fullSyncLeadsToGoogleSheet,
  getPendingDeletedLeads,
  clearPendingDeletedLeads,
  syncThreeSampleLeadsToSheet,
  DEFAULT_GOOGLE_SHEET_WEBHOOK_URL,
  exportLeadsToCSV,
  SAMPLE_APPS_SCRIPT_CODE,
  getSyncLogs,
  getLastSyncTime,
} from '../../services/googleSheetsService';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onLeadsUpdated?: () => void;
}

export default function GoogleSheetsSyncModal({
  isOpen,
  onClose,
  leads,
  onLeadsUpdated,
}: GoogleSheetsSyncModalProps) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [viewUrl, setViewUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [isSyncingSamples, setIsSyncingSamples] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{ time: string; count: number; status: 'success' | 'error'; message: string }>>([]);
  const [pendingDeletes, setPendingDeletes] = useState<Array<{ id: string; phone?: string; name?: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      const url = getGoogleSheetWebhookUrl();
      const view = getGoogleSheetViewUrl();
      setWebhookUrl(url);
      setViewUrl(view);
      setLastSync(getLastSyncTime());
      setLogs(getSyncLogs());
      setPendingDeletes(getPendingDeletedLeads());
      setStatusMessage(null);
      setIsSaved(false);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    setGoogleSheetWebhookUrl(webhookUrl);
    setGoogleSheetViewUrl(viewUrl);
    setIsSaved(true);
    setStatusMessage({
      type: 'success',
      text: webhookUrl.trim()
        ? 'Đã lưu cấu hình Google Sheets Webhook và đường link Google Sheet của CRM!'
        : 'Đã cập nhật cấu hình Google Sheet.',
      link: viewUrl.trim() || undefined,
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SAMPLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestSync = async () => {
    if (!webhookUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Vui lòng dán Webhook URL trước khi bấm thử nghiệm!',
      });
      return;
    }

    setIsTesting(true);
    setStatusMessage(null);

    const sampleLead: Lead = {
      id: `TEST-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString('vi-VN'),
      name: 'Kiểm Tra Đồng Bộ Sheet',
      phone: '0900000000',
      email: 'test.sheet@vici.vn',
      interest: 'Kiểm tra đường truyền Google Sheet',
      category: 'GENERAL_INQUIRY',
      experience: 'Đang kết nối',
      goals: ['Kiểm tra Webhook Apps Script'],
      preferredTime: 'Hiện tại',
      preferredFormat: 'Trực tiếp tại Studio',
      recommendedCourse: 'Tự động kiểm tra',
      source: 'Website Form',
      leadScore: 'WARM',
      status: 'New',
      staffNotes: 'Dòng dữ liệu thử nghiệm từ VICI CRM Admin',
      nextAction: 'Xác nhận kết nối thành công',
    };

    const res = await syncLeadToGoogleSheet(sampleLead, webhookUrl);
    setIsTesting(false);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: 'Gửi dữ liệu thử nghiệm thành công! Hãy mở Google Sheet của bạn để xem dòng mới xuất hiện.',
        link: viewUrl.trim() || undefined,
      });
      setLastSync(new Date().toLocaleString('vi-VN'));
      setLogs(getSyncLogs());
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleTestAISync = async () => {
    if (!webhookUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Vui lòng dán Webhook URL trước khi bấm thử nghiệm!',
      });
      return;
    }

    setIsTestingAI(true);
    setStatusMessage(null);

    const res = await syncChatSessionToGoogleSheet(
      {
        sessionId: `TEST-AI-${Date.now().toString().slice(-4)}`,
        customerName: 'Nguyễn Thu Trang (Học viên Test AI)',
        customerPhone: '0912345678',
        condition: 'Đau mỏi cổ vai gáy do ngồi máy tính nhiều, lệch khớp bả vai',
        preferredTime: 'Ca Tối (19:00 - 20:00)',
        recommendedCourse: 'Yoga Trị Liệu Cổ - Vai - Gáy & Cột Sống',
        leadScore: 'HOT',
        reportSummary:
          'Học viên văn phòng 8h/ngày. Xuất hiện cảm giác co thắt cơ thang và chèn ép nhẹ. Phác đồ đề xuất: Mở rộng khớp vai, tăng tuần hoàn đốt sống cổ C1-C7, thở cơ hoành. Chống chỉ định: Sirsasana (đứng bằng đầu), uốn lưng gấp.',
        transcript:
          'Học viên: Tôi làm việc văn phòng, hay đau mỏi cổ vai gáy thì nên tập lớp nào?\nMyVici: Chào bạn! VICI có lớp Yoga Trị Liệu Phục Hồi Cổ Vai Gáy lúc 19:00 thứ 2-4-6. Bạn để lại SĐT để HLV sắp xếp lịch test thể trạng nhé.\nHọc viên: Số mình 0912345678, liên hệ mình sau giờ làm nhé.',
        notes: 'Phụ trách: Master Henry Phan. Báo cáo tự động từ AI.',
        nextAction: 'HLV liên hệ xác nhận lịch đo biên độ khớp',
      },
      webhookUrl
    );

    setIsTestingAI(false);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: 'Đã gửi thành công Báo Cáo AI & Lịch Sử Trò Chuyện sang tab "Lịch Sử Tư Vấn AI" trên Google Sheet!',
        link: viewUrl.trim() || undefined,
      });
      setLastSync(new Date().toLocaleString('vi-VN'));
      setLogs(getSyncLogs());
    } else {
      setStatusMessage({
        type: 'error',
        text: `Lỗi đồng bộ báo cáo AI: ${res.message}.`,
      });
    }
  };

  const handleBatchSync = async () => {
    if (!webhookUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Vui lòng nhập Webhook URL của Google Sheet trước khi đồng bộ!',
      });
      return;
    }

    if (leads.length === 0) {
      setStatusMessage({
        type: 'info',
        text: 'Chưa có lead nào trong hệ thống để đồng bộ.',
      });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);

    const res = await fullSyncLeadsToGoogleSheet(leads, webhookUrl);
    setIsSyncing(false);

    if (res.success) {
      setPendingDeletes([]);
      setStatusMessage({
        type: 'success',
        text: res.message,
        link: viewUrl.trim() || undefined,
      });
      setLastSync(new Date().toLocaleString('vi-VN'));
      setLogs(getSyncLogs());
      onLeadsUpdated?.();
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleSyncThreeSamples = async () => {
    setIsSyncingSamples(true);
    setStatusMessage(null);

    const targetUrl = webhookUrl.trim() || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
    try {
      const res = await syncThreeSampleLeadsToSheet(targetUrl);
      setIsSyncingSamples(false);

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Đã tạo và đồng bộ thành công ${res.count} dữ liệu mẫu (1. Thoát vị đĩa đệm L4-L5; 2. Cổ vai gáy IT; 3. Chuông xoay trị mất ngủ) sang Google Sheet!`,
          link: viewUrl.trim() || undefined,
        });
        setLastSync(new Date().toLocaleString('vi-VN'));
        setLogs(getSyncLogs());
        onLeadsUpdated?.();
      } else {
        setStatusMessage({
          type: 'error',
          text: `Lỗi đồng bộ dữ liệu mẫu: ${res.message}`,
        });
      }
    } catch (err: any) {
      setIsSyncingSamples(false);
      setStatusMessage({
        type: 'error',
        text: `Không thể hoàn tất gửi 3 dữ liệu mẫu: ${err?.message || 'Lỗi mạng'}`,
      });
    }
  };

  const handleExportCSV = () => {
    exportLeadsToCSV(leads);
    setStatusMessage({
      type: 'success',
      text: 'Đã xuất file CSV chuẩn tiếng Việt (UTF-8) thành công!',
    });
  };

  const isConnected = !!webhookUrl.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#1B5E20] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-serif-display">
                  Đồng Bộ Google Sheets
                </h3>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/40 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Tự động lưu
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-950/40 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                    Chưa cấu hình
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-100/80">
                Tự động đẩy thông tin đăng ký nhận tư vấn từ học viên vào Google Sheet của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-emerald-200 transition-colors cursor-pointer"
            aria-label="Đóng (Phím Esc)"
            title="Đóng (Phím Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#252822]">
          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">
                <div>{statusMessage.text}</div>
                {statusMessage.link && (
                  <a
                    href={statusMessage.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mở Google Sheet của CRM để kiểm tra ngay</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Webhook & Sheet URL Configuration Section */}
          <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#E2D8C3] space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#4A3B22] text-xs sm:text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
                <span>Cấu Hình Kết Nối Google Sheet CRM</span>
              </label>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-xs text-[#8A6437] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showGuide ? 'Ẩn hướng dẫn cài đặt' : 'Xem cách lấy Webhook URL (1 phút)'}</span>
              </button>
            </div>

            {/* View URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#717769]">
                  1. Link xem Google Sheet trực tiếp (để mở nhanh kiểm tra):
                </span>
                {viewUrl.trim() && (
                  <a
                    href={viewUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#2E7D32] hover:underline font-semibold"
                  >
                    <span>Mở Sheet CRM</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={viewUrl}
                onChange={(e) => setViewUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none text-xs font-mono"
              />
            </div>

            {/* Webhook URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#717769]">
                  2. Webhook URL Google Apps Script (đã cố định đồng bộ):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
                    setGoogleSheetWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
                    setStatusMessage({
                      type: 'success',
                      text: 'Đã đặt lại đường link Webhook Google Sheet cố định của trung tâm VICI!',
                    });
                  }}
                  className="text-[11px] text-[#2E7D32] hover:underline font-semibold cursor-pointer"
                >
                  Dùng link Webhook mặc định
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSaved ? <Check className="w-4 h-4" /> : null}
                  <span>{isSaved ? 'Đã Lưu!' : 'Lưu Cấu Hình'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              💡 <strong>Hỗ trợ 2 sheet song song:</strong> Hệ thống tự động ghi Leads từ form vào tab <code>Danh Sách Leads CRM</code>, và ghi toàn bộ bản tóm tắt + lịch sử trò chuyện AI vào tab <code>Lịch Sử Tư Vấn AI</code>.
            </p>
          </div>

          {/* Dedicated 2-Way Sync & Auto-Delete Callout Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-300 text-[#422006] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-950">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span>Tính Năng Đồng Bộ 2 Chiều: Tự Động Xóa Dữ Liệu Khỏi Google Sheet</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Bản V3 Mới</span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed max-w-xl">
                - Khi bạn <strong>xóa học viên trên website</strong>: hệ thống sẽ gửi lệnh xóa ngay lập tức sang Google Sheet.<br />
                - Khi bấm <strong>"Đồng Bộ Toàn Bộ"</strong>: hệ thống làm sạch và viết lại toàn bộ danh sách hiện có, đảm bảo mọi thông tin đã xóa trên web sẽ được xóa sạch trên Sheet và không bị trùng dòng.
              </p>
              {pendingDeletes.length > 0 && (
                <div className="text-[11px] font-semibold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-lg inline-block mt-1">
                  ⚠️ Có {pendingDeletes.length} học viên bạn vừa xóa trên web đang sẵn sàng để gỡ bỏ khỏi Sheet khi bạn bấm Đồng Bộ.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
              title="Copy mã Apps Script V3 mới để dán vào file Google Sheet của bạn"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Đã copy mã V3!' : 'Copy Mã Script V3'}</span>
            </button>
          </div>

          {/* Dedicated 03 Sample Data Testing Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-[#F3F9F1] to-white border-2 border-emerald-300/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Thử Nghiệm: Đồng Bộ 03 Dữ Liệu Mẫu Lên Google Sheet</span>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-medium">Khuyên dùng</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed max-w-xl">
                Tạo và gửi tức thì <strong>03 hồ sơ học viên mẫu chuẩn trị liệu</strong> (1. Thoát vị L4-L5; 2. Cổ vai gáy IT; 3. Chuông xoay mất ngủ) có đầy đủ bệnh lý, mục tiêu trị liệu & lịch sử chat MyVici để bạn kiểm tra kết quả trên Google Sheet.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncThreeSamples}
              disabled={isSyncingSamples}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-semibold shrink-0 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingSamples ? 'animate-spin' : ''}`} />
              <span>{isSyncingSamples ? 'Đang gửi 3 mẫu...' : 'Tạo & Đồng Bộ 03 Mẫu'}</span>
            </button>
          </div>

          {/* Setup Guide (Collapsible) */}
          {showGuide && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in text-xs text-emerald-950">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <h4 className="font-bold flex items-center gap-2 text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>3 Bước Kết Nối Với Bất Kỳ Google Sheet Nào:</span>
                </h4>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã copy mã!' : 'Copy Mã Apps Script'}</span>
                </button>
              </div>

              <ol className="list-decimal list-inside space-y-2 leading-relaxed text-[12px]">
                <li>
                  Mở một Google Sheet mới trên Google Drive của bạn (ví dụ đặt tên <em>VICI Yoga Leads 2026</em>).
                </li>
                <li>
                  Trên menu trang tính, bấm vào <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; chọn <strong>Apps Script</strong>.
                </li>
                <li>
                  Xóa toàn bộ mã mặc định có sẵn trong đó, bấm nút <strong>"Copy Mã Apps Script"</strong> ở góc trên và dán vào.
                </li>
                <li>
                  Bấm biểu tượng <strong>Lưu (Save)</strong>, sau đó nhấn nút <strong>Triển khai (Deploy)</strong> màu xanh &rarr; chọn <strong>Triển khai mới (New deployment)</strong>.
                </li>
                <li>
                  Tại bánh răng cấu hình, chọn loại <strong>Ứng dụng web (Web app)</strong>. Chú ý chọn mục <strong>"Ai có quyền truy cập" = "Bất kỳ ai (Anyone)"</strong> để website gửi đơn được!
                </li>
                <li>
                  Bấm <strong>Triển khai</strong> &rarr; cấp quyền &rarr; <strong>Copy đường dẫn URL</strong> (kết thúc bằng <code className="bg-emerald-200/60 px-1 rounded font-mono">/exec</code>) và dán vào ô Webhook ở trên rồi bấm <strong>Lưu Cấu Hình</strong>.
                </li>
              </ol>
            </div>
          )}

          {/* Action Operations Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Test connection - Lead */}
            <button
              type="button"
              onClick={handleTestSync}
              disabled={isTesting}
              className="p-3 rounded-2xl bg-white border border-[#E2D8C3] hover:border-[#2E7D32] hover:bg-emerald-50/40 text-[#252822] text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 text-[#2E7D32] ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Đang gửi test...' : 'Test Lead Form'}</span>
              <span className="text-[10px] text-gray-500 font-normal">Ghi thử vào tab Lead CRM</span>
            </button>

            {/* Test connection - AI Chat Transcript & Report */}
            <button
              type="button"
              onClick={handleTestAISync}
              disabled={isTestingAI}
              className="p-3 rounded-2xl bg-white border border-[#E2D8C3] hover:border-[#8A6437] hover:bg-amber-50/40 text-[#252822] text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className={`w-4 h-4 text-[#8A6437] ${isTestingAI ? 'animate-spin' : ''}`} />
              <span>{isTestingAI ? 'Đang gửi test...' : 'Test Báo Cáo AI'}</span>
              <span className="text-[10px] text-gray-500 font-normal">Ghi thử tab Lịch Sử Tư Vấn AI</span>
            </button>

            {/* Sync all existing leads */}
            <button
              type="button"
              onClick={handleBatchSync}
              disabled={isSyncing}
              className="p-3 rounded-2xl bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#256628] hover:to-[#144717] text-white text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Làm sạch & đồng bộ toàn bộ học viên khớp 100% với website (tự động xóa bỏ dữ liệu đã xóa)"
            >
              <FileSpreadsheet className={`w-4 h-4 text-emerald-200 ${isSyncing ? 'animate-pulse' : ''}`} />
              <span>{isSyncing ? 'Đang làm sạch & đồng bộ...' : `Đồng Bộ (${leads.length}) Lead`}</span>
              <span className="text-[10px] text-emerald-200/90 font-normal">Xóa lead đã xóa & khớp 100%</span>
            </button>

            {/* Direct CSV / Excel Export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="p-3 rounded-2xl bg-white border border-[#E2D8C3] hover:border-[#8A6437] hover:bg-[#FAF5EB] text-[#252822] text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#8A6437]" />
              <span>Tải Excel / CSV</span>
              <span className="text-[10px] text-gray-500 font-normal">Mở ngay trên máy tính</span>
            </button>
          </div>

          {/* Sync History / Status Overview */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E2D8C3] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#4A3B22] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nhật ký đồng bộ gần nhất</span>
              </span>
              <span className="text-[11px] text-gray-500 font-normal">
                {lastSync ? `Lần cuối: ${lastSync}` : 'Chưa có lượt đồng bộ'}
              </span>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {logs.slice(0, 5).map((log, idx) => (
                  <div
                    key={idx}
                    className="text-[11px] flex items-center justify-between p-2 rounded-xl bg-white border border-[#EBE3D3]"
                  >
                    <span className="truncate max-w-[70%] text-stone-700">{log.message}</span>
                    <span className="text-gray-400 font-mono text-[10px] shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 italic">
                Khi học viên để lại thông tin trên trang web, nhật ký truyền tải sẽ tự động xuất hiện tại đây.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
