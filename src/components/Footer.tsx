import React from 'react';
import { Shield, Hammer, Heart, Check, Sparkles, Terminal, Activity } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenSitemap: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSitemap }) => {
  return (
    <footer className="bg-[#02040a] text-slate-400 py-12 border-t border-slate-900" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white font-black shadow-md border border-white/5">
              <span className="font-mono text-xs font-black tracking-tight text-white select-none">EZ</span>
              <div className="absolute -top-1 -left-1 bg-cyan-400 rounded-md p-0.5 flex items-center justify-center scale-90">
                <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-cyan-300" />
              </div>
            </div>
            <span className="text-lg font-black text-white tracking-tight font-mono">EZCV</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed text-right">
            المنصة العربية الأولى المتكاملة لإنشاء وتطوير السيرة الذاتية الذكية بالكامل، متوافقة 100% مع أنظمة فرز السير الذاتية ATS وبشكل مجاني وأنيق وموثوق للغاية.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[11px] text-cyan-400">
            <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-extrabold text-[10px]">تشفير سحابي متطور SSL ومحلي بالكامل</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">المنصة والأدوات</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors cursor-pointer">الصفحة الرئيسية</button>
            </li>
            <li>
              <button onClick={() => onNavigate('templates')} className="hover:text-cyan-400 transition-colors cursor-pointer">قوالب وتصاميم السير</button>
            </li>
            <li>
              <button onClick={() => onNavigate('builder-new')} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1 cursor-pointer">
                <span>إنشاء سيرة (Builder)</span>
                <Check className="w-3 h-3" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('blog')} className="hover:text-cyan-400 transition-colors cursor-pointer">المدونة المهنية والمقالات</button>
            </li>
          </ul>
        </div>

        {/* Info & Help */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">المعلومات والطلب</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">من نحن وقصتنا</button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">مرآة المساعدة وتواصل معنا</button>
            </li>
            <li>
              <button onClick={onOpenSitemap} className="hover:text-emerald-400 text-emerald-400 font-semibold transition-colors cursor-pointer">خريطة الموقع (Sitemap XML)</button>
            </li>
            <li>
              <div className="flex items-center gap-1.5 text-[9.5px] text-cyan-400 bg-cyan-950/40 p-2 rounded-lg border border-cyan-900/40">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-bold">خوادم الإنتاج والذكاء v4.0.0 ممتثلة 🟢</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">الشروط والخصوصية</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-cyan-400 transition-colors cursor-pointer">سياسة خاصة للخصوصية وحماية البيانات</button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-cyan-400 transition-colors cursor-pointer">شروط وأحكام الاستخدام</button>
            </li>
            <li>
              <div className="pt-2.5 text-[10px] text-slate-500 leading-relaxed text-right border-t border-slate-900">
                موقع EZCV ممتثل بالكامل لقواعد حماية المعطيات والبيانات العامة GDPR واللوائح العربية السحابية المتقدمة لسلامة المعلومات والملفات الشخصية.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center">
        <div>
          © {new Date().getFullYear()} EasyCVMaker. جميع الحقوق والاعتمادات السحابية محفوظة 🚀
        </div>
        <div className="flex items-center gap-1 justify-center">
          <span>صنع بكل فخر ودقة بمواصفات تكنولوجية لتمكين المهارات العربية</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
        </div>
      </div>
    </footer>
  );
};
