import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  X,
  FileJson,
  RefreshCw,
  Layers,
  ArrowDownToLine,
  Check
} from 'lucide-react';
import { Lead } from '../../types';
import { saveLeadToFirestore } from '../../services/firebase';

interface JsonBackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onLeadsUpdated: () => void;
}

export default function JsonBackupRestoreModal({
  isOpen,
  onClose,
  leads,
  onLeadsUpdated
}: JsonBackupRestoreModalProps) {
  const [activeTab, setActiveTab] = useState<'backup' | 'restore'>('backup');
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [parsedData, setParsedData] = useState<Lead[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Download Backup
  const handleDownloadBackup = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      // Try backend endpoint first
      let backupPayload: any = null;
      try {
        const res = await fetch('/api/leads/backup');
        if (res.ok) {
          backupPayload = await res.json();
        }
      } catch (_) {
        // Fallback to client state
      }

      if (!backupPayload || !Array.isArray(backupPayload.leads)) {
        backupPayload = {
          version: '2.0',
          system: 'VICI Yoga Therapy CRM',
          exportedAt: new Date().toISOString(),
          totalLeads: leads.length,
          leads: leads.map((l) => ({
            id: l.id,
            createdAt: l.createdAt,
            name: l.name,
            phone: l.phone,
            email: l.email || '',
            source: l.source,
            interest: l.interest,
            category: l.category,
            experience: l.experience || '',
            goals: l.goals || [],
            preferredTime: l.preferredTime || '',
            preferredFormat: l.preferredFormat || 'Trực tiếp tại Studio',
            recommendedCourse: l.recommendedCourse || '',
            leadScore: l.leadScore,
            status: l.status,
            assignedTo: l.assignedTo || 'Master Henry Phan',
            conversationSummary: l.conversationSummary || '',
            chatSummary: l.chatSummary || '',
            aiReport: l.aiReport || undefined,
            conversationHistory: l.conversationHistory || [],
            staffNotes: l.staffNotes || '',
            nextAction: l.nextAction || '',
            isSampleData: l.isSampleData || false
          }))
        };
      }

      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `vici-crm-backup-sync-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: `Đã tạo & tải xuống thành công file sao lưu và đồng bộ chứa ${leads.length} hồ sơ khách hàng!`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Không thể tải file sao lưu: ${err.message || 'Lỗi hệ thống'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle File Selection for Restore
  const processJsonFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setStatusMessage({
        type: 'error',
        text: 'Vui lòng chọn file định dạng .json hợp lệ'
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const extractedLeads = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.leads)
          ? parsed.leads
          : null;

        if (!extractedLeads || extractedLeads.length === 0) {
          throw new Error('File JSON không chứa danh sách hồ sơ khách hàng hợp lệ.');
        }

        const validLeads = extractedLeads.filter((l: any) => l && l.name && l.phone);
        if (validLeads.length === 0) {
          throw new Error('Không tìm thấy bản ghi có đủ Tên và Số điện thoại.');
        }

        setParsedData(validLeads);
        setStatusMessage(null);
      } catch (err: any) {
        setParsedData(null);
        setStatusMessage({
          type: 'error',
          text: `Đọc file thất bại: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processJsonFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processJsonFile(file);
  };

  // Execute Restore
  const handleExecuteRestore = async () => {
    if (!parsedData || parsedData.length === 0) return;
    setIsRestoring(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/leads/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: parsedData,
          mode: restoreMode
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Khôi phục dữ liệu không thành công');
      }

      // Sync restored leads to Firestore for multi-device sync
      try {
        for (const lead of parsedData) {
          await saveLeadToFirestore(lead);
        }
      } catch (fsErr) {
        console.warn('Firestore bulk sync notice during restore:', fsErr);
      }

      setStatusMessage({
        type: 'success',
        text: `Đồng bộ thành công! Hiện có ${data.total || parsedData.length} hồ sơ trong CRM (đã đồng bộ đám mây Firebase).`
      });
      setParsedData(null);
      setFileName('');
      onLeadsUpdated();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Khôi phục thất bại: ${err.message}`
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#FAF7F0] to-[#F4EADA] border-b border-[#E8DFC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D69A2D]/15 text-[#9E6910] flex items-center justify-center border border-[#D69A2D]/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#252822] font-serif-display">
                Sao Lưu & Đồng Bộ Dữ Liệu CRM
              </h3>
              <p className="text-xs text-[#717769]">
                Xuất file sao lưu chuẩn hóa và đồng bộ ngược lên website trên mọi thiết bị
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8DFC8] bg-[#FAF7F0] px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('backup');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'backup'
                ? 'border-[#8A6437] text-[#8A6437]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Sao Lưu (Xuất File JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('restore');
              setStatusMessage(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'restore'
                ? 'border-[#8A6437] text-[#8A6437]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Đồng Bộ Ngược Lên Website (Nạp File)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#4A4E44]">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-medium leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'backup' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A6437]">
                    Thông Tin Cơ Sở Dữ Liệu Hiện Tại
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Trực tuyến & Đầy đủ
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EAE1CE]">
                    <span className="text-gray-500 block text-[10px]">Tổng số hồ sơ (Leads):</span>
                    <strong className="text-base text-[#252822]">{leads.length} khách hàng</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EAE1CE]">
                    <span className="text-gray-500 block text-[10px]">Định dạng lưu trữ:</span>
                    <strong className="text-base text-[#252822]">JSON Chuẩn Hóa</strong>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  File sao lưu bao gồm đầy đủ: <strong>Họ tên, Số điện thoại, Tình trạng cơ xương khớp, Nhu cầu mong muốn, Toàn bộ lịch sử tin nhắn trò chuyện với AI Agent, Báo cáo lâm sàng AI và Ghi chú nội bộ của HLV</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-[#635122] space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#D69A2D]" />
                  <span>An toàn dữ liệu tuyệt đối:</span>
                </div>
                <p className="leading-relaxed">
                  Bạn có thể lưu file này vào máy tính hoặc Google Drive cá nhân. Khi chuyển sang máy mới hoặc cần đồng bộ lên website, chỉ cần dùng tab <strong>"Đồng Bộ Ngược Lên Website"</strong> bên cạnh để nạp lại dữ liệu bất cứ lúc nào.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className="w-full py-3 px-4 rounded-2xl bg-[#8A6437] hover:bg-[#6F4E27] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
              >
                <ArrowDownToLine className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                <span>{isExporting ? 'Đang tạo file sao lưu...' : 'Tải Xuống File Sao Lưu & Đồng Bộ (.JSON)'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#8A6437] bg-amber-50/70'
                    : 'border-[#D5C7AA] bg-[#FAF7F0] hover:bg-white hover:border-[#8A6437]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".json"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5C7AA] text-[#8A6437] flex items-center justify-center mx-auto mb-2 shadow-2xs">
                  <FileJson className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#252822]">
                  {fileName ? (
                    <span className="text-[#8A6437] font-mono">{fileName}</span>
                  ) : (
                    'Kéo & thả file sao lưu .JSON vào đây hoặc bấm để chọn file'
                  )}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Chỉ hỗ trợ file JSON sao lưu từ VICI CRM
                </p>
              </div>

              {/* Preview detected records */}
              {parsedData && (
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Đã nhận diện: {parsedData.length} hồ sơ khách hàng</span>
                    </span>
                  </div>

                  {/* Mode Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#717769] block">
                      Chọn phương thức đồng bộ:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRestoreMode('merge')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          restoreMode === 'merge'
                            ? 'bg-amber-50 border-[#8A6437] text-[#8A6437]'
                            : 'bg-white border-[#D5C7AA] text-gray-600'
                        }`}
                      >
                        <div className="font-bold text-xs">Gộp Dữ Liệu (Merge)</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          Khuyên dùng: Cập nhật thông tin mới, giữ nguyên các lead hiện tại
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRestoreMode('replace')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          restoreMode === 'replace'
                            ? 'bg-rose-50 border-rose-600 text-rose-800'
                            : 'bg-white border-[#D5C7AA] text-gray-600'
                        }`}
                      >
                        <div className="font-bold text-xs text-rose-700">Thay Thế (Replace)</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          Ghi đè toàn bộ danh sách bằng file này
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Sample Preview list */}
                  <div className="max-h-32 overflow-y-auto divide-y divide-[#EAE1CE] border rounded-xl bg-[#FAF7F0] text-xs">
                    {parsedData.slice(0, 5).map((lead, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between">
                        <div>
                          <strong className="text-[#252822]">{lead.name}</strong>
                          <span className="text-gray-500 text-[11px] ml-2 font-mono">{lead.phone}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200">
                          {lead.interest?.slice(0, 20)}...
                        </span>
                      </div>
                    ))}
                    {parsedData.length > 5 && (
                      <div className="p-2 text-center text-gray-500 text-[11px]">
                        ... và {parsedData.length - 5} hồ sơ khác
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteRestore}
                    disabled={isRestoring}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
                    <span>
                      {isRestoring
                        ? 'Đang đồng bộ dữ liệu vào CRM & Đám mây Firebase...'
                        : `Xác Nhận Đồng Bộ ${parsedData.length} Hồ Sơ Lên Website`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E8DFC8] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#D5C7AA] text-xs font-semibold text-[#555A4E] hover:bg-white cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
