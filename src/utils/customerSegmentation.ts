import { LeadCategory, LeadScore } from '../types';

export interface CustomerSegmentDetection {
  category: LeadCategory;
  categoryLabel: string;
  interest: string;
  preferredTime: string;
  preferredSchedule: string;
  recommendedCourse: string;
  recommendedSchedule: string;
  goals: string[];
  detectedConditions: string[];
  assignedTo: string;
  leadScore: LeadScore;
}

export interface SegmentProfile {
  category: LeadCategory;
  categoryLabel: string;
  defaultInterest: string;
  recommendedCourse: string;
  recommendedSchedule: string;
  assignedTo: string;
  standardGoals: string[];
}

export const SEGMENT_PROFILES: Record<LeadCategory, SegmentProfile> = {
  TRAINER_EDUCATION: {
    category: 'TRAINER_EDUCATION',
    categoryLabel: 'Đào tạo Huấn Luyện Viên Quốc Tế',
    defaultInterest: 'Khóa Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)',
    recommendedCourse: 'Khóa Đào Tạo HLV Yoga Quốc Tế E-RYT 500 / YACEP (Yoga Alliance Hoa Kỳ)',
    recommendedSchedule: 'Sáng Thứ 2 - 4 - 6 (09:00 – 12:00)',
    assignedTo: 'Master Henry Phan',
    standardGoals: [
      'Lấy chứng chỉ Yoga Alliance quốc tế (E-RYT 500 / YACEP)',
      'Làm chủ giải phẫu học Kinesiology và định tuyến trị liệu',
      'Đủ năng lực mở studio hoặc lớp trị liệu cá nhân',
      'Nắm vững kỹ thuật nắn chỉnh an toàn (Hands-on Adjustments)'
    ]
  },
  ADVANCED: {
    category: 'ADVANCED',
    categoryLabel: 'Yoga Nâng Cao / Ashtanga',
    defaultInterest: 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 Chuyên Đề)',
    recommendedCourse: 'Khóa 10 Chuyên Đề Ashtanga Cột Sống Cùng Master Henry Phan (1.290k)',
    recommendedSchedule: 'Chiều Thứ 3 & Thứ 5 (14:00 – 15:30)',
    assignedTo: 'Master Henry Phan',
    standardGoals: [
      'Chinh phục Handstand, Pincha và thăng bằng tay an toàn',
      'Mở khớp vai và uốn lưng trên (Thoracic) không chấn thương',
      'Nâng cao thể lực và kiểm soát năng lượng hơi thở',
      'Làm chủ chuỗi động tác Ashtanga chuyên sâu'
    ]
  },
  WORKSHOP: {
    category: 'WORKSHOP',
    categoryLabel: 'Workshop & Chuông Xoay Trị Liệu',
    defaultInterest: 'Workshop Chuông Xoay Tây Tạng & Trị Liệu Âm Thanh Chữa Lành',
    recommendedCourse: 'Workshop Chuông Xoay Trị Liệu Cuối Tuần & Lớp Tối Thứ 5',
    recommendedSchedule: 'Workshop Thứ 7 (08:30 – 11:30) & Tối Thứ 5 (19:00 – 20:30)',
    assignedTo: 'Master Mỹ Kiều',
    standardGoals: [
      'Giải tỏa stress, xoa dịu hệ thần kinh giao cảm',
      'Thư giãn sâu mạc cơ và cải thiện giấc ngủ',
      'Tái tạo năng lượng bình an qua tần số chuông xoay',
      'Thực hành chánh niệm và phục hồi tinh thần'
    ]
  },
  BEGINNER: {
    category: 'BEGINNER',
    categoryLabel: 'Người Mới Bắt Đầu (Newbie)',
    defaultInterest: 'Yoga Cho Người Mới Bắt Đầu (Lớp Newbie & Căn Bản)',
    recommendedCourse: 'Lớp Yoga For Newbie (Căn chỉnh định tuyến & Thở chuẩn Kinesiology)',
    recommendedSchedule: 'Ca Sáng (06:30 – 07:30) hoặc Ca Tối (19:00 – 20:00)',
    assignedTo: 'Đội ngũ Huấn Luyện Viên Trị Liệu VICI',
    standardGoals: [
      'Làm quen bài bản với các động tác Yoga căn bản',
      'Tăng độ dẻo dai cơ thể an toàn, khắc phục cứng khớp',
      'Học kỹ thuật thở đúng và kích hoạt cơ lõi',
      'Xây dựng thói quen tập luyện đều đặn và hơi thở đúng'
    ]
  },
  THERAPY_INTEREST: {
    category: 'THERAPY_INTEREST',
    categoryLabel: 'Trị Liệu Cơ Xương Khớp',
    defaultInterest: 'Trị Liệu Cơ - Vai - Cổ - Gáy & Chỉnh Dáng Cột Sống',
    recommendedCourse: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy 1-1 (650k) & Phác đồ cá nhân hóa',
    recommendedSchedule: 'Ca Tan Ca (17:45 - 18:45) hoặc Ca Tối (19:00 - 20:00)',
    assignedTo: 'Master Mỹ Kiều',
    standardGoals: [
      'Giải tỏa co thắt cơ cổ vai gáy và hết tê bì cánh tay',
      'Căn chỉnh trục cổ sinh lý, giảm áp lực Text Neck',
      'Kích hoạt cơ lõi bảo vệ cột sống và phục hồi chức năng',
      'Thiết lập thói quen vận động đúng tư thế'
    ]
  },
  RECOVERY_THERAPY: {
    category: 'RECOVERY_THERAPY',
    categoryLabel: 'Phục Hồi Trị Liệu & ROM Test',
    defaultInterest: 'Kiểm tra Tầm Vận Động (ROM Test) & Phục Hồi Chức Năng',
    recommendedCourse: 'Kiểm Tra Tầm Vận Động (ROM Test) & Trải Nghiệm Buổi Tập Thử',
    recommendedSchedule: 'Ca Sáng (06:30 - 07:30) hoặc Ca Tối (19:00 - 20:00)',
    assignedTo: 'Master Mỹ Kiều',
    standardGoals: [
      'Đánh giá tầm vận động khớp và tầm soát điểm co thắt',
      'Kéo giãn trục dọc giải áp đốt sống và đĩa đệm',
      'Tập luyện an toàn theo định tuyến chuẩn Kinesiology',
      'Tái lập cân bằng hệ cơ xương khớp'
    ]
  },
  GENERAL_INQUIRY: {
    category: 'GENERAL_INQUIRY',
    categoryLabel: 'Tìm Hiểu Thông Tin & Lịch Tập',
    defaultInterest: 'Tìm hiểu Thời khóa biểu & Gói tập Hội viên VICI',
    recommendedCourse: 'Gói Trải Nghiệm Hội Viên 3 Tháng / 6 Tháng',
    recommendedSchedule: 'Linh hoạt theo lịch học viên',
    assignedTo: 'Đội ngũ Tư vấn VICI',
    standardGoals: [
      'Tìm hiểu môi trường tập luyện chuẩn trị liệu tại VICI',
      'Lựa chọn gói tập và khung giờ phù hợp với sinh hoạt cá nhân',
      'Nhận tư vấn trực tiếp từ chuyên gia VICI'
    ]
  }
};

/**
 * Validates and sanitizes customer goals to ensure they strictly match the designated
 * segment, preventing cross-contamination (e.g. neck pain goals appearing on Trainer Education leads).
 */
export function sanitizeGoalsForSegment(
  category: LeadCategory,
  rawGoals: string[] = [],
  contextText: string = ''
): string[] {
  const profile = SEGMENT_PROFILES[category] || SEGMENT_PROFILES.THERAPY_INTEREST;
  const standard = profile.standardGoals;
  const lowerContext = contextText.toLowerCase();

  const isInvalidForTrainer = (g: string) =>
    g.includes('đau mỏi vai gáy') ||
    g.includes('thoát vị') ||
    g.includes('người mới bắt đầu') ||
    g.includes('newbie') ||
    g.includes('chuông xoay thư giãn');

  const isInvalidForAdvanced = (g: string) =>
    g.includes('người mới') ||
    g.includes('newbie') ||
    g.includes('chưa tập bao giờ') ||
    g.includes('thoát vị đĩa đệm') ||
    g.includes('chứng chỉ hlv');

  const isInvalidForBeginner = (g: string) =>
    g.includes('handstand') ||
    g.includes('pincha') ||
    g.includes('uốn lưng sâu') ||
    g.includes('ashtanga') ||
    g.includes('chứng chỉ') ||
    g.includes('hlv');

  const isInvalidForWorkshop = (g: string) =>
    g.includes('handstand') ||
    g.includes('chứng chỉ hlv') ||
    g.includes('thể lực');

  const isInvalidForTherapy = (g: string) =>
    g.includes('chứng chỉ hlv') ||
    g.includes('mở studio') ||
    g.includes('handstand') ||
    g.includes('pincha');

  const filtered = rawGoals.filter((g) => {
    const low = g.toLowerCase();
    if (!g.trim()) return false;
    if (category === 'TRAINER_EDUCATION' && isInvalidForTrainer(low)) return false;
    if (category === 'ADVANCED' && isInvalidForAdvanced(low)) return false;
    if (category === 'BEGINNER' && isInvalidForBeginner(low)) return false;
    if (category === 'WORKSHOP' && isInvalidForWorkshop(low)) return false;
    if (category === 'THERAPY_INTEREST' && isInvalidForTherapy(low)) return false;
    return true;
  });

  // If filtered is empty or has fewer than 2 goals, fill with profile standard goals
  const result = [...filtered];
  for (const stdGoal of standard) {
    if (result.length >= 4) break;
    if (!result.some((r) => r.toLowerCase().includes(stdGoal.toLowerCase().slice(0, 12)) || stdGoal.toLowerCase().includes(r.toLowerCase().slice(0, 12)))) {
      result.push(stdGoal);
    }
  }

  return result.slice(0, 4);
}

/**
 * Filters out assistant/AI canned responses, sales pitches, or course menus
 * from the conversation text, extracting ONLY what the customer actually stated.
 */
export function extractCustomerSpeechOnly(rawText: string): string {
  if (!rawText) return '';

  const userSegments: string[] = [];

  // Check if text has USER: and AI: blocks (multiline or single-line regex)
  if (/USER:/i.test(rawText)) {
    const regex = /USER:\s*([\s\S]*?)(?=(?:AI:|$))/gi;
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      if (match[1] && match[1].trim()) {
        userSegments.push(match[1].trim());
      }
    }
  }

  // Check if text has 👤 Học viên or Học viên: prefixes
  if (userSegments.length === 0 && /(?:Học viên|Khách hàng):/i.test(rawText)) {
    const regex = /(?:👤\s*)?(?:Học viên|Khách hàng):\s*([\s\S]*?)(?=(?:🧘\s*MyVici|🧘\s*MY VICI|🧘\s*ViciCare|MyVici:|ViciCare:|VICI:|AI:|$))/gi;
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      if (match[1] && match[1].trim()) {
        userSegments.push(match[1].trim());
      }
    }
  }

  if (userSegments.length > 0) {
    return userSegments.join(' ');
  }

  // If no conversational tags, clean any known boilerplate AI menus if present
  let cleaned = rawText;
  cleaned = cleaned.replace(/Namaste![\s\S]*?đào tạo Huấn luyện viên\?/gi, ' ');
  cleaned = cleaned.replace(/Các dịch vụ trị liệu & đào tạo cốt lõi tại VICI:[\s\S]*?E-RYT 500\./gi, ' ');
  cleaned = cleaned.replace(/Đào Tạo HLV Yoga Quốc Tế E-RYT 500 \/ YACEP \(Yoga Alliance Hoa Kỳ\)/gi, ' ');
  cleaned = cleaned.replace(/Khóa Ashtanga 10 Chuyên Đề/gi, ' ');
  cleaned = cleaned.replace(/Bảng học phí tại VICI[\s\S]*?(?:hỗ trợ đăng ký cho bạn nhé!)/gi, ' ');

  return cleaned.trim();
}

/**
 * Intelligent analyzer that inspects the conversation text, customer notes,
 * selected goals, and user inputs to accurately determine:
 * 1. The exact CRM customer segment (LeadCategory) without confusion or arbitrary defaults
 * 2. The accurate interest/course recommendation
 * 3. The accurate preferred schedule matching the customer's actual choice (preserving custom/selected times)
 * 4. The customer's genuine goals and expectations
 */
export function analyzeCustomerSegmentAndSchedule(
  textToAnalyze: string,
  userProvidedCondition?: string,
  userProvidedTime?: string,
  userProvidedGoals?: string[] | string
): CustomerSegmentDetection {
  // Extract ONLY user speech to avoid AI menus triggering false segments
  const customerSpeech = extractCustomerSpeechOnly(textToAnalyze || '');
  const lower = customerSpeech.toLowerCase().trim();
  const providedCond = (userProvidedCondition || '').trim();
  const providedTime = (userProvidedTime || '').trim();

  // Parse any user-provided goals
  const inputGoals: string[] = [];
  if (Array.isArray(userProvidedGoals)) {
    userProvidedGoals.forEach((g) => {
      if (typeof g === 'string' && g.trim()) inputGoals.push(g.trim());
    });
  } else if (typeof userProvidedGoals === 'string' && userProvidedGoals.trim()) {
    userProvidedGoals
      .split(/[,;\n]/)
      .map((g) => g.trim())
      .filter(Boolean)
      .forEach((g) => inputGoals.push(g));
  }

  // =========================================================================
  // 1. DETERMINE PREFERRED TIME (KHUNG GIỜ KHÁCH HÀNG THỰC SỰ MONG MUỐN)
  // =========================================================================
  let preferredTime = 'Linh hoạt theo nhu cầu';
  let recommendedSchedule = 'Linh hoạt theo nhu cầu của học viên';

  // Check if user has an explicit, non-generic provided time
  const isGenericProvidedTime =
    !providedTime ||
    providedTime === 'Linh hoạt' ||
    providedTime === 'Linh hoạt theo nhu cầu' ||
    providedTime === 'Chưa xác định' ||
    providedTime === 'Theo lịch hẹn' ||
    providedTime.includes('Khung giờ văn phòng tiện lợi');

  // Detect specific time signals from customer conversation
  let detectedSpecificTime: string | null = null;
  let detectedSpecificSchedule: string | null = null;

  if (
    lower.includes('19h') ||
    lower.includes('19:00') ||
    lower.includes('20h') ||
    lower.includes('ca tối') ||
    lower.includes('buổi tối') ||
    lower.includes('lớp tối') ||
    lower.includes('tối sau 7h')
  ) {
    if (
      lower.includes('thứ sáu') ||
      lower.includes('thứ 6') ||
      lower.includes('mai thứ sáu') ||
      lower.includes('mai thứ 6') ||
      lower.includes('tập thử')
    ) {
      detectedSpecificTime = 'Tối Thứ Sáu (19:00 – 20:00) / Ca Tối (19:00 – 20:00, T2-T4-T6)';
      detectedSpecificSchedule = 'Lớp Yoga Trị Liệu Ca Tối (19:00 – 20:00, Thứ 2 - Thứ 4 - Thứ 6) • Lịch tập thử: Tối Thứ Sáu 19:00';
    } else {
      detectedSpecificTime = 'Tối (19:00 – 20:00)';
      detectedSpecificSchedule = 'Ca Tối Phục Hồi & Trị Liệu (19:00 – 20:00, T2-T6)';
    }
  } else if (
    lower.includes('tan ca') ||
    lower.includes('tan làm') ||
    lower.includes('17h') ||
    lower.includes('17:45') ||
    lower.includes('18h') ||
    lower.includes('sau giờ làm') ||
    lower.includes('vừa làm về')
  ) {
    detectedSpecificTime = 'Tan Ca (17:45 – 18:45)';
    detectedSpecificSchedule = 'Ca Tan Ca Thư Giãn Cổ Vai Gáy (17:45 – 18:45, T2-T6)';
  } else if (
    lower.includes('5h') ||
    lower.includes('05:00') ||
    lower.includes('05h') ||
    lower.includes('sáng sớm') ||
    lower.includes('đón bình minh') ||
    lower.includes('trước giờ làm')
  ) {
    detectedSpecificTime = 'Sáng sớm (05:00 – 06:00)';
    detectedSpecificSchedule = 'Ca Sáng Sớm (05:00 – 06:00, Thứ 2 - Thứ 6)';
  } else if (
    lower.includes('6h30') ||
    lower.includes('06:30') ||
    lower.includes('6 giờ rưỡi') ||
    lower.includes('7h') ||
    lower.includes('7 giờ')
  ) {
    detectedSpecificTime = 'Sáng (06:30 – 07:30)';
    detectedSpecificSchedule = 'Ca Sáng Trị Liệu Chuyên Đề (06:30 – 07:30, T2-T6)';
  } else if (
    lower.includes('8h') ||
    lower.includes('08:00') ||
    lower.includes('8 giờ') ||
    lower.includes('đầu giờ sáng')
  ) {
    detectedSpecificTime = 'Sáng (08:00 – 09:00)';
    detectedSpecificSchedule = 'Ca Sáng Phục Hồi & Thể Lực (08:00 – 09:00, T2-T6)';
  } else if (
    (lower.includes('buổi sáng') || lower.includes('ca sáng') || lower.includes('tập sáng')) &&
    !lower.includes('tối')
  ) {
    detectedSpecificTime = 'Buổi Sáng (05:00, 06:30 hoặc 08:00)';
    detectedSpecificSchedule = 'Các ca sáng: 05:00 - 06:00, 06:30 - 07:30 hoặc 08:00 - 09:00';
  } else if (
    lower.includes('14h') ||
    lower.includes('14:00') ||
    lower.includes('15h') ||
    lower.includes('15:30') ||
    lower.includes('buổi chiều') ||
    lower.includes('ca chiều')
  ) {
    detectedSpecificTime = 'Chiều (14:00 – 15:30)';
    detectedSpecificSchedule = 'Ca Chiều Nâng Cao Ashtanga (14:00 – 15:30 T3 & T5)';
  } else if (
    lower.includes('cuối tuần') ||
    lower.includes('thứ 7') ||
    lower.includes('thứ bảy') ||
    lower.includes('chủ nhật') ||
    lower.includes('t7') ||
    lower.includes('cn')
  ) {
    detectedSpecificTime = 'Cuối Tuần (Thứ 7 & Chủ Nhật)';
    detectedSpecificSchedule = 'Workshop Thứ 7 (08:30 - 11:30) & Lịch Scan 1-1 Cuối Tuần';
  } else if (
    lower.includes('văn phòng') ||
    lower.includes('hành chính') ||
    lower.includes('giờ hành chính')
  ) {
    detectedSpecificTime = 'Khung giờ văn phòng tiện lợi (Sáng 05:00 / Tan ca 17:45 / Tối 19:00)';
    detectedSpecificSchedule = 'Tùy chọn: Tan ca (17:45 - 18:45), Tối (19:00 - 20:00) hoặc Sáng sớm (05:00 - 06:00)';
  }

  if (detectedSpecificTime) {
    preferredTime = detectedSpecificTime;
    recommendedSchedule = detectedSpecificSchedule || detectedSpecificTime;
  } else if (!isGenericProvidedTime && providedTime.length >= 3) {
    preferredTime = providedTime;
    recommendedSchedule = providedTime;
  }

  // =========================================================================
  // 2. DETECT SIGNALS & PATHOLOGY (NHẬN DIỆN CHÍNH XÁC TÌNH TRẠNG HỌC VIÊN)
  // =========================================================================
  const detectedConditions: string[] = [];
  const detectedGoals: string[] = [];

  // Signal: Musculoskeletal Therapy (Trị liệu Cơ Xương Khớp - Cổ vai gáy, cột sống, khớp)
  const hasNeckShoulder =
    providedCond === 'Đau mỏi Cổ - Vai - Gáy' ||
    lower.includes('vai gáy') ||
    lower.includes('cổ vai') ||
    lower.includes('mỏi cổ') ||
    lower.includes('đau cổ') ||
    lower.includes('đau vai') ||
    lower.includes('mỏi vai') ||
    lower.includes('bó cơ thang') ||
    lower.includes('tê tay') ||
    lower.includes('text neck') ||
    lower.includes('hội chứng chéo trên') ||
    (lower.includes('văn phòng') && lower.includes('máy tính') && (lower.includes('cổ') || lower.includes('vai'))) ||
    inputGoals.some((g) => g.toLowerCase().includes('vai gáy') || g.toLowerCase().includes('cổ'));

  const hasSpineBackDisc =
    providedCond === 'Thoát vị đĩa đệm L4-L5' ||
    lower.includes('thoát vị') ||
    lower.includes('đĩa đệm') ||
    lower.includes('l4') ||
    lower.includes('l5') ||
    lower.includes('s1') ||
    lower.includes('thắt lưng') ||
    lower.includes('đau lưng') ||
    lower.includes('thần kinh tọa') ||
    lower.includes('thoái hóa cột sống') ||
    lower.includes('lồi đĩa đệm') ||
    inputGoals.some((g) => g.toLowerCase().includes('cột sống') || g.toLowerCase().includes('thắt lưng') || g.toLowerCase().includes('đĩa đệm'));

  const hasJointPosture =
    lower.includes('khớp gối') ||
    lower.includes('tràn dịch') ||
    lower.includes('đau khớp') ||
    lower.includes('viêm khớp') ||
    lower.includes('vẹo cột sống') ||
    lower.includes('scoliosis') ||
    lower.includes('gù lưng') ||
    lower.includes('bàn chân bẹt') ||
    lower.includes('lệch hông') ||
    lower.includes('tê bì');

  const hasSleepStressTherapy =
    lower.includes('mất ngủ') ||
    lower.includes('ngủ không sâu') ||
    lower.includes('khó ngủ') ||
    lower.includes('stress') ||
    lower.includes('tiền đình') ||
    lower.includes('đau đầu') ||
    inputGoals.some((g) => g.toLowerCase().includes('giấc ngủ') || g.toLowerCase().includes('stress'));

  // Signal: Trainer Education (Đào tạo Huấn Luyện Viên Quốc Tế)
  // Must represent GENUINE intent to learn, train, or work as an instructor
  const hasTrainerLearningIntent =
    lower.includes('đào tạo hlv') ||
    lower.includes('đào tạo huấn luyện viên') ||
    lower.includes('học hlv') ||
    lower.includes('học làm hlv') ||
    lower.includes('khóa giáo viên') ||
    lower.includes('học giáo viên') ||
    lower.includes('học nghề hlv') ||
    lower.includes('học làm giáo viên') ||
    lower.includes('muốn đi dạy') ||
    lower.includes('sau này đi dạy') ||
    lower.includes('để sau này có thể dạy') ||
    lower.includes('dạy yoga') ||
    lower.includes('ra nghề') ||
    lower.includes('mở studio') ||
    lower.includes('mở phòng tập') ||
    lower.includes('chứng chỉ yoga alliance') ||
    lower.includes('bằng hlv') ||
    lower.includes('chứng chỉ hlv') ||
    lower.includes('khóa đào tạo hlv') ||
    inputGoals.some((g) => g.toLowerCase().includes('chứng chỉ hlv') || g.toLowerCase().includes('mở studio'));

  // If customer has actual pathology (neck pain, spine hernia, etc.), do NOT classify as Trainer Education
  // unless they explicitly chose 'Đào Tạo HLV Quốc Tế' as provided condition!
  const isTrainerEducation =
    (providedCond === 'Đào Tạo HLV Quốc Tế' || hasTrainerLearningIntent) &&
    !hasNeckShoulder &&
    !hasSpineBackDisc;

  // Signal: Advanced Ashtanga & Core Performance (Yoga Nâng Cao)
  const isAdvanced =
    (providedCond === 'Nâng Cao / Ashtanga' ||
      lower.includes('ashtanga') ||
      lower.includes('handstand') ||
      lower.includes('trồng chuối') ||
      lower.includes('pincha') ||
      lower.includes('10 chuyên đề') ||
      lower.includes('thăng bằng tay') ||
      (lower.includes('uốn lưng') && !lower.includes('đau lưng')) ||
      lower.includes('backbend') ||
      inputGoals.some((g) => g.toLowerCase().includes('nâng cao') || g.toLowerCase().includes('ashtanga') || g.toLowerCase().includes('handstand'))) &&
    !hasNeckShoulder &&
    !hasSpineBackDisc;

  // Signal: Workshop & Sound Healing (Chuông Xoay Trị Liệu)
  const isWorkshop =
    providedCond === 'Chuông Xoay & Giấc Ngủ' ||
    lower.includes('chuông xoay') ||
    lower.includes('singing bowl') ||
    lower.includes('sound healing') ||
    lower.includes('workshop chuông xoay') ||
    lower.includes('liệu pháp chuông xoay') ||
    lower.includes('trị liệu âm thanh') ||
    lower.includes('thiền chuông') ||
    inputGoals.some((g) => g.toLowerCase().includes('chuông xoay'));

  const hasTherapyKeywords =
    hasNeckShoulder ||
    hasSpineBackDisc ||
    hasJointPosture ||
    hasSleepStressTherapy ||
    lower.includes('scan trị liệu') ||
    lower.includes('trị liệu 1-1') ||
    lower.includes('phác đồ trị liệu') ||
    lower.includes('trị liệu chuyên sâu') ||
    lower.includes('đau mỏi') ||
    lower.includes('trị liệu');

  // Signal: Beginner (Người mới bắt đầu)
  const isBeginnerSignal =
    providedCond === 'Yoga Cho Người Mới' ||
    lower.includes('người mới') ||
    lower.includes('mới bắt đầu') ||
    lower.includes('newbie') ||
    lower.includes('chưa tập bao giờ') ||
    lower.includes('chưa từng tập') ||
    lower.includes('mới tập yoga') ||
    lower.includes('bắt đầu tập') ||
    lower.includes('chưa biết gì') ||
    lower.includes('lớp căn bản') ||
    lower.includes('cơ thể cứng') ||
    lower.includes('cơ địa cứng') ||
    lower.includes('cứng người') ||
    lower.includes('tập cho dẻo') ||
    inputGoals.some((g) => g.toLowerCase().includes('dẻo dai') || g.toLowerCase().includes('người mới'));

  // Signal: General Inquiry (Học phí, địa chỉ, lịch tập chung chung khi không có bệnh lý)
  const isGeneralInquiry =
    (lower.includes('học phí') ||
      lower.includes('giá bao nhiêu') ||
      lower.includes('bảng giá') ||
      lower.includes('bao nhiêu tiền') ||
      lower.includes('ở đâu') ||
      lower.includes('địa chỉ') ||
      lower.includes('chung cư opal') ||
      lower.includes('thời khóa biểu') ||
      lower.includes('các ca tập')) &&
    !isTrainerEducation &&
    !isAdvanced &&
    !isWorkshop &&
    !hasTherapyKeywords &&
    !isBeginnerSignal;

  // =========================================================================
  // 3. DETERMINE SEGMENT WITHOUT MIX-UPS OR ARBITRARY CLASSIFICATION
  // =========================================================================
  let category: LeadCategory;
  let categoryLabel: string;
  let interest: string;
  let recommendedCourse: string;
  let assignedTo: string;

  // PRIORITY RULE:
  // 1. Musculoskeletal Therapy (THERAPY_INTEREST) takes absolute precedence when user has physical ailments
  // 2. Trainer Education: clear career intent without acute therapy pathology
  // 3. Advanced: clear Ashtanga/advanced handstand intent
  // 4. Workshop: Singing bowl / sound healing
  // 5. Beginner: pure beginners without severe therapy complaints
  // 6. General Inquiry: info & pricing only

  if (hasTherapyKeywords) {
    category = 'THERAPY_INTEREST';
    categoryLabel = 'Trị Liệu Cơ Xương Khớp';

    if (hasNeckShoulder) {
      interest = 'Trị Liệu Cơ - Vai - Cổ - Gáy & Chỉnh Dáng Cột Sống (Hội chứng chéo trên)';
      if (
        lower.includes('19h') ||
        lower.includes('tối') ||
        lower.includes('thứ 6') ||
        lower.includes('thứ sáu') ||
        lower.includes('tập thử')
      ) {
        recommendedCourse = 'Lớp Yoga Trị Liệu Cơ Vai Cổ Gáy Ca Tối 19:00 & Scan Trị Liệu 1-1 (650k)';
      } else {
        recommendedCourse = 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy 1-1 (650k) & Phác đồ cá nhân hóa';
      }
      assignedTo = 'Master Henry Phan';

      detectedConditions.push('Đau mỏi Cổ - Vai - Gáy, căng cứng cơ nâng vai do ngồi máy tính (Hội chứng chéo trên)');
      detectedGoals.push(
        'Giải tỏa đau mỏi và co thắt nhóm cơ cổ vai gáy (Cơ nâng vai, cơ thang)',
        'Khắc phục hội chứng chéo trên do ngồi máy tính, phục hồi đường cong sinh lý cổ',
        'Tham gia tập thử và duy trì Lớp Yoga Trị Liệu Ca Tối (19:00 – 20:00)',
        'Scan Trị Liệu Cơ Vai Cổ Gáy 1-1 cùng Master Henry Phan để đo biên độ đốt sống'
      );
    } else if (hasSpineBackDisc) {
      interest = 'Trị Liệu Phục Hồi Cột Sống Thắt Lưng & Thoát Vị Đĩa Đệm';
      recommendedCourse = 'Trị Liệu Chuyên Sâu 1-1 Cá Nhân Hóa (60-75 phút) & Phục hồi cột sống';
      assignedTo = 'Master Henry Phan';
      recommendedSchedule = 'Lịch hẹn Scan 1-1 trực tiếp cùng Master Henry Phan';

      detectedConditions.push('Đau thắt lưng cơ năng / Nguy cơ tổn thương đĩa đệm L4-L5, L5-S1');
      detectedGoals.push(
        'Giảm áp lực và chèn ép lên đĩa đệm L4-L5/L5-S1',
        'Kích hoạt nhóm cơ lõi sâu (Core) bảo vệ cột sống tự nhiên',
        'Phục hồi khả năng vận động không còn đau nhức'
      );
    } else if (hasJointPosture) {
      interest = 'Trị Liệu Phục Hồi Khớp & Chỉnh Lệch Trục Cột Sống';
      recommendedCourse = 'Phác Đồ Phục Hồi Khớp & Cân Bằng Cột Sống 1-1';
      assignedTo = 'Master Henry Phan';
      recommendedSchedule = 'Lịch hẹn Scan cơ khớp 1-1';

      detectedConditions.push('Lệch trục khớp, thoái hóa khớp gối hoặc mất cân bằng cơ mạc');
      detectedGoals.push(
        'Tái cân bằng trục chịu lực của cơ thể',
        'Giảm viêm và đau nhức khớp gối, khớp hông an toàn',
        'Tăng độ vững chắc của hệ dây chằng và cơ bắp'
      );
    } else if (hasSleepStressTherapy) {
      interest = 'Yoga Therapy Phục Hồi Thần Kinh & Cải Thiện Giấc Ngủ';
      recommendedCourse = 'Lớp Yoga Therapy & Chuông Xoay Tây Tạng + Scan Phục Hồi';
      assignedTo = 'Master Mỹ Kiều';
      recommendedSchedule = 'Ca Tối Phục Hồi (19:00 – 20:00, Thứ 2 - Thứ 6)';

      detectedConditions.push('Rối loạn nhịp sinh học, căng thẳng hệ thần kinh thực vật, mất ngủ');
      detectedGoals.push(
        'Xoa dịu hệ thần kinh thực vật, dễ đi vào giấc ngủ',
        'Ngủ sâu giấc không bị thức dậy nửa đêm',
        'Tái tạo năng lượng và giảm đau đầu tiền đình'
      );
    } else {
      interest = 'Trị Liệu Phục Hồi Chức Năng Cơ Xương Khớp';
      recommendedCourse = 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy 1-1 (650k) & Phác đồ cá nhân hóa';
      assignedTo = 'Master Henry Phan';
      recommendedSchedule = 'Lịch Scan 1-1 tại Studio Opal Boulevard';

      detectedConditions.push('Đau mỏi cơ xương khớp do thói quen sinh hoạt và ngồi làm việc');
      detectedGoals.push(
        'Thăm khám tầm soát góc lệch cơ thể và giải tỏa đau nhức',
        'Thiết lập lộ trình phục hồi cơ xương khớp cá nhân hóa'
      );
    }
  } else if (isTrainerEducation) {
    category = 'TRAINER_EDUCATION';
    categoryLabel = 'Đào tạo Huấn Luyện Viên Quốc Tế';
    interest = 'Đào tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)';
    recommendedCourse = 'Khóa Đào Tạo HLV Yoga Quốc Tế E-RYT 500 / YACEP (Yoga Alliance Hoa Kỳ)';
    assignedTo = 'Master Henry Phan';
    recommendedSchedule = 'Sáng Thứ 2 - 4 - 6 (09:00 – 12:00)';

    detectedConditions.push('Định hướng nghề nghiệp giảng dạy Yoga trị liệu chuẩn quốc tế');
    detectedGoals.push(
      'Lấy chứng chỉ Yoga Alliance quốc tế (E-RYT 500 / YACEP)',
      'Làm chủ giải phẫu học Kinesiology và định tuyến trị liệu',
      'Đủ năng lực mở studio hoặc lớp trị liệu cá nhân'
    );
  } else if (isAdvanced) {
    category = 'ADVANCED';
    categoryLabel = 'Yoga Nâng Cao / Ashtanga';
    interest = 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 Chuyên Đề)';
    recommendedCourse = 'Khóa 10 Chuyên Đề Ashtanga Cột Sống Cùng Master Henry Phan (1.290k)';
    assignedTo = 'Master Henry Phan';
    recommendedSchedule = 'Chiều Thứ 3 & Thứ 5 (14:00 – 15:30)';

    detectedConditions.push('Đã có nền tảng thể lực, muốn nâng cao kỹ thuật uốn lưng và thăng bằng tay');
    detectedGoals.push(
      'Chinh phục Handstand, Pincha và thăng bằng tay an toàn',
      'Mở khớp vai và uốn lưng trên (Thoracic) không chấn thương',
      'Nâng cao thể lực và kiểm soát năng lượng hơi thở'
    );
  } else if (isWorkshop) {
    category = 'WORKSHOP';
    categoryLabel = 'Workshop & Chuông Xoay Trị Liệu';
    interest = 'Workshop Chuông Xoay Tây Tạng & Trị Liệu Âm Thanh Chữa Lành';
    recommendedCourse = 'Workshop Chuông Xoay Trị Liệu Cuối Tuần & Lớp Tối Thứ 5';
    assignedTo = 'Master Mỹ Kiều';
    recommendedSchedule = 'Workshop Thứ 7 (08:30 – 11:30) & Tối Thứ 5 (19:00 – 20:30)';

    detectedConditions.push('Căng thẳng hệ thần kinh, khó ngủ, muốn phục hồi năng lượng tinh thần');
    detectedGoals.push(
      'Giải tỏa stress, xoa dịu hệ thần kinh giao cảm',
      'Thư giãn sâu mạc cơ và cải thiện giấc ngủ',
      'Tái tạo năng lượng bình an qua tần số chuông xoay'
    );
  } else if (isBeginnerSignal) {
    // Pure beginner WITHOUT therapy pathology
    category = 'BEGINNER';
    categoryLabel = 'Người Mới Bắt Đầu (Newbie)';
    interest = 'Yoga Cho Người Mới Bắt Đầu (Lớp Newbie & Căn Bản)';
    recommendedCourse = 'Lớp Yoga For Newbie (Căn chỉnh định tuyến & Thở chuẩn Kinesiology)';
    assignedTo = 'Đội ngũ Huấn Luyện Viên Trị Liệu VICI';
    recommendedSchedule = 'Ca Sáng (06:30 – 07:30) hoặc Ca Tối (19:00 – 20:00)';

    detectedConditions.push('Chưa từng tập Yoga hoặc cơ gân kheo, khớp hông căng cứng');
    detectedGoals.push(
      'Làm quen bài bản với các động tác Yoga căn bản',
      'Tăng độ dẻo dai cơ thể an toàn, không bị chấn thương',
      'Xây dựng thói quen tập luyện đều đặn và hơi thở đúng'
    );
  } else if (isGeneralInquiry) {
    category = 'GENERAL_INQUIRY';
    categoryLabel = 'Tìm Hiểu Thông Tin & Học Phí';
    interest = 'Tìm hiểu Thời khóa biểu & Gói tập Hội viên VICI';
    recommendedCourse = 'Gói Trải Nghiệm Hội Viên 3 Tháng / 6 Tháng';
    assignedTo = 'Đội ngũ Tư vấn VICI';
    recommendedSchedule = 'Linh hoạt theo lịch học viên';

    detectedConditions.push('Quan tâm thông tin học phí, lịch tập và địa chỉ phòng tập VICI');
    detectedGoals.push(
      'Tìm hiểu môi trường tập luyện chuẩn trị liệu tại VICI',
      'Lựa chọn gói tập và khung giờ phù hợp với sinh hoạt cá nhân'
    );
  } else {
    // Sensible fallback: Default to Therapy Consultation
    category = 'THERAPY_INTEREST';
    categoryLabel = 'Trị Liệu Cơ Xương Khớp';
    interest = 'Tư vấn Phác đồ Trị liệu Cá Nhân Hóa';
    recommendedCourse = 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy 1-1 (650k) & Phác đồ cá nhân hóa';
    assignedTo = 'Master Mỹ Kiều';
    recommendedSchedule = 'Theo lịch hẹn Scan cá nhân hóa';

    detectedConditions.push('Cần được thăm khám tầm soát cơ xương khớp và tư vấn lớp phù hợp');
    detectedGoals.push(
      'Cải thiện sức khỏe thể chất và giải tỏa căng cứng cơ thể',
      'Tập luyện đúng kỹ thuật dưới sự hướng dẫn của Master'
    );
  }

  // Preserve user-specified condition name if provided and compatible with segment
  if (
    providedCond &&
    providedCond !== 'Tư vấn phác đồ cơ xương khớp' &&
    providedCond !== 'Tư vấn theo nhu cầu'
  ) {
    const isTrainer = category === 'TRAINER_EDUCATION';
    const isAdv = category === 'ADVANCED';
    const isWork = category === 'WORKSHOP';
    const isBeg = category === 'BEGINNER';
    const isTherapy = category === 'THERAPY_INTEREST';

    const condLower = providedCond.toLowerCase();
    const condIsTherapy = condLower.includes('cổ') || condLower.includes('vai gáy') || condLower.includes('l4') || condLower.includes('thoát vị') || condLower.includes('đĩa đệm') || condLower.includes('trị liệu');
    const condIsTrainer = condLower.includes('hlv') || condLower.includes('giáo viên');
    const condIsAdv = condLower.includes('nâng cao') || condLower.includes('ashtanga');
    const condIsBeg = condLower.includes('người mới') || condLower.includes('newbie');
    const condIsWork = condLower.includes('chuông xoay');

    // Only adopt providedCond if it does not conflict with the detected category
    if (
      (isTrainer && condIsTrainer) ||
      (isAdv && condIsAdv) ||
      (isBeg && condIsBeg) ||
      (isWork && condIsWork) ||
      (isTherapy && condIsTherapy) ||
      (!condIsTherapy && !condIsTrainer && !condIsAdv && !condIsBeg && !condIsWork)
    ) {
      interest = providedCond;
    }
  }

  // =========================================================================
  // 4. SYNTHESIZE FINAL CUSTOMER GOALS (KẾT HỢP MỤC TIÊU CỦA HỌC VIÊN)
  // =========================================================================
  const rawCombinedGoals: string[] = [];

  // 1st: Add customer's explicitly chosen goals
  inputGoals.forEach((g) => {
    if (!rawCombinedGoals.some((cg) => cg.toLowerCase() === g.toLowerCase())) {
      rawCombinedGoals.push(g);
    }
  });

  // 2nd: Add detected clinical goals if not redundant
  detectedGoals.forEach((dg) => {
    if (
      !rawCombinedGoals.some(
        (cg) =>
          cg.toLowerCase().includes(dg.toLowerCase().slice(0, 15)) ||
          dg.toLowerCase().includes(cg.toLowerCase().slice(0, 15))
      )
    ) {
      rawCombinedGoals.push(dg);
    }
  });

  // Strictly sanitize goals to match the detected category (no cross-contamination)
  const finalGoals = sanitizeGoalsForSegment(category, rawCombinedGoals, lower);

  return {
    category,
    categoryLabel,
    interest,
    preferredTime,
    preferredSchedule: preferredTime,
    recommendedCourse,
    recommendedSchedule,
    goals: finalGoals,
    detectedConditions,
    assignedTo,
    leadScore: 'HOT',
  };
}

