import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Clock,
  PhoneCall,
  UserCheck,
  AlertCircle,
  FileText,
  Plus,
  ArrowLeft,
  RefreshCw,
  Edit3,
  X,
  MessageSquare,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  Download,
  LogOut,
  ShieldCheck,
  Database,
  Bot,
  User,
  Trash2
} from 'lucide-react';
import { Lead, LeadCategory } from '../../types';
import GoogleSheetsSyncModal from './GoogleSheetsSyncModal';
import JsonBackupRestoreModal from './JsonBackupRestoreModal';
import AddLeadModal from './AddLeadModal';
import {
  exportLeadsToCSV,
  getGoogleSheetWebhookUrl,
  deleteLeadFromGoogleSheet,
} from '../../services/googleSheetsService';
import {
  subscribeToFirestoreLeads,
  fetchFirestoreLeads,
  saveLeadToFirestore,
  updateLeadInFirestore,
  deleteLeadFromFirestore,
  seedFirestoreIfEmpty,
  isConfigured as isFirebaseConfigured
} from '../../services/firebase';

interface AdminDashboardProps {
  onClose: () => void;
  onOpenRegisterForm?: () => void;
  onLogout?: () => void;
}

export default function AdminDashboard({ onClose, onLogout }: AdminDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteToast, setDeleteToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState<'connecting' | 'synced' | 'fallback'>('connecting');

  // Note editing state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [staffNoteInput, setStaffNoteInput] = useState('');
  const [nextActionInput, setNextActionInput] = useState('');

  // Synchronize inputs when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      setStaffNoteInput(selectedLead.staffNotes || '');
      setNextActionInput(selectedLead.nextAction || '');
    }
  }, [selectedLead]);

  // Fetch leads from backend
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads?reload=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
        if (isFirebaseConfigured && data.leads.length > 0) {
          seedFirestoreIfEmpty(data.leads).catch((e) => console.warn('Seed notice:', e));
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time multi-device subscription via Firebase Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (isFirebaseConfigured) {
      unsubscribe = subscribeToFirestoreLeads(
        async (firestoreLeads) => {
          setIsLoading(false);
          if (firestoreLeads && firestoreLeads.length > 0) {
            setLeads(firestoreLeads);
            setFirebaseStatus('synced');
          } else {
            // If Firestore collection is empty, migrate initial database to Firestore
            try {
              const res = await fetch('/api/leads?reload=true');
              const data = await res.json();
              if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
                setLeads(data.leads);
                await seedFirestoreIfEmpty(data.leads);
                setFirebaseStatus('synced');
              }
            } catch (err) {
              console.error('Initial migration error:', err);
            }
          }
        },
        (error) => {
          console.warn('Firestore subscription notice, fallback to REST API:', error);
          setFirebaseStatus('fallback');
          fetchLeads();
        }
      );
    } else {
      setFirebaseStatus('fallback');
      fetchLeads();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Manual refresh checking Firestore then REST
  const handleManualReload = async () => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured) {
        const fsLeads = await fetchFirestoreLeads();
        if (fsLeads && fsLeads.length > 0) {
          setLeads(fsLeads);
          setFirebaseStatus('synced');
          setIsLoading(false);
          return;
        }
      }
      await fetchLeads();
    } catch (err) {
      await fetchLeads();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Escape key to close modal or exit admin view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (leadToDelete) {
          setLeadToDelete(null);
        } else if (selectedLead) {
          setSelectedLead(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leadToDelete, selectedLead, onClose]);

  // Update lead status or notes
  const handleUpdateLead = async (
    id: string,
    updates: {
      status?: Lead['status'];
      staffNotes?: string;
      nextAction?: string;
      assignedTo?: string;
      category?: LeadCategory;
      preferredTime?: string;
      leadScore?: Lead['leadScore'];
    }
  ) => {
    setIsUpdatingStatus(true);
    try {
      // 1. Update in Firebase Firestore for instant multi-device sync
      if (isFirebaseConfigured) {
        updateLeadInFirestore(id, updates).catch((err) =>
          console.warn('Firestore update warning:', err)
        );
      }

      // 2. Also persist to backend REST API
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
        if (selectedLead?.id === id) {
          setSelectedLead(data.lead);
        }
      }
    } catch (err) {
      console.error('Update lead failed', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete lead handler
  const handleDeleteLead = async (lead: Lead) => {
    setIsDeleting(true);
    try {
      // 1. Delete from Firebase Firestore across all devices
      if (isFirebaseConfigured) {
        deleteLeadFromFirestore(lead.id).catch((err) =>
          console.warn('Firestore delete warning:', err)
        );
      }

      // 2. Delete from server API
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        // 3. Trigger deletion in Google Sheet (Matches by Lead ID / Phone)
        deleteLeadFromGoogleSheet(lead.id, lead.phone, lead.name).catch((err) =>
          console.warn('Google Sheet delete error:', err)
        );

        setLeads((prev) => prev.filter((l) => l.id !== lead.id));
        if (selectedLead?.id === lead.id) {
          setSelectedLead(null);
        }
        setLeadToDelete(null);
        setDeleteToast(`Đã xóa thành công thông tin của ${lead.name} (${lead.phone}) trên hệ thống và Google Sheet.`);
        setTimeout(() => {
          setDeleteToast(null);
        }, 4500);
      } else {
        setDeleteToast(data.error || 'Có lỗi xảy ra khi xóa lead');
        setTimeout(() => {
          setDeleteToast(null);
        }, 4000);
      }
    } catch (err) {
      console.error('Lỗi khi xóa lead:', err);
      setDeleteToast('Không thể kết nối đến máy chủ để xóa');
      setTimeout(() => {
        setDeleteToast(null);
      }, 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  // Callback when a new lead is added manually via modal
  const handleLeadAdded = (newLead: Lead) => {
    setLeads((prev) => {
      const exists = prev.some((l) => l.id === newLead.id);
      if (exists) {
        return prev.map((l) => (l.id === newLead.id ? newLead : l));
      }
      return [newLead, ...prev];
    });
    setSelectedLead(newLead);
    setSuccessToast(`Đã thêm thành công hồ sơ của ${newLead.name} (${newLead.phone})`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Add sample lead for quick testing
  const handleAddSampleLead = async () => {
    const sample = {
      name: `Học Viên Mới ${Math.floor(Math.random() * 900 + 100)}`,
      phone: `09${Math.floor(Math.random() * 89999999 + 10000000)}`,
      email: 'hocvien.moi@gmail.com',
      source: 'Website Form' as const,
      interest: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy (650.000đ)',
      category: 'THERAPY_INTEREST' as const,
      experience: 'Chưa từng tập Yoga',
      goals: ['Giảm đau mỏi vai gáy', 'Cải thiện giấc ngủ'],
      preferredTime: '19:00 - 20:00 tối Thứ 3, 5',
      recommendedCourse: 'Scan Trị Liệu + Gói 3 Tháng Phục Hồi',
      leadScore: 'HOT' as const,
      staffNotes: 'Khách hàng quan tâm phác đồ điều trị thoái hóa đốt sống cổ',
      nextAction: 'Gọi điện xác nhận lịch hẹn Scan',
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        if (isFirebaseConfigured) {
          saveLeadToFirestore(data.lead).catch((err) =>
            console.warn('Firestore sample lead save warning:', err)
          );
        }
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const hotLeads = leads.filter((l) => l.leadScore === 'HOT').length;
  const enrolledLeads = leads.filter((l) => l.status === 'Enrolled').length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0;

  // Filtered list
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesScore = filterScore === 'all' || lead.leadScore === filterScore;
    const matchesCategory = filterCategory === 'all' || lead.category === filterCategory;

    return matchesSearch && matchesStatus && matchesScore && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#F4EADA]/30 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen bg-[#F8F5EE] flex flex-col">
        {/* Top Navbar */}
        <header className="bg-[#21241E] text-white px-4 sm:px-8 py-4 border-b border-[#3A3E34] sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
              title="Quay lại trang chủ website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-serif-display">
                  VICI Lead Management CRM
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#D69A2D] text-white font-semibold">
                  Hệ Thống Phụ Trách
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Theo dõi & tư vấn khách hàng tự động từ Website và VICI AI Advisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Live Cloud Sync Indicator */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                firebaseStatus === 'synced'
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : firebaseStatus === 'connecting'
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                  : 'bg-stone-800/80 border-stone-700 text-stone-300'
              }`}
              title="Đồng bộ tự động thời gian thực qua Firebase Firestore giữa mọi thiết bị (Điện thoại, Laptop, Tablet)"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  firebaseStatus === 'synced'
                    ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                    : firebaseStatus === 'connecting'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-stone-400'
                }`}
              />
              <span className="hidden sm:inline">
                {firebaseStatus === 'synced'
                  ? 'Firebase: Đang đồng bộ'
                  : firebaseStatus === 'connecting'
                  ? 'Đang kết nối Firebase...'
                  : 'Firebase Offline'}
              </span>
              <span className="sm:hidden">
                {firebaseStatus === 'synced' ? 'Firebase' : 'Offline'}
              </span>
            </div>

            {/* JSON Database Backup & Restore Button */}
            <button
              id="admin-json-backup-btn"
              onClick={() => setIsBackupModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-700/80 to-[#8A6437] hover:from-amber-600 hover:to-[#6F4E27] border border-amber-400/40 text-xs font-bold text-amber-50 transition-all cursor-pointer shadow-2xs"
              title="Sao lưu và đồng bộ toàn bộ hội thoại và hồ sơ khách hàng dạng JSON"
            >
              <Database className="w-4 h-4 text-amber-200 shrink-0" />
              <span>Sao Lưu và Đồng Bộ</span>
            </button>

            {/* Google Sheets Sync Button */}
            <button
              id="admin-google-sheets-btn"
              onClick={() => setIsSheetsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/90 border border-emerald-500/40 text-xs font-semibold text-emerald-100 transition-all cursor-pointer shadow-2xs"
              title="Quản lý đồng bộ dữ liệu với Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Google Sheets</span>
              {getGoogleSheetWebhookUrl() ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tự động đồng bộ đang hoạt động" />
              ) : (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30">Cài đặt</span>
              )}
            </button>

            {/* Export CSV Button */}
            <button
              onClick={() => exportLeadsToCSV(leads)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-200 transition-all cursor-pointer"
              title="Xuất dữ liệu ra file Excel/CSV chuẩn tiếng Việt"
            >
              <Download className="w-4 h-4" />
              <span>Xuất CSV</span>
            </button>

            {/* Add New Lead Button */}
            <button
              id="admin-add-lead-btn"
              onClick={() => setIsAddLeadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D69A2D] to-[#B87A14] hover:from-[#E5A83B] hover:to-[#A36A0E] text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
              title="Mở bảng điền thông tin để thêm hồ sơ khách hàng mới"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Lead Mới</span>
            </button>

            <button
              onClick={handleManualReload}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
              title="Làm mới & đồng bộ dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/70 border border-red-500/30 text-xs font-semibold text-red-200 transition-all cursor-pointer"
                title="Đăng xuất khỏi Admin CRM"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#D69A2D] hover:bg-[#B87A14] text-xs font-bold text-white transition-all cursor-pointer"
            >
              Về Website
            </button>
          </div>
        </header>

        {/* CRM Main Content Area */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E8DFC8] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#717769] font-medium mb-1">
                <span>Tổng Số Lead</span>
                <Users className="w-4 h-4 text-[#8A6437]" />
              </div>
              <div className="text-3xl font-bold text-[#252822] font-serif-display">
                {totalLeads}
              </div>
              <p className="text-[11px] text-[#687B56] mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Thu thập tự động 24/7</span>
              </p>
            </div>

            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E8DFC8] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#717769] font-medium mb-1">
                <span>Lead Mới Cần Xử Lý</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 font-serif-display">
                {newLeads}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Cần gọi trong vòng 24h</p>
            </div>

            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E8DFC8] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#717769] font-medium mb-1">
                <span>Lead Nóng (HOT Score)</span>
                <Flame className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-600 font-serif-display">
                {hotLeads}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Sẵn sàng đặt lịch / chốt khóa</p>
            </div>

            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E8DFC8] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#717769] font-medium mb-1">
                <span>Đã Nhập Học (Enrolled)</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 font-serif-display">
                {enrolledLeads}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Tỷ lệ chuyển đổi: {conversionRate}%
              </p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-[#FFFDF8] rounded-2xl p-4 sm:p-5 border border-[#E8DFC8] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên, SĐT, mã Lead, khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#4A4E44] outline-none cursor-pointer"
              >
                <option value="all">Tất cả Trạng thái</option>
                <option value="New">Mới (New)</option>
                <option value="Contacted">Đã liên hệ (Contacted)</option>
                <option value="Consulting">Đang tư vấn (Consulting)</option>
                <option value="Trial">Hẹn học thử (Trial)</option>
                <option value="Enrolled">Đã nhập học (Enrolled)</option>
                <option value="Lost">Chưa chốt (Lost)</option>
              </select>

              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#4A4E44] outline-none cursor-pointer"
              >
                <option value="all">Tất cả Điểm (Score)</option>
                <option value="HOT">🔥 HOT</option>
                <option value="WARM">⚡ WARM</option>
                <option value="COLD">❄ COLD</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#4A4E44] outline-none cursor-pointer"
              >
                <option value="all">Tất cả Phân khúc CRM</option>
                <option value="THERAPY_INTEREST">Trị liệu Cơ Xương Khớp</option>
                <option value="BEGINNER">Người mới bắt đầu (Newbie)</option>
                <option value="ADVANCED">Nâng cao / Ashtanga</option>
                <option value="TRAINER_EDUCATION">Đào tạo Huấn Luyện Viên</option>
                <option value="WORKSHOP">Workshop Chuông Xoay</option>
                <option value="GENERAL_INQUIRY">Tìm hiểu thông tin / Học phí</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F0] border-b border-[#E8DFC8] text-[#717769] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Mã & Thời gian</th>
                    <th className="py-3.5 px-4">Họ tên & Liên hệ</th>
                    <th className="py-3.5 px-4">Khóa học quan tâm</th>
                    <th className="py-3.5 px-4">Nguồn</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Phụ trách</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8D7] text-[#252822]">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        Không tìm thấy Lead nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const scoreColor =
                        lead.leadScore === 'HOT'
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : lead.leadScore === 'WARM'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-blue-50 text-blue-700 border-blue-200';

                      const statusColor =
                        lead.status === 'New'
                          ? 'bg-blue-100 text-blue-700'
                          : lead.status === 'Contacted'
                          ? 'bg-purple-100 text-purple-700'
                          : lead.status === 'Consulting'
                          ? 'bg-amber-100 text-amber-800'
                          : lead.status === 'Trial'
                          ? 'bg-cyan-100 text-cyan-800'
                          : lead.status === 'Enrolled'
                          ? 'bg-emerald-100 text-emerald-700 font-bold'
                          : 'bg-gray-100 text-gray-600';

                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedLead(lead);
                            setStaffNoteInput(lead.staffNotes || '');
                            setNextActionInput(lead.nextAction || '');
                          }}
                        >
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#717769]">
                            <div className="font-bold text-[#252822]">{lead.id}</div>
                            <div>{lead.createdAt}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-sm text-[#252822]">{lead.name}</div>
                            <div className="text-[#8A6437] font-semibold">{lead.phone}</div>
                            {lead.email && <div className="text-[11px] text-gray-400">{lead.email}</div>}
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-medium truncate">{lead.interest}</div>
                            <div className="text-[11px] text-gray-500">
                              Khung giờ: {lead.preferredTime || 'Linh hoạt'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="px-2 py-0.5 rounded-full bg-[#EFE7D5] text-[#8A6437] text-[10px] font-semibold">
                                {lead.source}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                                {lead.category === 'TRAINER_EDUCATION'
                                  ? 'Đào tạo HLV'
                                  : lead.category === 'ADVANCED'
                                  ? 'Nâng cao / Ashtanga'
                                  : lead.category === 'BEGINNER'
                                  ? 'Người mới (Newbie)'
                                  : lead.category === 'WORKSHOP'
                                  ? 'Workshop'
                                  : lead.category === 'GENERAL_INQUIRY'
                                  ? 'Tìm hiểu chung'
                                  : 'Trị liệu / Cột sống'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold inline-flex items-center gap-1 ${scoreColor}`}
                            >
                              {lead.leadScore === 'HOT' && <Flame className="w-3 h-3" />}
                              {lead.leadScore}
                            </span>
                          </td>

                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleUpdateLead(lead.id, {
                                  status: e.target.value as Lead['status'],
                                })
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border border-transparent outline-none cursor-pointer ${statusColor}`}
                            >
                              <option value="New">Mới (New)</option>
                              <option value="Contacted">Đã liên hệ</option>
                              <option value="Consulting">Đang tư vấn</option>
                              <option value="Trial">Hẹn học thử</option>
                              <option value="Enrolled">Đã nhập học</option>
                              <option value="Lost">Tạm ngưng / Lost</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-[11px] text-gray-600">
                            {lead.assignedTo || 'Master Kiều Hùng'}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(lead);
                                  setStaffNoteInput(lead.staffNotes || '');
                                  setNextActionInput(lead.nextAction || '');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FFFDF8] border border-[#D5C7AA] hover:border-[#8A6437] text-xs font-semibold text-[#8A6437] transition-all cursor-pointer"
                                title="Xem chi tiết & Ghi chú"
                              >
                                Xem & Note
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLeadToDelete(lead);
                                }}
                                className="p-1.5 rounded-lg border border-red-200/80 bg-red-50/80 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all cursor-pointer"
                                title="Xóa thông tin hồ sơ này"
                                aria-label="Xóa thông tin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Lead Detail Drawer / Modal */}
        {selectedLead && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedLead(null);
              }
            }}
          >
            <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden max-h-[90vh] flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 bg-gradient-to-r from-[#FAF7F0] to-[#F4EADA] border-b border-[#E8DFC8] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#8A6437]">
                      {selectedLead.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#D69A2D]/15 text-[#9E6910] text-[10px] font-bold">
                      {selectedLead.source}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#252822] font-serif-display">
                    {selectedLead.name}
                  </h3>
                  <p className="text-xs text-[#63685C] mt-0.5">
                    Số điện thoại: <strong>{selectedLead.phone}</strong>
                    {selectedLead.email ? ` • ${selectedLead.email}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="hidden sm:inline-block text-[10px] bg-black/5 text-[#555A4E] px-1.5 py-0.5 rounded border border-[#D5C7AA]/50 font-mono select-none"
                    title="Nhấn phím Esc để đóng"
                  >
                    Esc
                  </span>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 cursor-pointer"
                    aria-label="Đóng (Phím Esc)"
                    title="Đóng (Phím Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#4A4E44]">
                {/* Status & Assignment Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8F5EE] border border-[#E8DFC8]">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#717769] block mb-1">
                      Trạng thái xử lý:
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) =>
                        handleUpdateLead(selectedLead.id, {
                          status: e.target.value as Lead['status'],
                        })
                      }
                      className="w-full p-2 text-xs rounded-xl bg-white border border-[#D5C7AA] font-semibold"
                    >
                      <option value="New">Mới (New)</option>
                      <option value="Contacted">Đã liên hệ</option>
                      <option value="Consulting">Đang tư vấn</option>
                      <option value="Trial">Hẹn học thử</option>
                      <option value="Enrolled">Đã nhập học</option>
                      <option value="Lost">Tạm ngưng / Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#717769] block mb-1">
                      Lead Score:
                    </label>
                    <div className="p-2 text-xs rounded-xl bg-white border border-[#D5C7AA] font-bold text-red-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{selectedLead.leadScore}</span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold uppercase text-[#717769] block mb-1">
                      Phân khúc CRM:
                    </label>
                    <select
                      value={selectedLead.category || 'THERAPY_INTEREST'}
                      onChange={(e) =>
                        handleUpdateLead(selectedLead.id, {
                          category: e.target.value as LeadCategory,
                        })
                      }
                      className="w-full p-2 text-xs rounded-xl bg-white border border-[#D5C7AA] font-semibold text-[#8A6437]"
                    >
                      <option value="THERAPY_INTEREST">Trị liệu Cơ Xương Khớp</option>
                      <option value="BEGINNER">Người mới bắt đầu (Newbie)</option>
                      <option value="ADVANCED">Nâng cao / Ashtanga</option>
                      <option value="TRAINER_EDUCATION">Đào tạo Huấn Luyện Viên</option>
                      <option value="WORKSHOP">Workshop Chuông Xoay</option>
                      <option value="GENERAL_INQUIRY">Tìm hiểu thông tin / Học phí</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold uppercase text-[#717769] block mb-1">
                      Người phụ trách:
                    </label>
                    <input
                      type="text"
                      value={selectedLead.assignedTo || 'Master Henry Phan'}
                      onChange={(e) =>
                        handleUpdateLead(selectedLead.id, { assignedTo: e.target.value })
                      }
                      className="w-full p-2 text-xs rounded-xl bg-white border border-[#D5C7AA]"
                    />
                  </div>
                </div>

                {/* Consultation Requirements */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#252822]">
                    Nhu cầu & Thể trạng
                  </h4>
                  <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] space-y-2 text-xs">
                    <p>
                      <strong>Khóa quan tâm:</strong> {selectedLead.interest}
                    </p>
                    <p>
                      <strong>Kinh nghiệm tập:</strong> {selectedLead.experience || 'Chưa tập bao giờ'}
                    </p>
                    <p>
                      <strong>Khung giờ mong muốn:</strong> {selectedLead.preferredTime || 'Linh hoạt'}
                    </p>
                    {selectedLead.goals && selectedLead.goals.length > 0 && (
                      <div>
                        <strong>Mục tiêu:</strong>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedLead.goals.map((g, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E8DFC8] text-[11px]"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Transcript & Conversation History if from chatbot */}
                {(selectedLead.conversationHistory && selectedLead.conversationHistory.length > 0) ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A6437] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#D69A2D]" />
                        <span>Toàn Văn Cuộc Trò Chuyện Với AI Agent ({selectedLead.conversationHistory.length} tin nhắn)</span>
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        Đã Lưu CRM
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E8DFC8] max-h-72 overflow-y-auto space-y-3 font-sans">
                      {selectedLead.conversationHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 ${
                            msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                              msg.sender === 'user'
                                ? 'bg-[#8A6437] text-white'
                                : 'bg-[#D69A2D] text-white'
                            }`}
                          >
                            {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                          </div>

                          <div
                            className={`max-w-[82%] p-3 rounded-2xl text-xs ${
                              msg.sender === 'user'
                                ? 'bg-[#252822] text-stone-100 rounded-tr-xs'
                                : 'bg-white border border-[#E8DFC8] text-[#252822] shadow-2xs rounded-tl-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-70">
                              <span className="font-bold">
                                {msg.sender === 'user' ? selectedLead.name : 'VICI AI Advisor'}
                              </span>
                              {msg.time && <span>{msg.time}</span>}
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : selectedLead.chatSummary ? (
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A6437] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D69A2D]" />
                      <span>Tóm tắt hội thoại với VICI AI Advisor</span>
                    </h4>
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-[#544723] max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                      {selectedLead.chatSummary}
                    </div>
                  </div>
                ) : null}

                {/* AI Clinical Assessment Report if available */}
                {selectedLead.aiReport && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D69A2D]" />
                        <span>Báo Cáo Đánh Giá Lâm Sàng & Phác Đồ AI</span>
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {selectedLead.aiReport.sessionId}
                      </span>
                    </div>

                    {selectedLead.aiReport.detectedConditions?.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-gray-600 block mb-1">
                          Triệu chứng/Vấn đề nhận diện:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedLead.aiReport.detectedConditions.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-amber-100/70 border border-amber-300/60 text-amber-900 text-[11px] font-semibold"
                            >
                              🩺 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedLead.aiReport.safetyNotes && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs">
                        <strong>Lưu ý an toàn cho HLV:</strong> {selectedLead.aiReport.safetyNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Staff Internal Notes & Next Action */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#252822] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8A6437]" />
                    <span>Ghi chú nội bộ & Hành động tiếp theo</span>
                  </h4>

                  <div>
                    <label className="text-[11px] text-gray-500 block mb-1">
                      Ghi chú chuyên môn (Tình trạng thoái hóa, tiền sử bệnh, cam kết):
                    </label>
                    <textarea
                      rows={3}
                      value={staffNoteInput}
                      onChange={(e) => setStaffNoteInput(e.target.value)}
                      placeholder="Nhập ghi chú cho trợ lý hoặc huấn luyện viên..."
                      className="w-full p-3 text-xs rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-500 block mb-1">
                      Hành động tiếp theo (Next Action):
                    </label>
                    <input
                      type="text"
                      value={nextActionInput}
                      onChange={(e) => setNextActionInput(e.target.value)}
                      placeholder="Ví dụ: Gọi điện lúc 14:00 ngày mai xác nhận lịch Scan..."
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#D5C7AA] outline-none focus:border-[#D69A2D]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleUpdateLead(selectedLead.id, {
                          staffNotes: staffNoteInput,
                          nextAction: nextActionInput,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-[#8A6437] text-white text-xs font-bold hover:bg-[#6F4E27] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isUpdatingStatus ? 'Đang lưu...' : 'Lưu ghi chú nội bộ'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-[#FAF7F0] border-t border-[#E8DFC8] flex items-center justify-between gap-3">
                <a
                  href={`tel:${selectedLead.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Gọi {selectedLead.phone}</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLeadToDelete(selectedLead)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
                    title="Xóa hồ sơ này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa hồ sơ</span>
                  </button>

                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-5 py-2 rounded-xl border border-[#D5C7AA] text-xs font-semibold text-[#555A4E] hover:bg-white cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Sheets Sync Modal */}
        <GoogleSheetsSyncModal
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
          leads={leads}
          onLeadsUpdated={fetchLeads}
        />

        {/* JSON Database Backup & Restore Modal */}
        <JsonBackupRestoreModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          leads={leads}
          onLeadsUpdated={fetchLeads}
        />

        {/* Add Lead Manual Form Modal */}
        <AddLeadModal
          isOpen={isAddLeadModalOpen}
          onClose={() => setIsAddLeadModalOpen(false)}
          onLeadAdded={handleLeadAdded}
        />

        {/* Delete Confirmation Modal */}
        {leadToDelete && (
          <div
            className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) {
                setLeadToDelete(null);
              }
            }}
          >
            <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl shadow-2xl border border-red-200 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#252822] mb-1 font-serif-display">
                  Xác nhận xóa thông tin lead?
                </h3>
                <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                  Bạn có chắc chắn muốn xóa hồ sơ của{' '}
                  <strong className="text-[#252822] font-semibold">{leadToDelete.name}</strong>{' '}
                  ({leadToDelete.phone})?
                </p>

                <div className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8] text-left text-xs space-y-1.5 mb-5">
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>Mã hồ sơ:</span>
                    <span className="font-mono font-bold text-[#252822]">{leadToDelete.id}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>Nhu cầu/Khóa:</span>
                    <span className="font-medium text-[#8A6437] truncate max-w-[200px]">{leadToDelete.interest}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>Thời gian tạo:</span>
                    <span>{leadToDelete.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setLeadToDelete(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#D5C7AA] text-xs font-semibold text-[#555A4E] hover:bg-[#FAF7F0] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDeleteLead(leadToDelete)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang xóa...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa vĩnh viễn</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Alert for deletion */}
        {deleteToast && (
          <div className="fixed top-20 right-6 z-80 bg-[#252822] text-amber-50 px-4 py-3 rounded-2xl shadow-xl border border-red-500/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-md text-xs sm:text-sm">
            <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
            <div className="flex-1 leading-snug">{deleteToast}</div>
            <button
              onClick={() => setDeleteToast(null)}
              className="text-stone-400 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Toast Alert for successful creation */}
        {successToast && (
          <div className="fixed top-20 right-6 z-80 bg-[#1D3220] text-emerald-50 px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-md text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1 leading-snug">{successToast}</div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-300 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
