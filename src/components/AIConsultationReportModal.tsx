/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Clinical Intake & Consultation Report Modal for VICI Yoga Therapy AI.
 * Synthesizes chat transcripts into structured clinical notes and syncs to CRM Google Sheets.
 */

import { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { AIConsultationReport } from '../types';
import {
  syncChatSessionToGoogleSheet,
  getGoogleSheetWebhookUrl,
  setGoogleSheetWebhookUrl,
  getGoogleSheetViewUrl,
  setGoogleSheetViewUrl,
} from '../services/googleSheetsService';

interface AIConsultationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AIConsultationReport | null;
  rawMessages: Array<{ sender: string; text: string; timestamp?: string }>;
  onUpdateCustomerInfo?: (info: { name: string; phone: string }) => void;
}

export default function AIConsultationReportModal({
  isOpen,
  onClose,
  report,
  rawMessages,
  onUpdateCustomerInfo,
}: AIConsultationReportModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    sheetUrl?: string;
  } | null>(null);

  const [showConfig, setShowConfig] = useState(false);
  const [webhookInput, setWebhookInput] = useState(getGoogleSheetWebhookUrl());
  const [viewUrlInput, setViewUrlInput] = useState(getGoogleSheetViewUrl());

  const [customerName, setCustomerName] = useState(report?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(report?.customerPhone || '');
  const [isEditingContact, setIsEditingContact] = useState(false);

  if (!isOpen || !report) return null;

  const currentSheetLink = getGoogleSheetViewUrl();
  const currentWebhook = getGoogleSheetWebhookUrl();

  const handleCopyText = () => {
    const textToCopy = `📋 BÁO CÁO TƯ VẤN VICI YOGA THERAPY AI
Mã hồ sơ: ${report.sessionId} | Ngày: ${report.timestamp}
Khách hàng: ${customerName || report.customerName || 'Chưa cung cấp'} - SĐT: ${customerPhone || report.customerPhone || 'Chưa cung cấp'}
Phân khúc CRM: ${report.categoryLabel || 'Yoga Trị Liệu Phục Hồi'} (${report.category || 'THERAPY_INTEREST'})
Khung giờ mong muốn: ${report.preferredTime || 'Linh hoạt theo nhu cầu'}
Lịch học lớp đề xuất: ${report.recommendedSchedule || 'Theo lịch VICI'}
Mục tiêu học viên: ${report.customerGoals?.join(', ') || 'Phục hồi và cải thiện sức khỏe'}
Mức độ tiềm năng: ${report.leadScore || 'HOT'}

--- VẤN ĐỀ THỂ TRẠNG & BỆNH LÝ ---
${report.detectedConditions.map((c) => `• ${c}`).join('\n')}

--- MỤC TIÊU CỤ THỂ ---
${(report.customerGoals || []).map((g) => `• ${g}`).join('\n')}

--- KHÓA HỌC ĐỀ XUẤT ---
${report.recommendedCourse} (Phụ trách: ${report.assignedTrainer})

--- LƯU Ý AN TOÀN & CHỐNG CHỈ ĐỊNH CHO HLV ---
${report.safetyNotes}

--- HÀNH ĐỘNG TIẾP THEO ---
${report.suggestedNextActions.map((a) => `• ${a}`).join('\n')}

--- BẢN TÓM TẮT CHUYÊN MÔN ---
${report.fullSummaryText}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveConfig = () => {
    setGoogleSheetWebhookUrl(webhookInput);
    setGoogleSheetViewUrl(viewUrlInput);
    setShowConfig(false);
    setSyncStatus({
      type: 'info',
      message: 'Đã cập nhật cấu hình Google Sheet. Bạn có thể bấm Đồng Bộ ngay bây giờ.',
      sheetUrl: viewUrlInput.trim() || undefined,
    });
  };

  const handleSyncToSheet = async () => {
    const webhook = getGoogleSheetWebhookUrl();
    if (!webhook) {
      setShowConfig(true);
      setSyncStatus({
        type: 'info',
        message: 'Vui lòng nhập Google Sheets Webhook URL để liên kết với trang tính của bạn.',
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    const transcript = rawMessages
      .map((m) => `${m.sender === 'user' ? 'Học viên' : 'MyVici'}: ${m.text}`)
      .join('\n\n');

    const result = await syncChatSessionToGoogleSheet(
      {
        sessionId: report.sessionId,
        customerName: customerName || report.customerName,
        customerPhone: customerPhone || report.customerPhone,
        condition: report.detectedConditions.join(', ') || report.executiveSummary,
        preferredTime: report.preferredTime,
        recommendedCourse: report.recommendedCourse,
        leadScore: report.leadScore,
        reportSummary: report.fullSummaryText,
        transcript: transcript,
        notes: `[Tư vấn AI VICI] HLV phụ trách: ${report.assignedTrainer}. Chống chỉ định: ${report.safetyNotes}`,
        nextAction: report.suggestedNextActions[0] || 'HLV gọi xác nhận phác đồ',
      },
      webhook
    );

    setIsSyncing(false);

    if (result.success) {
      setSyncStatus({
        type: 'success',
        message: 'Đã lưu lịch sử trò chuyện và báo cáo chi tiết vào Google Sheet CRM thành công!',
        sheetUrl: getGoogleSheetViewUrl() || undefined,
      });
    } else {
      setSyncStatus({
        type: 'error',
        message: result.message,
      });
    }
  };

  const handleSaveContact = () => {
    if (onUpdateCustomerInfo) {
      onUpdateCustomerInfo({ name: customerName, phone: customerPhone });
    }
    setIsEditingContact(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden max-h-[92vh] flex flex-col text-[#252822]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#8A6437] to-[#6A4B27] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-200 shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-serif-display">
                  Báo Cáo Tóm Tắt Cuộc Trò Chuyện & Hồ Sơ Đầu Vào
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    report.leadScore === 'HOT'
                      ? 'bg-rose-500/30 text-rose-200 border-rose-400/40'
                      : report.leadScore === 'WARM'
                      ? 'bg-amber-500/30 text-amber-200 border-amber-400/40'
                      : 'bg-blue-500/30 text-blue-200 border-blue-400/40'
                  }`}
                >
                  {report.leadScore === 'HOT' ? '🔥 HOT LEAD' : report.leadScore === 'WARM' ? '⚡ TIỀM NĂNG' : '📋 KHẢO SÁT'}
                </span>
              </div>
              <p className="text-[11px] text-amber-100/80">
                Mã: {report.sessionId} • Tạo lúc {report.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-amber-200 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Status Message Notification */}
          {syncStatus && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 animate-in fade-in ${
                syncStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : syncStatus.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              {syncStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs leading-relaxed">
                <p className="font-semibold">{syncStatus.message}</p>
                {syncStatus.sheetUrl && (
                  <a
                    href={syncStatus.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-emerald-700 font-bold hover:underline"
                  >
                    <span>Mở Google Sheet của CRM ngay</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Inline Sheet Config Panel (Collapsible) */}
          {showConfig && (
            <div className="p-4 rounded-2xl bg-[#F6F2EA] border border-[#E2D8C3] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-[#8A6437] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Cài Đặt Liên Kết Google Sheet CRM</span>
                </h4>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#717769] mb-1">
                  1. Đường link xem Google Sheet (để mở nhanh):
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={viewUrlInput}
                  onChange={(e) => setViewUrlInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D5C7AA] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#717769] mb-1">
                  2. Webhook URL Google Apps Script (để tự động ghi dữ liệu):
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D5C7AA] outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-xs cursor-pointer"
                >
                  Lưu Cài Đặt
                </button>
              </div>
            </div>
          )}

          {/* Customer Info Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
                Thông Tin Học Viên & Liên Hệ
              </span>
              <button
                type="button"
                onClick={() => setIsEditingContact(!isEditingContact)}
                className="text-[11px] text-[#8A6437] hover:underline cursor-pointer font-medium"
              >
                {isEditingContact ? 'Hủy' : 'Chỉnh sửa / Bổ sung SĐT'}
              </button>
            </div>

            {isEditingContact ? (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Họ và tên..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C7AA] bg-[#FAF7F0] outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại / Zalo..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C7AA] bg-[#FAF7F0] outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveContact}
                    className="px-3 py-1 rounded-lg bg-[#8A6437] text-white text-xs font-semibold cursor-pointer"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Họ và Tên:</span>
                  <strong className="text-[#252822]">{customerName || report.customerName || 'Chưa cung cấp'}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Số Điện Thoại:</span>
                  <strong className="text-[#252822]">
                    {customerPhone || report.customerPhone ? (
                      <span className="text-emerald-700 font-mono">{customerPhone || report.customerPhone}</span>
                    ) : (
                      <span className="text-amber-700 italic">Chưa để lại SĐT</span>
                    )}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Phân Khúc Khách Hàng:</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8DFC8]/60 text-[#6B4F1D]">
                    {report.categoryLabel || 'Yoga Trị Liệu'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Khung Giờ Mong Muốn:</span>
                  <span className="text-[#252822] font-medium">{report.preferredTime || 'Linh hoạt theo nhu cầu'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Goals */}
          {report.customerGoals && report.customerGoals.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8] shadow-2xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
                🎯 Mục Tiêu Đặt Ra Của Học Viên
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.customerGoals.map((goal, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{goal}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detected Conditions & Symptoms */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
              1. Thể Trạng & Vấn Đề Cơ Xương Khớp Nhận Diện Qua Hội Thoại
            </span>
            <div className="flex flex-wrap gap-1.5">
              {report.detectedConditions.length > 0 ? (
                report.detectedConditions.map((cond, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF5EB] border border-[#DFCFAE] text-[#8A6437] font-semibold text-xs"
                  >
                    🩺 {cond}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs italic">Chưa đề cập triệu chứng bệnh lý cụ thể</span>
              )}
            </div>
          </div>

          {/* Recommended Course & Trainer */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#F5ECE0] border border-[#E2D8C3] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
              2. Khóa Học & Huấn Luyện Viên Đề Xuất
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#4A3B22]">{report.recommendedCourse}</h4>
                <p className="text-xs text-[#717769] mt-0.5">
                  Phụ trách chuyên môn: <strong>{report.assignedTrainer}</strong>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white border border-[#D5C7AA] text-xs font-semibold text-[#8A6437] self-start sm:self-auto">
                {report.preferredTime || 'Theo lịch hẹn'}
              </span>
            </div>
          </div>

          {/* Safety Notes for Trainer */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>3. Khuyến Cáo An Toàn & Chống Chỉ Định Chuyển Giao Cho HLV:</span>
            </div>
            <p className="text-xs text-rose-950 leading-relaxed pl-5">
              {report.safetyNotes}
            </p>
          </div>

          {/* Next Actions */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC8] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
              4. Hành Động Tiếp Theo Đề Xuất (Next Actions):
            </span>
            <ul className="space-y-1 pl-1">
              {report.suggestedNextActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#252822]">
                  <ArrowRight className="w-3.5 h-3.5 text-[#8A6437] shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Summary Text */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
                5. Toàn Văn Tóm Tắt Cho CRM & HLV
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-[#8A6437] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EBE3D3] text-xs text-stone-700 leading-relaxed font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
              {report.fullSummaryText}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-white border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="p-2.5 rounded-xl border border-[#D5C7AA] hover:bg-[#FAF7F0] text-gray-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Cài đặt đường link Google Sheet"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Cài đặt Sheet</span>
            </button>

            {currentSheetLink && (
              <a
                href={currentSheetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#2E7D32] bg-emerald-50/50 hover:bg-emerald-100/60 text-[#1B5E20] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Mở Google Sheet trực tiếp"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
                <span>Mở Sheet CRM</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-4 py-2.5 rounded-xl border border-[#8A6437] text-[#8A6437] hover:bg-[#FAF5EB] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã Sao Chép' : 'Sao Chép Báo Cáo'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncToSheet}
              disabled={isSyncing}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#256628] hover:to-[#144717] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className={`w-4 h-4 ${isSyncing ? 'animate-pulse' : ''}`} />
              <span>{isSyncing ? 'Đang Lưu...' : 'Lưu Vào Google Sheet CRM'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
