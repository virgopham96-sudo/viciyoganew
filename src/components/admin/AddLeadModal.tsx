import { useState, FormEvent } from 'react';
import {
  X,
  UserPlus,
  Phone,
  User,
  Mail,
  Clock,
  Target,
  Sparkles,
  FileText,
  AlertCircle,
  Save,
  Activity,
  Award,
  Check
} from 'lucide-react';
import { Lead, LeadCategory, LeadScore, LeadStatus } from '../../types';
import { saveLeadToFirestore } from '../../services/firebase';
import { syncLeadToGoogleSheet, getGoogleSheetWebhookUrl } from '../../services/googleSheetsService';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: (newLead: Lead) => void;
}

const COMMON_INTERESTS = [
  'Scan Trị Liệu Cơ - Vai - Cổ - Gáy (650.000đ)',
  'Scan Cột Sống + Trị Liệu Thoát Vị Đĩa Đệm L4-L5',
  'Yoga Phục Hồi Chuyên Sâu 1:1 Cá Nhân Hóa (Master Henry Phan)',
  'Khóa Yoga Phục Hồi Nhóm Nhỏ (3 Tháng / 5-8 Học Viên)',
  'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 Chuyên Đề)',
  'Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)',
  'Yin Yoga & Thiền Chuông Xoay Himalaya Trị Liệu (Master Mỹ Kiều)',
  'Yoga Căn Bản Cho Người Mới Bắt Đầu (Newbie)',
  'Khác (Nhập tự do bên dưới)',
];

const PRESET_GOALS = [
  'Giảm đau mỏi cổ vai gáy',
  'Giảm đau thắt lưng / L4-L5',
  'Giải tỏa chèn ép thần kinh tọa',
  'Chỉnh gù lưng / Sai lệch tư thế',
  'Trị mất ngủ & Căng thẳng thần kinh',
  'Tăng độ dẻo dai an toàn',
  'Chinh phục Handstand / Ashtanga',
  'Lấy chứng chỉ HLV Quốc tế Yoga Alliance',
  'Phục hồi sau chấn thương',
];

export default function AddLeadModal({
  isOpen,
  onClose,
  onLeadAdded,
}: AddLeadModalProps) {
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterestPreset, setSelectedInterestPreset] = useState(COMMON_INTERESTS[0]);
  const [customInterest, setCustomInterest] = useState('');
  const [category, setCategory] = useState<LeadCategory>('THERAPY_INTEREST');
  const [experience, setExperience] = useState('Chưa từng tập Yoga');
  const [preferredTime, setPreferredTime] = useState('Ca Tối (19:00 - 20:00)');
  const [preferredFormat, setPreferredFormat] = useState('Trực tiếp tại Studio');
  const [goals, setGoals] = useState<string[]>(['Giảm đau mỏi cổ vai gáy']);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [leadScore, setLeadScore] = useState<LeadScore>('HOT');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [assignedTo, setAssignedTo] = useState('Master Henry Phan');
  const [source, setSource] = useState<Lead['source']>('Direct Consultation');
  const [staffNotes, setStaffNotes] = useState('');
  const [nextAction, setNextAction] = useState('Gọi điện trao đổi tình trạng thể trạng và xác nhận lịch hẹn');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleAddCustomGoal = () => {
    if (customGoalInput.trim() && !goals.includes(customGoalInput.trim())) {
      setGoals((prev) => [...prev, customGoalInput.trim()]);
      setCustomGoalInput('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setErrorMessage('Vui lòng nhập họ và tên của khách hàng');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Vui lòng nhập số điện thoại hoặc Zalo hợp lệ (tối thiểu 8 chữ số)');
      return;
    }

    const finalInterest =
      selectedInterestPreset === 'Khác (Nhập tự do bên dưới)'
        ? (customInterest.trim() || 'Tư vấn lộ trình trị liệu cá nhân')
        : selectedInterestPreset;

    setIsSubmitting(true);

    const payload = {
      name: cleanName,
      phone: cleanPhone,
      email: email.trim() || undefined,
      source,
      interest: finalInterest,
      category,
      experience,
      goals,
      preferredTime,
      preferredFormat,
      recommendedCourse: finalInterest,
      leadScore,
      status,
      assignedTo,
      staffNotes: staffNotes.trim() || `[Tạo thủ công] Học viên quan tâm: ${finalInterest}. Giờ mong muốn: ${preferredTime}`,
      nextAction: nextAction.trim() || 'Liên hệ tư vấn và xác nhận lịch hẹn',
    };

    try {
      // 1. Post to Server API
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo mới hồ sơ học viên trên máy chủ');
      }

      const createdLead: Lead = data.lead;

      // 2. Synchronize to Firebase Firestore for multi-device live sync
      try {
        await saveLeadToFirestore(createdLead);
      } catch (fsErr) {
        console.warn('Firebase sync notice during lead creation:', fsErr);
      }

      // 3. Sync to Google Sheets if configured
      if (getGoogleSheetWebhookUrl()) {
        syncLeadToGoogleSheet(createdLead).catch((sheetErr) => {
          console.warn('Google sheet sync notice during lead creation:', sheetErr);
        });
      }

      // 4. Update parent list
      onLeadAdded(createdLead);
      onClose();
    } catch (err: any) {
      console.error('Error creating lead:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra trong quá trình lưu hồ sơ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-[#FAF7F0] via-[#F6EFE2] to-[#ECE3D0] border-b border-[#E8DFC8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D69A2D]/15 text-[#9E6910] flex items-center justify-center border border-[#D69A2D]/30 shadow-2xs">
              <UserPlus className="w-5 h-5 text-[#8A6437]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#252822] font-serif-display flex items-center gap-2">
                <span>Thêm Hồ Sơ Khách Hàng (Lead Mới)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300/60 hidden sm:inline">
                  Đồng Bộ Firebase Live
                </span>
              </h3>
              <p className="text-xs text-[#717769]">
                Điền đầy đủ thông tin để phân bổ chuyên viên và lên phác đồ trị liệu chuẩn hóa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-[#4A4E44]">
            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: Customer Contact Info */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F0E8D7] pb-2">
                <User className="w-4 h-4 text-[#8A6437]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A6437]">
                  1. Thông Tin Khách Hàng & Liên Hệ
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44] flex items-center gap-1">
                    <span>Họ và tên</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-[#252822]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44] flex items-center gap-1">
                    <span>Số điện thoại / Zalo</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-[#252822] font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Email (Không bắt buộc)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-[#252822]"
                    />
                  </div>
                </div>
              </div>

              {/* Source & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Nguồn tiếp nhận (Source)
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as Lead['source'])}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] outline-none cursor-pointer"
                  >
                    <option value="Direct Consultation">Trực tiếp tại quầy / Hotline VICI</option>
                    <option value="Website Form">Website Form Đăng Ký</option>
                    <option value="VICI AI Advisor">MyVici AI Advisor</option>
                    <option value="VICI AI Chatbot">Chatbot Tư Vấn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Trạng thái ban đầu
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] outline-none cursor-pointer"
                  >
                    <option value="New">Mới (New) - Cần liên hệ</option>
                    <option value="Contacted">Đã liên hệ sơ bộ</option>
                    <option value="Consulting">Đang tư vấn phác đồ</option>
                    <option value="Trial">Đã hẹn lịch Scan / Tập thử</option>
                    <option value="Enrolled">Đã chốt & Nhập học</option>
                    <option value="Lost">Tạm ngưng / Chưa phù hợp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: Course Interest & Schedule */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F0E8D7] pb-2">
                <Activity className="w-4 h-4 text-[#8A6437]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A6437]">
                  2. Khóa Học & Lộ Trình Quan Tâm
                </h4>
              </div>

              {/* Interest Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#4A4E44]">
                  Gói / Dịch vụ đăng ký
                </label>
                <select
                  value={selectedInterestPreset}
                  onChange={(e) => {
                    setSelectedInterestPreset(e.target.value);
                    // Automatically adjust CRM segment based on selection
                    if (e.target.value.includes('Huấn Luyện Viên')) {
                      setCategory('TRAINER_EDUCATION');
                      setAssignedTo('Master Henry Phan');
                    } else if (e.target.value.includes('Ashtanga')) {
                      setCategory('ADVANCED');
                      setAssignedTo('Master Henry Phan');
                    } else if (e.target.value.includes('Chuông Xoay')) {
                      setCategory('WORKSHOP');
                      setAssignedTo('Master Mỹ Kiều');
                    } else if (e.target.value.includes('Newbie') || e.target.value.includes('Căn Bản')) {
                      setCategory('BEGINNER');
                    } else if (e.target.value.includes('Scan') || e.target.value.includes('Trị Liệu')) {
                      setCategory('THERAPY_INTEREST');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] font-medium outline-none cursor-pointer"
                >
                  {COMMON_INTERESTS.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                {selectedInterestPreset === 'Khác (Nhập tự do bên dưới)' && (
                  <input
                    type="text"
                    placeholder="Nhập tên khóa học hoặc nhu cầu cụ thể..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D69A2D] focus:bg-white outline-none text-[#252822]"
                    autoFocus
                  />
                )}
              </div>

              {/* Category, Preferred Time, Preferred Format */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Phân khúc CRM (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LeadCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] outline-none cursor-pointer"
                  >
                    <option value="THERAPY_INTEREST">Trị Liệu Cơ Xương Khớp</option>
                    <option value="BEGINNER">Người Mới Bắt Đầu (Newbie)</option>
                    <option value="ADVANCED">Nâng Cao / Ashtanga</option>
                    <option value="TRAINER_EDUCATION">Đào Tạo Huấn Luyện Viên</option>
                    <option value="WORKSHOP">Workshop Chuông Xoay / Tinh Thần</option>
                    <option value="GENERAL_INQUIRY">Tìm Hiểu Chung / Học Phí</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Khung giờ mong muốn</span>
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] outline-none cursor-pointer"
                  >
                    <option value="Ca Sáng Sớm (05:30 - 06:30)">Ca Sáng Sớm (05:30 - 06:30)</option>
                    <option value="Ca Sáng (09:00 - 10:00)">Ca Sáng (09:00 - 10:00)</option>
                    <option value="Ca Trưa (11:45 - 12:45)">Ca Trưa Văn Phòng (11:45 - 12:45)</option>
                    <option value="Ca Chiều Tan Ca (17:45 - 18:45)">Ca Chiều Tan Ca (17:45 - 18:45)</option>
                    <option value="Ca Tối (19:00 - 20:00)">Ca Tối (19:00 - 20:00)</option>
                    <option value="Cuối tuần (Thứ 7 - Chủ Nhật)">Cuối tuần (Thứ 7 - Chủ Nhật)</option>
                    <option value="Linh hoạt theo thỏa thuận">Linh hoạt theo thỏa thuận</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Hình thức tham gia
                  </label>
                  <select
                    value={preferredFormat}
                    onChange={(e) => setPreferredFormat(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] outline-none cursor-pointer"
                  >
                    <option value="Trực tiếp tại Studio">Trực tiếp tại Studio Opal Boulevard</option>
                    <option value="Kèm riêng 1:1 (PT) Cá Nhân Hóa">Kèm riêng 1:1 (PT) Cá Nhân Hóa</option>
                    <option value="Lớp Trị Liệu Nhóm Nhỏ (5-8 học viên)">Lớp Trị Liệu Nhóm Nhỏ (5-8 HV)</option>
                    <option value="Online tương tác có HLV sửa thế">Online tương tác có HLV</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Condition, Goals & Experience */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F0E8D7] pb-2">
                <Target className="w-4 h-4 text-[#8A6437]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A6437]">
                  3. Thể Trạng & Mục Tiêu Trị Liệu
                </h4>
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#4A4E44]">
                  Kinh nghiệm tập luyện
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Chưa từng tập Yoga', 'Dưới 6 tháng', '6 tháng - 1 năm', 'Trên 1 năm'].map(
                    (exp) => (
                      <button
                        type="button"
                        key={exp}
                        onClick={() => setExperience(exp)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          experience === exp
                            ? 'bg-[#8A6437] text-white border-[#8A6437] shadow-xs'
                            : 'bg-[#FAF7F0] text-[#555A4E] border-[#D5C7AA] hover:border-[#8A6437]'
                        }`}
                      >
                        {exp}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Preset Goals Tags */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#4A4E44] block">
                  Mục tiêu cải thiện & Bệnh lý (Chọn nhanh):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_GOALS.map((goal) => {
                    const isSelected = goals.includes(goal);
                    return (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => handleToggleGoal(goal)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100/80 text-amber-900 border-[#D69A2D]'
                            : 'bg-[#FAF7F0] text-gray-600 border-[#D5C7AA] hover:bg-white'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[#8A6437]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        )}
                        <span>{goal}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom goal input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Thêm mục tiêu hoặc mô tả triệu chứng khác..."
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomGoal();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] outline-none text-[#252822]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomGoal}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] hover:border-[#8A6437] text-xs font-semibold text-[#8A6437] transition-all cursor-pointer"
                  >
                    + Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 4: Internal CRM & Trainer Assignment */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F0E8D7] pb-2">
                <Award className="w-4 h-4 text-[#8A6437]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A6437]">
                  4. Điều Phối & Đánh Giá Tiềm Năng (Nội Bộ)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Lead Score */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Điểm đánh giá (Lead Score)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLeadScore('HOT')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        leadScore === 'HOT'
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-[#FAF7F0] text-rose-700 border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      🔥 HOT
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadScore('WARM')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        leadScore === 'WARM'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-[#FAF7F0] text-amber-800 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      ⚡ WARM
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadScore('COLD')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        leadScore === 'COLD'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                          : 'bg-[#FAF7F0] text-blue-700 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      ❄ COLD
                    </button>
                  </div>
                </div>

                {/* Assigned Trainer */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4A4E44]">
                    Huấn luyện viên phụ trách
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] text-[#252822] font-semibold outline-none cursor-pointer"
                  >
                    <option value="Master Henry Phan">Master Henry Phan (Giám đốc chuyên môn / Phục hồi L4-L5 / Ashtanga)</option>
                    <option value="Master Mỹ Kiều">Master Mỹ Kiều (Chuyên gia Chuông xoay & Yin Yoga)</option>
                    <option value="HLV Kiều Hùng">HLV Kiều Hùng (Căn chỉnh định tuyến)</option>
                    <option value="Đội ngũ HLV VICI">Đội ngũ Huấn Luyện Viên VICI</option>
                  </select>
                </div>
              </div>

              {/* Staff Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#4A4E44] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>Ghi chú tư vấn / Tiền sử bệnh án</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm về công việc, mức độ đau, thời gian rảnh rỗi hoặc dặn dò HLV..."
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-[#252822]"
                />
              </div>

              {/* Next Action */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#4A4E44] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D69A2D]" />
                  <span>Hành động tiếp theo (Next Action)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gọi điện hẹn lịch Scan 1:1 lúc 18h thứ 3..."
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-[#252822]"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-[#FAF7F0] border-t border-[#E8DFC8] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D5C7AA] text-xs font-semibold text-[#555A4E] hover:bg-white transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8A6437] to-[#6F4E27] hover:from-[#76552E] hover:to-[#5E4220] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu dữ liệu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu Hồ Sơ Khách Hàng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
