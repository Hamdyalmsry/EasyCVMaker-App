import React, { useRef, useState, useEffect } from 'react';
import { CVData, User, BlogPost } from '../types';
import { Plus, Edit2, Copy, Trash2, Download, Upload, Eye, FileText, CheckCircle, Clock, Database, HelpCircle, AlertCircle, Sparkles, Users, Activity, TrendingUp, Check, X, FileEdit, FolderPlus, Compass, BookOpen, ToggleRight } from 'lucide-react';
import { SEO } from './SEO';
import { AdSense } from './AdSense';

interface DashboardProps {
  currentUser: User | null;
  cvs: CVData[];
  onEditCV: (id: string) => void;
  onDuplicateCV: (id: string) => void;
  onDeleteCV: (id: string) => void;
  onNewCV: () => void;
  onImportCV: (cvData: any) => void;
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  blogPosts?: BlogPost[];
  onUpdateBlogPosts?: (posts: BlogPost[]) => void;
  pendingArticles?: BlogPost[];
  onUpdatePendingArticles?: (pending: BlogPost[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  cvs,
  onEditCV,
  onDuplicateCV,
  onDeleteCV,
  onNewCV,
  onImportCV,
  onOpenAuth,
  onNavigate,
  addToast,
  blogPosts = [],
  onUpdateBlogPosts,
  pendingArticles = [],
  onUpdatePendingArticles
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin and Client states
  const [adminActiveTab, setAdminActiveTab] = useState<'analytics' | 'articles' | 'pending'>('analytics');
  
  // Blog form states (Admin CRUD)
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editReadTime, setEditReadTime] = useState('دقائق للقراءة: 5');

  // Client proposal states
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientTitle, setClientTitle] = useState('');
  const [clientCategory, setClientCategory] = useState('نصائح مهنية');
  const [clientAuthor, setClientAuthor] = useState(currentUser?.name || 'كاتب متطلع');
  const [clientExcerpt, setClientExcerpt] = useState('');
  const [clientContent, setClientContent] = useState('');
  const [clientImage, setClientImage] = useState('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80');

  // Predefined hashtags/tags for easy click-to-pick
  const PREDEFINED_TAGS = [
    'نصائح مهنية',
    'أخطاء شائعة',
    'سيرة ذاتية متمرسة',
    'كتابة',
    'توظيف',
    'الذكاء الاصطناعي',
    'مهارات المستقبل',
    'كتابة السيرة',
    'التطور التقني'
  ];

  // Default image suggestions Unsplash
  const SAMPLE_IMAGES = [
    { title: 'كتابة وعمل', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80' },
    { title: 'تكنولوجيا وذكاء', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' },
    { title: 'سيرة ذاتية', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80' },
    { title: 'مقابلات وتوظيف', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' }
  ];

  // Sync client author name
  useEffect(() => {
    if (currentUser?.name) {
      setClientAuthor(currentUser.name);
    }
  }, [currentUser]);

  const handleExportJSON = (cv: CVData) => {
    const dataStr = JSON.stringify(cv, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${cv.title.replace(/\s+/g, '_')}_backup.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    addToast('تم تحميل ملف النسخة الاحتياطية بنجاح!', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
          // Force new fresh ID
          parsed.id = Math.random().toString(36).substring(2, 11);
          parsed.userId = currentUser ? currentUser.id : 'guest';
          parsed.updatedAt = new Date().toISOString();
          
          onImportCV(parsed);
          addToast('تم استيراد نسخة السيرة الاحتياطية بنجاح بنسق متكامل!', 'success');
        } else {
          addToast('تنسيق ملف النسخة الاحتياطية غير متوافق.', 'error');
        }
      } catch (err) {
        addToast('حدث داء فني في قراءة ملف JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Submit client proposed article to Admin
  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientTitle || !clientContent || !clientExcerpt) {
      addToast('فضلاً املأ جميع التفاصيل المطلوبة (العنوان، الموجز، المحتوى)', 'error');
      return;
    }

    const newProposal: any = {
      id: 'pending-' + Math.random().toString(36).substring(2, 9),
      slug: 'proposed-' + Math.random().toString(36).substring(2, 9),
      title: clientTitle,
      excerpt: clientExcerpt,
      content: clientContent,
      author: clientAuthor || 'العميل المبدع',
      date: new Date().toISOString().split('T')[0],
      image: clientImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      readTime: 'دقائق للقراءة: 4',
      tags: [clientCategory]
    };

    const updated = [newProposal, ...pendingArticles];
    onUpdatePendingArticles?.(updated);
    addToast('تم إرسال مسودة المقال للمراجعة الإدارية وسيرد عليك الآدمن فور البت فيها!', 'success');

    // Reset client inputs
    setClientTitle('');
    setClientExcerpt('');
    setClientContent('');
    setShowClientForm(false);
  };

  // Admin: Save Article (Create or Edit)
  const handleAdminSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editExcerpt || !editContent || !editAuthor) {
      addToast('فضلاً املأ جميع التفاصيل الإلزامية للمقالة.', 'error');
      return;
    }

    const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPost && editingPost.id && !editingPost.id.toString().startsWith('new-')) {
      // Edit Mode
      const updated = blogPosts.map(p => p.id === editingPost.id ? {
        ...p,
        title: editTitle,
        excerpt: editExcerpt,
        content: editContent,
        author: editAuthor,
        tags: tagsArray.length > 0 ? tagsArray : ['نصائح مهنية'],
        image: editImage || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
        readTime: editReadTime
      } : p);
      onUpdateBlogPosts?.(updated);
      addToast('تم حفظ وتعديل المقالة المنشورة بالمدونة بنجاح الحفظ!', 'success');
    } else {
      // Add/Create Mode
      const newPost: any = {
        id: 'post-' + Math.random().toString(36).substring(2, 9),
        slug: 'slug-' + Math.random().toString(36).substring(2, 9) + '-' + Math.floor(Math.random() * 100),
        title: editTitle,
        excerpt: editExcerpt,
        content: editContent,
        author: editAuthor,
        date: new Date().toISOString().split('T')[0],
        image: editImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
        readTime: editReadTime || 'دقائق للقراءة: 5',
        tags: tagsArray.length > 0 ? tagsArray : ['نصائح مهنية']
      };
      const updated = [newPost, ...blogPosts];
      onUpdateBlogPosts?.(updated);
      addToast('تم نشر مقالتك الجديدة بنجاح فوري على صفحة المدونة الحية!', 'success');
    }

    setEditingPost(null);
  };

  const startAddArticle = () => {
    setEditingPost({ id: 'new-' + Date.now() });
    setEditTitle('');
    setEditExcerpt('');
    setEditContent('');
    setEditAuthor(currentUser?.name || 'حمدي المصري');
    setEditTags('نصائح مهنية');
    setEditImage('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80');
    setEditReadTime('دقائق للقراءة: 5');
  };

  const startEditArticle = (post: any) => {
    setEditingPost(post);
    setEditTitle(post.title || '');
    setEditExcerpt(post.excerpt || '');
    setEditContent(post.content || '');
    setEditAuthor(post.author || '');
    setEditTags(post.tags?.join(', ') || '');
    setEditImage(post.image || '');
    setEditReadTime(post.readTime || 'دقائق للقراءة: 5');
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('هل أنت متأكد تماماً من رغبتك في حذف هذا المقال نهائياً من المدونة؟')) {
      const updated = blogPosts.filter(p => p.id !== id);
      onUpdateBlogPosts?.(updated);
      addToast('تم حذف وإلغاء نشر المقال بنجاح.', 'success');
    }
  };

  const handleApproveSubmission = (submission: any) => {
    const newPost: any = {
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      slug: slugify(submission.title) || 'slug-' + Math.random().toString(36).substring(2, 9),
      title: submission.title,
      excerpt: submission.excerpt,
      content: submission.content,
      author: submission.author,
      date: new Date().toISOString().split('T')[0],
      image: submission.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      readTime: 'دقائق للقراءة: 4',
      tags: submission.tags && submission.tags.length > 0 ? submission.tags : ['سيرة ذاتية متمرسة']
    };

    const updatedBlog = [newPost, ...blogPosts];
    onUpdateBlogPosts?.(updatedBlog);

    const updatedPending = pendingArticles.filter(p => p.id !== submission.id);
    onUpdatePendingArticles?.(updatedPending);

    addToast(`تم قبول المقال ونشره للمجتمع باسم العميل "${submission.author}" بنجاح!`, 'success');
  };

  const handleRejectSubmission = (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في تصفية هذا الاقتراح وحذفه؟')) {
      const updatedPending = pendingArticles.filter(p => p.id !== id);
      onUpdatePendingArticles?.(updatedPending);
      addToast('تم رفض مقترح العميل وحذف الطلب تلبية لرغبتك الإدارية.', 'info');
    }
  };

  // Simple Arabic helper to generate matching slugs
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0621-\u064A]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const totalResumes = cvs.length;
  const completedStats = cvs.filter(c => c.summary.length > 20 && c.workExperience.length > 0 && c.skills.length > 0).length;

  // Render Admin cockpit if logged-in user is Hamdy Al-Masry
  if (currentUser?.isAdmin) {
    return (
      <div className="py-12 bg-slate-900 text-slate-100 min-h-screen animate-fade-in font-sans" style={{ direction: 'rtl' }}>
        <SEO 
          title="لوحة تحكم كبار النظم والتحليلات - حمدي المصري" 
          description="بوابة الإحصائيات الشاملة ومؤشرات أداء السير والمنصة تحت صلاحيات الإدارة الكاملة."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Admin Greeting Banner with Golden Highlights */}
          <div className="bg-gradient-to-r from-slate-800 to-indigo-950 border border-slate-850 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative overflow-hidden">
            <div className="relative z-10 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-black text-amber-400 mb-3 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>بروتوكول الإدارة المعتمد والآمن</span>
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>بوابة التحليلات ورصد البيانات</span>
                <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  المسؤول: {currentUser.name} 👑
                </span>
              </h1>
              <p className="text-slate-450 text-xs sm:text-sm mt-1 mb-0 leading-relaxed max-w-xl">
                أهلاً بك يا أستاذ حمدي. تتبع هذه اللوحة مؤشرات عبور مصفي الـ ATS للأعضاء وتحليلات حركة القوالب الحيوية في النظام ككل.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 relative z-10">
              <button
                onClick={() => {
                  addToast('تمت مزامنة البيانات والتحليلات بنجاح مع السحاب!', 'success');
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>مزامنة قواعد البيانات</span>
              </button>
              
              <button
                onClick={onNewCV}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-100 font-bold text-xs rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>اختبار محرر النماذج</span>
              </button>
            </div>
            
            {/* Ambient Background decoration */}
            <div className="absolute left-0 bottom-0 top-0 w-1/3 bg-radial from-indigo-505/10 to-transparent pointer-events-none rounded-r-3xl"></div>
          </div>

          {/* Admin Navigation Tab Switchers */}
          <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-4 no-scrollbar">
            <button
              onClick={() => { setAdminActiveTab('analytics'); setEditingPost(null); }}
              className={`pb-4 px-3 font-black text-sm transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${adminActiveTab === 'analytics' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-450 hover:text-slate-200'}`}
            >
              <Activity className="w-4 h-4 text-slate-400" />
              <span>📊 تحليلات وإحصائيات النظام</span>
            </button>
            <button
              onClick={() => { setAdminActiveTab('articles'); setEditingPost(null); }}
              className={`pb-4 px-3 font-black text-sm transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${adminActiveTab === 'articles' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-450 hover:text-slate-200'}`}
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>📝 إدارة المقالات بالمدونة ({blogPosts.length})</span>
            </button>
            <button
              onClick={() => { setAdminActiveTab('pending'); setEditingPost(null); }}
              className={`pb-4 px-3 font-black text-sm transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${adminActiveTab === 'pending' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-450 hover:text-slate-200'}`}
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>⏳ طلبات النشر المعلقة</span>
              {pendingArticles.length > 0 ? (
                <span className="bg-red-500 font-bold text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                  {pendingArticles.length}
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-450 text-[10px] px-2 py-0.5 rounded-full">٠</span>
              )}
            </button>
          </div>

          {adminActiveTab === 'analytics' && (
            <>

          {/* Metric KPI Bento items Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total platform users */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">إجمالي مستخدمي المنصة</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-2 text-right">
                <span className="text-3xl font-black text-white block">٥٢,٤٩٢+</span>
                <span className="text-[10px] text-emerald-400 font-bold mt-1.5 inline-flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+١٢.٤٪ هذا الأسبوع</span>
                </span>
              </div>
            </div>

            {/* Generated resumes total */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">سير تم تصديرها</span>
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-right">
                <span className="text-3xl font-black text-white block">١٨٣,٩٠٤+</span>
                <span className="text-[10px] text-emerald-400 font-bold mt-1.5 inline-flex items-center gap-1">
                  <span>🟢 نشيط حياً ومعدل وآمن</span>
                </span>
              </div>
            </div>

            {/* Average ATS Score on system */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">متوسط تصنيف ATS</span>
                <CheckCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 text-right">
                <span className="text-3xl font-black text-white block">٩٨.٤٪</span>
                <span className="text-[10px] text-blue-400 font-bold mt-1.5 inline-flex items-center gap-1">
                  <span>مخرجات متطابقة مع المعايير الدولية</span>
                </span>
              </div>
            </div>

            {/* Server cold-start and API times */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">معدل تخديم الملقّم</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-right">
                <span className="text-3xl font-black text-white block">٤٨ مللي ثانية</span>
                <span className="text-[10px] text-slate-400 mt-1.5 block">سرعة التجميع والاستجابة للعملاء</span>
              </div>
            </div>
          </div>

          {/* Layout Row 2: Analytics & Graphics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Template Popularity breakdown card (2/3 width) */}
            <div className="lg:col-span-2 bg-slate-850 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between text-right">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded mb-3">
                  مخطط تحرك الطلب على القوالب
                </span>
                <h3 className="text-lg font-black text-white mb-2 leading-none">مقارنة أداء وتفضيل قوالب السير الذاتية</h3>
                <p className="text-slate-400 text-xs my-2 leading-relaxed">
                  توضح الإحصائية نسب استخدام القوالب من قبل المتقدمين لتجاوز تفتيش ATS. وتألق معدل اختيار قالب بانتو فور اعتماده رسمياً.
                </p>
              </div>

              {/* Graphical CSS bars representation with stylish colors */}
              <div className="space-y-4 mt-6">
                {/* Minimalist */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>الكلاسيكي النظيف (Minimalist)</span>
                    <span className="text-blue-400 font-mono">٤٢٪ ( الأكثر أماناً )</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-8 w-full rounded-full overflow-hidden border border-slate-800 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                {/* Berlin Corporate */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>المهني التنفيذي (Corporate)</span>
                    <span className="text-indigo-400 font-mono">٢٨٪</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-8 w-full rounded-full overflow-hidden border border-slate-800 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                {/* Creative Tech */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>الإبداعي الحديث (Creative Tech)</span>
                    <span className="text-teal-400 font-mono">١٨٪</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-8 w-full rounded-full overflow-hidden border border-slate-800 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                {/* Bento Grid layout */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>بانتو المستقبلي العصري (Bento Grid) 🚀</span>
                    <span className="text-amber-400 font-mono">١٢٪ ( انطلاقة متسارعة )</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-8 w-full rounded-full overflow-hidden border border-slate-800 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engaging Real-Time traffic hours representation */}
            <div className="bg-slate-850 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between text-right">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">مؤشر الضغط اللحظي</span>
                <h4 className="font-extrabold text-sm text-white mb-2 leading-tight">توزيع النشاط اليومي وحركة الأعضاء</h4>
                <p className="text-slate-450 text-[11px] leading-relaxed">توقيت حركة المستخدمين العرب بمقاييس رصد الملقّم الأساسي.</p>
              </div>

              <div className="space-y-3.5 mt-4">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-300 font-bold">⏱️ صباحاً (٠٨:٠٠ - ١٢:٠٠)</span>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">+٤,٢٠٠</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-300 font-bold">⏱️ ظهراً (١٢:٠٠ - ١٦:٠٠)</span>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">+٧,٨٩٠</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-300 font-bold">⏱️ مساءً (١٦:٠٠ - ٢٠:٠٠)</span>
                  <span className="text-[11px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">+٩,٤٥٠</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-300 font-bold">⏱️ ليلاً (٢٠:٠٠ - ٠٠:٠٠)</span>
                  <span className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">+٥,٨١٠</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Platform Live Monitor Operations Log */}
          <div className="bg-slate-850 border border-slate-800 p-6 rounded-3xl shadow-lg text-right">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-black text-white text-sm">مراقب المعالجات والعمليات الحالية (System Event Log)</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>النظام يعمل بكفاءة ١٠٠٪</span>
              </span>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg text-xs border border-slate-800/60">
                <span className="text-slate-300">🎉 مستخدم جديد من الرياض استكمل صياغة وتصدير سيرته الذاتية</span>
                <span className="text-[10px] text-slate-450">منذ ٣ ثوان</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg text-xs border border-slate-800/60">
                <span className="text-slate-300">🔄 تم تطبيق قالب "بانتو المستقبلي" بنجاح وعرضه فورياً للمراجع</span>
                <span className="text-[10px] text-slate-450">منذ دقيقة</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg text-xs border border-slate-800/60">
                <span className="text-slate-300">📦 استيراد ملف JSON احتياطي متكامل لمدير موارد ومطابقته</span>
                <span className="text-[10px] text-slate-450">منذ ٩ دقائق</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg text-xs border border-slate-800/60">
                <span className="text-slate-300">✅ تخطي محاكاة فلتر ATS بنتيجة عبور فحص نهائي ٩٩.٤٪ بنجاح</span>
                <span className="text-[10px] text-slate-450">منذ ١٤ دقيقة</span>
              </div>
            </div>
          </div>
            </>
          )}

          {/* --- TAB 2: ARTICLES CRUD --- */}
          {adminActiveTab === 'articles' && (
            <div className="bg-slate-850 border border-slate-805 rounded-3xl p-6 shadow-md text-right">
              {editingPost ? (
                // Add / Edit form
                <form onSubmit={handleAdminSaveArticle} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                      <Sparkles className="text-amber-400 w-4 h-4" />
                      <span>{editingPost.id.toString().startsWith('new-') ? 'كتابة ونشر مقالة مهنية جديدة للمنصة' : `تعديل المقال الحالي: ${editTitle}`}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="text-xs text-slate-400 hover:text-white bg-slate-800 border border-slate-705 px-3 py-1 rounded-xl"
                    >
                      إلغاء وتراجع ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    <div>
                      <label className="block text-xs font-bold text-slate-350 mb-1.5">عنوان المقالة *</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="أدخل عنوان المقال"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-white text-xs select-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-355 mb-1.5">اسم المحرر أو كاتب المقال *</label>
                      <input
                        type="text"
                        required
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        placeholder="اسم الكاتب"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-white text-xs select-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-355 mb-1.5">موجز العرض القصير (Excerpt) *</label>
                      <textarea
                        required
                        rows={2}
                        value={editExcerpt}
                        onChange={(e) => setEditExcerpt(e.target.value)}
                        placeholder="اكتب خلاصة موجزة من سطرين تظهر في كروت المدونة بوضوح..."
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-white text-xs select-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-355 mb-1.5">وقت القراءة التقريبي بالدقائق</label>
                      <input
                        type="text"
                        value={editReadTime}
                        onChange={(e) => setEditReadTime(e.target.value)}
                        placeholder="مثال: دقائق للقراءة: 5"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-755 rounded-xl text-white text-xs select-text focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-355 mb-1.5">الهاشتاجات والتصنيفات (تفصل بفاصلة) *</label>
                      <input
                        type="text"
                        required
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="أمثلة: نصائح مهنية, كتابة السيرة, التطور التقني"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-white text-xs select-text focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {PREDEFINED_TAGS.map((tag, idx) => {
                          const isSelected = editTags.split(',').map(t => t.trim()).includes(tag);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const current = editTags.split(',').map(t => t.trim()).filter(Boolean);
                                if (current.includes(tag)) {
                                  setEditTags(current.filter(c => c !== tag).join(', '));
                                } else {
                                  setEditTags([...current, tag].join(', '));
                                }
                              }}
                              className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all ${isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-455 hover:text-slate-200'}`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-355 mb-1.5">رابط صورة المقال المميزة (يمكن استخدام محدد الصور الجاهزة أدناه) *</label>
                      <input
                        type="url"
                        required
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="أدخل رابط صورة مباشر"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-white text-xs select-text focus:outline-none focus:border-amber-400"
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                        {SAMPLE_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditImage(img.url)}
                            className={`p-1 bg-slate-900 rounded-lg border text-right transition-all flex items-center justify-between hover:border-amber-400 cursor-pointer ${editImage === img.url ? 'border-amber-400 bg-amber-400/5' : 'border-slate-800'}`}
                          >
                            <span className="text-[10px] truncate text-slate-400">{img.title}</span>
                            <img src={img.url} className="w-6 h-6 rounded object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-355 mb-1.5">موضوع ومتن المقال بالكامل *</label>
                      <textarea
                        required
                        rows={8}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="اكتب تفاصيل مقالتك وموقعها بالكامل لدعم الفائدة..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-750 rounded-xl text-white text-xs select-text leading-relaxed focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3.5 border-t border-slate-800">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-95 transition-all cursor-pointer"
                    >
                      حفظ ومطابقة المادة
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs rounded-xl cursor-pointer"
                    >
                      تراجع وإلغاء
                    </button>
                  </div>
                </form>
              ) : (
                // Table list of general articles
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-extrabold text-base text-white">إدارة وتنسيق مقالات المدونة الحالية ({blogPosts.length})</h3>
                      <p className="text-slate-400 text-xs mt-0.5">يمكنك إضافة، تعديل وحذف المقالات وتأطير هاشتاجاتها المعتمدة.</p>
                    </div>
                    <button
                      onClick={startAddArticle}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-xl hover:opacity-95 transition-all cursor-pointer"
                    >
                      + كتابة مقال مهني جديد
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs font-sans">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-2 text-right">صورة الغلاف</th>
                          <th className="pb-2 text-right">عنوان التدوينة والتصنيفات</th>
                          <th className="pb-2 text-right">محرر المادة والكاتب</th>
                          <th className="pb-2 text-center">التاريخ والسرعة</th>
                          <th className="pb-2 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogPosts.map((post) => (
                          <tr key={post.id} className="border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors">
                            <td className="py-2.5">
                              <img src={post.image} className="w-11 h-8 object-cover rounded border border-slate-800" />
                            </td>
                            <td className="py-2.5">
                              <span className="font-bold text-slate-200 block">{post.title}</span>
                              <div className="flex gap-1 mt-0.5">
                                {post.tags && post.tags.map((tag, idx) => (
                                  <span key={idx} className="text-[9px] text-amber-400 font-sans">#{tag}</span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 text-slate-300 font-medium whitespace-nowrap">{post.author}</td>
                            <td className="py-2.5 text-center whitespace-nowrap">
                              <div className="text-slate-500 font-mono text-[10px]">{post.date}</div>
                              <div className="text-[9px] text-slate-500 font-sans mt-0.5">{post.readTime}</div>
                            </td>
                            <td className="py-2.5">
                              <div className="flex justify-center gap-1.5">
                                <button
                                  onClick={() => startEditArticle(post)}
                                  className="p-1.5 bg-indigo-505/10 bg-indigo-500/15 text-indigo-400 hover:text-white hover:bg-indigo-500 border border-indigo-500/20 rounded cursor-pointer"
                                  title="تعديل المقالة"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(post.id)}
                                  className="p-1.5 bg-red-500/15 text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 rounded cursor-pointer"
                                  title="حذف المقالة نهائياً"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- TAB 3: CUSTOMER BANNER PROPOSALS --- */}
          {adminActiveTab === 'pending' && (
            <div className="bg-slate-850 border border-slate-805 rounded-3xl p-6 shadow-md text-right">
              <div className="border-b border-slate-800 pb-3 mb-5">
                <h3 className="font-extrabold text-white text-base">مقترحات نشر المقالات المرفوعة من العملاء</h3>
                <p className="text-slate-400 text-xs mt-0.5">تفحص مشاركات المتطلعين للمساهمة وانشرها للمدونة لتشجيعهم، أو استبعد ما تراه غير دقيق.</p>
              </div>

              {pendingArticles.length === 0 ? (
                <div className="text-center py-12 space-y-4 select-none">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mx-auto">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-350 text-sm">لا توجد طلبات ومساهمات معلقة حالياً</h4>
                  <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    يستطيع المستخدمون من لوحة التحكم الخاصة بهم اقتراح موضوعات ومقالات لتصلك هنا للموافقة عليها أو رفضها بنقرة زر واحدة.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingArticles.map((sub) => (
                    <div key={sub.id} className="border border-slate-800 bg-slate-900 rounded-2xl p-5 hover:border-slate-755 transition-colors text-right relative font-sans">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-2 mb-3">
                        <div>
                          <span className="text-[9px] bg-sky-505/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-black font-sans">
                            #{sub.tags?.[0] || 'سيرة ذاتية متمرسة'}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-205 mt-1">{sub.title}</h4>
                        </div>
                        <div className="text-xs text-slate-400">
                          <span>المرشح أو كاتب المقال: </span>
                          <span className="font-black text-white">{sub.author}</span>
                        </div>
                      </div>

                      <div className="mb-3 text-right">
                        <span className="block text-[10px] text-slate-505 font-bold mb-0.5">موجز العميل:</span>
                        <p className="text-xs text-slate-350 italic font-sans">"{sub.excerpt}"</p>
                      </div>

                      <div className="mb-3 text-right">
                        <span className="block text-[10px] text-slate-505 font-bold mb-1 font-sans">نص ومضمون الموضوع المرفوع:</span>
                        <div className="bg-slate-950 p-3.5 rounded-lg text-xs text-slate-400 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                          {sub.content}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                        <button
                          onClick={() => handleApproveSubmission(sub)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer"
                        >
                          الموافقة على النشر حياً بالمدونة العامة ✅
                        </button>
                        <button
                          onClick={() => handleRejectSubmission(sub.id)}
                          className="px-3 py-1.5 bg-slate-850 text-red-400 border border-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          رفض وحذف المقترح ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#030712] text-slate-300 min-h-screen animate-fade-in tech-grid relative overflow-hidden pb-16 font-sans" style={{ direction: 'rtl' }}>
      <SEO 
        title="لوحة التحكم الفورية وادارة السير الذاتية" 
        description="إدارة ملفات سيرتك الذاتية بسهولة تامة. يمكنك إنشاء، نسخ، تعديل، حذف، واستيراد وتنزيل نسخ احتياطية شاملة."
      />

      {/* Cyber ambient background lighting orbs */}
      <div className="absolute top-[8%] left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full filter blur-[120px] animate-tech-glow pointer-events-none" />
      <div className="absolute top-[35%] right-8 w-[380px] h-[380px] bg-indigo-500/10 rounded-full filter blur-[150px] animate-tech-glow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[15%] left-12 w-[450px] h-[450px] bg-purple-500/5 col-span-3 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block with user details */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-right">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>لوحة التحكم المهنية</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-full animate-pulse">
                {currentUser ? `حساب: ${currentUser.name}` : 'حساب تجريبي زائر'}
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-semibold">لوحة بانتو ذكية لإدارة السير الذاتية وحفظ البيانات حياً وتلقائياً.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleTriggerFileInput}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>استيراد سيرة (.json)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={onNewCV}
              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-white/10"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء سيرة جديدة</span>
            </button>
          </div>
        </div>

        {/* Guest Warning */}
        {!currentUser && (
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-right">
                <strong className="block text-xs font-black text-amber-400">أنت تتصفح بحساب زائر تجريبي محلي ⚠️</strong>
                <span className="block text-[11px] text-slate-400 mt-0.5 leading-relaxed">سوف تضيع سيرتك الذاتية الحالية في حال قمت بمسح ذاكرة الكوكيز وبيانات المتصفح. يفضّل تسجيل حساب مجاني الآن لتأمين تقدمك بالكامل وحفظه رقمياً سحابياً.</span>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              className="shrink-0 text-xs font-black px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-colors cursor-pointer shadow-md"
            >
              سجل حسابك مجاناً الآن
            </button>
          </div>
        )}

        {/* AdSense Header Placement */}
        <AdSense slot="header" />

        {/* Bento Grid Layout Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 mb-12">
          
          {/* Greeting Card - Span 2 on Desktop, Row 1 */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-cyan-950/40 via-indigo-950/50 to-purple-950/40 border border-indigo-900/40 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-cyan-950/30">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 rounded-full mb-3 shadow-inner">
                تحديث ذكي فوري ⚡
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">
                {currentUser ? `أهلاً بك مجدداً، ${currentUser.name}! ✨` : 'أهلاً بك مجدداً يا ضيفنا العزيز! ✨'}
              </h2>
              <p className="text-slate-355 text-[11px] sm:text-xs leading-relaxed max-w-md font-medium text-slate-300">
                آخر تعديل لسيرتك الذاتية كان منذ فترة وجيزة. مستوى اكتمال ملف السيرة ومواءمتها مع متطلبات التوظيف ممتاز للغاية للتنافس.
              </p>
              <div className="mt-6">
                <button 
                  onClick={onNewCV}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-md border border-white/10 hover:opacity-90"
                >
                  صياغة سيرة متميزة
                </button>
              </div>
            </div>
            <FileText className="absolute left-4 bottom-4 opacity-10 w-44 h-44 translate-x-3 translate-y-3 pointer-events-none select-none text-cyan-400" />
          </div>

          {/* Analytics Strength Card - Col 3, Row 1 */}
          <div className="col-span-1 bg-[#0f172a]/90 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
            <div className="text-right">
              <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-none mb-1">جاهزية التقديم للشركات</h3>
              <p className="text-xs text-slate-300 font-medium">معدل الفرز والعبور التلقائي (ATS)</p>
            </div>
            <div className="flex items-end justify-between mt-4">
              <span className="text-5xl font-black text-white tracking-tight font-mono">
                {totalResumes > 0 ? Math.min(Math.round((completedStats / totalResumes) * 100) + 70, 99) : 82}
                <span className="text-lg text-slate-500 font-bold">/١٠٠</span>
              </span>
              <div className="w-20 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400" 
                  style={{ width: `${totalResumes > 0 ? Math.min(Math.round((completedStats / totalResumes) * 100) + 70, 99) : 82}%` }}
                ></div>
              </div>
            </div>
            <p className="text-[11px] text-cyan-400 mt-4 flex items-center gap-1 font-bold">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>أعلى ١٠٪ من كتل المترشحين بالشرق الأوسط</span>
            </p>
          </div>

          {/* Recent CVs List Card - Col 1, Rows 2-3 */}
          <div className="col-span-1 md:row-span-2 bg-[#0f172a]/90 border border-slate-800/80 rounded-3xl p-6 flex flex-col shadow-lg justify-between text-right">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                <h3 className="font-black text-white text-sm">مسوداتي وملفات السيرة ({totalResumes})</h3>
                <button onClick={onNewCV} className="text-cyan-400 text-[11px] font-black hover:underline cursor-pointer">إنشاء +</button>
              </div>

              {cvs.length > 0 ? (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {cvs.map((cv) => (
                    <div
                      key={cv.id}
                      className="p-4 bg-slate-950/60 hover:bg-slate-900/80 border border-slate-850/80 hover:border-cyan-500/30 rounded-2xl transition-all group relative"
                    >
                      <div className="flex flex-col justify-between h-full text-right">
                        <div>
                          <p className="font-bold text-xs text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{cv.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>تعديل: {new Date(cv.updatedAt).toLocaleDateString('ar-EG')}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-900/50 flex-wrap">
                          <button
                            onClick={() => onEditCV(cv.id)}
                            className="px-2.5 py-1 bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 hover:bg-cyan-900 rounded-md text-[10px] font-black transition-colors cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => onDuplicateCV(cv.id)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors"
                            title="تكرار"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleExportJSON(cv)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors"
                            title="تصدير"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCV(cv.id)}
                            className="p-1.5 text-red-400 hover:text-red-350 hover:bg-red-950/40 rounded-md transition-colors mr-auto animate-pulse"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  onClick={onNewCV}
                  className="min-h-[180px] border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-all"
                >
                  <Plus className="w-8 h-8 text-slate-600 group-hover:text-cyan-400 mb-2 transition-colors" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">لا توجد مسودات حالية</span>
                  <span className="text-[10px] text-slate-500 mt-1">انقر لبداية صياغة أول سيرة ذاتية</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-slate-800/60 mt-3 text-[10px] text-slate-500 font-bold">
              تتم مزامنة جميع المسودات محلياً وسحابياً تلقائياً 🛡️
            </div>
          </div>

          {/* AI Assistant Card - Col 2, Row 2 */}
          <div className="col-span-1 bg-[#120f2e]/60 border border-purple-900/60 rounded-3xl p-6 relative group shadow-lg text-right overflow-hidden flex flex-col justify-between min-h-[180px] hover:border-purple-500/40 duration-300">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-purple-950/40 border border-purple-800 rounded-xl flex items-center justify-center text-purple-400 mb-4 shadow-inner">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-black text-purple-400 text-sm mb-1 leading-none">مصحح البيانات ومولّد الذكاء الاصطناعي</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed opacity-90 mt-2 font-medium">
                اكتب خطوط المهام بلمسة احترافية وتغلب على حبسة الكاتب فجأة بنقرة زر واحدة في القالب التفاعلي.
              </p>
            </div>
            <span className="absolute top-6 left-6 px-2.5 py-1 bg-purple-950/40 text-purple-400 text-[9px] rounded-full font-black border border-purple-800/60">جديد ومجاني 💎</span>
          </div>

          {/* Featured Template Card - Col 3, Row 2 */}
          <div className="col-span-1 bg-[#0f172a]/90 border border-slate-800/80 rounded-3xl p-1 overflow-hidden relative shadow-lg min-h-[180px] hover:border-cyan-500/30 duration-300">
            <div className="w-full h-full bg-slate-950/60 rounded-[22px] p-4 flex flex-col justify-between text-right">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 p-4">
                <div className="w-8 h-1 bg-slate-800 rounded-full mb-1.5 animate-pulse"></div>
                <div className="w-16 h-3 bg-slate-700 rounded-md mb-3"></div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-slate-950 rounded"></div>
                  <div className="w-5/6 h-1.5 bg-slate-950 rounded"></div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-xs font-black text-white">بانتو المستقبلي العصري</span>
                <span className="text-[9px] text-cyan-400 font-bold px-2.5 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-full">نموذج مميز ⭐</span>
              </div>
            </div>
          </div>

          {/* Blog Career Tips - Col 2, Row 3 */}
          <div className="col-span-1 bg-[#0b0f19]/85 border border-slate-800 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg text-right min-h-[180px] hover:border-indigo-500/40 duration-300 group">
            <div>
              <p className="text-indigo-400 text-[9px] font-black uppercase tracking-wider mb-2">تعليم وثقافة مهنية 📖</p>
              <h4 className="font-bold text-xs sm:text-sm leading-snug group-hover:text-cyan-400 transition-colors">كيف تتغلب بذكاء على برمجة قارئ السيرة الذاتية (ATS) لعام ٢٠٢٦؟</h4>
            </div>
            <button 
              onClick={() => onNavigate('blog')} 
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 mt-4 text-right cursor-pointer"
            >
              <span>قراءة الدروس الكاملة</span>
              <span className="group-hover:translate-x-1 duration-200">←</span>
            </button>
          </div>

          {/* Sponsored Ad Unit - Col 3, Row 3 */}
          <div className="col-span-1 bg-[#0f172a]/40 border border-slate-850/60 rounded-3xl flex items-center justify-center p-6 text-center shadow-lg min-h-[180px]">
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">مساحة إعلانية مخصصة</p>
              <div className="w-36 h-12 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-500 font-black bg-slate-950 mt-1.5">
                <span className="text-[9px] font-mono">AD UNIT 300x100</span>
              </div>
            </div>
          </div>

        </div>

        {/* Client Article Submission / Proposal Card Section */}
        <div className="bg-gradient-to-br from-[#0b0f19]/90 via-[#120e2e]/90 to-[#0b0f19]/95 text-white rounded-3xl p-6 sm:p-8 border border-purple-950/80 shadow-2xl mb-12 text-right relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-radial from-indigo-500/5 to-transparent pointer-events-none rounded-l-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-full text-xs font-black text-cyan-400 mb-3 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ساهم بقلمك في إلهام المجتمع</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">شارك تجربتك، قصتك الوظيفية، أو مقالاً مهنياً باسمك! ✍️</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 mb-0 leading-relaxed max-w-2xl">
                  هل حصدت مقابلة ناجحة باستخدام السيرة الذاتية؟ أو ترغب في تقديم تكتيكات توظيف مفيدة؟ اقترِح مقالاً الآن باسمك ليقوم الأستاذ حمدي ومسؤولو المنصة بمراجعته وفوراً نشره حياً بالمدونة العامة لزملائك!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowClientForm(!showClientForm)}
                className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-505 bg-cyan-500 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg border border-white/10 transition-transform active:scale-95 cursor-pointer"
              >
                {showClientForm ? 'إغلاق نافذة الكتابة ✕' : 'ابدأ صياغة مقترحك ومقالك الآن ✨'}
              </button>
            </div>

            {/* Submit Form Area with Slide-down Animation */}
            {showClientForm && (
              <form onSubmit={handleClientSubmit} className="mt-8 pt-6 border-t border-slate-800/70 space-y-5 animate-fade-in font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">العنوان المقترح للمقال *</label>
                    <input
                      type="text"
                      required
                      value={clientTitle}
                      onChange={(e) => setClientTitle(e.target.value)}
                      placeholder="مثال: كيف تجاوزت المقابلة التقنية الصعبة بنجاح؟"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs select-text focus:outline-none focus:border-cyan-500 focus:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الذي تود النشر به *</label>
                    <input
                      type="text"
                      required
                      value={clientAuthor}
                      onChange={(e) => setClientAuthor(e.target.value)}
                      placeholder="اسمك الكريم ككاتب ومساهم"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs select-text focus:outline-none focus:border-cyan-500 focus:bg-slate-950"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">موجز وعرض قصير جداً للمقال (سيرة المادة) *</label>
                    <textarea
                      required
                      rows={2}
                      value={clientExcerpt}
                      onChange={(e) => setClientExcerpt(e.target.value)}
                      placeholder="صف المقال في سطرين ممتعين..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs select-text focus:outline-none focus:border-cyan-500 focus:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">التصنيف أو الهاشتاج الرئيسي المناسب لمقالك *</label>
                    <select
                      value={clientCategory}
                      onChange={(e) => setClientCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {PREDEFINED_TAGS.map((tag, idx) => (
                        <option key={idx} value={tag} className="bg-slate-950 text-white text-xs text-right">
                          #{tag}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">غلاف وصورة المقال (أنقر لاختيار صورة مقترحة مناسبة)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setClientImage(img.url)}
                          className={`p-1 bg-slate-950 rounded-lg border text-right transition-all flex items-center justify-between hover:border-cyan-400 cursor-pointer ${clientImage === img.url ? 'border-cyan-400 bg-cyan-950/40' : 'border-slate-850'}`}
                        >
                          <span className="text-[10px] truncate text-slate-300">{img.title}</span>
                          <img src={img.url} className="w-6 h-6 rounded object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">موضوع ومتن المقال الكامل بالتفصيل *</label>
                    <textarea
                      required
                      rows={6}
                      value={clientContent}
                      onChange={(e) => setClientContent(e.target.value)}
                      placeholder="اكتب وتحدث عما يفيد زملاءك ومرشحي المنصة، تفاصيل نصائح المقابلات، أو الأسرار التقنية المكتشفة..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs select-text leading-relaxed font-sans focus:outline-none focus:border-cyan-500 focus:bg-slate-950"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3.5 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black text-xs rounded-xl hover:opacity-95 transition-all cursor-pointer border border-white/5"
                  >
                    رقع المقال وإرساله للآدمن فوراً 🚀
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClientForm(false)}
                    className="px-4 py-2 bg-slate-900 border border-slate-850 text-slate-300 hover:text-white text-xs rounded-xl cursor-pointer"
                  >
                    تراجع وإلغاء الاقتراح
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* AdSense In-Content Placement */}
        <AdSense slot="in-content" />

      </div>
    </div>
  );
};
