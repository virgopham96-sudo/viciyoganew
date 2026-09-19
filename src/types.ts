export type LeadScore = 'HOT' | 'WARM' | 'COLD';

export type LeadStatus = 'New' | 'Contacted' | 'Consulting' | 'Trial' | 'Enrolled' | 'Lost';

export type LeadCategory = 
  | 'BEGINNER' 
  | 'THERAPY_INTEREST' 
  | 'ADVANCED' 
  | 'TRAINER_EDUCATION' 
  | 'WORKSHOP' 
  | 'GENERAL_INQUIRY';

export interface AIConsultationReport {
  sessionId: string;
  createdAt: string;
  timestamp?: string;
  customerName?: string;
  customerPhone?: string;
  category?: LeadCategory;
  categoryLabel?: string;
  detectedCondition: string;
  detectedConditions?: string[];
  severityLevel: 'Nhẹ' | 'Vừa' | 'Nặng' | 'Chưa xác định';
  lifestyleFactors: string[];
  customerGoals: string[];
  recommendedCourse: string;
  recommendedSchedule: string;
  preferredTime?: string;
  leadScore?: LeadScore;
  assignedTrainer?: string;
  safetyNotes?: string;
  clinicalSafetyNotes: string[];
  suggestedNextActions?: string[];
  nextAction: string;
  fullSummaryText: string;
  executiveSummary?: string;
  transcriptCount: number;
}

export interface ChatSessionRecord {
  sessionId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  condition: string;
  preferredTime: string;
  recommendedCourse: string;
  leadScore: LeadScore;
  reportSummary: string;
  chatTranscript: string;
  syncedToSheet?: boolean;
  syncedAt?: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  source: 'Website Form' | 'VICI AI Advisor' | 'Direct Consultation' | 'VICI AI Chatbot';
  interest: string;
  category: LeadCategory;
  experience?: string;
  goals?: string[];
  preferredTime?: string;
  preferredFormat?: string;
  recommendedCourse?: string;
  leadScore: LeadScore;
  status: LeadStatus;
  assignedTo?: string;
  conversationSummary?: string;
  chatSummary?: string;
  aiReport?: AIConsultationReport;
  conversationHistory?: Array<{ sender: 'ai' | 'user'; text: string; time: string }>;
  staffNotes?: string;
  nextAction?: string;
  isSampleData?: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  realName?: string;
  title: string;
  role: string;
  quote?: string;
  specialties: string[];
  credentials: string[];
  experience: string;
  teachingLocations: string[];
  bio: string;
  photoUrl: string;
  sourcePhotoUrl: string;
  socials?: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
  };
}

export interface Course {
  id: string;
  name: string;
  category: 'package' | 'therapy' | 'training' | 'workshop' | 'corporate';
  badge?: string;
  shortDesc: string;
  fullDesc: string;
  targetAudience: string[];
  duration: string;
  schedule: string;
  format: 'Trực tiếp tại Studio' | 'Online & Trực tiếp' | 'Theo lịch hẹn 1:1' | 'Doanh nghiệp' | 'Trực tiếp tại Studio & Thực tập';
  priceDisplay: string;
  priceDetail?: string;
  priceStatus: 'CONFIRMED' | 'ON REQUEST';
  benefits: string[];
  outcomes: string[];
  syllabus?: string[];
  featured?: boolean;
  photoUrl: string;
  sourcePhotoUrl: string;
}

export interface ScheduleItem {
  id: string;
  timeSlot: string;
  days: {
    [day: string]: {
      className: string;
      category: string;
      instructor?: string;
      level?: string;
      highlight?: boolean;
    } | null;
  };
}

export interface ActivitySpace {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  description: string;
  highlights: string[];
  photoUrl: string;
  sourcePhotoUrl: string;
}

export interface FAQItem {
  id: string;
  category: 'Khoá học' | 'Trị liệu' | 'Đào tạo HLV' | 'Học phí & Lịch học' | 'Chính sách' | 'Người mới';
  question: string;
  answer: string;
}

export interface StudentFeedback {
  id: string;
  name: string;
  role: string;
  age?: string;
  avatarUrl?: string;
  course: string;
  improvement: string;
  comment: string;
  rating: number;
  tags: string[];
}
