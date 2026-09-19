import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, Phone, ShieldCheck, LayoutDashboard, Facebook, Instagram, ChevronDown, Headphones, MapPin } from 'lucide-react';
import ViciLogo from './ViciLogo';
import ZaloIcon from './ZaloIcon';
import { VICI_INFO } from '../data/viciData';

interface HeaderProps {
  onOpenAIChat: (initialTopic?: string) => void;
  onOpenRegister: (courseName?: string) => void;
  isAdminView: boolean;
  onToggleAdminView: (value?: boolean) => void;
}

export default function Header({
  onOpenAIChat,
  onOpenRegister,
  isAdminView,
  onToggleAdminView,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key and outside click to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contactMenuRef.current && !contactMenuRef.current.contains(e.target as Node)) {
        setIsContactOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsContactOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Về VICI', href: '#about' },
    { label: 'Đội ngũ HLV', href: '#trainers' },
    { label: 'Khóa học', href: '#courses' },
    { label: 'Quy trình Trị liệu', href: '#therapy-sop' },
    { label: 'Cảm nhận học viên', href: '#feedback' },
    { label: 'Lịch học', href: '#schedule' },
    { label: 'Không gian', href: '#activities' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Liên hệ & Bản đồ', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (isAdminView) {
      onToggleAdminView(false);
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDF8]/95 backdrop-blur-md shadow-xs border-b border-[#E8DFC8]'
          : 'bg-[#FFFDF8]/80 backdrop-blur-xs border-b border-[#E8DFC8]/60'
      }`}
    >
      {/* Top micro banner */}
      <div className="bg-[#8A6437] text-amber-50 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10.5px] sm:text-xs font-medium">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <span className="flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5B25D]" />
              <span className="hidden sm:inline">Tiêu chuẩn Yoga Alliance Hoa Kỳ (E-RYT 500 & YACEP)</span>
              <span className="sm:hidden font-semibold">Yoga Alliance Hoa Kỳ E-RYT 500</span>
            </span>
            <span className="hidden md:inline-block text-amber-200/50">|</span>
            <span className="hidden md:inline-block">Master Henry Phan trực tiếp giảng dạy</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <a
              href={`tel:${VICI_INFO.hotline.replace(/\s/g, '')}`}
              className="flex items-center gap-1 hover:text-[#E5B25D] transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">Hotline: {VICI_INFO.hotline}</span>
              <span className="sm:hidden">{VICI_INFO.hotline}</span>
            </a>
            
            {/* Switcher to Admin CRM */}
            <button
              id="header-toggle-admin-btn"
              onClick={() => onToggleAdminView(!isAdminView)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-900/40 hover:bg-amber-900/70 border border-amber-400/30 text-amber-200 text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer"
              title="Truy cập hệ thống quản trị CRM"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>{isAdminView ? 'Về Website' : 'Đăng nhập quản lý'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="focus:outline-none"
          >
            <ViciLogo />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#4A4E44]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-[#D69A2D] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D69A2D] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Consolidated "Liên hệ tư vấn" (Zalo + MyVici AI) */}
            <div className="relative" ref={contactMenuRef}>
              <button
                id="header-contact-consult-btn"
                type="button"
                onClick={() => setIsContactOpen(!isContactOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full bg-[#FFF9EE] hover:bg-[#F4EADA] text-[#8A6437] border border-[#DFCFAE] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                aria-expanded={isContactOpen}
                aria-haspopup="true"
              >
                <Headphones className="w-3.5 h-3.5 text-[#8A6437]" />
                <span>Liên hệ tư vấn</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#8A6437] transition-transform duration-200 ${
                    isContactOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isContactOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#FFFDF8] rounded-2xl shadow-xl border border-[#E8DFC8] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-[#F4EADA] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66F17]">
                      Kênh liên hệ tư vấn VICI
                    </span>
                  </div>

                  {/* Option 1: Tư vấn MyVici AI */}
                  <button
                    type="button"
                    id="header-dropdown-myvici-btn"
                    onClick={() => {
                      setIsContactOpen(false);
                      onOpenAIChat();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#F4EADA]/60 text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D69A2D]/15 text-[#D69A2D] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D69A2D] group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#252822] group-hover:text-[#8A6437]">
                          Tư vấn cùng MyVici
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-semibold rounded-full">
                          AI 24/7
                        </span>
                      </div>
                      <p className="text-[11px] text-[#717769] leading-tight mt-0.5">
                        Khám sơ bộ & tư vấn phác đồ tức thì
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Chat Zalo chuyên viên */}
                  <a
                    id="header-dropdown-zalo-btn"
                    href={`https://zalo.me/${VICI_INFO.hotline.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsContactOpen(false)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-blue-50/70 text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0068FF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0068FF] group-hover:text-white transition-colors">
                      <ZaloIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#252822] group-hover:text-[#0068FF]">
                          Liên hệ qua Zalo
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-[#717769] leading-tight mt-0.5">
                        Zalo: <span className="font-semibold text-[#0068FF]">{VICI_INFO.hotline}</span>
                      </p>
                    </div>
                  </a>

                  {/* Option 3: Hotline trực tiếp */}
                  <a
                    href={`tel:${VICI_INFO.hotline.replace(/\s/g, '')}`}
                    onClick={() => setIsContactOpen(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-amber-50/60 text-left transition-colors cursor-pointer border-t border-[#F4EADA]/60 mt-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8A6437]" />
                    <span className="text-[11px] font-semibold text-[#8A6437]">
                      Gọi hotline: {VICI_INFO.hotline}
                    </span>
                  </a>

                  {/* Option 4: Vị trí & bản đồ Studio */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsContactOpen(false);
                      handleNavClick('#contact');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-amber-50/60 text-left transition-colors cursor-pointer border-t border-[#F4EADA]/60 mt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#D69A2D]" />
                    <span className="text-[11px] font-semibold text-[#8A6437]">
                      Bản đồ Studio Opal Boulevard
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Consultation Registration CTA */}
            <button
              id="header-register-btn"
              onClick={() => onOpenRegister()}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold rounded-full bg-[#D69A2D] text-white hover:bg-[#B87A14] shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>Đăng ký tư vấn</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-chat-quick-btn"
              onClick={() => onOpenAIChat()}
              className="w-11 h-11 rounded-full bg-[#D69A2D]/15 text-[#D69A2D] flex items-center justify-center active:scale-95 transition-transform"
              aria-label="AI Chatbot"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 rounded-xl text-[#252822] hover:bg-[#F4EADA]/60 flex items-center justify-center focus:outline-none active:scale-95 transition-transform"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] border-b border-[#E8DFC8] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-medium text-[#252822] hover:text-[#D69A2D] py-2 border-b border-[#F4EADA]/60"
              >
                {link.label}
              </a>
            ))}

            {/* Mục "Liên hệ tư vấn" (Zalo + MyVici AI + Hotline) */}
            <div className="pt-2 border-t border-[#F4EADA]/80">
              <div className="flex items-center gap-1.5 px-1 mb-2">
                <Headphones className="w-3.5 h-3.5 text-[#8A6437]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6437]">
                  Liên hệ tư vấn
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <a
                  href={`https://zalo.me/${VICI_INFO.hotline.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 text-[#0068FF] font-semibold text-xs border border-blue-200 active:scale-98 transition-transform"
                >
                  <ZaloIcon size={16} />
                  <span>Chat Zalo</span>
                </a>
                <button
                  id="mobile-drawer-ai-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAIChat();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#D69A2D]/10 text-[#A66F17] font-semibold text-xs border border-[#D69A2D]/30 active:scale-98 transition-transform cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D69A2D]" />
                  <span>Hỏi MyVici</span>
                </button>
              </div>
              <a
                href={`tel:${VICI_INFO.hotline.replace(/\s/g, '')}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F4EADA] text-[#8A6437] font-semibold text-xs border border-[#DFCFAE] active:scale-98 transition-transform mb-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Hotline: {VICI_INFO.hotline}</span>
              </a>
            </div>

            {/* Social Media Links of VICI */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={VICI_INFO.socialLinks.facebookCenter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-semibold text-xs border border-[#1877F2]/20 active:scale-98 transition-transform"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook VICI</span>
              </a>
              <a
                href={VICI_INFO.socialLinks.instagramCenter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#E1306C]/10 text-[#E1306C] font-semibold text-xs border border-[#E1306C]/20 active:scale-98 transition-transform"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram VICI</span>
              </a>
            </div>

            <div className="pt-1 flex flex-col gap-2.5">
              <button
                id="mobile-drawer-register-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D69A2D] text-white font-semibold shadow-xs active:scale-98 transition-transform"
              >
                <span>Đăng ký tư vấn ngay</span>
              </button>

              <button
                id="mobile-drawer-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onToggleAdminView(!isAdminView);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#8A6437]/10 text-[#8A6437] font-medium text-sm border border-[#8A6437]/20 active:scale-98 transition-transform"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{isAdminView ? 'Về trang chủ Website' : 'Đăng nhập quản lý'}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
