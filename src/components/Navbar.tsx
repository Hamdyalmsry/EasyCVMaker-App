import React, { useState } from 'react';
import { User, CVTemplateId } from '../types';
import { Menu, X, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string, articleSlug?: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { view: 'home', label: 'الرئيسية' },
    { view: 'templates', label: 'القوالب والتصاميم' },
    { view: 'blog', label: 'المدونة المهنية' },
    { view: 'about', label: 'من نحن' },
    { view: 'contact', label: 'تواصل معنا' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e293b]/70 bg-[#030712]/85 backdrop-blur-md text-white" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo with futuristic spark */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => onNavigate('home')}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 shadow-md shadow-cyan-500/10 text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/25 border border-white/10">
              <span className="font-mono text-[14px] font-black tracking-tight text-white select-none">EZ</span>
              <div className="absolute -top-1 -left-1 bg-cyan-400 rounded-lg p-0.5 shadow-md flex items-center justify-center scale-95 animate-pulse">
                <Sparkles className="w-3 h-3 text-slate-950 fill-cyan-350 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xl font-black tracking-tight bg-gradient-to-l from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent transition-all group-hover:opacity-90 font-mono">EZCV</span>
                <span className="text-[8px] font-black text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-1 py-0.2 rounded-md font-sans">ذكاء صناعي</span>
              </div>
              <span className="block text-[9.5px] text-slate-400 font-extrabold mt-0.5 tracking-wide">صانع السيرة الذكية والثورية 🚀</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {links.map((link) => (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`text-[13px] font-extrabold transition-all relative py-1.5 cursor-pointer ${
                  currentView === link.view
                    ? 'text-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {currentView === link.view && (
                  <span className="absolute bottom-0 right-0 left-0 h-[2.5px] bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full animate-fade-in" />
                )}
              </button>
            ))}
          </nav>

          {/* User Profile / Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-1.5 text-xs font-black py-2 px-3.5 rounded-xl border cursor-pointer transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 text-cyan-400 border-cyan-500/30 shadow-xs'
                      : 'text-slate-300 border-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-450" />
                  <span>لوحة التحكم ({currentUser.name})</span>
                </button>
                <button
                  onClick={() => onNavigate('builder-new')}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-black bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-cyan-500/20 active:opacity-90 transition-all active:scale-95 duration-200 cursor-pointer border border-white/5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إنشاء سيرة جديدة</span>
                </button>
                <button
                  onClick={onLogout}
                  title="تسجيل الخروج"
                  className="p-2 text-slate-400 hover:text-rose-455 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-black text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-650 hover:to-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-95 duration-100 border border-white/5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>ابدأ مجاناً</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 pt-3 pb-5 space-y-2 shadow-inner">
          {links.map((link) => (
            <button
              key={link.view}
              onClick={() => {
                onNavigate(link.view);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === link.view
                  ? 'bg-gradient-to-r from-slate-900 to-cyan-950/40 text-cyan-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-4 border-t border-slate-900 space-y-2">
            {currentUser ? (
              <>
                <div className="px-4 py-1.5 flex items-center gap-2 border border-slate-900 bg-slate-900/40 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-300 font-bold">مسجل باسم: {currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-800 text-slate-200 hover:bg-slate-900 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-405" />
                  <span>لوحة التحكم</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('builder-new');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>سيرة جديدة</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-455 hover:bg-rose-950/30 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 hover:bg-slate-900 cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-md cursor-pointer"
                >
                  ابدأ مجاناً الآن
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
