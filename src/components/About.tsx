import React from 'react';
import { Shield, CheckCircle, Target, Users, BookOpen, Star } from 'lucide-react';
import { SEO } from './SEO';

export const About: React.FC = () => {
  const stats = [
    { label: 'سيرة ذاتية تم تحميلها', value: '+١٨٠,٠٠٠' },
    { label: 'نسبة القبول في أنظمة ATS', value: '٩٨.٤٪' },
    { label: 'مستخدم مسجل ونشط', value: '+٥٠,٠٠٠' },
    { label: 'قوالب معتمدة دولياً', value: '٣ قوالب رئيسية' }
  ];

  const features = [
    {
      title: 'رؤية ثورية وتطوير سهل',
      description: 'نؤمن أن البحث عن وظيفة لا يجب أن يتعرقل بسبب حواجز التصميم الفنية. جئنا نتيح لكل باحث عن عمل أداة تضاهي جودة السير الذاتية بمئات الدولارات بمشاهدة فورية.',
      icon: <Target className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'حماية وتشفير البيانات',
      description: 'خصوصيتك هي أولى اهتماماتنا. بياناتك تحفظ محلياً بالكامل ولا يتم مشاركتها أو بيعها لأي أطراف لغرض التسويق الخبيث، كل شيء سري وآمن.',
      icon: <Shield className="w-6 h-6 text-indigo-600" />
    },
    {
      title: 'متوافق مع الذكاء الاصطناعي',
      description: 'نقدم لك محاكي الذكاء الاصطناعي التلقائي لإنهاء صياغة سيرة متوازنة في ثوانٍ، لتخطي مشكلة الورقة البيضاء والاستلهام الإملائي السريع.',
      icon: <Star className="w-6 h-6 text-amber-500" />
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen" style={{ direction: 'rtl' }}>
      <SEO 
        title="من نحن - قصتنا ورسالتنا" 
        description="تعرف على EasyCVMaker ومهمتنا في مساعدة المحترفين العرب على إنشاء سير ذاتية متوافقة مع أنظمة التوظيف العالمية مجاناً وبأعلى جودة."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with Warm Circle Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 rounded-full text-xs font-bold text-blue-700 mb-4 animate-pulse">
            <Users className="w-3.5 h-3.5" />
            <span>قصتنا وهدفنا</span>
          </span>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-snug">
            نسرع رحلتك المهنية لتصل لشركات أحلامك
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-sm leading-relaxed">
            تم إطلاق EasyCVMaker بأيدي شبان ومطوري برمجيات وتوظيف في الوطن العربي لتقديم الحل النهائي لمعادلة الأناقة والامتثال لفلاتر التصفية والتنظيم.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 text-center shadow-sm">
              <span className="block text-2xl font-black text-blue-600 tracking-tight">{stat.value}</span>
              <span className="block text-[11px] text-slate-400 font-bold mt-1.5">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Core Pillars */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-md space-y-8 mb-12">
          <h3 className="text-lg font-extrabold text-slate-800 border-r-4 border-blue-600 pr-3">ركائزنا والقيم الأساسية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl inline-block">{feat.icon}</div>
                <h4 className="text-sm font-bold text-slate-800">{feat.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed text-right md:text-justify">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h3 className="text-xl font-black text-slate-800 mb-6 font-sans">المؤسس والقيادة</h3>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg mb-3 shadow-md">
                ح.م
              </div>
              <h4 className="text-base font-black text-slate-800">حمدي المصري</h4>
              <p className="text-xs text-blue-600 font-bold mt-1">المؤسس والرئيس التنفيذي | خبير تطوير النظم والحلول الرقمية</p>
              <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                يقود منصة EasyCVMaker برؤية واعدة لتمكين الباحثين عن العمل في الوطن العربي، عبر تقديم أدوات مهنية متكاملة تواكب متطلبات سوق العمل العالمي وتتفوق على أنظمة الفلترة والفرز التلقائي.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
