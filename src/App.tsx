import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { User, CVData, ToastMessage, CVTemplateId, BlogPost } from './types';
import { blogPosts as initialBlogPosts } from './data/blogData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ToastContainer } from './components/Toast';

// Progressive Code-Splitting optimization (Dynamic Chunk loading on-demand)
const Dashboard = React.lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Builder = React.lazy(() => import('./components/Builder').then(m => ({ default: m.Builder })));
const TemplatesGrid = React.lazy(() => import('./components/TemplatesGrid').then(m => ({ default: m.TemplatesGrid })));
const Blog = React.lazy(() => import('./components/Blog').then(m => ({ default: m.Blog })));
const ArticleView = React.lazy(() => import('./components/ArticleView').then(m => ({ default: m.ArticleView })));
const About = React.lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const LegalDocs = React.lazy(() => import('./components/LegalDocs').then(m => ({ default: m.LegalDocs })));
const AuthModal = React.lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const SubscriptionModal = React.lazy(() => import('./components/SubscriptionModal').then(m => ({ default: m.SubscriptionModal })));
const SitemapModal = React.lazy(() => import('./components/SitemapModal').then(m => ({ default: m.SitemapModal })));

const LazyFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] py-12 text-slate-400 bg-[#030712]">
    <div className="w-9 h-9 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
    <p className="text-[11px] font-bold tracking-wide font-mono uppercase text-cyan-400/80">جاري تحميل واجهتك الاحترافية بالكامل... ⚡</p>
  </div>
);

const DEFAULT_PERSONAL_INFO = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  github: '',
  linkedin: ''
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  
  // Custom simple Hash/State Router
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('');
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Overlays & Utility state
  const [authOpen, setAuthOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [pendingTemplateChoice, setPendingTemplateChoice] = useState<string>('');
  const [sitemapOpen, setSitemapOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Blog articles and pending customer proposals
  const [blogPostsState, setBlogPostsState] = useState<BlogPost[]>([]);
  const [pendingArticles, setPendingArticles] = useState<BlogPost[]>([]);

  // Load / Seed Blog posts and pending customer submissions
  useEffect(() => {
    const savedPosts = localStorage.getItem('easycv_blog_posts');
    if (savedPosts) {
      try {
        setBlogPostsState(JSON.parse(savedPosts));
      } catch (e) {
        setBlogPostsState(initialBlogPosts);
      }
    } else {
      setBlogPostsState(initialBlogPosts);
      localStorage.setItem('easycv_blog_posts', JSON.stringify(initialBlogPosts));
    }

    const savedPending = localStorage.getItem('easycv_pending_articles');
    if (savedPending) {
      try {
        setPendingArticles(JSON.parse(savedPending));
      } catch (e) {
        setPendingArticles([]);
      }
    } else {
      setPendingArticles([]);
      localStorage.setItem('easycv_pending_articles', JSON.stringify([]));
    }
  }, []);

  const handleUpdateBlogPosts = useCallback((updatedPosts: BlogPost[]) => {
    setBlogPostsState(updatedPosts);
    localStorage.setItem('easycv_blog_posts', JSON.stringify(updatedPosts));
  }, []);

  const handleUpdatePendingArticles = useCallback((updatedPending: BlogPost[]) => {
    setPendingArticles(updatedPending);
    localStorage.setItem('easycv_pending_articles', JSON.stringify(updatedPending));
  }, []);

  // Show Toast Alert
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // On App Mount: check auth & load initial state
  useEffect(() => {
    const savedUser = localStorage.getItem('easycv_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('easycv_current_user');
      }
    }
  }, []);

  // Dynamic user specific CV loading
  useEffect(() => {
    const userId = currentUser ? currentUser.id : 'guest';
    const storageKey = `easycv_user_cvs_${userId}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        setCvList(JSON.parse(saved));
      } catch (e) {
        setCvList([]);
      }
    } else {
      // Seed initial dummy CV draft for direct dashboard inspection
      const defaultDraft: CVData = {
        id: 'cv-demo-1',
        userId: userId,
        title: 'مثال سيرة ذاتية - مسودة فارغة',
        templateId: 'minimalist',
        personalInfo: { ...DEFAULT_PERSONAL_INFO },
        summary: '',
        workExperience: [],
        education: [],
        skills: [],
        languages: [],
        projects: [],
        certifications: [],
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify([defaultDraft]));
      setCvList([defaultDraft]);
    }
  }, [currentUser]);

  // Navigate view handler
  const handleNavigate = (view: string, articleSlug?: string) => {
    if (view === 'privacy' || view === 'terms') {
      setLegalTab(view as 'privacy' | 'terms');
      setCurrentView('legal');
    } else if (view === 'blog-post' && articleSlug) {
      setSelectedArticleSlug(articleSlug);
      setCurrentView('blog-post');
    } else if (view === 'builder-new') {
      // Auto trigger templates page to choose style first
      setCurrentView('templates');
      addToast('اختر قالباً لبداية صياغة سيرتك الاحترافية!', 'info');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create CV based on template choice
  const handleCreateCVWithTemplate = (templateId: CVTemplateId) => {
    const isPremium = templateId === 'creative' || templateId === 'bento';
    const hasAccess = !isPremium ||
      (currentUser?.isSubscribed) ||
      (currentUser?.unlockedTemplates?.includes(templateId));

    if (!hasAccess) {
      setPendingTemplateChoice(templateId);
      setSubOpen(true);
      addToast('هذا التخطيط الفني متميز ومصمم وفق معايير ATS. يمكنك فتحه فوراً بضغطة واحدة!', 'info');
      return;
    }

    const userId = currentUser ? currentUser.id : 'guest';
    const newCV: CVData = {
      id: Math.random().toString(36).substring(2, 11),
      userId: userId,
      title: `سيرتي المهنية الجديدة - ${templateId === 'minimalist' ? 'كلاسيكي' : templateId === 'corporate' ? 'تنفيذي' : templateId === 'creative' ? 'إبداعي' : 'بانتو'}`,
      templateId: templateId,
      personalInfo: { ...DEFAULT_PERSONAL_INFO },
      summary: '',
      workExperience: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
      updatedAt: new Date().toISOString()
    };

    const currentKey = `easycv_user_cvs_${userId}`;
    const updatedList = [newCV, ...cvList];
    
    localStorage.setItem(currentKey, JSON.stringify(updatedList));
    setCvList(updatedList);
    setCurrentCV(newCV);
    setCurrentView('builder');
    addToast('تم إنشاء مسودة سيرتك الذاتية بنجاح! املأ الحقول لمعاينتها حياً.', 'success');
  };

  // Save changes from builder
  const handleSaveCV = useCallback((updatedCV: CVData) => {
    const userId = currentUser ? currentUser.id : 'guest';
    const currentKey = `easycv_user_cvs_${userId}`;
    
    setCvList((prevList) => {
      const updatedList = prevList.map((item) => item.id === updatedCV.id ? updatedCV : item);
      localStorage.setItem(currentKey, JSON.stringify(updatedList));
      return updatedList;
    });
  }, [currentUser]);

  const handleEditCV = (id: string) => {
    const match = cvList.find(c => c.id === id);
    if (match) {
      setCurrentCV(match);
      setCurrentView('builder');
    }
  };

  const handleDuplicateCV = (id: string) => {
    const match = cvList.find(c => c.id === id);
    if (match) {
      const cloned: CVData = {
        ...match,
        id: Math.random().toString(36).substring(2, 11),
        title: `${match.title} (نسخة مكررة)`,
        updatedAt: new Date().toISOString()
      };
      
      const userId = currentUser ? currentUser.id : 'guest';
      const storageKey = `easycv_user_cvs_${userId}`;
      const updatedList = [cloned, ...cvList];
      
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      setCvList(updatedList);
      addToast('تم تكرار ونسخ ملف السيرة الذاتية بنجاح تحت مسمى جديد!', 'success');
    }
  };

  const handleDeleteCV = (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف ملف السيرة الذاتية بشكل نهائي؟ لا يمكن استرجاعها بعد الحذف.')) {
      const userId = currentUser ? currentUser.id : 'guest';
      const storageKey = `easycv_user_cvs_${userId}`;
      const filtered = cvList.filter(c => c.id !== id);
      
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      setCvList(filtered);
      addToast('تم حذف السيرة الذاتية المحددة بنجاح.', 'success');
    }
  };

  const handleImportCV = (newCV: CVData) => {
    const userId = currentUser ? currentUser.id : 'guest';
    const storageKey = `easycv_user_cvs_${userId}`;
    const updatedList = [newCV, ...cvList];
    
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
    setCvList(updatedList);
  };

  // Auth Success action and migration of guest drafts
  const handleAuthSuccess = (user: User, message: string) => {
    setCurrentUser(user);
    localStorage.setItem('easycv_current_user', JSON.stringify(user));
    
    // Migrate Guest drafts so the user doesn't lose their previous work
    const guestKey = 'easycv_user_cvs_guest';
    const guestCVsRaw = localStorage.getItem(guestKey);
    
    if (guestCVsRaw) {
      try {
        const guestCVs: CVData[] = JSON.parse(guestCVsRaw);
        if (guestCVs.length > 0) {
          const userKey = `easycv_user_cvs_${user.id}`;
          const currentSaved = localStorage.getItem(userKey);
          let userCVs: CVData[] = currentSaved ? JSON.parse(currentSaved) : [];
          
          // Attach current guest ones with user specific ID
          const migrated = guestCVs.map(c => ({ ...c, userId: user.id }));
          userCVs = [...migrated, ...userCVs];
          
          localStorage.setItem(userKey, JSON.stringify(userCVs));
          localStorage.removeItem(guestKey);
          addToast('تم دمج وترحيل وتأمين ملفاتك من مسودة الزائر لحسابك الشخصي السحابي بنجاح!', 'success');
        }
      } catch (err) {
        // quiet ignore
      }
    }

    setAuthOpen(false);
    setCurrentView('dashboard');
    addToast(message, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('easycv_current_user');
    setCurrentUser(null);
    setCurrentView('home');
    addToast('تم تسجيل خروجك بنجاح. نتمنى لك مسيرة موفقة!', 'info');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Dynamic Navigation Headers */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Main Routed Area */}
      <main className="flex-1">
        <Suspense fallback={<LazyFallback />}>
          {currentView === 'home' && (
            <LandingPage
              onNavigate={handleNavigate}
              onSelectTemplate={handleCreateCVWithTemplate}
              onOpenAuth={() => setAuthOpen(true)}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              cvs={cvList}
              onEditCV={handleEditCV}
              onDuplicateCV={handleDuplicateCV}
              onDeleteCV={handleDeleteCV}
              onNewCV={() => handleNavigate('templates')}
              onImportCV={handleImportCV}
              onOpenAuth={() => setAuthOpen(true)}
              onNavigate={handleNavigate}
              addToast={addToast}
              blogPosts={blogPostsState}
              onUpdateBlogPosts={handleUpdateBlogPosts}
              pendingArticles={pendingArticles}
              onUpdatePendingArticles={handleUpdatePendingArticles}
            />
          )}

          {currentView === 'builder' && currentCV && (
            <Builder
              cvData={currentCV}
              onSave={handleSaveCV}
              onBack={() => handleNavigate('dashboard')}
              addToast={addToast}
              currentUser={currentUser}
              onOpenPremiumModal={(tId) => {
                setPendingTemplateChoice(tId);
                setSubOpen(true);
              }}
            />
          )}

          {currentView === 'templates' && (
            <TemplatesGrid
              onSelectTemplate={handleCreateCVWithTemplate}
            />
          )}

          {currentView === 'blog' && (
            <Blog
              onSelectArticle={(slug) => handleNavigate('blog-post', slug)}
              posts={blogPostsState}
            />
          )}

          {currentView === 'blog-post' && (
            <ArticleView
              slug={selectedArticleSlug}
              onBack={() => handleNavigate('blog')}
              addToast={addToast}
              posts={blogPostsState}
            />
          )}

          {currentView === 'about' && (
            <About />
          )}

          {currentView === 'contact' && (
            <Contact
              addToast={addToast}
            />
          )}

          {currentView === 'legal' && (
            <LegalDocs
              initialTab={legalTab}
            />
          )}
        </Suspense>
      </main>

      {/* Embedded Sticky Footers */}
      <Footer
         onNavigate={handleNavigate}
         onOpenSitemap={() => setSitemapOpen(true)}
      />

       {/* Floating System-Wide Toasts Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Interactive Authentication Form Overlays */}
      <Suspense fallback={null}>
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
          addToast={addToast}
        />
      </Suspense>

      {/* Premium Subscription & Template Purchase Modal */}
      <Suspense fallback={null}>
        <SubscriptionModal
          isOpen={subOpen}
          onClose={() => {
            setSubOpen(false);
            setPendingTemplateChoice('');
          }}
          currentUser={currentUser}
          templateId={pendingTemplateChoice}
          onSuccess={(updatedUser) => {
            setCurrentUser(updatedUser);
            if (pendingTemplateChoice && currentView !== 'builder') {
              setTimeout(() => {
                handleCreateCVWithTemplate(pendingTemplateChoice as any);
                setPendingTemplateChoice('');
              }, 100);
            } else {
              setPendingTemplateChoice('');
            }
          }}
          addToast={addToast}
          onOpenAuth={() => {
            setSubOpen(false);
            setAuthOpen(true);
          }}
        />
      </Suspense>

      {/* Diagnostic Sitemap visual details Modal */}
      <Suspense fallback={null}>
        <SitemapModal
          isOpen={sitemapOpen}
          onClose={() => setSitemapOpen(false)}
          addToast={addToast}
        />
      </Suspense>
    </div>
  );
}
