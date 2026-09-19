/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Admin Authentication Gate for VICI CRM.
 * Default credentials: admin / admin
 */

import { useState, FormEvent, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, X, ArrowRight, CheckCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AUTH_STORAGE_KEY = 'vici_crm_auth';

export function isUserAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
    sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  );
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === 'admin') {
      setIsSuccess(true);
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      }

      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 400);
    } else {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden">
        {/* Header with Luxury Brand Styling */}
        <div className="bg-gradient-to-r from-[#21241E] via-[#332B1E] to-[#21241E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng (Phím Esc)"
            title="Đóng (Phím Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D69A2D]/20 border border-[#D69A2D]/40 flex items-center justify-center text-[#E5B25D]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#D69A2D]/30 text-[#E5B25D] border border-[#D69A2D]/30">
                  Cổng Quản Trị
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif-display mt-0.5 text-white">
                Đăng Nhập VICI CRM
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-300 mt-2">
            Hệ thống quản lý dữ liệu học viên, điều phối lịch học và chăm sóc tư vấn
          </p>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đăng nhập thành công! Đang chuyển hướng vào CRM...</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A3B22] block">
              Tài khoản Quản trị
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Nhập tên tài khoản"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-xs sm:text-sm text-[#252822] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A3B22] block">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D5C7AA] focus:border-[#D69A2D] focus:bg-white outline-none text-xs sm:text-sm text-[#252822] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#D5C7AA] text-[#D69A2D] focus:ring-[#D69A2D]"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8A6437] to-[#6A4B27] hover:from-[#76542D] hover:to-[#573C1E] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Đăng nhập vào CRM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security Note */}
          <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8A6437]" />
            <span>Khu vực bảo mật dành riêng cho nhân sự quản lý VICI</span>
          </div>
        </form>
      </div>
    </div>
  );
}
