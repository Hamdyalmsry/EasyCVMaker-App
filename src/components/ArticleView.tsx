import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { blogPosts } from '../data/blogData';
import { ArrowRight, Calendar, User, Clock, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { SEO } from './SEO';
import { AdSense } from './AdSense';

interface ArticleViewProps {
  slug: string;
  onBack: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  posts?: BlogPost[];
}

export const ArticleView: React.FC<ArticleViewProps> = ({ slug, onBack, addToast, posts }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const activePosts = posts || blogPosts;
    const matched = activePosts.find((p) => p.slug === slug);
    if (matched) {
      setPost(matched);
    }
  }, [slug, posts]);

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  if (!post) {
    return (
      <div className="py-24 text-center" style={{ direction: 'rtl' }}>
        <p className="text-slate-500 font-bold">جاري تحميل المقال...</p>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('تم نسخ رابط المقال إلى حافظتك لمشاركته بنجاح!', 'success');
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen animate-fade-in" style={{ direction: 'rtl' }}>
      <SEO 
        title={post.title} 
        description={post.excerpt} 
        type="article" 
        image={post.image} 
      />

      {/* Reading Progress Indicator */}
      <div className="fixed top-16 left-0 w-full h-1 bg-slate-100 z-50">
        <div className="h-full bg-blue-600 transition-all duration-75" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back and commands */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لمدونة المحترفين</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white text-slate-500 hover:text-blue-600 border border-slate-100 rounded-xl shadow-sm hover:shadow transition-all"
              title="مشاركة المقال"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToast('تم حفظ المقال في مفضلتك الشخصية لقراءته لاحقاً!', 'info')}
              className="p-2 bg-white text-slate-500 hover:text-indigo-600 border border-slate-100 rounded-xl shadow-sm hover:shadow transition-all"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout split with Sidebar Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main article body */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2.5 py-1 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 leading-snug">
                {post.title}
              </h1>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium py-3 border-y border-slate-50">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-300" />
                  <span>الكاتب: {post.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-300" />
                  <span>نشر في: {post.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-300" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-sm my-6 select-none">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rich Content formatted with custom paragraph spacing */}
              <div className="text-slate-700 text-sm sm:text-base leading-loose space-y-6 text-right pt-4 whitespace-pre-line antialiased">
                {post.content}
              </div>

              {/* In-article Adsense Banner */}
              <div className="pt-6">
                <AdSense slot="in-content" />
              </div>

              {/* Summary and Next Career step CTA */}
              <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100/60 mt-8">
                <h4 className="font-bold text-blue-900 mb-1.5">هل تريد صياغة سيرة ذاتية مثالية على الفور؟</h4>
                <p className="text-xs text-blue-700 leading-relaxed mb-4">
                  وفر عليك مشقة التنسيق اليدوي المعقد. اختر واحداً من قوالبنا المصممة علمياً لتتوافق مع معايير ATS وابدأ بتحقيق أحلامك الآن في 3 دقائق فقط.
                </p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10"
                >
                  تصفح قوالب التصميم الآن
                </button>
              </div>

            </div>
          </article>

          {/* Sidebar Ads & Recommended block */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Sidebar Ad Container */}
            <AdSense slot="sidebar" />

            {/* Simulated Newsletter form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 text-indigo-600">النشرة الوظيفية الأسبوعية</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                انضم لأكثر من ٢٠ ألف مهتم وتلقى أحدث المقالات ونصائح التوظيف الشاغرة بمكالمات حصرية مجاناً.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast('شكراً لتسجيلك! ستصلك أول نشرة توظيفية الأسبوع القادم.', 'success');
                }}
                className="space-y-2.5"
              >
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none placeholder:text-slate-400 text-left"
                />
                <button
                  type="submit"
                  className="w-full text-center py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  اشتراك بالنشرة المهنية
                </button>
              </form>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
};
