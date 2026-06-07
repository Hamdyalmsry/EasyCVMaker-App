import React from 'react';
import { ExternalLink, Sparkles, Award, Shield } from 'lucide-react';

interface AdSenseProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer';
}

export const AdSense: React.FC<AdSenseProps> = ({ slot }) => {
  // Balanced mock Ads relevant to CVs & Career, formatted cleanly
  const getAdDetails = () => {
    switch (slot) {
      case 'header':
        return {
          title: 'خصم 50% على باقة الترقية الذهبية الاحترافية!',
          description: 'احصل على قوالب حصرية، تدقيق لغوي باستخدام الذكاء الاصطناعي، وعدد غير محدود من السير الذاتية.',
          cta: 'ترقية الحساب الآن',
          badge: 'رعاية',
          icon: <Sparkles className="w-5 h-5 text-amber-500" />,
          classes: 'w-full py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg flex flex-wrap items-center justify-between gap-4 text-center sm:text-right'
        };
      case 'sidebar':
        return {
          title: 'تحليل السيرة الذاتية مجاناً عبر ATS',
          description: 'هل سيرتك الذاتية مهيأة للقبول التلقائي لدى كبرى الشركات؟ اختبر نسبة التوافق الآن في ثوانٍ معدودة.',
          cta: 'افحص ملفك مجاناً',
          badge: 'إعلان بواسطة Google',
          icon: <Award className="w-6 h-6 text-blue-600" />,
          classes: 'w-full p-5 bg-gradient-to-b from-blue-50/70 to-indigo-50/70 border border-blue-100/80 rounded-xl flex flex-col gap-4 shadow-sm'
        };
      case 'in-content':
        return {
          title: 'كورسات معتمدة من Google و IBM مجاناً',
          description: 'تأهل للحصول على وظائف متميزة برواتب مجزية. تصفح آلاف الكورسات المجانية المتاحة للمستخدمين اليوم.',
          cta: 'تصفح الكورسات',
          badge: 'إعلان ممول',
          icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
          classes: 'w-full p-6 bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm'
        };
      case 'footer':
        return {
          title: 'هل تبحث عن عمل عن بعد؟ سجل في مهارات المستقبل',
          description: 'وظائف متميزة للشركات الصاعدة في الخليج والشرق الأوسط تبحث عن كفاءات فورية.',
          cta: 'سجل سيرتك الآن',
          badge: 'إعلان بواسطة EasyCV',
          icon: <Shield className="w-5 h-5 text-emerald-500" />,
          classes: 'w-full py-4 px-6 bg-slate-50/60 border border-slate-100 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs'
        };
    }
  };

  const ad = getAdDetails();

  return (
    <div className="my-6 mx-auto max-w-7xl animate-fade-in" style={{ direction: 'rtl' }}>
      {/* Label/Header of Ad */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium tracking-wide mb-1 px-1">
        <span>{ad.badge}</span>
        <span className="opacity-60">مساحة إعلانية آمنة</span>
      </div>

      {slot === 'header' && (
        <div className={ad.classes}>
          <div className="flex items-center gap-3">
            <span className="shrink-0 leading-none">{ad.icon}</span>
            <div className="text-right">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800">{ad.title}</h4>
              <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">{ad.description}</p>
            </div>
          </div>
          <button className="text-xs font-semibold px-4 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-md shadow-sm transition-all flex items-center gap-1">
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {slot === 'sidebar' && (
        <div className={ad.classes}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">{ad.icon}</div>
            <h4 className="text-sm font-bold text-slate-800 leading-snug">{ad.title}</h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed text-right md:text-justify">{ad.description}</p>
          <button className="w-full text-xs font-semibold py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-1">
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {slot === 'in-content' && (
        <div className={ad.classes}>
          <div className="flex items-start gap-4 flex-1">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl shrink-0 hidden sm:block">
              {ad.icon}
            </div>
            <div className="text-right">
              <h4 className="text-base font-bold text-slate-800">{ad.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ad.description}</p>
            </div>
          </div>
          <button className="shrink-0 text-xs font-semibold px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5">
            <span>{ad.cta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {slot === 'footer' && (
        <div className={ad.classes}>
          <div className="flex items-center gap-3">
            <span className="shrink-0">{ad.icon}</span>
            <p className="text-slate-600 font-medium text-right leading-relaxed">
              <strong className="text-slate-800">{ad.title} ── </strong> 
              <span className="text-slate-500 text-[11px]">{ad.description}</span>
            </p>
          </div>
          <button className="shrink-0 text-[11px] font-bold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-all">
            {ad.cta}
          </button>
        </div>
      )}
    </div>
  );
};
