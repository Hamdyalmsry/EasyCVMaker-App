import React, { useState } from 'react';
import { Shield, Scale, Scroll, FileText, Check } from 'lucide-react';
import { SEO } from './SEO';

interface LegalDocsProps {
  initialTab?: 'privacy' | 'terms';
}

export const LegalDocs: React.FC<LegalDocsProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-fade-in" style={{ direction: 'rtl' }}>
      <SEO 
        title={activeTab === 'privacy' ? 'سياسة الخصوصية وسرية المعلومات' : 'شروط وأحكام استخدام المنصة'} 
        description="نصائح ومعايير الامتثال وحماية خصوصية بيانات المستخدمين وكيف يتم تشفير السير الذاتية وحفظها محلياً بأقصى مستويات الأمان المعتمدة."
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>سياسة الخصوصية وحماية البيانات</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>شروط وأحكام الاستخدام</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-100 shadow-sm leading-relaxed text-right text-slate-600 text-xs sm:text-sm">
          {activeTab === 'privacy' ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Scroll className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h1 className="text-2xl font-black text-slate-800">بيان سياسة الخصوصية وسرية المعطيات</h1>
                <p className="text-xs text-slate-400 mt-1">تاريخ التحديث الأخير: ٦ يونيو ٢٠٢٦</p>
              </div>

              <p className="font-medium text-slate-800">
                منصة EasyCVMaker ملتزمة التزاماً تاماً بحماية خصوصيتك ومعلوماتك الشخصية. توضح هذه الوثيقة طريقتنا في التعامل مع السير الذاتية والبيانات المرفوعة:
              </p>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">١. جمع المعلومات واستخدامها</h3>
                <p>
                  نحن نركز على معيار الحفظ المحلي للملفات (Local Storage). لا يتم حفظ سيرتك الذاتية في خوادمنا المركزية لغايات مجهولة، بل تظل مدفونة بأمان داخل متصفحك الشخصي أو حسابك المشفر في تطبيقنا السحابي المؤقت، لكي تملك التحكم المطلق بحجم مشاركتها أو تعديلها.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">٢. تأمين وتشفير المدخلات</h3>
                <p>
                  يتم حماية كافة المدخلات واللوحات عبر بروتوكولات التشفير القياسية SSL (Secure Sockets Layer)، مما يمنع اعتراض أي أطراف ثالثة لتفاصيل سيرتك الذاتية أو العناوين والهاتف المرفق.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">٣. ملفات الكوكيز (Cookies)</h3>
                <p>
                  نستخدم ملفات كوكيز بسيطة وسرية لتحسين تذكر حسابك المسجل لتوفير ميزة الحفظ التلقائي للتقدم في السير الذاتية بدلاً من الاضطرار لإدخال خبراتك بالكامل عند كل تحميل.
                </p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-[11px] text-blue-800">
                ⚠️ بمتابعة تصفحك واستخدامك لمنصتنا، أنت توافق بشكل كامل على شروط الحفظ ومستند الأمان الصادر هنا.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                <h1 className="text-2xl font-black text-slate-800">شروط وأحكام استخدام المنصة للباحثين</h1>
                <p className="text-xs text-slate-400 mt-1">تاريخ التحديث الأخير: ٦ يونيو ٢٠٢٦</p>
              </div>

              <p className="font-medium text-slate-800">
                أهلاً بك في EasyCVMaker. بالوصول إلى موقعنا أو استخدام أدوات تحرير السير الذاتية، أنت توافق على احترام البنود القانونية التالية:
              </p>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">١. الاستخدام المشروع والمصرح به</h3>
                <p>
                  أنت تقر بأن جميع المعلومات الواردة في السيرة الذاتية التي تصنعها حقيقية وتعود إليك أو للمفوضين عنك، ويحظر محاكاة هويات مزيفة لغيرك أو تزوير خبرات لم تكتسبها فعلياً، وهو ما يقع بالكامل تحت مسؤوليتك القانونية والأخلاقية.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">٢. حقوق الملكية الفكرية للقوالب</h3>
                <p>
                  نحن نوفر لك القوالب لغرض الاستخدام الشخصي المتمثل في التقدم للوظائف الشاغرة ومشاركتها مع مدراء التوظيف. يحظر نسخ الكود المصدري للقوالب، أو إعادة بيعها تجارياً على منصات أخرى تحت زعم أنها عمل من إنشائك الفردي.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">٣. نطاق وحدود المسؤولية</h3>
                <p>
                  يسعى فريق EasyCVMaker لتوفير صيغة مطابقة بنسبة 100% لأنواع فلاتر الفرز، لكننا لا نضمن بالضرورة الحصول التلقائي على الوظيفة أو استجابة الشركات للطلبات، نظراً لأن أمور التوظيف تخضع لشروط كفاءة وتقييم الشركات الفردي.
                </p>
              </div>

              <div className="flex items-start gap-2 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى تصفح مراجعة الدعم وقسم تواصل معنا وسنجيبك بكل ترحيب.</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
