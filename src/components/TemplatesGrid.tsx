import React, { useState, useEffect } from 'react';
import { Eye, FileText, BadgeCheck, Sparkles, Building, Briefcase, Zap, Globe, Lock, Unlock } from 'lucide-react';
import { CVTemplateId } from '../types';
import { SEO } from './SEO';
import { COUNTRIES } from '../data/countryData';

interface TemplatesGridProps {
  onSelectTemplate: (templateId: CVTemplateId) => void;
}

export const TemplatesGrid: React.FC<TemplatesGridProps> = ({ onSelectTemplate }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('EG');

  useEffect(() => {
    const saved = localStorage.getItem('easycv_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        if (parsed.country) {
          setSelectedCountryCode(parsed.country);
        }
      } catch (e) {}
    }
  }, []);

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  const templates = [
    {
      id: 'minimalist' as CVTemplateId,
      name: 'الكلاسيكي النظيف (Minimalist)',
      atsScore: '٩٩.٢٪ بالتجربة الفنية',
      description: 'تصميم أوروبي هادئ يركز بالكامل على تسلسل الكلمات وتسهيل القراءة السريعة. هو الخيار الأفضل والآمن لمسؤولي التوظيف وأنظمة الفرز الرمزي ATS.',
      badge: 'الأكثر اختياراً لحديثي التخرج والمهندسين',
      color: 'border-slate-800 bg-[#090d16]/30',
      icon: <FileText className="w-8 h-8 text-cyan-400" />,
      features: ['عمود واحد واضح ومقروء', 'توزيع مثالي للمساحات البيضاء', 'توافق كامل مع ملفات ATS'],
      isPremium: false
    },
    {
      id: 'corporate' as CVTemplateId,
      name: 'المهني التنفيذي (Corporate)',
      atsScore: '٩٨.٧٪ مع فلاتر الفرز',
      description: 'تصميم عريض غني بالمعلومات مع شريط معلومات جانبي أزرق داكن. ممتاز للمدراء التنفيذيين، المستشارين، وذوي الخبرات الممتدة الطويلة.',
      badge: 'مثالي للوظائف المصرفية والطبية ومجالات التسويق',
      color: 'border-slate-800 bg-[#0f172a]/30',
      icon: <Building className="w-8 h-8 text-indigo-400" />,
      features: ['شريط ملخص جانبي ملون', 'تسلسل زمني جذاب للتوظيف', 'تصميم متوازن واثق وكلاسيكي'],
      isPremium: false
    },
    {
      id: 'creative' as CVTemplateId,
      name: 'الإبداعي الحديث (Creative Tech)',
      atsScore: '٩٧.٩٪ في الأنماط الرقمية',
      description: 'لمسة معاصرة مع لمحات دافئة وتوزيع بانتو للبيانات. يجمع بين المظهر المهني والتعبير عن الشخصية الفريدة لإبهار لجان التصميم والإبداع وفنون الويب.',
      badge: 'مفضل للمبرمجين، مصممي واجهة المستخدم، وصناع المحتوى',
      color: 'border-slate-800 bg-[#120f2e]/30',
      icon: <Zap className="w-8 h-8 text-purple-400 animate-pulse" />,
      features: ['عناوين أيقونية أنيقة', 'توزيع مهارات حديث ومحدد', 'ألوان متناسقة وعلامات بصرية فريدة'],
      isPremium: true
    },
    {
      id: 'bento' as CVTemplateId,
      name: 'بانتو المستقبلي (Bento Grid Modern)',
      atsScore: '٩٩.٥٪ تخطيط متطور',
      description: 'أرقى صيحات تصميم الويب وريادة الأعمال لعام ٢٠٢٦. ينسق سبر البيانات في صناديق ذكية متباينة الأبعاد بتوزيع بصري أخاذ يجذب اهتمام لجان التوظيف والشركات الناشئة.',
      badge: 'الأقوى للمهندسين، قادة المشاريع، والمحترفين المستقلين',
      color: 'border-slate-800 bg-[#061e30]/35',
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      features: ['تقسيم بانتو تفاعلي جذاب', 'إبراز رقمي مباشر للمشاريع', 'تحليلات مرونة سريعة وجذابة'],
      isPremium: true
    },
    {
      id: 'classic' as CVTemplateId,
      name: 'الأكاديمي العريق (Classic Serif)',
      atsScore: '٩٨.٥٪ في التماثل الورقي',
      description: 'تنسيق متناظر غني بالبساطة والوقار ومطبوع بخطوط السيريف (Serif) الفاخرة العريقة. غاية في الانسيابية لتخطي كبرى بوابات الفرز والحصول على انطباع رفيع لدى جهات التوظيف.',
      badge: 'مفضل للأساتذة والأطباء والوظائف الإدارية والقانونية',
      color: 'border-slate-850 bg-[#2e1d0f]/15',
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      features: ['تنسيق متوازن متناظر', 'خطوط سيريف أكاديمية فاخرة', 'توزيع مريح للعين لتسهيل القراءة السريعة'],
      isPremium: false
    },
    {
      id: 'modern' as CVTemplateId,
      name: 'العصري الأنيق (Modern Clean)',
      atsScore: '٩٩.٠٪ مظهر متطور',
      description: 'تنسيق أنيق ممتد يعتمد تقسيمات هندسية تمنح مسؤولي التوظيف سهولة فائقة في رصد المحطات المهنية البارزة، مع مسارات متوازية ممتعة بصرياً.',
      badge: 'رائع لحديثي التخرج والمحترفين في مجالات التكنولوجيا والاتصالات',
      color: 'border-slate-850 bg-[#160d29]/30',
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      features: ['خطوط تقسيم متناسقة وموزونة', 'إبراز فائق العناية لأقسام المهارات واللغات', 'مظهر يعطي انطباع السرعة والاهتمام بالتفاصيل'],
      isPremium: true
    },
    {
      id: 'compact' as CVTemplateId,
      name: 'المكثف العملي (Compact Dense)',
      atsScore: '٩٨.٢٪ كفاءة مساحة',
      description: 'مثالي للمحترفين ذوي الخبرة الطويلة بأكثر من ٨ سنوات. يعتمد تكنيك ضغط المساحات الذكي للتعبير عن عشرات المنجزات والخبرات المتشعبة في صفحة واحدة ممتلئة.',
      badge: 'الأقوه للمستشارين والمدراء والخبرات المتشعبة الطويلة',
      color: 'border-slate-850 bg-[#06241b]/30',
      icon: <Briefcase className="w-8 h-8 text-emerald-400" />,
      features: ['أعمدة متباينة ثنائية تقلل الفراغات غير المستغلة', 'توفير مساحات ميكروية ذكية لتفادي الفحص المتعدد الأوراق', 'يدمج الخبرات المتشعبة والشهادات بجاذبية دون زحام كئيب'],
      isPremium: true
    }
  ];

  return (
    <div className="py-12 bg-[#030712] min-h-screen text-slate-300 animate-fade-in tech-grid relative overflow-hidden pb-20" style={{ direction: 'rtl' }}>
      <SEO 
        title="اختر القالب المثالي لسيرتك المهنية" 
        description="تصفح واختر من بين قوالب السيرة الذاتية الثلاثة الحاصلة على علامات الأمان العالمية وتخطت فلاتر الـ ATS لتأكيد القبول وتألق ملفك."
      />

      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/40 border border-indigo-900/40 rounded-full text-xs font-bold text-indigo-300 mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>قوالب معتمدة ومحسنة للتوظيف ممتثلة للفحص ATS</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            اختر التخطيط الأقرب لمستواك المهني 📑
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto mt-2 text-xs sm:text-sm leading-relaxed">
            جميع القوالب المتوفرة متوافقة بالكامل وتوفر رؤية فورية أثناء التعديل (Live Preview) مع إمكانية عرض الأسعار بعملتك المحلية أينما كنت.
          </p>
        </div>

        {/* Dynamic Country Selector bar inside Templates list */}
        <div className="bg-[#0f172a]/90 backdrop-blur border border-slate-800 p-4 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto rounded-3xl shadow-lg">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <div className="text-right">
              <span className="block text-xs font-black text-white">تصفح العملات والتسعير المحلي:</span>
              <span className="block text-[10px] text-slate-400">اختر بلد إقامتك لرؤية سعر تشغيل القوالب المتميزة تلقائياً بالعملة المعتمدة.</span>
            </div>
          </div>
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-black cursor-pointer text-white focus:outline-none focus:border-cyan-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.currencyCode})
              </option>
            ))}
          </select>
        </div>

        {/* Templates Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((tpl) => {
            const hasAccess = !tpl.isPremium || 
              (currentUser?.isSubscribed) || 
              (currentUser?.unlockedTemplates?.includes(tpl.id));

            return (
              <div
                key={tpl.id}
                className="bg-[#0b0f19]/80 rounded-3xl border border-slate-850 shadow-md overflow-hidden hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all flex flex-col justify-between relative group"
              >
                {/* Premium / Free Lock label */}
                <div className="absolute top-3 left-3 z-10">
                  {!tpl.isPremium ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-800 rounded-full text-[10px] font-bold px-2.5 py-1 text-emerald-400 shadow-sm">
                      مجاني بالكامل 🆓
                    </span>
                  ) : hasAccess ? (
                    <span className="inline-flex items-center gap-1 bg-cyan-950/40 border border-cyan-800 text-[10px] font-bold px-2.5 py-1 rounded-full text-cyan-400 shadow-sm">
                      مفتوح لحسابك <Unlock className="w-3 h-3 text-cyan-400 ml-0.5" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#1a0f3d] border border-purple-800/60 text-[10px] font-black px-2.5 py-1 rounded-full text-purple-400 shadow-sm">
                      قالب متميز 💎 {currentCountry.formattedPrice}
                    </span>
                  )}
                </div>

                {/* Top Banner Accent */}
                <div className={`p-6 border-b border-slate-850 flex items-center justify-between pt-12 ${tpl.color}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-950 rounded-xl shadow-inner border border-slate-800">{tpl.icon}</div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-500 font-extrabold">نمط التخطيط</span>
                      <span className="block text-xs font-black text-white group-hover:text-cyan-400 transition-colors">
                        {tpl.id === 'minimalist' ? 'كلاسيكي وبسيط' : 
                         tpl.id === 'corporate' ? 'تنفيذي مهني' : 
                         tpl.id === 'creative' ? 'إبداعي حديث' : 
                         tpl.id === 'bento' ? 'بانتو معاصر' : 
                         tpl.id === 'classic' ? 'أكاديمي عريق' : 
                         tpl.id === 'modern' ? 'عصري ممتد' : 
                         tpl.id === 'compact' ? 'مكثف مدمج' : 'نموذج مخصص'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9.5px] text-slate-500 font-bold">تقييم الـ ATS</span>
                    <span className="inline-flex items-center gap-0.5 text-cyan-400 font-black text-xs">
                      <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{tpl.atsScore.split(' ')[0]}</span>
                    </span>
                  </div>
                </div>

                {/* Main Info Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white mb-2 leading-none group-hover:text-cyan-400 transition-all">{tpl.name}</h3>
                    <span className="inline-block text-[10px] bg-slate-900 border border-slate-800 font-bold text-slate-400 px-2.5 py-1 rounded-md mb-4">{tpl.badge}</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed text-right md:text-justify mb-5">{tpl.description}</p>
                  </div>

                  {/* Bullet details */}
                  <div className="space-y-2 border-t border-slate-900 pt-4 mb-6">
                    {tpl.features.map((feat, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/80 shrink-0 select-none"></div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary CTA */}
                  <button
                    onClick={() => onSelectTemplate(tpl.id)}
                    className="w-full text-center py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-white/5 cursor-pointer active:scale-98"
                  >
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {tpl.isPremium && !hasAccess ? `فتح وتفعيل القالب المهني` : 'اختر القالب وابدأ الكتابة'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
