import React, { useState } from 'react';
import { User, ToastMessage } from '../types';
import { Mail, Lock, User as UserIcon, X, Sparkles, Globe } from 'lucide-react';
import { COUNTRIES } from '../data/countryData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, message: string) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  addToast
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('EG');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      addToast('فضلاً، املأ جميع الحقول المطلوبة', 'error');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const trimmedInput = email.trim();
      
      // Admin Intercept logic
      if (!isSignUp && (trimmedInput === 'حمدي المصري' || trimmedInput.toLowerCase() === 'hamdyalmsry123@gmail.com' || trimmedInput.toLowerCase() === 'hamdy') && password === '579106hamdy') {
        const adminUser: User = {
          id: 'admin_hamdy',
          email: 'hamdyalmsry123@gmail.com',
          name: 'حمدي المصري',
          createdAt: new Date().toISOString(),
          isAdmin: true
        };
        const usersRaw = localStorage.getItem('easycv_users');
        const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
        if (!users.some(u => u.email === adminUser.email)) {
          users.push(adminUser);
          localStorage.setItem('easycv_users', JSON.stringify(users));
          localStorage.setItem(`pwd_${adminUser.email}`, '579106hamdy');
        }
        
        onSuccess(adminUser, 'مرحباً بك يا أستاذ حمدي المصري! تم تسجيل دخولك كمسؤول للمنصة بنجاح.');
        setLoading(false);
        return;
      }

      // Fetch users
      const usersRaw = localStorage.getItem('easycv_users');
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];

      if (isSignUp) {
        // Sign Up Flow
        const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          addToast('هذا البريد الإلكتروني مسجل بالفعل!', 'error');
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substring(2, 11),
          email: email.toLowerCase(),
          name: name,
          createdAt: new Date().toISOString(),
          country: country,
          unlockedTemplates: [],
          isSubscribed: false
        };

        users.push(newUser);
        localStorage.setItem('easycv_users', JSON.stringify(users));
        
        // Also setup mock data for password for dummy auth
        localStorage.setItem(`pwd_${newUser.email}`, password);

        onSuccess(newUser, 'تم إنشاء حسابك بنجاح! مرحباً بك في EasyCVMaker.');
      } else {
        // Login Flow
        const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const savedPwd = matched ? localStorage.getItem(`pwd_${matched.email}`) : null;

        if (matched && savedPwd === password) {
          onSuccess(matched, `مرحباً بعودتك، ${matched.name}!`);
        } else {
          // If brand new demo run and empty localStorage, create a dummy account to avoid blocking the user
          if (users.length === 0) {
            const demoUser: User = {
              id: 'demo-user-1',
              email: email.toLowerCase(),
              name: 'مستخدم تجريبي',
              createdAt: new Date().toISOString()
            };
            localStorage.setItem('easycv_users', JSON.stringify([demoUser]));
            localStorage.setItem(`pwd_${demoUser.email}`, password);
            onSuccess(demoUser, 'مرحباً بك بحساب تجريبي تفاعلي!');
          } else {
            addToast('البريد الإلكتروني أو كلمة المرور غير صحيحة!', 'error');
          }
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ direction: 'rtl' }}>
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 sm:p-8 animate-slide-up duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">مرحباً بك</span>
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isSignUp ? 'ابدأ تصميم سيرتك الاحترافية في ثوانٍ مجاناً' : 'عد لإدارة سيرك الذاتية وتعديلها في أي وقت'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم الكامل</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="محمد أحمد"
                    className="w-full text-sm py-2.5 pr-9 pl-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">من أي دولة أنت؟ (لتحديد العملة وسعر القوالب)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Globe className="w-4 h-4 text-slate-400" />
                  </span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-sm py-2.5 pr-9 pl-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all text-slate-800 text-right appearance-none cursor-pointer font-bold"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.currencySymbol} - {c.currencyCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني أو اسم المستخدم</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com أو اسم المستخدم"
                className="w-full text-sm py-2.5 pr-9 pl-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm py-2.5 pr-9 pl-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-left"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 active:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول الآمن'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Account Type */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {isSignUp ? 'لديك حساب بالفعل؟' : 'لا تملك حساباً بعد؟'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 mr-1.5 hover:underline"
            >
              {isSignUp ? 'تسجيل الدخول الآن' : 'سجل مجاناً الآن'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
