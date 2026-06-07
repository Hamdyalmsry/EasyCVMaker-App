import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Check, HelpCircle } from 'lucide-react';
import { SEO } from './SEO';

interface ContactProps {
  addToast: (message: string, type: 'success' | 'error') => void;
}

export const Contact: React.FC<ContactProps> = ({ addToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('فضلاً املأ كافة البيانات الإلزامية قبل الإرسال.', 'error');
      return;
    }
    setSending(true);

    setTimeout(() => {
      addToast('تم إرسال رسالتك بنجاح! سيقوم مستشارونا بالرد عليك خلال ٢٤ ساعة عمل.', 'success');
      setName('');
      setEmail('');
      setSubject('general');
      setMessage('');
      setSending(false);
    }, 1000);
  };

  const faqs = [
    {
      q: 'هل استخدام صانع السير الذاتية مجاني بالكامل؟',
      a: 'نعم! نتيح لك تصميم، تحرير، وحفظ، وتحميل سيرتك الذاتية في صيغة PDF احترافية مجاناً بالكامل دون أي رسوم مخفية.'
    },
    {
      q: 'هل سيرتي الذاتية متوافقة وتتخطى برنامج ATS؟',
      a: 'بالتأكيد. صممت قوالبنا بالتشاور مع خبراء توظيف لضمان أن النص قابل للمسح والفلترة بواسطة جميع برامج الموارد البشرية الشهيرة دون خطأ.'
    },
    {
      q: 'كيف يمكنني تحويل السيرة الذاتية إلى صيغة PDF نظيفة وعالية الجودة؟',
      a: 'عند الانتهاء في صفحة الـ Builder، انقر على زر "تحميل PDF" وسيقوم النظام بتفعيل نافذة الطباعة المنظمة وحفظها كملف رقمي نظيف على الفور.'
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-fade-in" style={{ direction: 'rtl' }}>
      <SEO 
        title="تواصل معنا - مركز المساعدة والدعم" 
        description="لديك سؤال أو تحتاج للمساعدة في صياغة سيرتك الذاتية؟ فريق دعم ومستشاري EasyCVMaker متواجدون لمساعدتك فوراً في أي وقت."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 rounded-full text-xs font-bold text-blue-700 mb-4 animate-pulse">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>الدعم الفني وتواصل المحترفين</span>
          </span>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-snug">
            يسعدنا دائماً الاستماع إلى استفساراتك
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto mt-2 text-sm leading-relaxed">
            سواء كنت تواجه مشكلة فنية في إدراج خبراتك، أو تبحث عن نماذج تعاون رعاية خاصة مع شركة أو جامعة، راسلنا وسيتواصل مستشارونا معك فوراً.
          </p>
        </div>

        {/* Content Section Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Panel: Contact info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1 text-blue-600">بيانات الاتصال السريع</h3>
              
              <div className="flex items-center gap-3.5 py-2.5">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-400 font-bold">البريد الإلكتروني للإدارة</span>
                  <span className="block text-sm font-bold text-slate-700">support@easycvmaker.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 py-2.5">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-400 font-bold">المساعد الهاتفي الفوري</span>
                  <span className="block text-sm font-bold text-slate-700" style={{ direction: 'ltr' }}>+966 50 123 4567</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 py-2.5">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-400 font-bold">الموقع الرئيسي ومقر التشغيل</span>
                  <span className="block text-xs font-bold text-slate-700">الرياض، حي الياسمين ── مركز الابتكار الرقمي</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md">
              <h4 className="text-sm font-black mb-1.5 flex items-center gap-2">
                <span>هل تبحث عن إجابات فورية؟</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed text-right">
                نوفر لك قسم فحص المساعدة والأسئلة الشائعة في الأسفل للإجابة عن تساؤلات حفظ ملفاتك في المتصفح أو طباعتها بهدوء.
              </p>
            </div>
          </div>

          {/* Right Panel: Send form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-base font-black text-slate-800 mb-6">أرسل استفسارك الآن</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="محمد أحمد"
                      className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">موضوع الرسالة</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all text-slate-800 text-right"
                  >
                    <option value="general">استفسار عام حول صانع السير الذاتية</option>
                    <option value="technical">مشكلة فنية أثناء تصدير PDF</option>
                    <option value="business">عقود رعاية وشراكة أعمال</option>
                    <option value="other">شؤون أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تفاصيل رسالتك</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك أو مشكلتك الفنية بالتفصيل هنا..."
                    className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-right"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      <span>إرسال الرسالة الإلكترونية</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 justify-center">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>الأسئلة الأكثر شيوعاً للفائدة السريعة</span>
          </h3>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                <h4 className="text-sm font-bold text-slate-800">{faq.q}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 text-right md:text-justify">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
