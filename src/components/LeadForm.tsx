import { useState, FormEvent, useEffect } from 'react';
import { Send, CheckCircle2, Sparkles, Phone, Mail, User, Clock, AlertCircle, Check, Tag, FileSpreadsheet, Facebook, Instagram } from 'lucide-react';
import { VICI_INFO } from '../data/viciData';
import { Lead } from '../types';
import { syncLeadToGoogleSheet } from '../services/googleSheetsService';
import { saveLeadToFirestore } from '../services/firebase';
import { analyzeCustomerSegmentAndSchedule } from '../utils/customerSegmentation';

interface LeadFormProps {
  prefilledCourse?: string;
  onLeadSubmitted?: (lead: Lead) => void;
}

// Available course and service packages to tick/register
const COURSE_PACKAGES = [
  {
    id: 'scan-650k',
    name: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy',
    price: '650.000đ',
    badge: 'Khuyên Dùng Buổi Đầu',
    desc: 'Tầm soát điểm đau, đo biên độ vận động khớp & tư vấn phác đồ 1-1',
  },
  {
    id: 'pkg-3-months',
    name: 'Gói Yoga Cá Nhân Hóa 3 Tháng',
    price: '2.550.000đ',
    badge: 'Phổ Biến',
    desc: 'Lớp nhóm cá nhân hóa theo TKB (tương đương 850.000đ/tháng)',
  },
  {
    id: 'pkg-6-months',
    name: 'Gói Yoga Cá Nhân Hóa 6 Tháng',
    price: '4.800.000đ',
    badge: 'Tiết Kiệm',
    desc: 'Liệu trình chuyển hóa cơ thể & phục hồi cột sống (800.000đ/tháng)',
  },
  {
    id: 'pkg-1-year',
    name: 'Gói Đặc Biệt 1 Năm (All-in-One VIP)',
    price: '8.000.000đ/năm',
    badge: 'VIP Trọn Gói',
    desc: 'Toàn quyền tham gia lớp + Tặng 1 buổi Trị liệu 1-1 + 1 Workshop',
  },
  {
    id: 'ashtanga-advanced',
    name: 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống',
    price: '1.290.000đ',
    badge: 'Nâng Cao',
    desc: 'Khóa 10 chuyên đề nâng cao kỹ thuật uốn lưng & thăng bằng',
  },
  {
    id: 'hlv-training',
    name: 'Khóa Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500)',
    price: 'Tư vấn riêng',
    badge: 'Nghề HLV',
    desc: 'Đào tạo HLV Yoga Trị liệu chuyên nghiệp cấp bằng quốc tế Yoga Alliance',
  },
  {
    id: 'therapy-1on1',
    name: 'Trị Liệu Chuyên Sâu 1-1 Cá Nhân Hóa',
    price: '1.200.000đ/buổi',
    badge: 'Kèm 1-1',
    desc: 'Chuyên gia trực tiếp nắn chỉnh phục hồi chức năng hệ cơ xương khớp',
  },
  {
    id: 'singing-bowl-ws',
    name: 'Workshop Liệu Pháp Chuông Xoay & Chánh Niệm',
    price: '1.200.000đ',
    badge: 'Healing',
    desc: 'Chữa lành sóng não, giải tỏa stress và chăm sóc giấc ngủ sâu',
  },
  {
    id: 'corporate-wellness',
    name: 'Gói Sức Khỏe Doanh Nghiệp (Corporate Wellness)',
    price: 'Thiết kế riêng',
    badge: 'Doanh Nghiệp',
    desc: 'Yoga trị liệu cột sống & workshop giải tỏa áp lực văn phòng',
  },
];

export default function LeadForm({ prefilledCourse, onLeadSubmitted }: LeadFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [customCourseNote, setCustomCourseNote] = useState('');
  const [timePreference, setTimePreference] = useState('');
  const [experience, setExperience] = useState('Chưa từng tập Yoga');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize prefilledCourse when clicked from course cards or timetable
  useEffect(() => {
    if (prefilledCourse) {
      setSelectedCourses((prev) => {
        // Find existing match by loose string
        const matched = COURSE_PACKAGES.find(
          (c) =>
            c.name.toLowerCase() === prefilledCourse.toLowerCase() ||
            prefilledCourse.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(prefilledCourse.toLowerCase())
        );
        const courseToAdd = matched ? matched.name : prefilledCourse;
        if (prev.includes(courseToAdd)) return prev;
        return [courseToAdd, ...prev];
      });
    }
  }, [prefilledCourse]);

  const goalOptions = [
    'Giảm đau mỏi vai gáy / cổ',
    'Phục hồi và chăm sóc cột sống',
    'Cải thiện giấc ngủ & xả stress',
    'Tăng độ dẻo dai & linh hoạt',
    'Học Yoga nâng cao / Ashtanga',
    'Định hướng trở thành HLV Yoga',
    'Workshop Chuông Xoay thư giãn',
  ];

  // Toggle course checkbox selection
  const handleCourseToggle = (courseName: string) => {
    setErrorMessage('');
    if (selectedCourses.includes(courseName)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== courseName));
    } else {
      setSelectedCourses([...selectedCourses, courseName]);
    }
  };

  const handleGoalToggle = (g: string) => {
    if (selectedGoals.includes(g)) {
      setSelectedGoals(selectedGoals.filter((item) => item !== g));
    } else {
      setSelectedGoals([...selectedGoals, g]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên của bạn.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 8 chữ số).');
      return;
    }

    // Determine final selected course(s)
    const combinedCourses = [...selectedCourses];
    if (customCourseNote.trim() && !combinedCourses.includes(customCourseNote.trim())) {
      combinedCourses.push(customCourseNote.trim());
    }

    if (combinedCourses.length === 0) {
      setErrorMessage('Vui lòng tích chọn ít nhất một khóa học hoặc dịch vụ bạn muốn đăng ký.');
      return;
    }

    if (!consent) {
      setErrorMessage('Vui lòng tích chọn đồng ý vào ô bên dưới để VICI liên hệ tư vấn bảo mật.');
      return;
    }

    setIsSubmitting(true);

    const primaryInterest = combinedCourses.join(' + ');

    // Use intelligent analyzer to accurately determine segment, schedule, recommended course and goals
    const fullAnalysisContext = `${primaryInterest}. Mục tiêu: ${selectedGoals.join(', ')}. Ghi chú: ${notes}. Kinh nghiệm: ${experience}.`;
    const analysis = analyzeCustomerSegmentAndSchedule(
      fullAnalysisContext,
      primaryInterest,
      timePreference || 'Linh hoạt theo nhu cầu',
      selectedGoals
    );

    const newLeadData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source: 'Website Form' as const,
      interest: primaryInterest,
      category: analysis.category,
      experience,
      goals: selectedGoals.length > 0 ? selectedGoals : analysis.goals,
      preferredTime: timePreference?.trim() || 'Linh hoạt theo nhu cầu',
      recommendedCourse: analysis.recommendedCourse || primaryInterest,
      leadScore: 'HOT' as const,
      assignedTo: analysis.assignedTo,
      staffNotes: notes
        ? `[Phân khúc: ${analysis.categoryLabel}] Khóa: [${primaryInterest}]. Ca: ${timePreference || 'Linh hoạt'}. Ghi chú: ${notes}`
        : `[Phân khúc: ${analysis.categoryLabel}] Khóa: [${primaryInterest}] qua Website Form`,
      nextAction: `${analysis.assignedTo} gọi điện tư vấn chuyên môn trong 24h`,
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadData),
      });

      const result = await response.json();
      if (result.success && result.lead) {
        setSubmittedLead(result.lead);
        if (onLeadSubmitted) onLeadSubmitted(result.lead);
        // Sync to Firebase Firestore for multi-device CRM
        saveLeadToFirestore(result.lead).catch((e) => console.warn('Firebase sync notice:', e));
        // Simultaneously sync to Google Sheet
        syncLeadToGoogleSheet(result.lead).catch((e) => console.warn('Background sheet sync notice:', e));
      } else {
        throw new Error(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      // Fallback local lead generation if offline
      const localLead: Lead = {
        id: `VICI-LEAD-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'New',
        assignedTo: 'Master Mỹ Kiều',
        ...newLeadData,
      };
      setSubmittedLead(localLead);
      if (onLeadSubmitted) onLeadSubmitted(localLead);
      saveLeadToFirestore(localLead).catch((e) => console.warn('Firebase offline sync notice:', e));
      // Simultaneously sync to Google Sheet
      syncLeadToGoogleSheet(localLead).catch((e) => console.warn('Background sheet sync notice:', e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedLead(null);
    setName('');
    setPhone('');
    setEmail('');
    setSelectedCourses([]);
    setCustomCourseNote('');
    setNotes('');
    setConsent(false);
    setSelectedGoals([]);
  };

  return (
    <section id="contact-form" className="py-20 bg-[#FFFDF8] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F0] rounded-3xl border border-[#E8DFC8] shadow-md overflow-hidden p-6 sm:p-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D69A2D]/15 text-[#9E6910] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tư vấn tận tâm &amp; bảo mật</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#252822] font-serif-display mb-2">
              Đăng Ký Nhận Tư Vấn Khóa Học
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5F52]">
              Tích chọn khóa học bạn quan tâm để Master Henry Phan và đội ngũ VICI hỗ trợ thiết lập lộ trình luyện tập an toàn, phù hợp với cơ thể bạn.
            </p>
          </div>

          {/* Success State */}
          {submittedLead ? (
            <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#E8DFC8] text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#252822] font-serif-display">
                Đăng Ký Thành Công!
              </h3>
              <p className="text-sm text-[#555A4E] max-w-md mx-auto leading-relaxed">
                Cảm ơn <strong>{submittedLead.name}</strong>. Đội ngũ VICI đã nhận được thông tin đăng ký và sẽ liên hệ qua số điện thoại{' '}
                <strong>{submittedLead.phone}</strong> trong thời gian sớm nhất để tư vấn chương trình chi tiết.
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã ghi nhận vào Admin CRM &amp; đồng bộ lên Google Sheet</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E8DFC8] text-xs text-[#555A4E] text-left max-w-md mx-auto space-y-1.5">
                <p>
                  <strong>Mã hồ sơ:</strong> <span className="font-mono text-[#8A6437]">{submittedLead.id}</span>
                </p>
                <p>
                  <strong>Khóa học đã tích chọn:</strong>{' '}
                  <span className="text-[#252822] font-semibold">{submittedLead.interest}</span>
                </p>
                <p>
                  <strong>Khung giờ mong muốn:</strong> {submittedLead.preferredTime || 'Linh hoạt'}
                </p>
              </div>

              <div className="pt-4">
                <button
                  id="lead-form-reset-btn"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-full border border-[#D5C7AA] text-xs font-bold text-[#8A6437] hover:bg-[#F4EADA]/60 transition-all cursor-pointer"
                >
                  Đăng ký thêm cho người thân / Đăng ký lại
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Row 1: Full name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8A6437] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Ví dụ: Nguyễn Thị Mai Lan"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] focus:ring-1 focus:ring-[#D69A2D] outline-none text-base sm:text-sm text-[#252822] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-1.5">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8A6437] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Ví dụ: 0912 345 678"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] focus:ring-1 focus:ring-[#D69A2D] outline-none text-base sm:text-sm text-[#252822] placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Time Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-1.5">
                    Email (nhận tài liệu &amp; phác đồ)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A6437] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mailan.nguyen@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] focus:ring-1 focus:ring-[#D69A2D] outline-none text-base sm:text-sm text-[#252822] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-1.5">
                    Khung giờ học mong muốn
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#8A6437] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={timePreference}
                      onChange={(e) => setTimePreference(e.target.value)}
                      placeholder="Ví dụ: Tối 19:00 - 20:00 hoặc Sáng sớm 06:00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] outline-none text-base sm:text-sm text-[#252822] placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* COURSE SELECTION SECTION (INTERACTIVE CHECKBOXES) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44]">
                    Tích chọn Khóa học hoặc Dịch vụ bạn quan tâm <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-[#8A6437]">
                    Đã chọn:{' '}
                    <span className="px-2 py-0.5 rounded-full bg-[#D69A2D]/15 text-[#9E6910] font-bold">
                      {selectedCourses.length} khóa
                    </span>
                  </span>
                </div>
                <p className="text-[11px] text-[#717769] mb-3">
                  (Nhấp chuột hoặc chạm vào ô bất kỳ để tích chọn hoặc bỏ chọn khóa học)
                </p>

                {/* Custom/External prefilled course tag if not in standard list */}
                {prefilledCourse &&
                  !COURSE_PACKAGES.some(
                    (c) => c.name.toLowerCase() === prefilledCourse.toLowerCase()
                  ) && (
                    <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#8A6437]">
                        <Tag className="w-4 h-4 text-[#D69A2D] shrink-0" />
                        <span>
                          Lớp đang chọn từ lịch trình: <strong>{prefilledCourse}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCourseToggle(prefilledCourse)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedCourses.includes(prefilledCourse)
                            ? 'bg-[#D69A2D] text-white shadow-xs'
                            : 'bg-white border border-amber-300 text-[#8A6437]'
                        }`}
                      >
                        {selectedCourses.includes(prefilledCourse) ? '✓ Đã tích chọn' : '+ Tích chọn'}
                      </button>
                    </div>
                  )}

                {/* Grid of Course Checkbox Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COURSE_PACKAGES.map((pkg) => {
                    const isChecked = selectedCourses.includes(pkg.name);
                    return (
                      <div
                        key={pkg.id}
                        id={`course-checkbox-${pkg.id}`}
                        onClick={() => handleCourseToggle(pkg.name)}
                        className={`group p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-[#FAF4E8] border-[#D69A2D] shadow-xs ring-1 ring-[#D69A2D]/40'
                            : 'bg-white border-[#E8DFC8] hover:border-[#D5C7AA] hover:bg-[#FFFDF8]'
                        }`}
                      >
                        {/* Checkbox Visual Box */}
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md shrink-0 flex items-center justify-center border transition-all duration-200 ${
                            isChecked
                              ? 'bg-[#D69A2D] border-[#D69A2D] text-white shadow-xs'
                              : 'border-[#C4B595] bg-white group-hover:border-[#8A6437]'
                          }`}
                        >
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#C4B595]/40" />
                          )}
                        </div>

                        {/* Hidden Native Checkbox for form compatibility */}
                        <input
                          type="checkbox"
                          name="courses"
                          value={pkg.name}
                          checked={isChecked}
                          onChange={() => handleCourseToggle(pkg.name)}
                          className="sr-only"
                          aria-label={pkg.name}
                        />

                        {/* Card Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <h4
                              className={`text-xs sm:text-[13px] font-bold line-clamp-1 ${
                                isChecked ? 'text-[#8A6437]' : 'text-[#252822]'
                              }`}
                            >
                              {pkg.name}
                            </h4>
                            {pkg.badge && (
                              <span className="shrink-0 text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#D69A2D]/15 text-[#9E6910]">
                                {pkg.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#D69A2D]">{pkg.price}</span>
                          </div>

                          <p className="text-[11px] text-[#6B7260] line-clamp-2 mt-1 leading-snug">
                            {pkg.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Note or Custom Class */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={customCourseNote}
                    onChange={(e) => setCustomCourseNote(e.target.value)}
                    placeholder="Hoặc nhập tên lớp / yêu cầu khung giờ riêng khác..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] outline-none text-xs text-[#252822] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row: Experience & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-1.5">
                    Kinh nghiệm tập Yoga của bạn
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] outline-none text-xs sm:text-sm text-[#252822] cursor-pointer"
                  >
                    <option value="Chưa từng tập Yoga">Chưa từng tập Yoga (Mới bắt đầu)</option>
                    <option value="Dưới 6 tháng">Dưới 6 tháng</option>
                    <option value="6 - 12 tháng">6 - 12 tháng</option>
                    <option value="Trên 1 năm">Trên 1 năm</option>
                    <option value="Tôi đang là HLV Yoga">Tôi đang là HLV Yoga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-1.5">
                    Tình trạng cơ thể hoặc ghi chú thêm
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Tôi hay bị tê mỏi cổ vai gáy bên phải..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#D5C7AA] focus:border-[#D69A2D] outline-none text-xs sm:text-sm text-[#252822] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Goals Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4E44] mb-2">
                  Mục tiêu chính của bạn (tích chọn các mục phù hợp)
                </label>
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map((g) => {
                    const isSelected = selectedGoals.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => handleGoalToggle(g)}
                        className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 select-none ${
                          isSelected
                            ? 'bg-[#8A6437] text-white border-[#8A6437] shadow-2xs'
                            : 'bg-white text-[#555A4E] border-[#D5C7AA] hover:border-[#8A6437]'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                            isSelected
                              ? 'bg-white text-[#8A6437] font-bold'
                              : 'border border-[#C4B595]'
                          }`}
                        >
                          {isSelected ? '✓' : '+'}
                        </span>
                        <span>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consent Checkbox (CLEAR, PROMINENT & HIGHLY CLICKABLE) */}
              <div className="pt-2">
                <div
                  id="consent-box-container"
                  onClick={() => {
                    setConsent(!consent);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    consent
                      ? 'bg-[#FAF4E8] border-[#D69A2D] shadow-xs'
                      : 'bg-white border-[#E8DFC8] hover:border-[#D5C7AA]'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      consent
                        ? 'bg-[#D69A2D] border-[#D69A2D] text-white shadow-xs'
                        : 'border-[#C4B595] bg-white'
                    }`}
                  >
                    {consent ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                  </div>

                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="sr-only"
                  />

                  <div className="text-xs sm:text-[13px] text-[#4A4E44] leading-relaxed cursor-pointer">
                    Tôi đồng ý để <strong>VICI Yoga Therapy Training Center</strong> sử dụng thông
                    tin này cho mục đích liên hệ tư vấn lộ trình luyện tập phù hợp. (VICI cam kết
                    bảo mật thông tin cá nhân 100%).
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 text-center">
                <button
                  id="lead-form-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#D69A2D] text-white font-bold text-sm sm:text-base hover:bg-[#B87A14] shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang gửi thông tin...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Nhận tư vấn từ VICI</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#8A8F82] mt-2">
                  Hotline hỗ trợ trực tiếp: <strong>{VICI_INFO.hotline}</strong> (Thầy Henry Phan)
                </p>

                {/* Social media connections of VICI */}
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-[#717769]">
                  <span className="text-[11px]">Kênh chính thức:</span>
                  <a
                    href={VICI_INFO.socialLinks.facebookCenter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#1877F2] hover:underline font-medium"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                  <span>•</span>
                  <a
                    href={VICI_INFO.socialLinks.instagramCenter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#E1306C] hover:underline font-medium"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
