import React, { useState } from 'react';
import { Sparkles, FileText, BadgeCheck, ShieldAlert, Zap, Globe, Share2, Award, ArrowLeft, ArrowUpRight, HelpCircle, Laptop, Shield, Layers } from 'lucide-react';
import { CVTemplateId } from '../types';
import { SEO } from './SEO';
import { AdSense } from './AdSense';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectTemplate: (templateId: CVTemplateId) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectTemplate,
  onOpenAuth
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Home Page Interactive Live Sandbox States
  const [sandboxPreset, setSandboxPreset] = useState<'developer' | 'market' | 'doctor'>('developer');
  const [sandboxName, setSandboxName] = useState('أحمد بن عبد الله');
  const [sandboxTitle, setSandboxTitle] = useState('مهندس برمجيات وتطبيقات سحابية أول');
  const [sandboxSummary, setSandboxSummary] = useState('شغوف ببناء النظم البرمجية المستقرة وتصميم الواجهات الرشيقة باستخدام React و Node.js ومؤمن بالرمز النظيف وسرعة الأداء لتخطّي فلاتر الـ ATS بامتياز وجذب انتباه مسؤولي التوظيف.');
  const [sandboxColor, setSandboxColor] = useState('#2563eb');
  const [sandboxTemplate, setSandboxTemplate] = useState<CVTemplateId>('minimalist');

  const presets = {
    developer: {
      name: 'أحمد بن عبد الله',
      title: 'مهندس برمجيات وتطبيقات سحابية أول',
      summary: 'شغوف ببناء النظم البرمجية المستقرة وتصميم الواجهات الرشيقة باستخدام React و Node.js ومؤمن بالرمز النظيف وسرعة الأداء لتخطّي فلاتر الـ ATS بامتياز وجذب انتباه مسؤولي التوظيف.',
      color: '#2563eb',
    },
    market: {
      name: 'رنا بنت عبد العزيز',
      title: 'أخصائية تسويق رقمي وإشهار نمو صاعد',
      summary: 'محترفة تسويق رقمي بارعة في قيادة حملات الاستحواذ المدفوعة وزيادة المبيعات وعائدات الاستثمار لأكثر من ٣٠٠٪ عبر أدوات تحليلات جوجل وسيو متكامل يعزز الوجود السحابي للمؤسسات.',
      color: '#10b981',
    },
    doctor: {
      name: 'د. هاني آل عبد المطلب',
      title: 'استشاري طب باطني وباحث إكلينيكي',
      summary: 'ممارس مكرس وطبيب باطني بخلفية أكاديمية وافرة ونشيطة، ملتزم برعاية المريض وتشخيص الحالات الدقيقة ونشر المقالات الطبية بمجلات رصينة ومؤتمرات دولية.',
      color: '#f59e0b',
    }
  };

  const handleApplyPreset = (key: 'developer' | 'market' | 'doctor') => {
    setSandboxPreset(key);
    const selected = presets[key];
    setSandboxName(selected.name);
    setSandboxTitle(selected.title);
    setSandboxSummary(selected.summary);
    setSandboxColor(selected.color);
  };

  const features = [
    {
      title: 'معتمد وخاضع لقارئ ATS الذكي',
      desc: 'قوالب السيرة الذاتية لدينا مصممة مع مراعاة كاملة لهياكل أنظمة الفرز والقبول التلقائي ATS، مما يرفع آمال عبور ملفك للفرز البشري بنسبة تصل إلى ٩٩٪.',
      icon: <BadgeCheck className="w-5 h-5 text-cyan-400" />
    },
    {
      title: 'مولد المساعدة التلقائي والمصحح',
      desc: 'بنقرة واحدة، يقوم مصحح البيانات والذكاء الاصطناعي التفاعلي بتوليد ملخصات احترافية، مهارات مقترحة، ومجموعات نقاط خبرة غنية ومقنعة للغاية.',
      icon: <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
    },
    {
      title: 'تصدير PDF قياسي عالي الدقة',
      desc: 'احصل على ملفات PDF ذات جودة مطبعية فائقة بدون ظهور روابط مفسدة أو تشويه للتنسيق. حجم الملفات مثالي للرفع والفرز الفوري.',
      icon: <FileText className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'أمن البيانات والخصوصية التامة',
      desc: 'بياناتك ومسودات السيرة الذاتية تظل مشفرة على متصفحك الشخصي وتتمتع بحفظ تلقائي مستمر، مما يعني ألا أحد سواك يمكنه التعديل أو الرؤية.',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />
    }
  ];

  const faqs = [
    {
      q: 'هل يمكنني بالفعل طباعة السيرة وصنعها مجاناً؟',
      a: 'نعم، المنصة تتيح لك استخدام القوالب بالكامل وملء الأقسام والتحميل بصيغة PDF مباشرة مجاناً لجميع المستخدمين والمحترفين دون طلب معطيات بطاقات الائتمان.'
    },
    {
      q: 'كيف يعمل مولد المساعدة الذكي بالأتمتة؟',
      a: 'وفرنا لكم نظام "المحاكي التلقائي للخبرة المتميزة" لملء تفاصيل سيرتك بنقرة واحدة كقاعدة انطلاق سريعة، مما يعطيك هيكلاً مبهراً لتبدأ التعديل عليه فوراً.'
    },
    {
      q: 'هل يمكنني تغيير قالب التصميم بعد ملء الخبرات؟',
      a: 'طبعاً بالتأكيد! يمكنك التنقل بين القوالب المتعددة بضغطة زر وسيتم تكييف كافة أرقام وبيانات خبراتك مع القالب الجديد في نفس اللحظة.'
    }
  ];

  const testimonials = [
    {
      name: 'عبدالله الشمري',
      role: 'مهندس برمجيات ريادي في الرياض',
      comment: 'بعد استخدام قالب الكلاسيكي النظيف المعتمد هنا، تضاعفت دعوات المقابلات الشخصية التي استقبلتها من ٣ مقابلات شهرياً إلى أكثر من ٥ دعوات أسبوعياً بفضل توافقه المذهل مع ATS!'
    },
    {
      name: 'سارة عبد الرحمن',
      role: 'أخصائية تسويق رقمي في دبي',
      comment: 'أفضل تجربة صانع سيرة ذاتية على الإطلاق وخصوصاً قالب البينتو التقني الحديث. الحفظ التلقائي مريح للغاية والقدرة على تبديل قوالب الألوان بحرية خرافية.'
    }
  ];

  return (
    <div className="bg-[#030712] text-slate-350 min-h-screen animate-fade-in tech-grid pb-12 relative overflow-hidden font-sans" style={{ direction: 'rtl' }}>
      <SEO 
        title="صانع السيرة الذاتية الاحترافي والذكي مجاناً" 
        description="صمم سيرتك الذاتية في دقائق معدودة بقوالب حديثة معتمدة ومتوافقة مع أنظمة التوظيف ATS. تحميل مباشر وسهل وحفظ تلقائي."
      />

      {/* Cyber ambient background lighting orbs */}
      <div className="absolute top-[8%] left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full filter blur-[120px] animate-tech-glow pointer-events-none" />
      <div className="absolute top-[35%] right-8 w-[380px] h-[380px] bg-indigo-500/10 rounded-full filter blur-[150px] animate-tech-glow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[15%] left-12 w-[450px] h-[450px] bg-purple-500/5 col-span-3 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-full text-xs font-bold text-cyan-400 mb-6 neon-glow-cyan animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>الجيل الجديد من صناع السيرة الذاتية الذكية (SaaS 2.0)</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-snug sm:leading-tight">
            سيرتك الذاتية <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">الرقمية المطورة</span> في دقائق معدودة!
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto mt-5 text-sm sm:text-base md:text-lg leading-relaxed font-semibold">
            امنح نفسك الأفضلية المطلقة وتخطّى مرشحات الفرز التلقائي (ATS Evaluation) في ثوانٍ. بنيناه بأدق المواصفات التقنية ليمنحك التفوق المباشر.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-9">
            <button
              onClick={() => onNavigate('templates')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/20 active:opacity-95 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <span>ابدأ التجربة مجاناً</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-850/90 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>تصفح الدروس والمقالات المهنية</span>
              <ArrowUpRight className="w-4 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-850/80">
            <div className="text-right sm:text-center">
              <span className="block text-2xl sm:text-3xl font-black text-white tracking-tight bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent font-mono">+١٨٠ألف</span>
              <span className="block text-[10px] sm:text-xs text-slate-500 font-bold mt-1">سير مصممة ومحملة بنجاح</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">٩٩.٢٪</span>
              <span className="block text-[10px] sm:text-xs text-slate-500 font-bold mt-1">نسبة مطابقة عبور ATS</span>
            </div>
            <div className="text-left sm:text-center">
              <span className="block text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight font-mono">٠ ريال</span>
              <span className="block text-[10px] sm:text-xs text-slate-500 font-bold mt-1">أدوات وقوالب مجانية بالكامل</span>
            </div>
          </div>

        </div>
      </section>

      {/* Home Page Live Interactive Sandbox Editor & Simulator */}
      <section className="px-4 -mt-10 sm:-mt-16 max-w-6xl mx-auto mb-16 relative z-10 font-sans">
        <div className="bg-[#0f172a]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative text-right">
          
          {/* Header Controls / Simulation Badge */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-5 border-b border-slate-800/70">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/30 rounded-full text-xs font-black text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>لوحة التجربة والمحاكاة التفاعلية الحية ⚡</span>
              </div>
              <h3 className="text-lg font-black text-white mt-2">جرّب صياغة وتكييف سيرتك الذاتية مباشرة! 👇</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">اختر نموذجاً، اكتب اسمك، غيّر الألوان والقوالب وشاهد التغيرات الفورية تلقائياً.</p>
            </div>

            {/* Career Presets Selector */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-850/80">
              <span className="text-[10px] text-slate-500 font-extrabold px-2">النماذج الجاهزة:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('developer')}
                className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${sandboxPreset === 'developer' ? 'bg-gradient-to-r from-cyan-500 to-indigo-505 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                مطور رائد 💻
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('market')}
                className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${sandboxPreset === 'market' ? 'bg-gradient-to-r from-cyan-500 to-indigo-505 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                مسوق نمو 📈
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('doctor')}
                className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${sandboxPreset === 'doctor' ? 'bg-gradient-to-r from-cyan-500 to-indigo-505 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                طبيب استشاري 🩺
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Micro Sandbox Controls */}
            <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-850/70 space-y-5">
              
              <div className="space-y-3.5 text-right">
                <span className="text-[11px] font-black text-cyan-400 block border-b border-slate-800/60 pb-1.5">✍️ البيانات الشخصية والنبذة:</span>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    value={sandboxName}
                    onChange={(e) => {
                      setSandboxName(e.target.value);
                      setSandboxPreset('' as any);
                    }}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">المسمى الوظيفي المستهدف</label>
                  <input
                    type="text"
                    value={sandboxTitle}
                    onChange={(e) => {
                      setSandboxTitle(e.target.value);
                      setSandboxPreset('' as any);
                    }}
                    placeholder="مثال: مهندس شبكات أول..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">الملخص المهني والنبذة الشخصية</label>
                  <textarea
                    rows={4}
                    value={sandboxSummary}
                    onChange={(e) => {
                      setSandboxSummary(e.target.value);
                      setSandboxPreset('' as any);
                    }}
                    placeholder="تحدث بأسلوب متميز عن برهانك ومستواك المهني..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-500 shadow-sm font-sans"
                  />
                </div>
              </div>

              {/* Swap Style Templates & Colors */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-black text-cyan-400 block border-b border-slate-800/60 pb-1.5">🎨 التحكم في التصميم والقالب:</span>
                
                {/* Template picker */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSandboxTemplate('minimalist')}
                    className={`px-3 py-2.5 text-[10.5px] font-black rounded-lg border text-center transition-all cursor-pointer ${sandboxTemplate === 'minimalist' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white border-transparent' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'}`}
                  >
                    القالب الكلاسيكي 📄
                  </button>
                  <button
                    onClick={() => setSandboxTemplate('corporate')}
                    className={`px-3 py-2.5 text-[10.5px] font-black rounded-lg border text-center transition-all cursor-pointer ${sandboxTemplate === 'corporate' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white border-transparent' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'}`}
                  >
                    القالب التنفيذي 💼
                  </button>
                  <button
                    onClick={() => setSandboxTemplate('creative')}
                    className={`px-3 py-2.5 text-[10.5px] font-black rounded-lg border text-center transition-all cursor-pointer ${sandboxTemplate === 'creative' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white border-transparent' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'}`}
                  >
                    القالب الإبداعي 🌟
                  </button>
                  <button
                    onClick={() => setSandboxTemplate('bento')}
                    className={`px-3 py-2.5 text-[10.5px] font-black rounded-lg border text-center transition-all cursor-pointer ${sandboxTemplate === 'bento' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white border-transparent' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'}`}
                  >
                    قالب بينتو التقني ⊞
                  </button>
                </div>

                {/* Color pickers switcher */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-bold text-slate-400">اللون السائد:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { hex: '#2563eb', label: 'أزرق' },
                      { hex: '#10b981', label: 'أخضر' },
                      { hex: '#8b5cf6', label: 'بنفسجي' },
                      { hex: '#dc2626', label: 'أحمر' },
                      { hex: '#0f172a', label: 'كوزموس' }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setSandboxColor(col.hex)}
                        title={col.label}
                        className={`w-6 h-6 rounded-full border border-white/10 transition-all cursor-pointer ${sandboxColor === col.hex ? 'ring-2 ring-cyan-400 scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'}`}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Direct Seeding Goal */}
              <div className="pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    onSelectTemplate(sandboxTemplate);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <span>افتح هذا التصميم في لوحة التعديل الكاملة! 🚀</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-500 text-center block mt-2 font-bold select-none">بياناتك المدخلة هنا سيتم نقلها مباشرة للأداة لتبدأ فوراً!</span>
              </div>

            </div>

            {/* Right Column: Dynamic A4 Copy with sci-fi frame */}
            <div className="lg:col-span-7 bg-slate-950/40 p-4 rounded-3xl border border-slate-850 shadow-inner relative flex flex-col items-center overflow-hidden min-h-[500px]">
              
              {/* Paper Top bar */}
              <div className="w-full flex justify-between items-center mb-4 text-slate-450 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-300 font-mono">EZ-DOCUMENT PREVIEW v4.0.1</span>
                </div>
                <div className="text-[9px] font-extrabold bg-[#030712] text-cyan-400 px-2 py-0.5 border border-slate-800 rounded-md">المقاس المعياري A4</div>
              </div>

              {/* Simulated Paper Document Container */}
              <div className="w-full overflow-x-auto flex justify-center py-2">
                <div 
                  className="bg-white p-6 w-[520px] h-[735px] shadow-2xl border border-slate-800/20 rounded-lg text-right relative overflow-hidden shrink-0 transition-all duration-300 select-text selection:bg-cyan-100 select-none"
                  style={{
                    fontSize: '10px',
                    direction: 'rtl',
                    fontFamily: 'Cairo, Inter, system-ui, sans-serif'
                  }}
                >
                  
                  {/* DESIGN TEMPLATE: MINIMALIST */}
                  {sandboxTemplate === 'minimalist' && (
                    <div className="space-y-4 text-slate-800">
                      {/* Name Centered & Color accent */}
                      <div className="text-center pb-4 border-b border-slate-100">
                        <h4 
                          className="text-lg font-black transition-colors"
                          style={{ color: sandboxColor }}
                        >
                          {sandboxName || 'الاسم الكامل'}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold mt-1">{sandboxTitle || 'المسمى المشخص للمهنة'}</p>
                        <div className="flex justify-center gap-3 text-[9px] text-slate-400 mt-2 font-mono">
                          <span>📍 الرياض، السعودية</span>
                          <span>•</span>
                          <span>✉️ info@domain.com</span>
                          <span>•</span>
                          <span>📞 +966 500000000</span>
                        </div>
                      </div>

                      {/* Summary Section */}
                      <div className="space-y-1.5 focus:ring-1">
                        <h5 className="text-[11px] font-black uppercase tracking-wide flex items-center gap-1.5" style={{ color: sandboxColor }}>
                          <span className="w-1.5 h-3 rounded-full" style={{ backgroundColor: sandboxColor }}></span>
                          الملخص والهدف المهني
                        </h5>
                        <p className="text-slate-600 text-[10px] leading-relaxed font-normal text-justify">
                          {sandboxSummary || 'اكتب نبذة مهنية مختصرة ومؤثرة تصف قصة نجاحك وتطلعاتك لبدء المحاكاة...'}
                        </p>
                      </div>

                      {/* Hardcode Mock Work Experience so it shows a full, complete motivating sheet */}
                      <div className="space-y-2">
                        <h5 className="text-[11px] font-black uppercase tracking-wide flex items-center gap-1.5" style={{ color: sandboxColor }}>
                          <span className="w-1.5 h-3 rounded-full" style={{ backgroundColor: sandboxColor }}></span>
                          الخبرة العملية المسجلة
                        </h5>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                              <span>أخصائي مهني / قيادي أول</span>
                              <span className="text-[9px] text-slate-400 font-mono">2023 - الآن</span>
                            </div>
                            <div className="text-slate-500 text-[9px] font-medium">الشركة التقنية المتقدمة للحلول السحابية | الرياض</div>
                            <p className="text-slate-400 text-[9px] mt-1 leading-relaxed">
                              • قيادة العمليات وتنفيذ استراتيجيات التطوير المهني بأعلى مستويات الجودة المعتمدة بالشرق الأوسط.<br />
                              • خفض معدلات الأخطاء بنسبة ٤٥٪ وتحسين آليات مطابقة فلاتر الـ ATS وتوظيف الكوادر الطموحة.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mock Education & Skills for completeness */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-1.5">
                          <h6 className="text-[10px] font-black text-slate-800" style={{ color: sandboxColor }}>التحصيل التعليمي</h6>
                          <div className="text-[9px]">
                            <span className="block font-bold">درجة البكالوريوس في الهندسة / العلوم</span>
                            <span className="text-slate-400">جامعة الملك سعود | الرياض</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h6 className="text-[10px] font-black text-slate-800" style={{ color: sandboxColor }}>المهارات الأساسية</h6>
                          <div className="flex flex-wrap gap-1">
                            {['إدارة المشروعات', 'التفكير الاستراتيجي', 'حل المشكلات', 'الذكاء الاصطناعي', 'التواصل الفعّال'].map((sk) => (
                              <span 
                                key={sk} 
                                className="text-[8px] px-1.5 py-0.5 rounded font-bold"
                                style={{ backgroundColor: `${sandboxColor}10`, color: sandboxColor }}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* DESIGN TEMPLATE: CORPORATE */}
                  {sandboxTemplate === 'corporate' && (
                    <div className="h-full grid grid-cols-12 gap-4 text-slate-800">
                      
                      {/* Left Sidebar accent column color */}
                      <div 
                        className="col-span-4 p-4 text-white -m-6 ml-0 h-[105%] flex flex-col justify-between"
                        style={{ backgroundColor: sandboxColor }}
                      >
                        <div className="space-y-5">
                          {/* Name Block */}
                          <div className="space-y-1">
                            <h4 className="text-sm font-black tracking-tight text-white leading-tight">
                              {sandboxName || 'الاسم الكامل'}
                            </h4>
                            <p className="text-[9px] text-white/95">{sandboxTitle || 'المسمى المشخص'}</p>
                          </div>

                          <div className="h-px bg-white/20"></div>

                          {/* Contact */}
                          <div className="space-y-2 text-[8px] opacity-90 font-sans">
                            <div className="font-bold">📍 الرياض، السعودية</div>
                            <div>✉️ contact@domain.sa</div>
                            <div>📞 +966 50000000</div>
                          </div>

                          {/* Skills */}
                          <div className="space-y-2">
                            <h5 className="text-[9px] font-black uppercase tracking-wider text-white border-b border-white/20 pb-1">المهارات الفنية</h5>
                            <div className="flex flex-wrap gap-1">
                              {['حل المشكلات', 'التحليل البياني', 'صنع القرار', 'المفاوضات'].map(sk => (
                                      <span key={sk} className="text-[8px] px-1.5 py-0.5 bg-white/10 rounded-md text-white font-bold">{sk}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-[8px] text-white/40 font-mono">سيرة معتمدة ATS</div>
                      </div>

                      {/* Right Main Body Content */}
                      <div className="col-span-8 space-y-4">
                        <div className="space-y-1 pb-2 border-b border-slate-150">
                          <h5 className="text-[10px] font-black uppercase tracking-wider" style={{ color: sandboxColor }}>الملخص التنفيذي والأهداف</h5>
                          <p className="text-slate-605 text-[9.5px] leading-relaxed text-justify">
                            {sandboxSummary || 'نبذة تخصصية تصف الكفاءات المتطورة والجاهزية العالية لشغل الشواغر المتاحة...'}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black uppercase tracking-wider" style={{ color: sandboxColor }}>التسلسل الوظيفي والخبرات</h5>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-800">
                                <span className="text-slate-850">مدير المشاريع الإقليمي</span>
                                <span className="text-slate-400 font-mono">2021 - الآن</span>
                              </div>
                              <div className="text-[8px] text-slate-405">مجموعة حلول النمو العالمية | الرياض</div>
                              <p className="text-slate-500 text-[8px] mt-1 leading-relaxed">
                                • تنفيذ خطط التوظيف المتطورة وتوفير حلول السحابة الحيوية وبناء مسار التحول الرقمي.<br />
                                • المساهمة في نمو فروع الشركة بنسبة ٥٠٪ وتقديم استشارات لـ ١٢ عميلاً استراتيجياً بنجاح تام.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h5 className="text-[10px] font-black uppercase tracking-wider" style={{ color: sandboxColor }}>التعليم والشهادات المهنية</h5>
                          <div className="text-[8px]">
                            <span className="block font-bold">الماجستير المهني في الإدارة التنفيذية</span>
                            <span className="text-slate-400 text-[8px]">جامعة الأمير سلطان | الرياض</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* DESIGN TEMPLATE: CREATIVE */}
                  {sandboxTemplate === 'creative' && (
                    <div className="space-y-4 text-slate-855">
                      {/* Rounded Banner Header */}
                      <div 
                        className="p-5 rounded-2xl text-white relative overflow-hidden flex justify-between items-center"
                        style={{ backgroundColor: sandboxColor }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12"></div>
                        <div className="relative z-10">
                          <h4 className="text-lg font-black">{sandboxName || 'الاسم الكريم'}</h4>
                          <p className="text-xs text-white/95 mt-0.5">{sandboxTitle || 'المسمى الإبداعي المستهدف'}</p>
                        </div>
                        <div className="text-left relative z-10 text-[8px] text-white/90">
                          <div>📍 الرياض، السعودية</div>
                          <div>✉️ test@creative.sa</div>
                        </div>
                      </div>

                      {/* Summary with creative quotation */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic text-slate-650 text-[9.5px] leading-relaxed text-justify">
                        <span className="text-lg font-black text-slate-300 block line-height-none -mt-1 -mb-2">“</span>
                        {sandboxSummary || 'اكتب رؤيتك الإبداعية واقتباسك المهني الخاص لإلهام مسؤولي التوظيف وجذب الفرص...'}
                      </div>

                      {/* Job Experiences */}
                      <div className="space-y-2.5">
                        <h5 className="text-[10px] font-black border-r-2 pr-2 leading-none" style={{ borderColor: sandboxColor, color: sandboxColor }}>
                          مسيرتي الفنية والمهنية
                        </h5>
                        
                        <div className="space-y-2">
                          <div className="relative pr-3 border-r border-slate-100">
                            <span className="absolute right-[-4px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: sandboxColor }}></span>
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-800">
                              <span>قائد الفريق الإبداعي</span>
                              <span className="text-[8px] text-slate-400">2022 - الآن</span>
                            </div>
                            <div className="text-[8px] text-slate-450">استوديو أفكار للتصميم والابتكار | جدة</div>
                            <p className="text-slate-500 text-[8.5px] mt-1 leading-relaxed">
                              • بناء هويات بصرية متناسقة وتصميم تجربة المستخدم لأكثر من ٢٠ عميلاً متميزاً برعاية وتنسيق كاملين.<br />
                              • تحقيق زيادة بلغت ٤٠٪ في معدلات الثقة والاحتفاظ بالعملاء عبر واجهات حديثة ملهمة.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <h5 className="text-[10px] font-black" style={{ color: sandboxColor }}>اللغات المتقنة</h5>
                          <div className="flex gap-2 text-[8px] text-slate-500">
                            <span>العربية (الأم) 🇸🇦</span>
                            <span>الإنجليزية (طلاقة) 🇬🇧</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-[10px] font-black" style={{ color: sandboxColor }}>الشهادات المهنية</h5>
                          <span className="block text-[8px] font-bold text-slate-600">شهادة التصميم والحلول الإبداعية المعتمدة</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* DESIGN TEMPLATE: BENTO */}
                  {sandboxTemplate === 'bento' && (
                    <div className="space-y-3 text-slate-800">
                      
                      {/* Bento Row 1: Banner Block & Quick Contact Block */}
                      <div className="grid grid-cols-12 gap-3">
                        <div 
                          className="col-span-8 p-4 rounded-2xl text-white flex flex-col justify-between"
                          style={{ backgroundColor: sandboxColor }}
                        >
                          <div>
                            <span className="text-[7.5px] uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full font-bold">الملف الفردي المعتمد</span>
                            <h4 className="text-sm font-black mt-2 leading-tight">{sandboxName || 'الاسم الكامل'}</h4>
                          </div>
                          <p className="text-[9.5px] text-white/95 mt-1">{sandboxTitle || 'المسمى المشخص'}</p>
                        </div>

                        <div className="col-span-4 bg-slate-900 text-white p-3 rounded-2xl flex flex-col justify-between text-[8px] font-mono">
                          <div className="space-y-1 leading-normal">
                            <span className="text-cyan-400 text-[8px] block font-black">📍 معلومات الاتصال</span>
                            <span className="block">الرياض، السعودية</span>
                            <span className="block">contact@domain.sa</span>
                          </div>
                          <span className="text-[7.5px] text-slate-500 mt-2 font-bold font-sans">متوافق ATS 🤖</span>
                        </div>
                      </div>

                      {/* Bento Row 2: Big Summary block */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                        <span className="text-[9px] font-black block mb-1" style={{ color: sandboxColor }}>⊞ النبذة والهدف الاستراتيجي:</span>
                        <p className="text-slate-605 text-[9px] leading-relaxed text-justify font-sans">
                          {sandboxSummary || 'عبر عن مهاراتك بشكل احترافي رائع لتبدأ المحاكاة...'}
                        </p>
                      </div>

                      {/* Bento Row 3: Experience & Skills inside Bento blocks */}
                      <div className="grid grid-cols-12 gap-3">
                        
                        <div className="col-span-7 bg-white p-3.5 rounded-2xl border border-slate-150 space-y-2">
                          <span className="text-[9px] font-black block" style={{ color: sandboxColor }}>✦ المسار المهني البارز:</span>
                          <div className="text-[9px] space-y-1">
                            <div className="flex justify-between font-bold text-slate-800">
                              <span>قائد تحول العمليات</span>
                              <span className="text-slate-400 font-mono font-normal">2022</span>
                            </div>
                            <span className="block text-[8px] text-slate-400 font-medium">الشركة السعودية للصناعات المبتكرة</span>
                            <p className="text-slate-500 text-[8px] leading-relaxed mt-1">
                              • الإشراف الكامل على تطوير النماذج وتحقيق سرعة إنتاج فائقة تواكب أحدث استراتيجيات السوق المفتوح.
                            </p>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-5 bg-slate-50 p-3.5 rounded-2xl border border-slate-150 flex flex-col justify-between">
                          <div>
                            <span className="text-[8.5px] font-black block text-slate-800 mb-1.5">✦ جرد مهاراتك:</span>
                            <div className="flex flex-wrap gap-1">
                              {['تطوير الواجهات', 'اتخاذ القرارات', 'أتمتة العمليات', 'التسويق'].slice(0, 3).map(sk => (
                                <span key={sk} className="text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-705 font-bold rounded-md">{sk}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-200 text-[7.5px] text-slate-400 font-bold mt-2">سجل مؤتمت بالكامل</div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* AdSense Header Placement */}
      <AdSense slot="header" />

      {/* Main Features Grid with Sci-fi Bento Blocks */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/40 border border-indigo-800/40 rounded-full text-[11px] font-bold text-indigo-300 mb-3 animate-pulse">
            <Layers className="w-3.5 h-3.5" />
            <span>نظام فلترة وموثوقية ممتد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">صُمم خصيصاً ليتطابق مع أدوات الـ ATS المتقدمة</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mt-2">
            تمت هندسة التطبيق ليعطيك السرعة والأدوات القياسية المطلوبة في رحلتك المهنية بعيداً عن التعقيد الزائد عبر شبكات بانتو غنية بهيكل تقني واعد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const spanClass = (idx === 0 || idx === 3) ? "md:col-span-2" : "md:col-span-1";
            return (
              <div 
                key={idx} 
                className={`${spanClass} glass-panel p-6 sm:p-8 rounded-2xl border border-slate-850 hover:border-cyan-500/35 transition-all duration-300 group flex flex-col justify-between hover:shadow-cyan-500/5 neon-glow-cyan`}
              >
                <div>
                  <div className="p-3 bg-slate-950 border border-slate-850 inline-block rounded-xl mb-4 group-hover:text-cyan-400 transition-colors shadow-inner">
                    {feat.icon}
                  </div>
                  <h3 className="text-base font-black text-white mb-2 leading-none group-hover:text-cyan-400 transition-colors">{feat.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed text-right md:text-justify font-medium">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#070b19]/80 border-t border-b border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">رحلات مهنية ناجحة محفوفة بالتفوق</h2>
            <p className="text-slate-400 text-sm mt-1">آراء مسجلة لمشتركين استطاعوا لفت انتباه الشركات واستلام العروض الحقيقية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, index) => (
              <div key={index} className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-850 shadow-lg hover:border-indigo-500/30 transition-all">
                <span className="block text-2xl text-cyan-400 leading-none mb-3 font-mono">“</span>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 text-justify font-medium">{test.comment}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-950 to-indigo-950 border border-cyan-800/30 text-cyan-400 font-extrabold flex items-center justify-center text-sm shadow-inner">
                    {test.name[0]}
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-black text-white leading-none">{test.name}</h4>
                    <span className="block text-[10px] text-slate-500 font-bold mt-1">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white">خطط تناسب جميع الطموحات والباحثين</h2>
          <p className="text-slate-400 text-sm mt-1">ابدأ مجاناً لخبراتك الأساسية، أو ارتقِ لخيارات غير محدودة</p>
          
          {/* Cycle Toggler */}
          <div className="inline-flex bg-slate-950 p-1.5 rounded-2xl items-center gap-1 mt-6 border border-slate-850">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs px-4 py-1.5 rounded-lg font-black transition-colors cursor-pointer ${billingCycle === 'monthly' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              دفع شهري
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`text-xs px-4 py-1.5 rounded-lg font-black transition-colors cursor-pointer ${billingCycle === 'yearly' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-505 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              دفع سنوي (خصم ٢٠٪)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Plan 1 */}
          <div className="glass-panel text-white rounded-3xl p-6 sm:p-8 border border-slate-850 hover:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">الخطة التقديرية</span>
              <h3 className="text-lg font-black text-white">مجاناً بالكامل للجميع</h3>
              <p className="text-[11px] text-slate-400 mt-2 mb-6">مناسب لإنشاء سيرة ذاتية أولى مشفرة ومتناسقة للتوظيف المباشر.</p>
              
              <div className="text-3xl font-black text-cyan-400 mb-6 font-mono">٠ ريال <span className="text-xs text-slate-500 font-semibold">/ للأبد</span></div>
              
              <ul className="space-y-3 text-xs text-slate-400 mb-8">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div> الوصول لجميع تصاميم القوالب القياسية</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div> الحفظ التلقائي والخصوصية المستمرة</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div> تصدير ملفات PDF حية ممتازة</li>
              </ul>
            </div>
            
            <button
              onClick={() => onNavigate('templates')}
              className="w-full text-center py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
            >
              ابدأ الاستخدام مجاناً
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-gradient-to-br from-[#0f172a]/95 to-[#1a103c]/90 rounded-3xl p-6 sm:p-8 border-2 border-cyan-500 hover:border-cyan-400 shadow-xl shadow-cyan-500/10 relative flex flex-col justify-between">
            <span className="absolute top-0 right-1/2 translate-x-1/2 translate-y-[-50%] bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] uppercase font-black px-4 py-1 rounded-full shadow-md">
              باقة الأولوية للمتوجهين تقنياً ✦
            </span>
            
            <div className="mt-2">
              <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block mb-1">الترقية التنافسية الذكية</span>
              <h3 className="text-lg font-black text-white">باقة المحترفين والمشروعات</h3>
              <p className="text-[11px] text-slate-350 mt-2 mb-6">مجموعة أدوات تدقيق فنية ومشاريع ومميزات تدقيق ATS ذكية تناسب الباحثين عن التفوق السريع بجاذبية عالية.</p>
              
              <div className="text-3xl font-black text-white mb-6 font-mono">
                {billingCycle === 'monthly' ? '٢٩ ريال' : '٢٣ ريال'}
                <span className="text-xs text-slate-500 font-semibold font-sans"> / شهرياً</span>
              </div>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2 text-cyan-300 font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div> الوصول لكافة القوالب الذهبية وبينتو</li>
                <li className="flex items-center gap-2 text-slate-200 font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div> تحليل ومراجعة الكلمات المفتاحية فوراً</li>
                <li className="flex items-center gap-2 text-slate-200 font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div> خوادم سريعة للتحميل والتحويل عالي الدقة</li>
              </ul>
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full text-center py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all border border-white/10 cursor-pointer"
            >
              اشترك ورقِّ حسابك الآن
            </button>
          </div>
        </div>
      </section>

      {/* AdSense In-Content Placement */}
      <AdSense slot="in-content" />

      {/* FAQ accordions with cyber style */}
      <section className="py-16 bg-slate-950/40 border border-slate-900 max-w-4xl mx-auto rounded-3xl mb-16 px-4 sm:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white">هل تحتاج لإجابات سريعة؟</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">تصفح الأسئلة الشائعة لمعرفة معايير الخصوصية والتصدير للغتين العربية والإنجليزية</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-900 rounded-2xl overflow-hidden transition-all bg-slate-950/70">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-right p-5 bg-slate-900/40 hover:bg-slate-900/80 font-bold text-xs sm:text-sm text-white flex justify-between items-center cursor-pointer transition-all border-none focus:outline-none"
                >
                  <span className="font-extrabold">{faq.q}</span>
                  <span className="text-cyan-400 font-black text-[10px]">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="p-5 text-xs text-slate-400 leading-relaxed text-right md:text-justify border-t border-slate-900 animate-fade-in bg-slate-950/50 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Pre-footer Call-To-Action - Cosmic Grid Card */}
      <section className="py-14 bg-gradient-to-tr from-[#090d1a] via-[#101935] to-[#120f2e] text-white text-center rounded-3xl max-w-5xl mx-auto px-4 sm:px-8 mb-16 shadow-2xl relative z-10 border border-indigo-500/30">
        <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none rounded-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-indigo-200">صمّم مستقبلك الجديد بكفاءة وذكاء خارقين!</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed font-semibold">
            انضم الآن لآلاف المبدعين الذين عززوا وجودهم الوظيفي واستلموا عروضاً من أبرز الشركات والمنظمات بالشرق الأوسط والخليج.
          </p>
          <button
            onClick={() => onNavigate('templates')}
            className="mt-7 px-8 py-4 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-[0.99] hover:shadow-cyan-500/20 shadow-lg text-white font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <span>اختر قالباً واصنع سيرتك الذكية مجاناً</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* AdSense Footer Placement */}
      <AdSense slot="footer" />

    </div>
  );
};
