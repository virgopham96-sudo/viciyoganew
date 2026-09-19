import { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { VICI_ASSETS } from '../data/viciData';

interface ScheduleProps {
  onOpenRegister: (courseName?: string) => void;
}

export default function Schedule({ onOpenRegister }: ScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFullScheduleModal, setShowFullScheduleModal] = useState<boolean>(false);

  // Handle Escape key to close timetable modal
  useEffect(() => {
    if (!showFullScheduleModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowFullScheduleModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullScheduleModal]);

  const daysList = [
    { id: 'all', label: 'Tất cả các ngày' },
    { id: 'Thứ 2', label: 'Thứ 2' },
    { id: 'Thứ 3', label: 'Thứ 3' },
    { id: 'Thứ 4', label: 'Thứ 4' },
    { id: 'Thứ 5', label: 'Thứ 5' },
    { id: 'Thứ 6', label: 'Thứ 6' },
    { id: 'Thứ 7', label: 'Thứ 7' },
  ];

  const categories = [
    { id: 'all', label: 'Tất cả nhóm lớp' },
    { id: 'Lớp nền tảng', label: 'Yoga For Newbie / Nền tảng' },
    { id: 'Trị liệu mục tiêu', label: 'Trị liệu Cổ Vai Gáy / Khớp Hông' },
    { id: 'Kéo giãn / phục hồi', label: 'Kéo giãn & Phục hồi' },
    { id: 'Thể lực / flow', label: 'Thể lực / Vinyasa' },
    { id: 'Nâng cao / trị liệu cột sống', label: 'Ashtanga & Cột sống' },
    { id: 'Khoá đào tạo HLV', label: 'Đào tạo HLV Quốc Tế' },
  ];

  // Verified items from official timetable
  const scheduleRows = [
    { id: 1, day: 'Thứ 2', time: '05:00 – 06:00', name: 'Yoga For Newbie', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Xây nền tảng vững, tập thở đúng cách' },
    { id: 2, day: 'Thứ 3', time: '05:00 – 06:00', name: 'Yoga For Newbie', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Tư thế căn bản, nhịp độ chậm rãi' },
    { id: 3, day: 'Thứ 4', time: '05:00 – 06:00', name: 'Yoga For Newbie', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Dành cho người mới tập' },
    { id: 4, day: 'Thứ 5', time: '05:00 – 06:00', name: 'Yoga For Newbie', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Thở định tâm & kéo giãn nhẹ' },
    { id: 5, day: 'Thứ 6', time: '05:00 – 06:00', name: 'Yoga For Newbie', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Khởi đầu ngày mới an yên' },

    { id: 6, day: 'Thứ 2', time: '06:30 – 07:30', name: 'Yoga Stretching (Kéo giãn)', category: 'Kéo giãn / phục hồi', instructor: 'HLV Linh Anna', note: 'Giảm căng cơ, tăng độ dẻo dai toàn thân' },
    { id: 7, day: 'Thứ 3', time: '06:30 – 07:30', name: 'Hip Opening (Mở khớp hông)', category: 'Trị liệu mục tiêu', instructor: 'Master Mỹ Kiều', note: 'Giải phóng căng cứng vùng hông & chậu' },
    { id: 8, day: 'Thứ 4', time: '06:30 – 07:30', name: 'Shoulder & Upperback (Mở vai & lưng trên)', category: 'Trị liệu mục tiêu', instructor: 'HLV Linh Anna', note: 'Chuyên đề giải tỏa mỏi vai gáy cho dân văn phòng' },
    { id: 9, day: 'Thứ 5', time: '06:30 – 07:30', name: 'Twisting Yoga (Vặn xoắn cột sống)', category: 'Trị liệu mục tiêu', instructor: 'Master Mỹ Kiều', note: 'Hỗ trợ linh hoạt cột sống & hệ tiêu hóa' },
    { id: 10, day: 'Thứ 6', time: '06:30 – 07:30', name: 'Yoga Balance (Thăng bằng & Thể lực)', category: 'Thể lực / flow', instructor: 'Master Henry Phan', note: 'Kích hoạt nhóm cơ lõi và sự tập trung' },

    { id: 11, day: 'Thứ 2', time: '08:00 – 09:00', name: 'Hatha Yoga Truyền Thống', category: 'Lớp nền tảng', instructor: 'HLV Linh Anna', note: 'Tư thế giữ lâu, căn chỉnh định tuyến chuẩn' },
    { id: 12, day: 'Thứ 3', time: '08:00 – 09:00', name: 'Vinyasa Yoga', category: 'Thể lực / flow', instructor: 'Master Henry Phan', note: 'Chuỗi chuyển động nối liền theo hơi thở' },
    { id: 13, day: 'Thứ 4', time: '08:00 – 09:00', name: 'Yin Yoga Thư Giãn Sâu', category: 'Kéo giãn / phục hồi', instructor: 'Master Mỹ Kiều', note: 'Tác động sâu vào mạc cơ và khớp xương' },
    { id: 14, day: 'Thứ 5', time: '08:00 – 09:00', name: 'Yoga Detox Giảm Cân', category: 'Thể lực / flow', instructor: 'HLV Linh Anna', note: 'Vận động chuyển hóa năng lượng tích cực' },
    { id: 15, day: 'Thứ 6', time: '08:00 – 09:00', name: 'Ashtanga (Chăm sóc cột sống)', category: 'Nâng cao / trị liệu cột sống', instructor: 'Master Henry Phan', note: 'Chuỗi Ashtanga chuẩn hóa bảo vệ đốt sống' },

    { id: 16, day: 'Thứ 2', time: '09:00 – 12:00', name: 'Đào Tạo HLV Yoga Quốc Tế', category: 'Khoá đào tạo HLV', instructor: 'Master Henry Phan', note: 'Chuẩn Yoga Alliance Hoa Kỳ (E-RYT 500)' },
    { id: 17, day: 'Thứ 4', time: '09:00 – 12:00', name: 'Đào Tạo HLV Yoga Quốc Tế', category: 'Khoá đào tạo HLV', instructor: 'Master Henry Phan', note: 'Lý thuyết giải phẫu học và trị liệu 6D' },
    { id: 18, day: 'Thứ 6', time: '09:00 – 12:00', name: 'Đào Tạo HLV Yoga Quốc Tế', category: 'Khoá đào tạo HLV', instructor: 'Master Henry Phan', note: 'Thực hành đứng lớp & căn chỉnh học viên' },

    { id: 19, day: 'Thứ 3', time: '14:00 – 15:30', name: 'Yoga Nâng Cao Ashtanga & Cột Sống', category: 'Nâng cao / trị liệu cột sống', instructor: 'Master Henry Phan', note: '10 chuyên đề uốn lưng, mở vai, handstand' },
    { id: 20, day: 'Thứ 5', time: '14:00 – 15:30', name: 'Yoga Nâng Cao Ashtanga & Cột Sống', category: 'Nâng cao / trị liệu cột sống', instructor: 'Master Henry Phan', note: 'Trực tiếp Master Henry chỉnh sửa trục an toàn' },

    { id: 21, day: 'Thứ 2', time: '17:45 – 18:45', name: 'Hatha Yoga Tan Ca', category: 'Lớp nền tảng', instructor: 'HLV Linh Anna', note: 'Thư giãn cột sống sau giờ làm' },
    { id: 22, day: 'Thứ 3', time: '17:45 – 18:45', name: 'Open Shoulder (Mở vai gáy)', category: 'Trị liệu mục tiêu', instructor: 'HLV Linh Anna', note: 'Chống gù lưng và xoa dịu đau mỏi vai' },
    { id: 23, day: 'Thứ 4', time: '17:45 – 18:45', name: 'Dynamic Yoga', category: 'Thể lực / flow', instructor: 'HLV VICI', note: 'Tăng sức bền và độ dẻo dai' },
    { id: 24, day: 'Thứ 5', time: '17:45 – 18:45', name: 'Hip Opening (Mở khớp hông)', category: 'Trị liệu mục tiêu', instructor: 'HLV Linh Anna', note: 'Giảm áp lực thắt lưng do ngồi ghế lâu' },
    { id: 25, day: 'Thứ 6', time: '17:45 – 18:45', name: 'Yoga Stretching (Kéo giãn sâu)', category: 'Kéo giãn / phục hồi', instructor: 'HLV VICI', note: 'Thư thái kết thúc tuần làm việc' },

    { id: 26, day: 'Thứ 2', time: '19:00 – 20:00', name: 'Yoga For Newbie Tối', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Khung giờ thuận tiện cho người mới' },
    { id: 27, day: 'Thứ 3', time: '19:00 – 20:00', name: 'Gentle Yoga Phục Hồi', category: 'Kéo giãn / phục hồi', instructor: 'Master Mỹ Kiều', note: 'Vận động nhẹ nhàng, chuẩn bị cho giấc ngủ' },
    { id: 28, day: 'Thứ 4', time: '19:00 – 20:00', name: 'Yoga For Newbie Tối', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Căn chỉnh hơi thở định tâm' },
    { id: 29, day: 'Thứ 5', time: '19:00 – 20:00', name: 'Yoga Therapy (Chuông Xoay)', category: 'Kéo giãn / phục hồi', instructor: 'Master Mỹ Kiều', note: 'Trị liệu âm thanh sóng rung chuông xoay' },
    { id: 30, day: 'Thứ 6', time: '19:00 – 20:00', name: 'Yoga For Newbie Tối', category: 'Lớp nền tảng', instructor: 'Đội ngũ HLV VICI', note: 'Khép lại tuần làm việc nhẹ nhõm' },
    { id: 31, day: 'Thứ 7', time: '19:00 – 20:00', name: 'Đào Tạo HLV Thầy Henry', category: 'Khoá đào tạo HLV', instructor: 'Master Henry Phan', note: 'Bổ sung thời lượng thực hành nâng cao' },
    { id: 32, day: 'Thứ 7', time: '08:30 – 11:30', name: 'Chương Trình Đặc Biệt / Workshop', category: 'Trị liệu mục tiêu', instructor: 'Henry & Kiều Hùng', note: 'Workshop Chuông Xoay, Henry Wellness Team, Gia đình Yoga' }
  ];

  const filteredRows = scheduleRows.filter((row) => {
    const matchDay = selectedDay === 'all' || row.day === selectedDay;
    const matchCat = selectedCategory === 'all' || row.category === selectedCategory;
    return matchDay && matchCat;
  });

  return (
    <section id="schedule" className="py-20 bg-[#FFFDF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A6437]/10 text-[#8A6437] text-xs font-semibold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thời khóa biểu tuần</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-2">
              Lịch Học Tại VICI Yoga Therapy
            </h2>
            <p className="text-sm text-[#5A5F52]">
              Áp dụng Online & Offline (T9/2026 – T12/2026). Khung giờ linh hoạt từ 05:00 sáng đến 20:00 tối.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <button
              id="schedule-view-full-btn"
              onClick={() => setShowFullScheduleModal(true)}
              className="px-4 py-3 sm:py-2.5 rounded-full border border-[#D5C7AA] hover:bg-[#F8F5EE] text-xs font-semibold text-[#555A4E] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>Xem sơ đồ TKB gốc</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="schedule-book-trial-btn"
              onClick={() => onOpenRegister('Đăng ký lớp học thử theo TKB')}
              className="px-5 py-3 sm:py-2.5 rounded-full bg-[#D69A2D] text-white text-xs font-bold hover:bg-[#B87A14] shadow-2xs transition-all cursor-pointer text-center active:scale-98"
            >
              Đăng ký học thử miễn phí
            </button>
          </div>
        </div>

        {/* Day Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {daysList.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`min-h-[42px] px-4.5 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
                selectedDay === d.id
                  ? 'bg-[#8A6437] text-white shadow-xs'
                  : 'bg-[#F8F5EE] text-[#555A4E] hover:bg-[#EFE7D5]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown/Pills for Mobile & Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs no-scrollbar">
          <span className="text-[#717769] font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc nhóm lớp:
          </span>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer font-medium active:scale-97 flex items-center justify-center ${
                selectedCategory === c.id
                  ? 'bg-[#D69A2D] text-white font-semibold shadow-2xs'
                  : 'bg-[#FFFDF8] border border-[#E8DFC8] text-[#63685C] hover:border-[#D69A2D]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Timetable Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#E8DFC8] shadow-2xs hover:border-[#D69A2D] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8A6437]/10 text-[#8A6437] text-[11px] font-bold">
                    {row.day}
                  </span>
                  <span className="text-xs font-semibold text-[#8A6437] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D69A2D]" />
                    {row.time}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#252822] font-serif-display mb-1">
                  {row.name}
                </h3>
                
                <p className="text-xs font-medium text-[#717769] mb-2">
                  {row.category}
                </p>

                <p className="text-xs text-[#555A4E] leading-relaxed mb-4 bg-[#F8F5EE] p-2.5 rounded-xl">
                  {row.note}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E8D7] flex items-center justify-between text-xs">
                <span className="text-[#63685C] flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-[#8A6437]" />
                  {row.instructor}
                </span>

                <button
                  onClick={() => onOpenRegister(`Lớp ${row.name} (${row.day} lúc ${row.time})`)}
                  className="min-h-[44px] px-3 py-1.5 rounded-lg hover:bg-[#FAF7F0] text-xs font-bold text-[#D69A2D] hover:text-[#B87A14] flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Chọn lớp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Special Saturday Banner */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#FAF6ED] via-[#F4EADA] to-[#FAF6ED] border border-[#DFCFAE] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold text-[#D69A2D] uppercase tracking-wider">
              Thứ 7 & Dịch vụ theo yêu cầu
            </span>
            <h4 className="text-base font-bold text-[#252822]">
              Training Tập Trung • Vườn Dược Liệu • Kèm Riêng PT 1:1 • Wellness Doanh Nghiệp
            </h4>
            <p className="text-xs text-[#63685C] mt-1">
              Các khung giờ riêng tư không cố định trong bảng tuần. Vui lòng liên hệ Hotline/Zalo 0366.840.130 để đặt lịch trước.
            </p>
          </div>

          <button
            onClick={() => onOpenRegister('Dịch vụ theo yêu cầu / Lớp Thứ 7')}
            className="px-5 py-2.5 rounded-full bg-[#8A6437] text-white text-xs font-semibold hover:bg-[#6F4E27] shrink-0 cursor-pointer"
          >
            Liên hệ đặt lịch trước
          </button>
        </div>
      </div>

      {/* Modal View Full Schedule Image */}
      {showFullScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFullScheduleModal(false);
            }
          }}
        >
          <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Thời khóa biểu VICI Yoga Kiều Hùng (T9/2026 – T12/2026)
                </h3>
                <p className="text-xs text-gray-500">
                  Khung giờ áp dụng cho cả hình thức Online & Offline tại Opal Boulevard
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="hidden sm:inline-block text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 font-mono select-none"
                  title="Nhấn phím Esc để đóng"
                >
                  Esc
                </span>
                <button
                  onClick={() => setShowFullScheduleModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                  aria-label="Đóng (Phím Esc)"
                  title="Đóng (Phím Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-auto py-4 flex-grow text-center">
              <img
                src={VICI_ASSETS.schedule.primary}
                alt="Thời khóa biểu VICI"
                className="max-w-full h-auto mx-auto rounded-xl border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs text-gray-400 mt-3">
                Nguồn tài liệu chính thức VICI Yoga Therapy
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowFullScheduleModal(false)}
                className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
