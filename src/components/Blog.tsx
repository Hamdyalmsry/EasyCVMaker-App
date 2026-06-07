import React, { useState } from 'react';
import { BlogPost } from '../types';
import { blogPosts } from '../data/blogData';
import { Search, Calendar, User, Clock, ChevronLeft, ArrowLeft } from 'lucide-react';
import { SEO } from './SEO';
import { AdSense } from './AdSense';

interface BlogProps {
  onSelectArticle: (slug: string) => void;
  posts?: BlogPost[];
}

export const Blog: React.FC<BlogProps> = ({ onSelectArticle, posts }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const activePosts = posts || blogPosts;

  // Derive unique tags
  const allTags = Array.from(new Set(activePosts.flatMap((post) => post.tags)));

  // Filter blog posts
  const filteredPosts = activePosts.filter((post) => {
    const matchesSearch =
      post.title.includes(search) || post.excerpt.includes(search);
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-fade-in" style={{ direction: 'rtl' }}>
      <SEO 
        title="المدونة المهنية - نصائح التوظيف وكتابة السيرة الذاتية" 
        description="اقرأ تدوينات خبرائنا الحصرية حول تخطي خوارزميات ATS، صياغة المهارات المهنية والتقنية، واجتياز المقابلات الشخصية بنجاح تام."
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 rounded-full text-xs font-bold text-blue-700 mb-3 animate-pulse">
            📚 دليل الكفاءات والمحترفين
          </span>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-snug">
            مدونة التوظيف والإلهام المهني
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm leading-relaxed">
            مقالات حصرية يكتبها نخبة من مستشاري الموارد البشرية لتسريع قبولك بالشركات الكبرى وتصميم سيرة احترافية واثقة.
          </p>
        </div>

        {/* AdSense Header Placement */}
        <AdSense slot="header" />

        {/* Toolbar: Search and Filter */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-10 mt-6">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن المقالات..."
              className="w-full text-xs py-2.5 pr-10 pl-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 text-right"
            />
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                !selectedTag
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              الكل
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectArticle(post.slug)}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-1">
                    {post.tags.slice(0, 1).map((t) => (
                      <span key={t} className="bg-blue-600/90 backdrop-blur-md text-white font-bold text-[9px] px-2.5 py-1 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta info block */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 text-right">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer Card trigger */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-700">{post.author}</span>
                    <span className="text-xs text-blue-600 font-extrabold flex items-center gap-1 hover:gap-1.5 transition-all">
                      <span>اقرأ المقال بالكامل</span>
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-inner">
            <p className="text-slate-400 font-bold text-sm">عذراً، لم نجد أي مقالات تطابق شروط بحثك.</p>
          </div>
        )}

        {/* AdSense In-Content Placement */}
        <AdSense slot="in-content" />

      </div>
    </div>
  );
};
