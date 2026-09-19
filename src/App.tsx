/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import TherapySOP from './components/TherapySOP';
import Trainers from './components/Trainers';
import Courses from './components/Courses';
import Outcomes from './components/Outcomes';
import Testimonials from './components/Testimonials';
import Schedule from './components/Schedule';
import Activities from './components/Activities';
import AIAdvisorCTA from './components/AIAdvisorCTA';
import LeadForm from './components/LeadForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import MobileBottomBar from './components/MobileBottomBar';
import FloatingRightActions from './components/FloatingRightActions';
import AIChatModal from './components/AIChatModal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal, { isUserAdminLoggedIn, logoutAdmin } from './components/admin/AdminLoginModal';
import { Lead } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInitialTopic, setAiInitialTopic] = useState<string | undefined>(undefined);
  const [prefilledCourse, setPrefilledCourse] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(isUserAdminLoggedIn());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    setIsAdminLoggedIn(isUserAdminLoggedIn());
  }, []);

  // Trigger AI Chat modal with optional prompt
  const handleOpenAIChat = (initialTopic?: string) => {
    setAiInitialTopic(initialTopic);
    setIsAIChatOpen(true);
  };

  // Trigger consultation form scroll with prefilled course
  const handleOpenRegister = (courseName?: string) => {
    if (courseName) {
      setPrefilledCourse(courseName);
    }
    const formElement = document.querySelector('#contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch to or from Admin CRM with Login gate
  const handleToggleAdminView = (val?: boolean) => {
    const targetState = val !== undefined ? val : !isAdminView;
    if (targetState) {
      if (isAdminLoggedIn || isUserAdminLoggedIn()) {
        setIsAdminLoggedIn(true);
        setIsAdminView(true);
      } else {
        setIsLoginModalOpen(true);
      }
    } else {
      setIsAdminView(false);
    }
  };

  // Successful login handler
  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminView(true);
    setToastNotification('Đăng nhập Quản trị viên VICI thành công!');
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Admin Logout handler
  const handleLogout = () => {
    logoutAdmin();
    setIsAdminLoggedIn(false);
    setIsAdminView(false);
    setToastNotification('Đã đăng xuất khỏi hệ thống Admin CRM.');
    setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  // Lead captured from form or chat
  const handleLeadCaptured = (lead: Lead) => {
    setToastNotification(`Đã ghi nhận thông tin của ${lead.name} (${lead.phone}) vào CRM & đồng bộ Google Sheets!`);
    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  // Global Escape key listener for closing active overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLoginModalOpen) {
          setIsLoginModalOpen(false);
        } else if (isAIChatOpen) {
          setIsAIChatOpen(false);
        } else if (toastNotification) {
          setToastNotification(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAIChatOpen, isLoginModalOpen, toastNotification]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#252822] font-sans antialiased selection:bg-[#D69A2D]/20 selection:text-[#8A6437]">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 right-4 z-50 bg-[#252822] text-amber-50 px-4 py-3 rounded-2xl shadow-xl border border-amber-400/30 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-md text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 leading-snug">{toastNotification}</div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-stone-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Navigation */}
      <Header
        onOpenAIChat={handleOpenAIChat}
        onOpenRegister={handleOpenRegister}
        isAdminView={isAdminView}
        onToggleAdminView={handleToggleAdminView}
      />

      {/* Main Page Content or Admin View */}
      {isAdminView ? (
        <AdminDashboard
          onClose={() => setIsAdminView(false)}
          onLogout={handleLogout}
        />
      ) : (
        <main className="pb-24 lg:pb-0">
          {/* Hero Section */}
          <Hero
            onOpenAIChat={() => handleOpenAIChat()}
            onOpenRegister={() => handleOpenRegister()}
          />

          {/* Stats & Verified Credentials */}
          <Stats />

          {/* Brand Story & Philosophy */}
          <About />

          {/* 4-Step Standard Operating Procedure for Therapy */}
          <TherapySOP onOpenRegister={handleOpenRegister} />

          {/* Master Henry Phan & Trainers */}
          <Trainers onOpenRegister={handleOpenRegister} />

          {/* Courses & Training Ecosystem */}
          <Courses onOpenRegister={handleOpenRegister} />

          {/* Program Outcomes & Benefits */}
          <Outcomes />

          {/* Student Feedback & Transformations */}
          <Testimonials onOpenRegister={handleOpenRegister} />

          {/* Timetable & Schedule */}
          <Schedule onOpenRegister={handleOpenRegister} />

          {/* Spaces & Healing Activities */}
          <Activities />

          {/* Pre-FAQ AI Advisor CTA Banner */}
          <AIAdvisorCTA onOpenAIChat={handleOpenAIChat} />

          {/* Consultation Lead Form */}
          <LeadForm
            prefilledCourse={prefilledCourse}
            onLeadSubmitted={handleLeadCaptured}
          />

          {/* Frequently Asked Questions */}
          <FAQ onOpenAIChat={handleOpenAIChat} />

          {/* Unified Right-Side Floating Actions: Liên hệ Zalo & Hỏi MyVici */}
          <FloatingRightActions onOpenAIChat={handleOpenAIChat} />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenRegister={handleOpenRegister}
        onOpenAIChat={() => handleOpenAIChat()}
      />

      {/* Mobile Sticky Bottom CTA Bar */}
      {!isAdminView && (
        <MobileBottomBar
          onOpenAIChat={() => handleOpenAIChat()}
          onOpenRegister={() => handleOpenRegister()}
        />
      )}

      {/* AI Chatbot Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialTopic={aiInitialTopic}
        onLeadCaptured={handleLeadCaptured}
        onOpenRegisterForm={handleOpenRegister}
      />

      {/* Admin CRM Authentication Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
