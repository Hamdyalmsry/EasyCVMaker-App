import React, { useState, useEffect } from 'react';
import { CVData, CVTemplateId, WorkExperience, Education, Language, Project, Certification } from '../types';
import {
  Sparkles, FileText, Layout, ArrowRight, Printer, Save, Undo, ZoomIn, ZoomOut, Check,
  Trash2, Plus, GripVertical, Download, ExternalLink, HelpCircle, GraduationCap, Briefcase, Zap, Globe, Award
} from 'lucide-react';
import { SEO } from './SEO';
import { AdSense } from './AdSense';

interface BuilderProps {
  cvData: CVData;
  onSave: (data: CVData) => void;
  onBack: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  currentUser?: any;
  onOpenPremiumModal?: (templateId: string) => void;
}

export const Builder: React.FC<BuilderProps> = ({
  cvData,
  onSave,
  onBack,
  addToast,
  currentUser,
  onOpenPremiumModal
}) => {
  const [data, setData] = useState<CVData>({ ...cvData });
  const [zoom, setZoom] = useState(0.75);
  const getThemeColor = () => data.colorTheme || '#2563eb';
  const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'projects' | 'certifications'>('personal');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isImprovingExperience, setIsImprovingExperience] = useState<string | null>(null);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // ATS AI analysis state variables
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    strengths: string[];
    missingKeywords: string[];
    structureIssues: string[];
    formattingTips: string[];
    summaryFeedback: string;
  } | null>(null);
  const [showATSPanel, setShowATSPanel] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAutoFillMenu, setShowAutoFillMenu] = useState(false);
  const [showTemplatesGallery, setShowTemplatesGallery] = useState(false);

  // Dynamic CV score and motivator tips calculation
  const calculateCVStrength = () => {
    let score = 0;
    let tips: string[] = [];
    
    if (data.personalInfo.name && data.personalInfo.name.trim().length > 3) {
      score += 15;
    } else {
      tips.push('يرجى كتابة الاسم الكامل لجذب انتباه مسؤولي التوظيف');
    }
    
    if (data.personalInfo.title && data.personalInfo.title.trim().length > 3) {
      score += 15;
    } else {
      tips.push('المسمى الوظيفي المستهدف يربط تخصصك بفرص العمل المتوافقة');
    }
    
    if (data.summary && data.summary.trim().length > 15) {
      score += 20;
    } else {
      tips.push('الملخص المهني هو بطاقتك التعريفية الأولى، صِف شغفك وإنجازاتك في سطرين مهيبين');
    }
    
    if (data.workExperience && data.workExperience.length > 0) {
      score += 20;
      const descLength = data.workExperience.every(exp => exp.description && exp.description.length > 10);
      if (!descLength) {
        tips.push('أضِف مهاماً دقيقة وإنجازات ملموسة لكل شركة بالأرقام إن أمكن');
      }
    } else {
      tips.push('سجل خبرة مهنية واحدة على الأقل لإثبات قدرتك العملية');
    }
    
    if (data.education && data.education.length > 0) {
      score += 15;
    } else {
      tips.push('التحصيل العلمي والجامعي يعكس خلفيتك الأكاديمية ونقاط قوتك للمؤسسات');
    }
    
    if (data.skills && data.skills.length >= 3) {
      score += 15;
    } else {
      tips.push('أضِف على الأقل 3 مهارات من مهاراتك الفنية لتخطي فلترة الـ ATS بنجاح');
    }
    
    return { score, tips };
  };

  const { score: cvScore, tips: cvTips } = calculateCVStrength();

  const improveExperienceAI = async (workId: string, position: string, company: string, currentDesc: string) => {
    setIsImprovingExperience(workId);
    addToast('جاري تحسين وصياغة الوصف الوظيفي بالأسلوب الاحترافي الاستثنائي...', 'info');

    try {
      const response = await fetch('/api/improve-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position,
          company,
          description: currentDesc,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'فشل في تحسين الوصف');
      }

      const resData = await response.json();
      if (resData.description) {
        setData((prev) => ({
          ...prev,
          workExperience: prev.workExperience.map((w) => 
            w.id === workId ? { ...w, description: resData.description } : w
          ),
          updatedAt: new Date().toISOString()
        }));
        addToast('تمت صياغة الوصف المهني بنقاط إنجاز جذابة بالذكاء الاصطناعي!', 'success');
      }
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'حدث خطأ عند محاولة صياغة الوصف المهني.', 'error');
    } finally {
      setIsImprovingExperience(null);
    }
  };

  const suggestSkillsAI = async () => {
    const title = data.personalInfo.title;
    if (!title) {
      addToast('يرجى تحديد المسمى الوظيفي أولاً في قسم "الهوية" لنقترح لك المهارات المطابقة بدقة.', 'info');
      return;
    }

    setIsSuggestingSkills(true);
    addToast('جاري استخراج المهارات الأكثر طلباً لمؤهلك بالذكاء الاصطناعي...', 'info');
    setSuggestedSkills([]);

    try {
      const response = await fetch('/api/suggest-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'فشل في استدعاء المقترحات');
      }

      const resData = await response.json();
      if (resData.skills && resData.skills.length > 0) {
        setSuggestedSkills(resData.skills);
        addToast('تم العثور على أهم المهارات الموصى بها لسيرتك!', 'success');
      }
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'فشل في الحصول على مهارات مقترحة.', 'error');
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  const generateAISummary = async () => {
    // If name and title are empty, tell user to fill them first
    if (!data.personalInfo.name && !data.personalInfo.title) {
      addToast('الرجاء إدخال الاسم والمسمى الوظيفي أولاً لمساعد المعلم AI في صياغة خلاصة دقيقة لمسارك.', 'info');
      return;
    }

    setIsGeneratingSummary(true);
    addToast('جاري تحضير ملخص مهني ريادي مميز عبر الذكاء الاصطناعي...', 'info');

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: data.personalInfo,
          skills: data.skills,
          workExperience: data.workExperience,
          education: data.education,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'فشل في توليد الملخص');
      }

      const resData = await response.json();
      if (resData.summary) {
        setData((prev) => ({
          ...prev,
          summary: resData.summary,
          updatedAt: new Date().toISOString()
        }));
        addToast('تم توليد وتحديث ملخصك المهني بنجاح مذهل!', 'success');
      } else {
        throw new Error('لم يتم إرجاع أي ملخص مقترح');
      }
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'حدث خطأ غير متوقع أثناء توليد الملخص بالذكاء الاصطناعي.', 'error');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const runATSAnalysisAI = async () => {
    setIsAnalyzingATS(true);
    setShowATSPanel(true);
    addToast('جاري بدء الفحص الذكي ومراجعة معايير ATS ومطابقة الكلمات الدلالية...', 'info');

    try {
      const response = await fetch('/api/analyze-cv-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvData: data }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'فشل فحص السيرة الذاتية');
      }

      const resData = await response.json();
      setAtsResult({
        score: resData.score ?? 50,
        strengths: resData.strengths ?? [],
        missingKeywords: resData.missingKeywords ?? [],
        structureIssues: resData.structureIssues ?? [],
        formattingTips: resData.formattingTips ?? [],
        summaryFeedback: resData.summaryFeedback ?? ''
      });
      addToast('اكتمل التحليل الذكي بنجاح! راجع التقرير المفصل الآن لتحقيق أقصى توافق ⚡', 'success');
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'حدث خطأ عند فحص السيرة الذاتية مع أنظمة ATS بالذكاء الاصطناعي.', 'error');
    } finally {
      setIsAnalyzingATS(false);
    }
  };

  // Trigger Save on data change with deep comparison or simple throttled updates
  useEffect(() => {
    onSave(data);
  }, [data, onSave]);

  const handlePersonalChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSummaryChange = (val: string) => {
    setData((prev) => ({
      ...prev,
      summary: val,
      updatedAt: new Date().toISOString()
    }));
  };

  // List editors
  const addWorkExperience = () => {
    const newItem: WorkExperience = {
      id: Math.random().toString(36).substring(2, 9),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    };
    setData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newItem],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeWorkExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter(i => i.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  // Education Helpers
  const addEducation = () => {
    const newItem: Education = {
      id: Math.random().toString(36).substring(2, 9),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setData((prev) => ({
      ...prev,
      education: [...prev.education, newItem],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter(i => i.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  // Languages Helper
  const addLanguage = () => {
    const newItem: Language = {
      id: Math.random().toString(36).substring(2, 9),
      language: '',
      level: 'متقدم'
    };
    setData((prev) => ({
      ...prev,
      languages: [...prev.languages, newItem],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeLanguage = (id: string) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.filter(i => i.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  // Projects Helper
  const addProject = () => {
    const newItem: Project = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      role: '',
      description: '',
      link: ''
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newItem],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter(i => i.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  // Certifications Helpers
  const addCertification = () => {
    const newItem: Certification = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      issuer: '',
      date: ''
    };
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newItem],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeCertification = (id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(i => i.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  // Skills comma separator helper
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const items = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setData((prev) => ({
      ...prev,
      skills: items,
      updatedAt: new Date().toISOString()
    }));
  };

  // AI Auto-Fill Helper (Simulated Local Expert AI)
  const handleAIAutoFill = (role: 'developer' | 'sales' | 'designer') => {
    const aiTemplates = {
      developer: {
        title: 'سيرة ذاتية - مهندس برمجيات وويب',
        personalInfo: {
          name: 'عبد الرحمن الشريف',
          title: 'مطور برمجيات ذكي وتطبيقات الهواتف (Full-Stack)',
          email: 'abdulrahman.sh@example.com',
          phone: '+966 50 111 2233',
          location: 'الرياض، المملكة العربية السعودية',
          website: 'https://alsharif.dev',
          github: 'github.com/alsharif-dev',
          linkedin: 'linkedin.com/in/alsharif-dev'
        },
        summary: 'مطور واجهات ومواقع متقدم (Full-Stack Engineer) بخبرة عملية تتجاوز ٤ سنوات في تصميم وصياغة حلول الويب السريعة والذكية باستخدام React, NextJS, Node.js و Express. شغوف بتحسين أداء الصفحات وكتابة أكواد نظيفة متوافقة مع أنظمة التشغيل السحابي والخدمي.',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Vite', 'GraphQL', 'Docker', 'RESTful APIs', 'Git', 'Agile Methodology'],
        workExperience: [
          {
            id: 'work-ai-1',
            company: 'شركة الأنظمة الرقمية الرائدة',
            position: 'مطور برمجيات أول (Senior Web Developer)',
            startDate: '2023-01',
            endDate: '',
            description: 'قيادة فريق تطوير الويب مكون من ٤ مبرمجين لإنشاء منصة تجارة إلكترونية ذكية. خفض وقت استجابة الخادم بنسبة ٣٥٪ وتحرير الكفاءة البصرية للعميل باستخدام تقنيات خادمة NextJS.',
            current: true
          },
          {
            id: 'work-ai-2',
            company: 'مؤسسة الحلول السحابية',
            position: 'مطور واجهات ومواقع (Frontend Engineer)',
            startDate: '2021-06',
            endDate: '2022-12',
            description: 'تطوير لوحات التحكم التفاعلية لبيانات الإحصائيات وبناء واجهات API مرنة ومحسنة التفاعل، وتحسين استهلاك الذاكرة العشوائية للتطبيق.',
            current: false
          }
        ],
        education: [
          {
            id: 'edu-ai-1',
            school: 'جامعة الملك سعود بالرياض',
            degree: 'بكالوريوس علوم الحاسب والمعلومات',
            field: 'علوم هندسة البرمجيات والتعدين الفني',
            startDate: '2017-09',
            endDate: '2021-06',
            description: 'تخرج بتقدير ممتاز مع مرتبة الشرف الأولى. الفائز بالمركز الأول في مسابقة الهاكاثون البرمجي الوطني.'
          }
        ],
        languages: [
          { id: 'lang-ai-1', language: 'اللغة العربية', level: 'اللغة الأم' },
          { id: 'lang-ai-2', language: 'اللغة الإنجليزية', level: 'متقدم وتحدث بطلاقة' }
        ],
        projects: [
          {
            id: 'proj-ai-1',
            name: 'نظام توصيل طلبات سحابي متكامل',
            role: 'مهندس المطور الرئيسي للنظم',
            description: 'بناء نظام لوجستي لإدارة شاحنات ومركبات التوزيع بدقة تحديد المواقع الفوري وخريطة تفاعلية ذكية للطلب.',
            link: 'https://github.com/alsharif-dev/logistics'
          }
        ],
        certifications: [
          { id: 'cert-ai-1', name: 'شهادة مطور تطبيقات السحابة المعتمد AWS Cloud Architect', issuer: 'Amazon Web Services (AWS)', date: '2025-04' }
        ]
      },
      sales: {
        title: 'سيرة ذاتية - مدير مبيعات متميز',
        personalInfo: {
          name: 'سمير خليل طه',
          title: 'مدير تطوير مبيعات الشركاء والشركات الكبرى (B2B)',
          email: 'samir.khaleel@example.com',
          phone: '+966 55 999 8877',
          location: 'جدة، المملكة العربية السعودية',
          website: 'https://samir-sales.com',
          github: '',
          linkedin: 'linkedin.com/in/samir-sales'
        },
        summary: 'مستشار ومدير مبيعات طموح وصاحب مسيرة نجاح تجاوزت ٥ سنوات في التفاوض، صياغة الاتفاقيات وتجاوز مستويات جلب الأرباح لقطاعات التقنية المالية وشركات لوجستيات التوريد في الشرق الأوسط.',
        skills: ['إدارة حسابات الشركات B2B', 'استراتيجيات التفاوض الصعب', 'تحليل السوق والمنافسين', 'تطبيق CRM (Salesforce)', 'توجيه وبناء فرق المبيعات', 'العلاقات العامة وعلاقات العملاء'],
        workExperience: [
          {
            id: 'work-sales-1',
            company: 'شريك المدفوعات الرقمي المحدود',
            position: 'مدير تطوير مبيعات الأعمال الإقليمي',
            startDate: '2022-08',
            endDate: '',
            description: 'تنفيذ صفقات استراتيجية مع ٣٢ علامة تجارية جالبة لأرباح تتجاوز ٤ ملايين ريال سنوياً. قيادة تدريب وتوجيه لوحة فريق المبيعات لزيادة التحويل بنسبة ١٨٪.',
            current: true
          }
        ],
        education: [
          {
            id: 'edu-sales-1',
            school: 'جامعة الملك عبدالعزيز بجدة',
            degree: 'بكالوريوس إدارة أعمال وتسويق مالي',
            field: 'الاقتصاد وتحليل نمو الأسواق المبتكرة',
            startDate: '2016-09',
            endDate: '2020-05',
            description: 'الحصول على جائزة الطالب القيادي وجائزة بحوث التسويق المالي المبتكر.'
          }
        ],
        languages: [
          { id: 'lang-sales-1', language: 'اللغة العربية', level: 'اللغة الأم' },
          { id: 'lang-sales-2', language: 'اللغة الإنجليزية', level: 'متقدم جداً' }
        ],
        projects: [
          {
            id: 'proj-sales-1',
            name: 'إعادة هيكلة تجربة مبيعات التجزئة السحابية',
            role: 'مدير الاستراتيجية التسويقية والتمويل',
            description: 'نظام تشغيلي متكامل لربط متاجر مبيعات المواد الغذائية بلوحة توزيع وطلبات مخصصة.',
            link: ''
          }
        ],
        certifications: [
          { id: 'cert-sales-1', name: 'مدير مبيعات معتمد مهنياً (CMS)', issuer: 'جمعية التسويق والمبيعات العالمية', date: '2024-11' }
        ]
      },
      designer: {
        title: 'سيرة ذاتية - مصمم واجهات ريادي',
        personalInfo: {
          name: 'ميسم عادل الفايز',
          title: 'مصممة واجهات وتجربة المستخدم الرئيسية (Lead UI/UX Designer)',
          email: 'maysam.ad@example.com',
          phone: '+966 53 444 5566',
          location: 'الدمام، المملكة العربية السعودية',
          website: 'https://maysam-designs.myportfolio.com',
          github: '',
          linkedin: 'linkedin.com/in/maysam-designs'
        },
        summary: 'مصممة ومنظرة سلوك مستخدمين بخبرة تناهز ٣ سنوات في بناء لغات التصميم وهياكل المواقع والتطبيقات (Design Systems). متمرسة في Figma وتطبيق اختبارات سهولة الاستخدام وترجمة رؤية الأعمال إلى واجهات بصرية ساحرة وبسيطة.',
        skills: ['Figma', 'Adobe XD', 'بناء لغات التصميم (Design Systems)', 'هيكلة الإطارات السلكية (Wireframing)', 'سلوك واختبار سهولة الاستخدام', 'التواصل البصري وعلم تنسيق الألوان'],
        workExperience: [
          {
            id: 'work-des-1',
            company: 'منصة تواصل الرقمية للبرمجيات',
            position: 'مصممة واجهات رئيسية للويب والهندسة',
            startDate: '2024-02',
            endDate: '',
            description: 'إعادة تصميم تطبيق الهواتف الرئيسي للمنصة، مما تسبب في رفع معدل بقاء العميل وتصفح التطبيق بنسبة ٤٢٪ وتسهيل تجربة السداد لخطوة واحدة.',
            current: true
          }
        ],
        education: [
          {
            id: 'edu-des-1',
            school: 'جامعة الإمام عبدالرحمن بن فيصل بالدمام',
            degree: 'بكالوريوس التصميم الجرافيكي وتقنيات المדיה',
            field: 'الفنون البصرية وبحوث سلوك المستخدم الرقمي',
            startDate: '2019-09',
            endDate: '2023-06',
            description: 'التخرج بمرتبة الشرف والامتياز الأكاديمي لمشاريع الهوية البصرية الصاعدة.'
          }
        ],
        languages: [
          { id: 'lang-des-1', language: 'اللغة العربية', level: 'اللغة الأم' },
          { id: 'lang-des-2', language: 'اللغة الإنجليزية', level: 'متقدم' }
        ],
        projects: [
          {
            id: 'proj-des-1',
            name: 'هوية رقمية متكاملة لعيادات صحية سحابية',
            role: 'مصممة الهوية وتجربة الحجز بالكامل',
            description: 'موقع وتطبيق يوفر حجز الأطباء بأقل من ٣ ثوانٍ، مدعوم بأشكال بصرية مريحة للعين وفائقة البساطة.',
            link: ''
          }
        ],
        certifications: [
          { id: 'cert-des-1', name: 'شهادة احتراف واجهات وتجربة المستخدم المعتمدة من Google', issuer: 'Google Professional Certifications', date: '2023-10' }
        ]
      }
    };

    const targetTemplate = aiTemplates[role];
    if (targetTemplate) {
      setData((prev) => ({
        ...prev,
        ...targetTemplate,
        updatedAt: new Date().toISOString()
      }));
      addToast('تمت صياغة بيانات سيرة احترافية ومكتملة بالكامل عبر محاكي AI بنجاح مذهل!', 'success');
    }
  };

  // Trigger Browser Custom Print View specifically for the resume frame
  const handlePrint = () => {
    addToast('جاري تفعيل إعدادات الطباعة وتوليد PDF الاحترافي بدقة فائقة...', 'info');

    const printElement = document.getElementById('resume-print-area');
    if (!printElement) {
      addToast('خطأ: تعذر العثور على منطقة السيرة الذاتية للطباعة.', 'error');
      try {
        window.print();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    // Standard fallback if iframe creation is disabled or fails
    try {
      // Create or locate a dedicated invisible print iframe
      let printIframe = document.getElementById('resume-print-iframe') as HTMLIFrameElement;
      if (printIframe) {
        printIframe.remove();
      }
      
      printIframe = document.createElement('iframe');
      printIframe.id = 'resume-print-iframe';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0px';
      printIframe.style.height = '0px';
      printIframe.style.border = '0';
      printIframe.style.zIndex = '-9999';
      document.body.appendChild(printIframe);

      const iframeDoc = printIframe.contentDocument || printIframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Could not access iframe document');
      }

      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><head><title>' + (data.personalInfo.name || 'السيرة الذاتية') + '</title>');
      
      // Inherit all stylesheet rules and inline styles from parent document to preserve Tailwind layouts
      const parentStyleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
      parentStyleSheets.forEach((styleTag) => {
        iframeDoc.write(styleTag.outerHTML);
      });

      // Inject robust layout overrides to optimize printing (A4, precise colors, background colors, custom fonts)
      iframeDoc.write(`
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;650;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
          @media print {
            @page {
              size: A4;
              margin: 12mm 12mm; /* Professional academic margins */
            }
            body {
              background-color: white !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: 'Cairo', 'Inter', system-ui, sans-serif !important;
            }
          }
          body {
            direction: rtl;
            background-color: white !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: 'Cairo', 'Inter', system-ui, sans-serif !important;
          }
          /* Override scaling, zoom transforms and shadows on the isolated print element */
          #resume-print-area {
            transform: none !important;
            -webkit-transform: none !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: white !important;
          }
          /* Guarantee background colors match perfectly on Webkit / Safari too */
          #resume-print-area, #resume-print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Prevent elements from separating or splitting awkwardly between A4 sheet pages */
          .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      `);
      iframeDoc.write('</head><body>');
      iframeDoc.write(printElement.outerHTML);
      iframeDoc.write('</body></html>');
      iframeDoc.close();

      // Give images, webfonts, and layouts ample room to compile and resolve before triggering dialog
      setTimeout(() => {
        try {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          addToast('تم تجهيز المعاينة بنجاح! الرجاء حفظ السيرة كملف PDF. ولكن لأجل التحميل يرجى التحميل ثم الفتح مباشرةً.', 'success');
        } catch (err) {
          console.error('Nested print trigger failed, falling back to window.print()', err);
          window.print();
        }
      }, 750);
    } catch (err) {
      console.warn('Iframe isolation printer error, resorting to native fallback:', err);
      try {
        window.print();
      } catch (fallbackErr) {
        addToast('خطأ: تعذر تشغيل واجهة الطباعة في متصفحك.', 'error');
      }
    }
  };

  const handleDownloadHTML = () => {
    addToast('جاري تجميع حزم الملف المستقل وتوليد السيرة الذاتية التفاعلية الحية...', 'info');

    const printElement = document.getElementById('resume-print-area');
    if (!printElement) {
      addToast('خطأ: تعذر العثور على منطقة السيرة الذاتية للتوليد والتحميل.', 'error');
      return;
    }

    try {
      // Gather all stylesheets to preserve styling beautifully
      let styleContent = '';
      const parentStyleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
      parentStyleSheets.forEach((styleTag) => {
        styleContent += styleTag.outerHTML + '\n';
      });

      const fullHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>${data.personalInfo.name || 'السيرة الذاتية'} - EasyCV</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  ${styleContent}
  <style>
    @media print {
      @page {
        size: A4;
        margin: 12mm 12mm;
      }
      body {
        background-color: white !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-family: 'Cairo', 'Inter', system-ui, -apple-system, sans-serif !important;
      }
      /* Hide download utility bar inside printout */
      .utility-bar {
        display: none !important;
      }
      .preview-container {
        padding: 0 !important;
        margin: 0 !important;
      }
      #resume-print-area {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
    }
    body {
      direction: rtl;
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
      margin: 0 !important;
      padding: 0 !important;
      min-height: 100vh;
      font-family: 'Cairo', 'Inter', system-ui, -apple-system, sans-serif !important;
    }
    /* Fixed utility top bar that prompts print nicely */
    .utility-bar {
      background-color: #0f172a;
      color: white;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      direction: rtl;
    }
    .utility-title {
      font-weight: 900;
      font-size: 15px;
      color: #fbbf24;
    }
    .utility-desc {
      font-size: 11px;
      color: rgb(203 213 225);
      margin-top: 2px;
    }
    .utility-btn {
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .utility-btn:hover {
      background-color: #1d4ed8;
      transform: translateY(-1px);
    }
    /* Resume Frame layout */
    .preview-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }
    #resume-print-area {
      background-color: white !important;
      width: 794px;
      min-height: 1123px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15) !important;
      border: 1px solid rgb(226 232 240) !important;
      padding: 48px !important;
      box-sizing: border-box;
      transform: none !important;
    }
    #resume-print-area, #resume-print-area * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page-break-avoid {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  </style>
</head>
<body>
  <div class="utility-bar">
    <div>
      <div class="utility-title">✨ تم التجهيز بنجاح! السيرة الذاتية جاهزة كملف PDF مدمج بالتنسيق والتصميم الأصلي 📄</div>
      <div class="utility-desc">بمجرد تحميل الملف التفاعلي وفتحه مباشرة، ستظهر لك نافذة الحفظ التلقائي للطباعة للحصول على دقة 100%.</div>
    </div>
    <button class="utility-btn" onclick="window.print()">🖨️ طباعة السيرة وحفظها كـ PDF (مقاس A4)</button>
  </div>
  
  <div class="preview-container">
    ${printElement.outerHTML}
  </div>

  <script>
    // Automatically trigger native print dialog upon loading for fluid convenience
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 600);
    });
  </script>
</body>
</html>`;

      const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.personalInfo.name ? data.personalInfo.name.replace(/\s+/g, '_') : 'سيرتي_الذاتية'}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('🚀 تم تجهيز المعاينة بنجاح! الرجاء حفظ السيرة كملف PDF. ولكن لأجل تحميل يرجى تحميله ثم فتحه مباشرةً.', 'success');
      setShowPrintModal(false);
    } catch (err) {
      console.error('File export failed:', err);
      addToast('فشل تصدير وتحميل الملف. يرجى تجربة الطباعة التلقائية المباشرة.', 'error');
    }
  };

  // Helper template style classes for coloring the preview dynamically
  const colorSchemes = {
    slate: { text: 'text-slate-800', primary: 'bg-slate-900', border: 'border-slate-300', accent: 'text-indigo-600', textLight: 'text-slate-500' },
    blue: { text: 'text-slate-800', primary: 'bg-blue-900', border: 'border-blue-200', accent: 'text-blue-600', textLight: 'text-slate-500' },
    corporate_sidebar: { text: 'text-slate-800', primary: 'bg-slate-800', border: 'border-blue-100', accent: 'text-blue-600', sidebarBg: 'bg-slate-900 text-white' }
  };

  return (
    <div className="min-h-screen bg-slate-900/5 animate-fade-in" style={{ direction: 'rtl' }}>
      <SEO 
        title={`تعديل: ${data.title}`} 
        description="استخدم المحرر الاحترافي المنبثق لملء خبراتك ومؤهلاتك التعليمية ومعاينتها فوراً بدقة طباعة PDF متطورة."
      />

      {/* Builder Top Bar Controls */}
      <div className="bg-slate-950/95 border-b border-slate-800/80 text-white px-4 py-3 sm:py-4 sticky top-0 z-30 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300">
        
        {/* Back and title */}
        <div className="flex items-center gap-3 w-full sm:w-auto self-start sm:self-center">
          <button
            type="button"
            onClick={onBack}
            className="p-2 px-3.5 text-[11px] font-black bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 border border-slate-800/80 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-indigo-500/5 hover:border-indigo-500/20 active:scale-95"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للوحة التحكم</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData(prev => ({ ...prev, title: e.target.value, updatedAt: new Date().toISOString() }))}
              className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-indigo-500 focus:outline-none text-xs sm:text-xs font-black text-white px-1 py-0.5 max-w-[160px] sm:max-w-[240px] focus:ring-0 leading-none"
              placeholder="اسم السيرة الذاتية"
            />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9.5px] font-black rounded-lg w-fit">
              <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></span>
              قالب: {
                data.templateId === 'classic' ? 'كلاسيكي ورقي' :
                data.templateId === 'modern' ? 'حديث وعصري' :
                data.templateId === 'compact' ? 'جازم ومكثف' :
                data.templateId === 'bento' ? 'شبكة بينتو البصرية' :
                data.templateId === 'creative' ? 'إبداعي ملون' : 'نموذج مخصص'
              }
            </span>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          
          {/* Auto Fill with Ready Template */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAutoFillMenu(!showAutoFillMenu)}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white text-[11px] font-black rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95 duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>💡 ملء تلقائي بنموذج جاهز</span>
            </button>
            
            {showAutoFillMenu && (
              <>
                {/* Backdrop overlay only for easy click-away on mobile */}
                <div className="fixed inset-0 z-40" onClick={() => setShowAutoFillMenu(false)} />
                
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2.5 bg-slate-900/98 backdrop-blur-md border border-amber-500/30 p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-80 text-right z-50 animate-fade-in space-y-4">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 rounded-t-2xl"></div>
                  
                  <div className="space-y-1">
                    <h5 className="text-[12px] font-black text-amber-400 flex items-center gap-1.5 justify-start flex-row-reverse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>اختر نموذج متميز فوري ⚡</span>
                    </h5>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      سيتم ملء بياناتك بالكامل بنموذج احترافي متكامل لإبراز قدرات القالب والتعديل عليه مباشرة.
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        handleAIAutoFill('developer');
                        setShowAutoFillMenu(false);
                      }}
                      className="w-full text-right p-3 bg-slate-950/40 hover:bg-amber-500/10 border border-slate-800/85 hover:border-amber-500/30 rounded-xl text-slate-200 hover:text-white font-bold transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-[9.5px] text-slate-400 group-hover:text-amber-200 transition-colors">تقنية وويب 💻</span>
                      <span className="font-extrabold text-[11px] text-slate-150">مهندس برمجيات متكامل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleAIAutoFill('sales');
                        setShowAutoFillMenu(false);
                      }}
                      className="w-full text-right p-3 bg-slate-950/40 hover:bg-amber-500/10 border border-slate-800/85 hover:border-amber-500/30 rounded-xl text-slate-200 hover:text-white font-bold transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-[9.5px] text-slate-400 group-hover:text-amber-200 transition-colors">إداري وشركات 🤝</span>
                      <span className="font-extrabold text-[11px] text-slate-150">مدير مبيعات B2B</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleAIAutoFill('designer');
                        setShowAutoFillMenu(false);
                      }}
                      className="w-full text-right p-3 bg-slate-950/40 hover:bg-amber-500/10 border border-slate-800/85 hover:border-amber-500/30 rounded-xl text-slate-200 hover:text-white font-bold transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-[9.5px] text-slate-400 group-hover:text-amber-200 transition-colors">تصميم وإبداع 🎨</span>
                      <span className="font-extrabold text-[11px] text-slate-150">مصمم واجهات مستخدم UI</span>
                    </button>
                  </div>

                  <div className="text-[9px] text-amber-500/85 text-center pt-1 border-t border-slate-850">
                    ⚠️ ملء تلقائي يستبدل البيانات الحالية بالكامل
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          {/* Print Trigger */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-505 hover:to-indigo-505 text-white text-[11px] font-black rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="sm:inline">تحميل / طباعة PDF</span>
          </button>
        </div>

      </div>

      {/* Main Builder layout columns split */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form Panel (Left Side) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-6">
          
          {/* Embedded Editor Subnavigation */}
          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 justify-center">
            <button
              onClick={() => setActiveTab('personal')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'personal' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              الهوية والاتصال
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'summary' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              الملخص
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'experience' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              الخبرات
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'education' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              التعليم
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'skills' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              المهارات
            </button>
            <button
              onClick={() => setActiveTab('languages')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'languages' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              اللغات
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              المشاريع
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`text-[11px] font-bold px-3 py-2 rounded-xl transition-all ${activeTab === 'certifications' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              الشهادات
            </button>
          </div>

          {/* AI Assistant Contextual Panel */}
          <div className="bg-gradient-to-br from-amber-50/70 via-indigo-50/30 to-blue-50/40 border border-amber-200/80 p-4 rounded-2xl shadow-3xs space-y-3 text-right">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-amber-100 text-amber-800 border border-amber-200/50 animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>مساعد الذكاء الاصطناعي الذكي (AI Assistant)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">بدعم من Gemini 3.5</span>
            </div>

            {activeTab === 'personal' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  أدخل مسمى وظيفي دقيق في حقل <span className="font-bold text-slate-800">"المسمى المهني المستهدف"</span> بالأسفل. سيتم استخدام مسمى وظيفتك هذا فوراً لتوليد الملخص، المهارات المناسبة، والخبرات المتناسقة عبر الذكاء الاصطناعي.
                </p>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  هل تريد صياغة خلاصة ذاتية باهرة ومقنعة؟ سيقوم الذكاء الاصطناعي بتحليل اسمك، مسماك المستهدف، مهاراتك، وخبراتك الحالية ليكتب لك موجزاً مخصصاً واحترافياً لجذب الـ HR!
                </p>
                <button
                  type="button"
                  onClick={generateAISummary}
                  disabled={isGeneratingSummary}
                  className="w-full bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingSummary ? 'جاري صياغة ملخصك البليغ...' : 'صياغة ملخص احترافي بليغ فوراً 🪄'}</span>
                </button>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  اختر أي عمل وظيفي بالأسفل لتلقين الذكاء الاصطناعي وتحسين وصف المهام بأسلوب الإنجازات القوي وصياغة نقاط نقطية (Bulleted list) تبرز روعتك.
                </p>
                <div className="space-y-2">
                  {data.workExperience.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {data.workExperience.map((work) => (
                        <div key={work.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 shadow-3xs hover:border-amber-200 transition-colors">
                          <button
                            type="button"
                            onClick={() => improveExperienceAI(work.id, work.position, work.company, work.description)}
                            disabled={isImprovingExperience !== null}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
                          >
                            <Sparkles className={`w-3 h-3 ${isImprovingExperience === work.id ? 'animate-spin' : ''}`} />
                            <span>{isImprovingExperience === work.id ? 'جاري التحسين...' : 'تحسين بالذكاء الاصطناعي'}</span>
                          </button>
                          <span className="text-xs font-bold text-slate-800 truncate pl-2 max-w-[150px]">
                            {work.position || 'موضع'} في {work.company || 'شركة'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 text-center py-2">يرجى إضافة خبرة واحدة على الأقل بالأسفل لبدء التحسين بالذكاء الاصطناعي.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  دع مساعد الذكاء الاصطناعي يقترح عليك أهم الكفاءات والكلمات المفتاحية الفنية والشخصية الملائمة تماماً لمسماك المستهدف: <span className="font-bold text-slate-800">"{data.personalInfo.title || 'غير محدد'}"</span> لتخطي فلاتر ATS!
                </p>
                
                <button
                  type="button"
                  onClick={suggestSkillsAI}
                  disabled={isSuggestingSkills}
                  className="w-full bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSuggestingSkills ? 'animate-spin' : ''}`} />
                  <span>{isSuggestingSkills ? 'جاري استخراج المقترحات...' : 'اقتراح مهارات تخصصية فوراً 🪄'}</span>
                </button>

                {suggestedSkills.length > 0 && (
                  <div className="mt-3 bg-white border border-amber-200/50 rounded-xl p-3 space-y-2">
                    <p className="text-[11px] font-black text-amber-700 text-right">المهارات المقترحة (انقر للإضافة الفورية):</p>
                    <div className="flex flex-wrap gap-1 justify-start" style={{ direction: 'rtl' }}>
                      {suggestedSkills.map((skill, sIdx) => {
                        const isAlreadyAdded = data.skills.includes(skill);
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => {
                              if (!isAlreadyAdded) {
                                setData(prev => ({ ...prev, skills: [...prev.skills, skill], updatedAt: new Date().toISOString() }));
                                addToast(`تمت إضافة المهارة: ${skill}`, 'success');
                              }
                            }}
                            disabled={isAlreadyAdded}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all flex items-center gap-0.5 ${isAlreadyAdded ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'}`}
                          >
                            <span>{skill}</span>
                            {!isAlreadyAdded && <span className="font-extrabold text-amber-600 ml-0.5">+</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab !== 'personal' && activeTab !== 'summary' && activeTab !== 'experience' && activeTab !== 'skills' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  أكمل إدخال تفاصيل قسم <span className="font-black text-slate-800">"{activeTab === 'education' ? 'التعليم' : activeTab === 'projects' ? 'المشاريع' : activeTab === 'certifications' ? 'الشهادات' : 'اللغات'}"</span> بشكل دقيق لصياغة مستند مثالي متكامل.
                </p>
              </div>
            )}
          </div>

          {/* Active section editor view */}
          <div className="pt-4 border-t border-slate-50">
            
            {/* Personal Info tab content */}
            {activeTab === 'personal' && (
              <div className="space-y-4 animate-fade-in text-right">
                <h3 className="text-sm font-black text-slate-800">بيانات الهوية الشخصية وبطاقة الاتصال</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      value={data.personalInfo.name}
                      onChange={(e) => handlePersonalChange('name', e.target.value)}
                      placeholder="امحمد أحمد"
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">المسمى المهني المستهدف</label>
                    <input
                      type="text"
                      value={data.personalInfo.title}
                      onChange={(e) => handlePersonalChange('title', e.target.value)}
                      placeholder="مثال: مطور ويب ممتاز"
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none text-left"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">رقم الهاتف الجوال</label>
                    <input
                      type="text"
                      value={data.personalInfo.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">الموقع / الإقامة الحالية</label>
                  <input
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    placeholder="الرياض، المملكة العربية السعودية"
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">روبط موقعك الشخصي</label>
                    <input
                      type="text"
                      value={data.personalInfo.website}
                      onChange={(e) => handlePersonalChange('website', e.target.value)}
                      placeholder="https://domain.dev"
                      className="w-full text-[11px] py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">رابط Github</label>
                    <input
                      type="text"
                      value={data.personalInfo.github}
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      placeholder="github.com/profile"
                      className="w-full text-[11px] py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">رابط Linkedin</label>
                    <input
                      type="text"
                      value={data.personalInfo.linkedin}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/name"
                      className="w-full text-[11px] py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary tab */}
            {activeTab === 'summary' && (
              <div className="space-y-4 animate-fade-in text-right">
                <h3 className="text-sm font-black text-slate-800">الملخص المهني وجاذبية البدايات</h3>
                <p className="text-[10px] text-slate-400">ملخص مهني بليغ من ٣ إلى ٤ أسطر يعرف بمسيرتك ونقاط قوتك الفورية لأقسام التوظيف.</p>
                <textarea
                  rows={6}
                  value={data.summary || ''}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  placeholder="مطور مبيعات أو تكنولوجيا طموح ذو مهارة..."
                  className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none"
                ></textarea>
              </div>
            )}

            {/* Experience tab */}
            {activeTab === 'experience' && (
              <div className="space-y-4 animate-fade-in text-right">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800">الخبرات المهنية والوظائف السابقة</h3>
                  <button
                    onClick={addWorkExperience}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/50 px-2.5 py-1 rounded-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف خبرة جديدة</span>
                  </button>
                </div>

                <div className="space-y-4 divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-1">
                  {data.workExperience.map((work, index) => (
                    <div key={work.id} className="pt-4 first:pt-0 pb-1.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">رقم الخبرة الكلية: #{index + 1}</span>
                        <button
                          onClick={() => removeWorkExperience(work.id)}
                          className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">الشركة / صاحب العمل</label>
                          <input
                            type="text"
                            value={work.company}
                            onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">المسمى الوظيفي</label>
                          <input
                            type="text"
                            value={work.position}
                            onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">تاريخ البدء</label>
                          <input
                            type="month"
                            value={work.startDate}
                            onChange={(e) => updateWorkExperience(work.id, 'startDate', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">تاريخ الانتهاء</label>
                          <input
                            type="month"
                            disabled={work.current}
                            value={work.endDate}
                            onChange={(e) => updateWorkExperience(work.id, 'endDate', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-40 text-left"
                          />
                        </div>
                        <div className="flex items-center justify-center pt-4">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                            <input
                              type="checkbox"
                              checked={work.current}
                              onChange={(e) => updateWorkExperience(work.id, 'current', e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>أعمل هنا حالياً</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">الوصف والإنجازات في الوظيفة</label>
                        <textarea
                          rows={3}
                          value={work.description}
                          onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                          placeholder="مثال: قيادة لوحات التوزيع البصري، إكمال صفقات مبيعات..."
                          className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education tab */}
            {activeTab === 'education' && (
              <div className="space-y-4 animate-fade-in text-right">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800">المؤهلات التعليمية الحاصل عليها</h3>
                  <button
                    onClick={addEducation}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/50 px-2.5 py-1 rounded-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف شهادة / تعليم جديد</span>
                  </button>
                </div>

                <div className="space-y-4 divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-1">
                  {data.education.map((edu, index) => (
                    <div key={edu.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">المؤهل #{index + 1}</span>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">الجامعة / المؤسسة التعليمية</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">الدرجة العلمية / المستوى</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="بكالوريوس، ماجستير..."
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">التخصص الدراسي الدقيق</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">تاريخ البدء</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">تاريخ التخرج / المتوقع</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">تفاصيل وملاحظات إضافية (تقديرات، إلخ)</label>
                        <input
                          type="text"
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="تخرجت بتقدير ممتاز..."
                          className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4 animate-fade-in text-right">
                <h3 className="text-sm font-black text-slate-800">المهارات الشخصية والتقنية</h3>
                <p className="text-[10px] text-slate-400">اكتب مهاراتك بشكل منفصل وافصل بينهما بعلامة الفاصلة (,) لتظهر تلقائياً كعلامات ورقائق بصرية جذابة في سيرتك.</p>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">المهارات التراكمية (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={data.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="React, Negotiation, Excel, Salesforce, Photoshop..."
                    className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg focus:outline-none ltr:text-left text-right"
                  />
                </div>

                {/* Display dynamic preview of tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages tab */}
            {activeTab === 'languages' && (
              <div className="space-y-4 animate-fade-in text-right">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800">إتقان اللغات الأجنبية والمحلية</h3>
                  <button
                    onClick={addLanguage}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/50 px-2.5 py-1 rounded-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف لغة جديدة</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.languages.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={item.language}
                        onChange={(e) => updateLanguage(item.id, 'language', e.target.value)}
                        placeholder="مثال: ภาษาไทย, اللغة الإنجليزية..."
                        className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg flex-1"
                      />
                      <select
                        value={item.level}
                        onChange={(e) => updateLanguage(item.id, 'level', e.target.value)}
                        className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg flex-1"
                      >
                        <option value="اللغة الأم">اللغة الأم (Native)</option>
                        <option value="متقدم / تحدث بطلاقة">متقدم / تحدث بطلاقة (Fluent)</option>
                        <option value="متوسط">متوسط (Intermediate)</option>
                        <option value="مبتدئ">مبتدئ (Beginner)</option>
                      </select>
                      <button
                        onClick={() => removeLanguage(item.id)}
                        className="text-rose-500 hover:bg-rose-50 p-1.5 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4 animate-fade-in text-right">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 font-sans">المشاريع البارزة والمعارض</h3>
                  <button
                    onClick={addProject}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/50 px-2.5 py-1 rounded-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف مشروعاً جديداً</span>
                  </button>
                </div>

                <div className="space-y-4 divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="pt-3 first:pt-0 pb-1.5 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">تفاصيل المشروع البارز:</span>
                        <button onClick={() => removeProject(proj.id)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          placeholder="اسم المشروع"
                          className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                          placeholder="دورك الفردي بالمشروع"
                          className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                        placeholder="رابط المشروع أو الرابط العام"
                        className="text-[11px] py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-left"
                      />

                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="نبذة موجزة..."
                        className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg w-full"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications tab */}
            {activeTab === 'certifications' && (
              <div className="space-y-4 animate-fade-in text-right">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800">العضوية والشهادات المهنية الرائدة</h3>
                  <button
                    onClick={addCertification}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/50 px-2.5 py-1 rounded-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف شهادة جديدة</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="space-y-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          placeholder="اسم الشهادة المهنية"
                          className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg flex-1 mr-1"
                        />
                        <button onClick={() => removeCertification(cert.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                          placeholder="الجهة المانحة"
                          className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg"
                        />
                        <input
                          type="month"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                          className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-left"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Local storage feedback line */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>حفظ تلقائي محلي نشط</span>
            </span>
            <span>آخر تحديث: {new Date(data.updatedAt).toLocaleTimeString('ar-EG')}</span>
          </div>

        </div>

        {/* Real-time CV Print/Live Preview Panel (Right Side) */}
        <div className="lg:col-span-7 space-y-4 sticky top-18">
          
          {/* Strength Professional Gauge & Motivation tips - More Motivating & Beautiful */}
          <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-3xl p-5 text-right text-white relative overflow-hidden shadow-lg">
            <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-radial from-amber-500/5 to-transparent pointer-events-none rounded-r-3xl"></div>
            
            <div className="relative z-10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-400">مقياس قوة وجاهزية سيرتك الذاتية ⚡</h4>
                    <p className="text-[10px] text-slate-350 mt-0.5">معايير احترافية ومؤشرات متوافقة بالكامل مع الـ ATS وجهات التوظيف</p>
                  </div>
                </div>
                <div className="text-left font-sans">
                  <span className="text-xl font-black font-mono text-amber-400">{cvScore}%</span>
                  <span className="text-[9px] text-slate-400 block font-normal">جاهزية الملف</span>
                </div>
              </div>

              {/* Progress Bar with animated gradient */}
              <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-400 transition-all duration-700 rounded-full" 
                  style={{ width: `${cvScore}%` }}
                ></div>
              </div>

              {/* Dynamic Motivating Headline based on score */}
              <div className="text-xs">
                {cvScore < 40 && (
                  <p className="text-indigo-200 font-bold text-[11px] leading-relaxed">
                    ✨ واصل الكتابة يدوياً أو بواسطة <span className="text-amber-400 font-black">تحسينات الذكاء الاصطناعي السحابية ⚡</span> لتأسيس سيرتك المهنية الجذابة بنجاح!
                  </p>
                )}
                {cvScore >= 40 && cvScore < 75 && (
                  <p className="text-indigo-200 font-bold text-[11px] leading-relaxed">
                    🌟 أداء مذهل! خطوت خطوة عملاقة نحو الصدارة. مكملات سيرتك الذاتية تعزز ثقة جهة الاستقطاب فوراً!
                  </p>
                )}
                {cvScore >= 75 && cvScore < 100 && (
                  <p className="text-indigo-200 font-bold text-[11px] leading-relaxed">
                    🔥 جهوزية فتاكة! سيرتك المهنية تتربع على قمة مقاييس الاحترافية. جاهزة الآن للتأثير في المقابلات وسوق العمل.
                  </p>
                )}
                {cvScore === 100 && (
                  <p className="text-emerald-400 font-black text-[11px] leading-relaxed flex items-center gap-1">
                    🎉 مبروك! سيرتك الذاتية متكاملة ومصاغة بأعلى المعايير وقوانين التوظيف الشاملة. سدد وطبق لفرصتك فوراً!
                  </p>
                )}
              </div>

              {/* Dynamic Actionable Guidance List */}
              {cvTips.length > 0 && (
                <div className="bg-slate-950/50 border border-slate-800/40 rounded-2xl p-3 space-y-2">
                  <span className="text-[10px] text-slate-450 font-bold block">💡 خطتك المهنية لرفع كفاءة ومطابقة الملف:</span>
                  <ul className="space-y-1.5 text-[10px] text-slate-300">
                    {cvTips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-right">
                        <span className="text-amber-400 shrink-0 font-bold">✦</span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Advanced ATS Smart Analysis & Auditing Widget */}
              <div className="pt-3 border-t border-slate-805/60 mt-1 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-300 font-bold">المستشار التلقائي الشامل لـ ATS:</span>
                  <button
                    type="button"
                    onClick={runATSAnalysisAI}
                    disabled={isAnalyzingATS}
                    className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 disabled:opacity-50 text-slate-950 hover:opacity-95 text-[9.5px] font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    {isAnalyzingATS ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                        <span>جاري فحص ATS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-slate-950" />
                        <span>تحليل ATS بالذكاء الاصطناعي ⚡</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Instant checklist (Always showing real-time feedback from client side) */}
                <div className="grid grid-cols-2 gap-2 text-[9.5px] bg-slate-950/45 p-2 rounded-xl border border-slate-800/40">
                  <div className="flex items-center gap-1 text-slate-300">
                    {data.personalInfo.email && data.personalInfo.phone ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : (
                      <span className="text-rose-400 font-bold">✗</span>
                    )}
                    <span>معلومات الاتصال</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-200">
                    {data.workExperience && data.workExperience.length > 0 ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : (
                      <span className="text-rose-400 font-bold">✗</span>
                    )}
                    <span>الخبرة المهنية</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-200">
                    {data.skills && data.skills.length >= 3 ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : (
                      <span className="text-rose-400 font-bold">✗</span>
                    )}
                    <span>كثافة الكلمات ({data.skills.length})</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-200">
                    {data.templateId !== 'creative' && data.templateId !== 'bento' && data.templateId !== 'modern' && data.templateId !== 'compact' ? (
                      <span className="text-emerald-400 font-bold">✓ متوافق</span>
                    ) : (
                      <span className="text-amber-400 font-bold">! قالب مرن</span>
                    )}
                    <span>تخطيط ATS</span>
                  </div>
                </div>
                {/* If we have atsResult, show it beautifully! */}
                {showATSPanel && atsResult && (
                  <div className="bg-slate-950/95 border border-amber-500/20 rounded-2xl p-4 space-y-3.5 text-right mt-3 text-white transition-all duration-300 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                        <span className="text-[11px] font-black">تقرير ملاءمة ATS الذكي ⚖️</span>
                      </div>
                      <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-amber-400 font-black rounded-lg">
                        النتيجة: {atsResult.score}%
                      </span>
                    </div>

                    {/* Strengths */}
                    {atsResult.strengths?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold block">🟢 نقاط القوة البرمجية الفتاكة:</span>
                        <ul className="space-y-1 text-[9.5px] text-slate-300 list-inside pr-1">
                          {atsResult.strengths.slice(0, 3).map((str, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-500">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {atsResult.missingKeywords?.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-amber-400 font-bold block">🔥 كلمات دلالية فنية موصى بها (انقر لزرعها بموقع مهاراتك ⚡):</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {atsResult.missingKeywords.map((word, i) => (
                            <button
                              key={i} 
                              type="button"
                              onClick={() => {
                                if (!data.skills.includes(word)) {
                                  setData(prev => ({
                                    ...prev,
                                    skills: [...prev.skills, word],
                                    updatedAt: new Date().toISOString()
                                  }));
                                  addToast(`تم زرع الكلمة المفتاحية "${word}" بنجاح في مهاراتك لمطابقة ATS!`, 'success');
                                } else {
                                  addToast('هذه الكلمة مضافة بالفعل في المهام.', 'info');
                                }
                              }}
                              className="text-[9px] px-2 py-1 bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-slate-300 rounded-lg cursor-pointer transition-all hover:text-white flex items-center gap-0.5"
                              title="انقر لزرع هذه المهارة الكلمة في السيرة"
                            >
                              <span className="text-amber-400 font-bold">+</span>
                              <span>{word}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Structure Issues */}
                    {atsResult.structureIssues?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-rose-400 font-bold block">⚠️ الملاحظات الهيكلية والتسلسلية (إصدار ATS):</span>
                        <ul className="space-y-1 text-[9.5px] text-slate-300 list-inside pr-1">
                          {atsResult.structureIssues.slice(0, 3).map((issue, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-rose-500">•</span>
                              <span className="leading-relaxed">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Summary feedback */}
                    {atsResult.summaryFeedback && (
                      <div className="bg-slate-900/60 p-2.5 text-[9px] text-slate-300 border-r-2 border-amber-500 rounded-lg leading-relaxed">
                        <strong className="text-amber-400 block mb-0.5">💡 تغذية راجعة لملخصك:</strong>
                        {atsResult.summaryFeedback}
                      </div>
                    )}

                    {/* Formatting tips */}
                    {atsResult.formattingTips?.length > 0 && (
                      <div className="border-t border-slate-800 pt-2 text-[9px] text-slate-450 space-y-1 leading-normal">
                        <strong className="text-slate-300 block">💡 نصائح التنسيق العام لـ ATS:</strong>
                        <ul className="space-y-1 pr-1">
                          {atsResult.formattingTips.slice(0, 2).map((tip, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-indigo-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowATSPanel(false)}
                      className="w-full py-1.5 text-center bg-slate-900 hover:bg-slate-850 hover:text-slate-100 text-[9px] font-black text-slate-400 rounded-lg cursor-pointer transition-all border border-slate-800"
                    >
                      إغلاق تقرير التحليل المؤقت
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Zoom & Template Controls */}
          <div className="bg-white px-4 py-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Ready Templates selection buttons & gallery trigger */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowTemplatesGallery(true)}
                  className="text-[11px] px-3.5 py-1.5 rounded-xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-sm hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>معرض القوالب والتصاميم الجاهزة 🎨</span>
                  <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-mono">7</span>
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <span className="text-[9.5px] font-black text-slate-400">سريع:</span>
                
                {/* Minimalist */}
                <button
                  type="button"
                  onClick={() => {
                    setData(prev => ({ ...prev, templateId: 'minimalist' }));
                    addToast('تم تفعيل قالب كلاسيكي النظيف!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${data.templateId === 'minimalist' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  كلاسيكي
                </button>

                {/* Corporate */}
                <button
                  type="button"
                  onClick={() => {
                    setData(prev => ({ ...prev, templateId: 'corporate' }));
                    addToast('تم تفعيل قالب المهني التنفيذي!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${data.templateId === 'corporate' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  تنفيذي
                </button>

                {/* Classic */}
                <button
                  type="button"
                  onClick={() => {
                    setData(prev => ({ ...prev, templateId: 'classic' }));
                    addToast('تم تفعيل قالب كلاسيكي عتيق!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${data.templateId === 'classic' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  تقليدي ورقي
                </button>

                {/* Compact */}
                <button
                  type="button"
                  onClick={() => {
                    setData(prev => ({ ...prev, templateId: 'compact' }));
                    addToast('تم تفعيل قالب جازم ومكثف!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${data.templateId === 'compact' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  مكثف
                </button>

                {/* Modern */}
                <button
                  type="button"
                  onClick={() => {
                    setData(prev => ({ ...prev, templateId: 'modern' }));
                    addToast('تم تفعيل قالب حديث وعصري!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${data.templateId === 'modern' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  عصري
                </button>

                {/* Creative */}
                <button
                  type="button"
                  onClick={() => {
                    const hasAccess = currentUser?.isSubscribed || currentUser?.unlockedTemplates?.includes('creative');
                    if (!hasAccess) {
                      if (onOpenPremiumModal) {
                        onOpenPremiumModal('creative');
                      } else {
                        addToast('قالب الإبداعي هو قالب متميز يتطلب التفعيل 💎', 'info');
                      }
                      return;
                    }
                    setData(prev => ({ ...prev, templateId: 'creative' }));
                    addToast('تم تفعيل قالب الإبداعي الحديث!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-0.5 ${data.templateId === 'creative' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  <span>إبداعي</span>
                  {!(currentUser?.isSubscribed || currentUser?.unlockedTemplates?.includes('creative')) && <span className="opacity-80 text-[8px]">💎</span>}
                </button>

                {/* Bento */}
                <button
                  type="button"
                  onClick={() => {
                    const hasAccess = currentUser?.isSubscribed || currentUser?.unlockedTemplates?.includes('bento');
                    if (!hasAccess) {
                      if (onOpenPremiumModal) {
                        onOpenPremiumModal('bento');
                      } else {
                        addToast('قالب بانتو هو قالب متميز يتطلب التفعيل 💎', 'info');
                      }
                      return;
                    }
                    setData(prev => ({ ...prev, templateId: 'bento' }));
                    addToast('تم تفعيل قالب بانتو المستقبلي العصري!', 'info');
                  }}
                  className={`text-[9.5px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-0.5 ${data.templateId === 'bento' ? 'bg-slate-900 border-slate-900 text-white shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  <span>بانتو</span>
                  {!(currentUser?.isSubscribed || currentUser?.unlockedTemplates?.includes('bento')) && <span className="opacity-80 text-[8px]">💎</span>}
                </button>
              </div>

              {/* Enhanced Zoom slider with Quick Fit Preset Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-100 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => { setZoom(0.65); addToast('تم ملائمة السيرة الذاتية كاملة في الشاشة 📄', 'info'); }}
                  className={`text-[9px] px-2 py-1 rounded-xl font-black transition-all cursor-pointer ${zoom === 0.65 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="عرض الورقة بالكامل"
                >
                  الصفحة كاملة 📄
                </button>
                <button
                  type="button"
                  onClick={() => { setZoom(0.85); addToast('تم ضبط عرض الورقة الذكي المتكامل 🖥️', 'info'); }}
                  className={`text-[9px] px-2 py-1 rounded-xl font-black transition-all cursor-pointer ${zoom === 0.85 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="ملائمة الشاشة عريض"
                >
                  عريض 🖥️
                </button>
                <button
                  type="button"
                  onClick={() => { setZoom(1); addToast('تم العودة للحجم الحقيقي للطباعة 🖨️', 'info'); }}
                  className={`text-[9px] px-2 py-1 rounded-xl font-black transition-all cursor-pointer ${zoom === 1 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="الحجم الأصلي 100%"
                >
                  100% 🖨️
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1"></div>

                <button
                  onClick={() => setZoom(Math.max(0.4, zoom - 0.05))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3 text-slate-600" />
                </button>
                <span className="text-[10px] font-mono font-black text-slate-700 min-w-[32px] text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(Math.min(1.5, zoom + 0.05))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Micro-Interaction Theme Presets Grid */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-3 text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-500">اختر السمة واللون:</span>
                <div className="flex items-center gap-2">
                  {[
                    { id: '#2563eb', name: 'أزرق ملكي', bg: 'bg-blue-600' },
                    { id: '#059669', name: 'أخضر زمردي', bg: 'bg-emerald-600' },
                    { id: '#7c3aed', name: 'بنفسجي إبداعي', bg: 'bg-purple-600' },
                    { id: '#e11d48', name: 'عنابي دافئ', bg: 'bg-rose-600' },
                    { id: '#d97706', name: 'ذهبي كهرماني', bg: 'bg-amber-600' },
                    { id: '#334155', name: 'رمادي كربوني', bg: 'bg-slate-705' }
                  ].map((preset) => {
                    const isSelected = (data.colorTheme || '#2563eb') === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setData(prev => ({ ...prev, colorTheme: preset.id }));
                          addToast(`تم تطبيق لون السمة: ${preset.name}`, 'success');
                        }}
                        className={`w-5 h-5 rounded-full ${preset.bg} cursor-pointer relative shadow-sm hover:scale-120 transition-all duration-150 ${isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : 'opacity-85'}`}
                        title={preset.name}
                      >
                        {isSelected && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                💡 تغيير اللون يحدث حياً وبحركة انتقالية ناعمة
              </div>
            </div>

          </div>

          {/* Interactive Document Sheets wrapper with wood/slate-desk border & real-time live typing tag */}
          <div className="overflow-x-auto p-6 bg-slate-900 rounded-3xl border border-slate-700 max-h-[850px] overflow-y-auto shadow-inner relative flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center mb-4 text-right px-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>جاري الرصد والمزامنة الحية ✍️</span>
              </span>
              <span className="text-[10px] text-slate-450 font-medium">ورقة المقاس الموحد: A4 القياسية</span>
            </div>

            {/* Dynamic Sized Scaling Wrapper to completely solve whitespace gaps or floating bounds */}
            <div 
              className="relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden bg-slate-950 flex justify-center items-start mx-auto border border-slate-800"
              style={{
                width: `${794 * zoom}px`,
                height: `${1123 * zoom}px`,
              }}
            >
              {/* Sheet Page */}
              <div
                id="resume-print-area"
                className="bg-white p-12 w-[794px] min-h-[1123px] absolute top-0 left-0 origin-top-left transition-all duration-300 text-right select-text selection:bg-amber-100 selection:text-amber-900"
                style={{
                  transform: `scale(${zoom})`,
                  fontSize: '13px',
                  direction: 'rtl',
                  fontFamily: 'Cairo, Inter, system-ui, -apple-system, sans-serif'
                }}
              >
              
               {/* MINIMALIST TEMPLATE */}
               {data.templateId === 'minimalist' && (
                 <div className="space-y-6 text-slate-800 transition-all duration-300">
                   {/* Title and Top Section */}
                   <div className="border-b-2 pb-4 text-center" style={{ borderBottomColor: getThemeColor() + '40' }}>
                     <h1 className="text-2xl font-black text-slate-900 leading-none">{data.personalInfo.name || 'الاسم الكامل'}</h1>
                     <p className="text-sm font-bold mt-1" style={{ color: getThemeColor() }}>{data.personalInfo.title || 'المسمى الوظيفي المطلوب'}</p>
                     
                     {/* Compact address */}
                     <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-slate-400 font-semibold mt-3">
                       <span>البريد: {data.personalInfo.email || '-'}</span>
                       <span>•</span>
                       <span style={{ direction: 'ltr' }}>هاتف: {data.personalInfo.phone || '-'}</span>
                       <span>•</span>
                       <span>الموقع: {data.personalInfo.location || '-'}</span>
                     </div>
 
                     <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-450 font-mono mt-1">
                       {data.personalInfo.website && <span>موقع: {data.personalInfo.website}</span>}
                       {data.personalInfo.github && <span>Github: {data.personalInfo.github}</span>}
                       {data.personalInfo.linkedin && <span>Linkedin: {data.personalInfo.linkedin}</span>}
                     </div>
                   </div>
 
                   {/* Summary */}
                   {data.summary && (
                     <div className="space-y-1.5">
                       <h3 className="text-xs font-black text-slate-900 pr-2 uppercase tracking-wider" style={{ borderRight: `4px solid ${getThemeColor()}` }}>الملخص المهني</h3>
                       <p className="text-xs leading-relaxed text-slate-600 text-justify whitespace-pre-line">{data.summary}</p>
                     </div>
                   )}
 
                   {/* Experience */}
                   {data.workExperience.length > 0 && (
                     <div className="space-y-3">
                       <h3 className="text-xs font-black text-slate-900 pr-2 uppercase tracking-wider" style={{ borderRight: `4px solid ${getThemeColor()}` }}>الخبرات المهنية</h3>
                        <div className="space-y-3.5">
                          {data.workExperience.map((item) => (
                            <div key={item.id} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <strong className="font-extrabold text-slate-900">{item.position} | {item.company}</strong>
                                <span className="text-[11px] text-slate-500 font-semibold">
                                  {item.startDate} ── {item.current ? 'حتى الآن' : item.endDate}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed text-slate-600 text-justify whitespace-pre-line">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {data.education.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-slate-900 pr-2 uppercase tracking-wider" style={{ borderRight: `4px solid ${getThemeColor()}` }}>التعليم والتحصيل العلمي</h3>
                        <div className="space-y-2.5">
                          {data.education.map((edu) => (
                            <div key={edu.id} className="text-xs">
                              <div className="flex justify-between items-center">
                                <strong className="font-bold text-slate-900">{edu.degree} - {edu.field}</strong>
                                <span className="text-[11px] text-slate-500">{edu.startDate} – {edu.endDate}</span>
                              </div>
                              <p className="text-slate-600 text-[11px]">{edu.school} {edu.description && `├── ${edu.description}`}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Tag block unified */}
                    {data.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-black text-slate-900 pr-2 uppercase tracking-wider" style={{ borderRight: `4px solid ${getThemeColor()}` }}>المهارات والقدرات الكلية</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {data.skills.map((skill, idx) => (
                            <span key={idx} className="border text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ borderColor: getThemeColor() + '40', color: getThemeColor(), backgroundColor: getThemeColor() + '05' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Double split for Languages and Projects */}
                    <div className="grid grid-cols-2 gap-6 items-start">
                      {/* Languages */}
                      {data.languages.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-black text-slate-900 pr-2" style={{ borderRight: `4px solid ${getThemeColor()}` }}>ألسنة ولغات</h3>
                          <div className="space-y-1 text-xs text-slate-600">
                            {data.languages.map((l) => (
                              <div key={l.id} className="flex justify-between">
                                <span>{l.language}</span>
                                <span className="text-[10px] font-bold" style={{ color: getThemeColor() }}>{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications or projects */}
                      {data.certifications.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-black text-slate-900 pr-2" style={{ borderRight: `4px solid ${getThemeColor()}` }}>العضويات والأوراق</h3>
                          <div className="space-y-1 text-xs text-slate-600">
                            {data.certifications.map((c) => (
                              <div key={c.id} className="flex justify-between">
                                <span>{c.name} ({c.issuer})</span>
                                <span className="text-[10px] text-slate-400">{c.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

               {/* CORPORATE TEMPLATE */}
               {data.templateId === 'corporate' && (
                 <div className="grid grid-cols-12 gap-6 text-slate-800 h-full transition-all duration-300">
                   
                   {/* Dynamic Left sidebar block with theme gradient */}
                   <div className="col-span-4 text-white p-5 rounded-2xl space-y-5 text-right flex flex-col justify-between" style={{ background: `linear-gradient(145deg, ${getThemeColor()}, #0f172a)` }}>
                     <div>
                       {/* Name placeholder in sidebar */}
                       <div className="border-b border-white/10 pb-4 mb-4">
                         <h2 className="text-lg font-black leading-snug">{data.personalInfo.name || 'الاسم الكامل'}</h2>
                         <span className="text-[11px] font-mono block mt-1" style={{ color: getThemeColor() === '#334155' ? '#cbd5e1' : '#bfdbfe' }}>{data.personalInfo.title || 'المسمى الوظيفي'}</span>
                       </div>
 
                       {/* Info details */}
                       <div className="space-y-3.5 text-xs text-slate-200">
                         <h3 className="text-[10px] tracking-widest font-bold text-white uppercase opacity-60">بيانات الاتصال</h3>
                          <p className="break-all">📧 {data.personalInfo.email || '-'}</p>
                          <p style={{ direction: 'ltr' }}>📱 {data.personalInfo.phone || '-'}</p>
                          <p>📍 {data.personalInfo.location || '-'}</p>
                          {data.personalInfo.website && <p className="text-[11px] font-mono break-all text-blue-100">🔗 {data.personalInfo.website}</p>}
                        </div>

 
                       {/* Skills List in sidebar */}
                       {data.skills.length > 0 && (
                         <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
                           <h3 className="text-[10px] font-bold text-white uppercase opacity-65">القدرات الرئيسية</h3>
                           <div className="flex flex-wrap gap-1">
                             {data.skills.map((skill, index) => (
                               <span key={index} className="bg-white/10 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                                 {skill}
                               </span>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
 
                     {/* Logo tag */}
                     <div className="text-[9px] text-slate-400 font-mono text-center">
                       صُنع بنظام EasyCVMaker المعتمد
                     </div>
                   </div>
 
                   {/* Detailed right column */}
                   <div className="col-span-8 space-y-6 text-right">
                     {/* Summary */}
                     {data.summary && (
                       <div className="space-y-2">
                         <h3 className="text-xs font-black pb-1 border-b-2 uppercase tracking-wide" style={{ color: getThemeColor(), borderBottomColor: getThemeColor() }}>بيان ملخص مهني</h3>
                         <p className="text-xs leading-relaxed text-slate-655 text-justify">{data.summary}</p>
                       </div>
                     )}
 
                     {/* Work experiences */}
                     {data.workExperience.length > 0 && (
                       <div className="space-y-3">
                         <h3 className="text-xs font-black pb-1 border-b-2 uppercase" style={{ color: getThemeColor(), borderBottomColor: getThemeColor() }}>الخلفية المهنية</h3>
                          <div className="space-y-3.5">
                            {data.workExperience.map((item) => (
                              <div key={item.id} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-extrabold text-slate-900">{item.company} ── {item.position}</span>
                                  <span className="text-[10px] font-bold text-slate-400">({item.startDate} — {item.current ? 'حتى الآن' : item.endDate})</span>
                                </div>
                                <p className="text-xs text-slate-600 text-justify leading-relaxed">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {data.education.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-black pb-1 border-b-2 uppercase" style={{ color: getThemeColor(), borderBottomColor: getThemeColor() }}>المؤهلات وتحصيل العلوم</h3>
                          {data.education.map((edu) => (
                            <div key={edu.id} className="text-xs">
                              <div className="flex justify-between">
                                <span className="font-bold text-slate-900">{edu.school} ── {edu.degree}</span>
                                <span className="text-[10px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
                              </div>
                              <span className="text-[11px] block text-slate-500">{edu.field} {edu.description && `── ${edu.description}`}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Projects list */}
                      {data.projects.length > 0 && (
                        <div className="space-y-2 border-t border-slate-50 pt-3">
                          <h3 className="text-xs font-black pb-1 border-b-2 uppercase" style={{ color: getThemeColor(), borderBottomColor: getThemeColor() }}>مشاريع بارزة وتطبيقات</h3>
                          {data.projects.map((proj) => (
                            <div key={proj.id} className="text-xs">
                              <strong className="text-slate-800">{proj.name} ({proj.role})</strong>
                              <p className="text-[11px] text-slate-655 leading-relaxed mt-0.5">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {data.templateId === 'bento' && (
                <div className="space-y-4 text-slate-800 h-full text-right transition-all duration-300" style={{ direction: 'rtl' }}>
                  {/* Grid Layout Row 1: Header / Personal details & summary */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Header Details Card */}
                    <div className="col-span-8 text-white p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${getThemeColor()}, #0f172a)` }}>
                      <div className="relative z-10 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full text-[9px] font-bold text-blue-200 mb-1.5">
                          💼 الملف الشخصي الرقمي المختار
                        </span>
                        <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none">{data.personalInfo.name || 'الاسم الكامل'}</h1>
                        <p className="text-[11px] font-bold opacity-90 mt-1" style={{ color: getThemeColor() === '#334155' ? '#cbd5e1' : '#bfdbfe' }}>{data.personalInfo.title || 'المسمى المطلوب'}</p>
                      </div>

                      <div className="relative z-10 grid grid-cols-2 gap-2 text-[10px] text-slate-200 border-t border-white/10 mt-3 pt-2 text-right">
                        <p className="truncate">📧 البريد: {data.personalInfo.email || '-'}</p>
                        <p className="truncate" style={{ direction: 'ltr' }}>📱 هاتف: {data.personalInfo.phone || '-'}</p>
                        <p className="truncate">📍 العنوان: {data.personalInfo.location || '-'}</p>
                        {data.personalInfo.website && <p className="truncate">🔗 موقع: {data.personalInfo.website}</p>}
                      </div>
                      
                      <div className="absolute left-2 top-2 opacity-5 animate-pulse text-indigo-300 font-bold leading-relaxed">
                        <Sparkles className="w-16 h-16 pointer-events-none" />
                      </div>
                    </div>

                    {/* Summary Brief Bento Card */}
                    <div className="col-span-4 p-4 rounded-2xl flex flex-col justify-between shadow-2xs text-right border" style={{ borderColor: getThemeColor() + '20', backgroundColor: getThemeColor() + '05' }}>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: getThemeColor() }}>الخلاصة والهدف</span>
                        <p className="text-[10px] leading-relaxed text-slate-700 mt-1 text-justify line-clamp-5 whitespace-pre-line">{data.summary || 'اكتب ملخصاً مهنياً معبراً لإبراز تخصصك وقيمتك المضافة هنا لتقديرها عاجلاً.'}</p>
                      </div>
                      <span className="text-[9px] font-bold mt-1 block" style={{ color: getThemeColor() }}>حالة ملف ATS: معتمد وذكي</span>
                    </div>
                  </div>

                  {/* Grid Layout Row 2: Experience is prioritized in a large Bento Card */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Main Experience Box */}
                    <div className="col-span-8 bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-2xs text-right">
                      <h3 className="text-xs font-black text-slate-900 pr-2 pb-0.5" style={{ borderRight: `4px solid ${getThemeColor()}` }}>الخبرات والمسار المهني</h3>
                      
                      {data.workExperience.length > 0 ? (
                        <div className="space-y-3.5 text-right">
                          {data.workExperience.map((work) => (
                            <div key={work.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                              <div className="flex justify-between font-extrabold text-slate-900 mb-0.5">
                                <span>{work.position} — <span style={{ color: getThemeColor() }}>{work.company}</span></span>
                                <span className="text-[10px] text-slate-400 font-bold">{work.startDate} – {work.current ? 'الآن' : work.endDate}</span>
                              </div>
                              <p className="text-[11px] text-slate-605 leading-relaxed text-justify whitespace-pre-line">{work.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">لم يتم إضافة خبرات مهنية بعد. اضغط تعديل لإضافة مسيرتك هنا.</p>
                      )}
                    </div>

                    {/* Right column: Skills and Languages in elegant Bento boxes */}
                    <div className="col-span-4 space-y-4 flex flex-col justify-between text-right">
                      {/* Skills Box with dynamic styling */}
                      <div className="border p-4 rounded-2xl flex-1 shadow-2xs" style={{ backgroundColor: getThemeColor() + '05', borderColor: getThemeColor() + '20' }}>
                        <h4 className="text-xs font-black mb-2.5 pr-2" style={{ borderRight: `4px solid ${getThemeColor()}`, color: getThemeColor() }}>القدرات والمهارات</h4>
                        {data.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {data.skills.map((skill, index) => (
                              <span key={index} className="bg-white border font-bold text-[9px] px-2 py-0.5 rounded-lg shadow-3xs" style={{ borderColor: getThemeColor() + '15', color: getThemeColor() }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400">لا توجد مهارات مدخلة</p>
                        )}
                      </div>

                      {/* Languages Box */}
                      {data.languages.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl shadow-2xs text-right">
                          <h4 className="text-xs font-black text-slate-805 mb-2 pr-2" style={{ borderRight: `4px solid ${getThemeColor()}` }}>اللغات والمستويات</h4>
                          <div className="space-y-1.5">
                            {data.languages.map((l) => (
                              <div key={l.id} className="text-[10px] text-slate-600 flex justify-between items-center bg-white px-2 py-0.5 rounded border border-slate-100">
                                <span className="font-bold">{l.language}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded" style={{ color: getThemeColor(), backgroundColor: getThemeColor() + '10' }}>{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grid Layout Row 3: Education, Projects, Certifications side-by-side */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Education Box */}
                    <div className="col-span-6 bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs text-right">
                      <h4 className="text-xs font-black text-slate-900 pr-2 mb-2" style={{ borderRight: `4px solid ${getThemeColor()}` }}>التحصيل الدراسي والتدريب</h4>
                      {data.education.length > 0 ? (
                        <div className="space-y-2.5">
                          {data.education.map((edu) => (
                            <div key={edu.id} className="text-xs">
                              <div className="flex justify-between font-bold text-slate-850 mb-0.5">
                                <span>{edu.school}</span>
                                <span className="text-[10px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
                              </div>
                              <span className="block text-[11px] text-slate-500 font-medium">{edu.degree} في {edu.field}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-2">لا توجد سجلات دراسية بعد.</p>
                      )}
                    </div>

                    {/* Projects and Certifications box combined */}
                    <div className="col-span-6 bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs text-right">
                      <h4 className="text-xs font-black text-slate-900 pr-2 mb-2" style={{ borderRight: `4px solid ${getThemeColor()}` }}>المشاريع البارزة والعضويات</h4>
                      {data.projects.length > 0 || data.certifications.length > 0 ? (
                        <div className="space-y-2.5 limit-bento-scroll max-h-[140px] overflow-y-auto pr-1">
                          {data.projects.map((proj) => (
                            <div key={proj.id} className="text-[11px] border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center">
                                <strong className="text-slate-800 text-xs font-bold">{proj.name}</strong>
                                <span className="text-[9px] font-semibold" style={{ color: getThemeColor() }}>{proj.role}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{proj.description}</p>
                            </div>
                          ))}
                          
                          {data.certifications.map((cert) => (
                            <div key={cert.id} className="text-[11px] flex justify-between items-center text-right">
                              <span className="text-slate-700 font-medium">📜 {cert.name} ({cert.issuer})</span>
                              <span className="text-[10px] text-slate-400">{cert.date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-2">لم يتم إضافة مشاريع أو شهادات اعتماد مهني حالية.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CLASSIC TEMPLATE */}
              {data.templateId === 'classic' && (
                <div className="space-y-5 text-slate-900 transition-all duration-300 leading-relaxed text-right pr-1">
                  {/* Centered Academic Header */}
                  <div className="text-center border-b-2 pb-3" style={{ borderColor: getThemeColor() }}>
                    <h1 className="text-xl sm:text-2xl font-black tracking-normal text-slate-955 mb-1">{data.personalInfo.name || 'الاسم الكامل'}</h1>
                    <p className="text-xs font-bold tracking-wide mb-2" style={{ color: getThemeColor() }}>{data.personalInfo.title || 'المسمى الأكاديمي / الإداري المستهدف'}</p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2.5 text-[10.5px] text-slate-600 font-medium font-sans">
                      <span>📧 {data.personalInfo.email || '-'}</span>
                      <span>•</span>
                      <span style={{ direction: 'ltr' }}>📱 {data.personalInfo.phone || '-'}</span>
                      <span>•</span>
                      <span>📍 {data.personalInfo.location || '-'}</span>
                      {data.personalInfo.website && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-semibold">🔗 {data.personalInfo.website}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary Section */}
                  {data.summary && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-955 flex items-center justify-start gap-1">
                        <span className="w-1.5 h-3 inline-block" style={{ backgroundColor: getThemeColor() }}></span>
                        <span>الملخص المهني والوقار الأكاديمي</span>
                      </h2>
                      <p className="text-xs text-slate-750 leading-relaxed text-justify whitespace-pre-line pr-2">{data.summary}</p>
                    </div>
                  )}

                  {/* Work Experience */}
                  {data.workExperience?.length > 0 && (
                    <div className="space-y-2.5">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-955 flex items-center justify-start gap-1">
                        <span className="w-1.5 h-3 inline-block" style={{ backgroundColor: getThemeColor() }}></span>
                        <span>السجل الوظيفي والخبرات العملية</span>
                      </h2>
                      <div className="space-y-3.5 pr-2">
                        {data.workExperience.map((item) => (
                          <div key={item.id} className="space-y-1 border-r border-slate-100 pr-2.5">
                            <div className="flex justify-between items-center text-xs">
                              <strong className="font-black text-slate-900">{item.position} | {item.company}</strong>
                              <span className="text-[10px] text-slate-500 font-bold">
                                {item.startDate} — {item.current ? 'حتى الآن' : item.endDate}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {data.education?.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-955 flex items-center justify-start gap-1">
                        <span className="w-1.5 h-3 inline-block" style={{ backgroundColor: getThemeColor() }}></span>
                        <span>التحصيل الأكاديمي والدرجات العلمية</span>
                      </h2>
                      <div className="space-y-3 pr-2">
                        {data.education.map((edu) => (
                          <div key={edu.id} className="text-xs flex justify-between items-start border-r border-slate-100 pr-2.5">
                            <div>
                              <strong className="text-slate-900 font-bold block">{edu.degree} في {edu.field}</strong>
                              <span className="text-[11px] text-slate-550 block">{edu.school} {edu.description && `── ${edu.description}`}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">{edu.startDate} – {edu.endDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills & Languages split row */}
                  <div className="grid grid-cols-12 gap-5 pt-1">
                    {/* Skills list block */}
                    {data.skills?.length > 0 && (
                      <div className="col-span-8 space-y-1.5">
                        <h3 className="text-xs font-black text-slate-955 uppercase tracking-wider flex items-center justify-start gap-1">
                          <span className="w-1.5 h-3 inline-block" style={{ backgroundColor: getThemeColor() }}></span>
                          <span>الكفايات الفنية والمهارات الرئيسية</span>
                        </h3>
                        <div className="flex flex-wrap gap-1.5 pr-2">
                          {data.skills.map((skill, idx) => (
                            <span key={idx} className="border text-[9.5px] font-bold px-2 py-0.5 rounded-sm" style={{ borderColor: getThemeColor() + '20', color: getThemeColor(), backgroundColor: getThemeColor() + '03' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages list sidebar */}
                    {data.languages?.length > 0 && (
                      <div className="col-span-4 space-y-2 mt-4 font-sans text-right">
                        <h4 className="text-[11px] font-black text-slate-850 uppercase tracking-widest pb-1 border-b border-slate-205" style={{ color: getThemeColor() }}>التواصل واللغات 🗣️</h4>
                        <div className="space-y-1.5">
                          {data.languages.map((l) => (
                            <div key={l.id} className="text-[10px] text-slate-655 flex justify-between items-center bg-white border border-slate-100 p-1.5 rounded-lg">
                              <span className="font-bold">{l.language}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded" style={{ color: getThemeColor(), backgroundColor: getThemeColor() + '10' }}>{l.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications sidebar */}
                    {data.certifications?.length > 0 && (
                      <div className="space-y-2 mt-4 font-sans text-right">
                        <h4 className="text-[11px] font-black text-slate-805 uppercase tracking-widest pb-1 border-b border-slate-205" style={{ color: getThemeColor() }}>شهادات مهنية 📜</h4>
                        <div className="space-y-1.5 text-[9.5px] text-slate-605">
                          {data.certifications.map((c) => (
                            <div key={c.id} className="border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                              <p className="font-bold text-slate-755">{c.name}</p>
                              <span className="text-slate-400 block text-[8.5px]">{c.issuer} — {c.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COMPACT TEMPLATE */}
              {data.templateId === 'compact' && (
                <div className="space-y-3.5 text-slate-800 transition-all duration-300 leading-tight text-right font-sans pr-1">
                  {/* Compact High-Density Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between border-b pb-1.5 z-10 relative" style={{ borderColor: getThemeColor() }}>
                    <div>
                      <h1 className="text-lg font-black text-slate-900 leading-none">{data.personalInfo.name || 'الاسم الكامل'}</h1>
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: getThemeColor() }}>{data.personalInfo.title || 'المسمى المطلوب'}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center sm:justify-end gap-1.5 text-[9px] text-slate-505 font-semibold mt-1 sm:mt-0 max-w-sm">
                      <span>📧 {data.personalInfo.email || '-'}</span>
                      <span>|</span>
                      <span style={{ direction: 'ltr' }}>📱 {data.personalInfo.phone || '-'}</span>
                      <span>|</span>
                      <span>📍 {data.personalInfo.location || '-'}</span>
                      {data.personalInfo.website && (
                        <>
                          <span>|</span>
                          <span>🔗 {data.personalInfo.website}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Compact Summary */}
                  {data.summary && (
                    <div className="space-y-0.5">
                      <h3 className="text-[10px] font-black uppercase text-slate-955 border-r-2 pr-1.5" style={{ borderColor: getThemeColor() }}>الملخص المهني</h3>
                      <p className="text-[10px] leading-snug text-slate-655 text-justify whitespace-pre-line">{data.summary}</p>
                    </div>
                  )}

                  {/* Compact Work Experience */}
                  {data.workExperience?.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase text-slate-955 border-r-2 pr-1.5" style={{ borderColor: getThemeColor() }}>الخبرات المهنية المكثفة</h3>
                      <div className="space-y-2">
                        {data.workExperience.map((item) => (
                          <div key={item.id} className="space-y-0.5">
                            <div className="flex justify-between items-center text-[10px]">
                              <strong className="font-extrabold text-slate-900">{item.position} | {item.company}</strong>
                              <span className="text-[9px] text-slate-505 font-bold">
                                {item.startDate} — {item.current ? 'حتى الآن' : item.endDate}
                              </span>
                            </div>
                            <p className="text-[9.5px] leading-relaxed text-slate-600 text-justify whitespace-pre-line pl-1">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compact Education */}
                  {data.education?.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase text-slate-955 border-r-2 pr-1.5" style={{ borderColor: getThemeColor() }}>التعليم الفني والتحصيل</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {data.education.map((edu) => (
                          <div key={edu.id} className="text-[9.5px] border-r border-slate-100 pr-1.5 flex justify-between items-baseline">
                            <div>
                              <span className="font-black text-slate-800">{edu.degree} - {edu.school}</span>
                              <span className="text-[8.5px] text-slate-400 block -mt-0.5 leading-none">{edu.field}</span>
                            </div>
                            <span className="text-[8.5px] text-slate-400 shrink-0">{edu.startDate} – {edu.endDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compact Skills block */}
                  {data.skills?.length > 0 && (
                    <div className="space-y-1 select-none">
                      <h3 className="text-[10px] font-black uppercase text-slate-955 border-r-2 pr-1.5" style={{ borderColor: getThemeColor() }}>القدرات والمهارات الفنية الكلية</h3>
                      <div className="flex flex-wrap gap-1 pr-1">
                        {data.skills.map((skill, idx) => (
                          <span key={idx} className="border text-[8.5px] font-bold px-1.5 py-0.2 rounded-sm" style={{ borderColor: getThemeColor() + '20', color: getThemeColor(), backgroundColor: getThemeColor() + '02' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compact Languages, Projects, Certifications split row */}
                  <div className="grid grid-cols-3 gap-3.5 pt-1 border-t border-slate-55">
                    {/* Languages */}
                    {data.languages?.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black text-slate-850" style={{ color: getThemeColor() }}>ألسنة ولغات التواصل</h4>
                        <div className="space-y-0.5 text-[9px] text-slate-600 pl-1 font-sans">
                          {data.languages.map((l) => (
                            <div key={l.id} className="flex justify-between border-b border-dashed border-slate-100 pb-0.2">
                              <span>{l.language}</span>
                              <strong className="text-[8.5px]" style={{ color: getThemeColor() }}>{l.level}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {data.projects?.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black text-slate-850" style={{ color: getThemeColor() }}>أبرز المشاريع والتطبيقات</h4>
                        <div className="space-y-0.5 text-[9px] text-slate-600 pl-1">
                          {data.projects.slice(0, 2).map((p) => (
                            <div key={p.id} className="truncate" title={p.name}>
                              <strong className="text-slate-800 block text-[8.5px]">{p.name}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {data.certifications?.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black text-slate-850" style={{ color: getThemeColor() }}>الاعتمادات الكلية</h4>
                        <div className="space-y-0.5 text-[9px] text-slate-600 pl-1">
                          {data.certifications.slice(0, 2).map((c) => (
                            <div key={c.id} className="truncate">
                              <span>📜 {c.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CREATIVE TEMPLATE */}
              {data.templateId === 'creative' && (
                <div className="grid grid-cols-12 gap-5 text-slate-800 transition-all duration-300 h-full text-right" style={{ direction: 'rtl' }}>
                  {/* Left Column (4 cols) - Sidebar style with a warm accent colored frame */}
                  <div className="col-span-4 p-4 rounded-xl flex flex-col justify-between text-right border" style={{ borderColor: getThemeColor() + '20', backgroundColor: getThemeColor() + '06' }}>
                    <div className="space-y-4">
                      {/* Avatar initials fallback badge */}
                      <div className="flex items-center justify-center pt-2">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md" style={{ backgroundColor: getThemeColor() }}>
                          {data.personalInfo.name ? data.personalInfo.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'CV'}
                        </div>
                      </div>

                      {/* Contact Info Group */}
                      <div className="space-y-2 border-b border-dashed pb-3" style={{ borderColor: getThemeColor() + '20' }}>
                        <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wide">بيانات الاتصال 📱</h4>
                        <div className="space-y-1 text-[9.5px] text-slate-600">
                          {data.personalInfo.email && <p className="truncate">📧 {data.personalInfo.email}</p>}
                          {data.personalInfo.phone && <p className="truncate font-sans" style={{ direction: 'ltr' }}>📱 {data.personalInfo.phone}</p>}
                          {data.personalInfo.location && <p className="truncate">📍 {data.personalInfo.location}</p>}
                          {data.personalInfo.website && <p className="truncate font-mono">🔗 {data.personalInfo.website}</p>}
                        </div>
                      </div>

                      {/* Skills section */}
                      {data.skills?.length > 0 && (
                        <div className="space-y-2 border-b border-dashed pb-3" style={{ borderColor: getThemeColor() + '20' }}>
                          <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wide">القدرات والمهارات 🎨</h4>
                          <div className="flex flex-wrap gap-1">
                            {data.skills.map((skill, index) => (
                              <span key={index} className="text-[8.5px] bg-white border font-bold px-2 py-0.5 rounded-full shadow-3xs" style={{ borderColor: getThemeColor() + '15', color: getThemeColor() }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages Section */}
                      {data.languages?.length > 0 && (
                        <div className="space-y-2 border-b border-dashed pb-3" style={{ borderColor: getThemeColor() + '20' }}>
                          <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wide">اللغات والمستويات 🗣️</h4>
                          <div className="space-y-1">
                            {data.languages.map((l) => (
                              <div key={l.id} className="text-[9px] text-slate-600 flex justify-between items-center bg-white px-2 py-0.5 rounded-lg border border-slate-100">
                                <span className="font-bold">{l.language}</span>
                                <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded" style={{ color: getThemeColor(), backgroundColor: getThemeColor() + '10' }}>{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications Section */}
                      {data.certifications?.length > 0 && (
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wide">العضويات والشهادات 📜</h4>
                          <div className="space-y-1 text-[9px] text-slate-600">
                            {data.certifications.map((c) => (
                              <div key={c.id} className="border-b border-slate-100/50 pb-1 last:border-0">
                                <span className="font-bold block">{c.name}</span>
                                <span className="text-[8px] text-slate-400 block">{c.issuer} • {c.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-[8px] font-extrabold mt-2 text-center block" style={{ color: getThemeColor() }}>مصمم بهوية إبداعية مبهجة ✨</span>
                  </div>

                  {/* Right Column (8 cols) - Main creative experience & details */}
                  <div className="col-span-8 bg-white border border-slate-150 p-5 rounded-xl space-y-4 shadow-3xs text-right">
                    {/* Header Banner */}
                    <div className="border-b pb-3" style={{ borderColor: getThemeColor() + '25' }}>
                      <h1 className="text-xl font-black text-slate-900 leading-none">{data.personalInfo.name || 'الاسم الكامل'}</h1>
                      <p className="text-xs font-bold mt-1.5" style={{ color: getThemeColor() }}>{data.personalInfo.title || 'المسمى المطلوب'}</p>
                    </div>

                    {/* Summary */}
                    {data.summary && (
                      <div className="space-y-1">
                        <h3 className="text-[10.5px] font-black uppercase tracking-wider pb-0.5" style={{ color: getThemeColor() }}>نبذة إبداعية مميزة</h3>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 text-justify whitespace-pre-line">{data.summary}</p>
                      </div>
                    )}

                    {/* Experience List */}
                    {data.workExperience?.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <h3 className="text-[10.5px] font-black uppercase tracking-wider pb-0.5" style={{ color: getThemeColor() }}>المسار والخبرات المهنية</h3>
                        <div className="space-y-3">
                          {data.workExperience.map((work) => (
                            <div key={work.id} className="text-xs pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                              <div className="flex justify-between font-extrabold text-slate-900 mb-0.5">
                                <span>{work.position} ── <span style={{ color: getThemeColor() }}>{work.company}</span></span>
                                <span className="text-[9.5px] text-slate-450 font-bold font-sans">{work.startDate} – {work.current ? 'الآن' : work.endDate}</span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-relaxed text-justify whitespace-pre-line">{work.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education and Projects Side by Side */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                      {/* Education */}
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: getThemeColor() }}>التحصيل والتدريب 🎓</h4>
                        {data.education?.length > 0 ? (
                          <div className="space-y-2">
                            {data.education.map((edu) => (
                              <div key={edu.id} className="text-[9.5px]">
                                <strong className="text-slate-800 block font-bold leading-normal">{edu.degree} ── {edu.school}</strong>
                                <span className="text-slate-400 text-[8.5px] font-sans">{edu.startDate} – {edu.endDate} {edu.field && `• ${edu.field}`}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400">لا توجد تفاصيل تعليمية بعد</span>
                        )}
                      </div>

                      {/* Projects */}
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: getThemeColor() }}>مشاريع بارزة 🎯</h4>
                        {data.projects?.length > 0 ? (
                          <div className="space-y-2">
                            {data.projects.map((proj) => (
                              <div key={proj.id} className="text-[9.5px]">
                                <strong className="text-slate-800 block font-bold leading-normal">{proj.name} ({proj.role})</strong>
                                <span className="text-slate-550 text-[8.5px] line-clamp-2 mt-0.5">{proj.description}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400">لا توجد تفاصيل مشروعات بعد</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODERN TEMPLATE */}
              {data.templateId === 'modern' && (
                <div className="space-y-4 text-slate-800 transition-all duration-300 text-right font-sans" style={{ direction: 'rtl' }}>
                  {/* Clean Modern Split Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start border-l-4 pr-3 py-1.5 z-10 relative" style={{ borderLeftColor: getThemeColor(), borderRightColor: 'transparent' }}>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{data.personalInfo.name || 'الاسم الكامل'}</h1>
                      <p className="text-xs font-bold mt-1" style={{ color: getThemeColor() }}>{data.personalInfo.title || 'المسمى المطلوب'}</p>
                    </div>
                    
                    <div className="flex flex-wrap sm:justify-end gap-x-2 text-[10px] text-slate-500 font-semibold mt-2 sm:mt-0 font-sans">
                      <span>📧 {data.personalInfo.email || '-'}</span>
                      <span>|</span>
                      <span style={{ direction: 'ltr' }}>📱 {data.personalInfo.phone || '-'}</span>
                      <span>|</span>
                      <span>📍 {data.personalInfo.location || '-'}</span>
                      {data.personalInfo.website && (
                        <>
                          <span>|</span>
                          <span>🔗 {data.personalInfo.website}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {data.summary && (
                    <div className="space-y-1.5 bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-100 transition-colors">
                      <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                        <span className="w-1 h-3 rounded-full" style={{ backgroundColor: getThemeColor() }}></span>
                        <span>موجز الملخص والمسار المهني</span>
                      </h3>
                      <p className="text-[10.5px] leading-relaxed text-slate-600 text-justify whitespace-pre-line">{data.summary}</p>
                    </div>
                  )}

                  {/* Two Column Layout split for modern view */}
                  <div className="grid grid-cols-12 gap-5 pt-1">
                    {/* Main Experience content (Col spans 8) */}
                    <div className="col-span-8 space-y-4">
                      {/* Experience list */}
                      {data.workExperience?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-black uppercase text-slate-900 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getThemeColor() }}></span>
                            <span>الخبرات والمسؤوليات المهنية</span>
                          </h3>
                          <div className="space-y-3.5 pr-1">
                            {data.workExperience.map((item) => (
                              <div key={item.id} className="relative pr-3 border-r-2 animate-fade-in" style={{ borderRightColor: getThemeColor() + '40' }}>
                                {/* Small absolute timeline dot */}
                                <span className="absolute -right-[6px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: getThemeColor() }}></span>
                                <div className="text-xs font-bold text-slate-850 flex justify-between items-baseline mb-0.5">
                                  <span>{item.position} | <span style={{ color: getThemeColor() }}>{item.company}</span></span>
                                  <span className="text-[9.5px] text-slate-450 font-medium font-sans">({item.startDate} — {item.current ? 'الآن' : item.endDate})</span>
                                </div>
                                <p className="text-[10px] leading-relaxed text-slate-600 text-justify whitespace-pre-line">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Display Education here */}
                      {data.education?.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <h3 className="text-xs font-black uppercase text-slate-900 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getThemeColor() }}></span>
                            <span>التحصيل والمؤهلات الأكاديمية</span>
                          </h3>
                          <div className="space-y-2">
                            {data.education.map((edu) => (
                              <div key={edu.id} className="text-xs">
                                <div className="flex justify-between font-bold text-slate-800">
                                  <span>{edu.school} ── {edu.degree}</span>
                                  <span className="text-[10px] text-slate-450 font-sans font-medium">{edu.startDate} – {edu.endDate}</span>
                                </div>
                                <span className="text-[10px] block text-slate-500 mt-0.5">{edu.field} {edu.description && `── ${edu.description}`}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Left Column (Col spans 4) */}
                    <div className="col-span-4 space-y-4">
                      {/* Skills Box */}
                      {data.skills?.length > 0 && (
                        <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 space-y-2">
                          <h3 className="text-[10.5px] font-black uppercase text-slate-900" style={{ color: getThemeColor() }}>القدرات البرمجية</h3>
                          <div className="flex flex-wrap gap-1">
                            {data.skills.map((skill, idx) => (
                              <span key={idx} className="bg-white border text-[8.5px] font-bold px-1.5 py-0.5 rounded-md hover:shadow-3xs transition-shadow" style={{ borderColor: getThemeColor() + '10', color: getThemeColor() }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects box in sidebar */}
                      {data.projects?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-[10.5px] font-black uppercase text-slate-900 pr-1 border-r-2" style={{ borderRightColor: getThemeColor() }}>مشاريع منجزة 🎯</h3>
                          <div className="space-y-2 pr-1 text-[9.5px]">
                            {data.projects.map((proj) => (
                              <div key={proj.id} className="border-b border-slate-55 pb-1.5 last:border-0 last:pb-0">
                                <strong className="text-slate-850 font-bold block">{proj.name}</strong>
                                <span className="text-slate-450 text-[8px] block mt-0.2">الدور: {proj.role}</span>
                                <p className="text-slate-500 text-[8.5px] mt-0.5 text-justify leading-tight line-clamp-3">{proj.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages box in sidebar */}
                      {data.languages?.length > 0 && (
                        <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 space-y-2">
                          <h3 className="text-[10.5px] font-black uppercase text-slate-905" style={{ color: getThemeColor() }}>ألسنة ولغات</h3>
                          <div className="space-y-1.5">
                            {data.languages.map((l) => (
                              <div key={l.id} className="flex justify-between items-center text-[9.5px]">
                                <span className="font-bold text-slate-700">{l.language}</span>
                                <span className="text-[8.5px] px-1.5 py-0.2 rounded font-bold font-sans" style={{ color: getThemeColor(), backgroundColor: getThemeColor() + '15' }}>{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications box in sidebar */}
                      {data.certifications?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-[10.5px] font-black uppercase text-slate-900 pr-1 border-r-2" style={{ borderRightColor: getThemeColor() }}>الاعتمادات 📜</h3>
                          <div className="space-y-1 text-[8.5px] text-slate-600 pr-1 leading-tight">
                            {data.certifications.map((cert) => (
                              <div key={cert.id} className="border-b border-slate-100/40 pb-1 last:border-0">
                                <span className="font-bold text-slate-800 block">{cert.name}</span>
                                <span className="text-slate-400 text-[7.5px] block">{cert.issuer} • {cert.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              </div>
            </div>
          </div>

          </div>

        </div>

      {/* Styled Browser Print CSS stylesheet injected specifically for seamless window printing */}
      <style>{`
        @media print {
          /* Hide all application components except the document preview */
          body * {
            visibility: hidden;
            background: none !important;
          }
          #resume-print-area, #resume-print-area * {
            visibility: visible;
          }
          #resume-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            transform: none !important;
            box-shadow: none !important;
            border: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Dynamic Export & Print Prompt Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in font-sans text-right" style={{ direction: 'rtl' }}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Ambient decoration */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400"></div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 justify-start flex-row-reverse">
                <span>تصدير وطباعة السيرة الذاتية بدقة 100% 📄</span>
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                هل تفضل تحميل الملف على جهازك كـ مستند مستقل، أم إرساله مباشرةً لأمر الطباعة بالمتصفح؟
              </p>
            </div>

            {/* Selection Grid */}
            <div className="space-y-3.5">
              {/* Option 1: HTML Download (Recommended) */}
              <button
                type="button"
                onClick={handleDownloadHTML}
                className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/25 rounded-2xl transition-all cursor-pointer group text-right flex items-start gap-3 justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform font-bold text-lg">
                  📥
                </div>
                <div className="space-y-1 pr-1.5 flex-1">
                  <div className="text-xs font-black text-slate-850 group-hover:text-blue-700 transition-colors flex items-center gap-1.5 justify-start">
                    <span>تحميل كملف جاهز وثم فتحه مباشرة (موصى به للغاية) 🔥</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
                    يقوم بحفظ السيرة الذاتية فوراً كملف على حاسوبك/هاتفك. بمجرد فتح الملف المحمل، ستنطلق واجهة الطباعة مباشرة لتتمتع بجودة عالية وبخط Cairo الأصيل متفادياً قيود المتصفحات.
                  </p>
                </div>
              </button>

              {/* Option 2: Browser Print */}
              <button
                type="button"
                onClick={() => {
                  setShowPrintModal(false);
                  handlePrint();
                }}
                className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-indigo-500/40 hover:bg-slate-100/50 rounded-2xl transition-all cursor-pointer group text-right flex items-start gap-3 justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform font-bold text-lg">
                  🖨️
                </div>
                <div className="space-y-1 pr-1.5 flex-1">
                  <div className="text-xs font-black text-slate-850 group-hover:text-indigo-700 transition-colors flex items-center gap-1.5 justify-start">
                    <span>إرسال أمر الطباعة المباشرة من المتصفح الآن</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
                    يفتح نافذة الطباعة التلقائية للنظام في الإطار الحالي فوراً. (قد يتم حجبها في بعض متصفحات الجوال أو داخل شاشات المعاينة الفرعية).
                  </p>
                </div>
              </button>
            </div>

            {/* Helpful advice */}
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-[10px] text-amber-800 leading-relaxed font-medium">
              💡 <span className="font-extrabold">تنبيه ذكي:</span> بعد تشغيل الطباعة ورؤية خيارات حفظ الملف كـ <strong>PDF</strong>، احرص دائماً على اختيار مقاس الورق <strong>A4</strong> مع تفعيل <strong>"رسومات الخلفية" (Background Graphics)</strong> وإلغاء خيار "الرؤوس والتذييلات" للحصول على مظهر احترافي فائق النقاء.
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-600 cursor-pointer transition-all"
              >
                إلغاء وتراجع
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Templates Gallery Modal */}
      {showTemplatesGallery && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in font-sans text-right" style={{ direction: 'rtl' }}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 border border-slate-150 shadow-2xl space-y-6 relative flex flex-col">
            
            {/* Header banner glow */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"></div>
            
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 shrink-0">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 justify-start">
                  <span>معرض القوالب والتصاميم الجاهزة 🎨</span>
                  <span className="text-[10px] py-0.5 px-2 bg-indigo-50 text-indigo-700 font-bold rounded-full">7 تصاميم حية</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  اختر أحد التصاميم الجاهزة المعتمدة من مسؤولي التوظيف وخوادم الفحص الفوري ATS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesGallery(false)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Grid of Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto py-1 pr-1 flex-1">
              {[
                {
                  id: 'minimalist',
                  name: 'كلاسيكي ورسمي',
                  type: 'free',
                  theme: 'مبسط / أكاديمي',
                  atsStatus: 'متوافق 100% مع ATS 📄',
                  desc: 'العنوان في الوسط، تليه الأقسام الكلاسيكية بالتسلسل وممتاز للتنسيق التقليدي المعتمد عالمياً.',
                  badge: 'مجاني',
                  color: 'indigo-500',
                  industry: 'التعليم، المحاماة، المحاسبة، القطاع الحكومي والتعليمي',
                  miniature: (
                    <div className="w-16 h-20 border border-slate-205 rounded p-1 flex flex-col gap-1 bg-white">
                      <div className="h-2 bg-slate-400 w-2/3 mx-auto rounded-sm"></div>
                      <div className="h-1 bg-slate-300 w-1/2 mx-auto rounded-sm mb-1"></div>
                      <div className="h-1 bg-slate-200 w-full rounded-xs"></div>
                      <div className="h-1 bg-slate-200 w-5/6 rounded-xs"></div>
                      <div className="h-1 bg-slate-100 w-full rounded-xs mt-1"></div>
                      <div className="h-1.5 bg-slate-300 w-1/4 rounded-xs"></div>
                      <div className="h-1 bg-slate-105 w-5/6 rounded-xs"></div>
                    </div>
                  )
                },
                {
                  id: 'corporate',
                  name: 'المهني والتنفيذي',
                  type: 'free',
                  theme: 'عمودان / حديث',
                  atsStatus: 'متوافق مع ATS 📄',
                  desc: 'عمود جانبي داكن يحتوي على معلومات الاتصال والمهارات واللغات لمنع ضياع المساحات.',
                  badge: 'مجاني',
                  color: 'blue-500',
                  industry: 'إدارة الأعمال، المبيعات والشركات، المصارف والخدمات',
                  miniature: (
                    <div className="w-16 h-20 border border-slate-205 rounded p-1 flex gap-1 bg-white">
                      <div className="w-2/5 bg-slate-100 p-0.5 flex flex-col gap-1 rounded-xs">
                        <div className="w-full h-1.5 bg-slate-400 rounded-2xs"></div>
                        <div className="w-1/2 h-1 bg-slate-300 rounded-2xs"></div>
                        <div className="w-4/5 h-1 bg-slate-350 rounded-2xs"></div>
                      </div>
                      <div className="w-3/5 flex flex-col gap-1">
                        <div className="h-2 bg-slate-300 w-3/4 rounded-sm"></div>
                        <div className="h-1 bg-slate-200 w-full rounded-xs"></div>
                        <div className="h-1 bg-slate-200 w-full rounded-xs"></div>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'classic',
                  name: 'كلاسيكي ورقي عتيق',
                  type: 'free',
                  theme: 'أنيق / تقليدي',
                  atsStatus: 'متوافق 100% مع ATS 📄',
                  desc: 'تصميم تقليدي رصين وذو هوامش متزنة، ومثالي جداً للطباعة دون استهلاك كميات الحبر.',
                  badge: 'مجاني',
                  color: 'amber-650',
                  industry: 'الأوساط الأكاديمية والطبية، الوظائف المستقرة والقطاع العام',
                  miniature: (
                    <div className="w-16 h-20 border border-slate-205 rounded p-1 flex flex-col gap-1 bg-white">
                      <div className="h-1.5 bg-slate-400 w-1/2 mx-auto rounded-xs"></div>
                      <div className="h-[1px] bg-slate-200 w-full my-0.5"></div>
                      <div className="h-1 bg-slate-205 w-full rounded-xs"></div>
                      <div className="h-1 bg-slate-155 w-full rounded-xs"></div>
                      <div className="h-1.5 bg-slate-300 w-1/3 rounded-xs mt-1"></div>
                      <div className="h-1 bg-slate-155 w-full rounded-xs"></div>
                    </div>
                  )
                },
                {
                  id: 'compact',
                  name: 'مكثف وموجز',
                  type: 'free',
                  theme: 'مدمج / عالي الكثافة',
                  atsStatus: 'متوافق 100% مع ATS 📄',
                  desc: 'ضغط وتوزيع فائق الذكاء، يتيح لك حشر كميات كبيرة من البيانات وصيف رصين في صفحة وحيدة مرتبة.',
                  badge: 'مجاني',
                  color: 'slate-700',
                  industry: 'أصحاب الخبرات الطويلة (+5 سنوات)، المهندسين، والمديرين',
                  miniature: (
                    <div className="w-16 h-20 border border-slate-205 rounded p-1 flex flex-col gap-[2px] bg-white">
                      <div className="flex justify-between items-center mb-0.5">
                        <div className="h-1.5 bg-slate-400 w-1/4 rounded-2xs"></div>
                        <div className="h-1 bg-slate-300 w-1/3 rounded-2xs"></div>
                      </div>
                      <div className="h-[1px] bg-slate-300 w-full mb-0.5"></div>
                      <div className="h-1 bg-slate-200 w-full rounded-3xs"></div>
                      <div className="h-1 bg-slate-200 w-11/12 rounded-3xs"></div>
                      <div className="h-1 bg-slate-200 w-10/12 rounded-3xs"></div>
                    </div>
                  )
                },
                {
                  id: 'modern',
                  name: 'حديث وعصري',
                  type: 'free',
                  theme: 'أنيق بحدود جانبية',
                  atsStatus: 'مرن وبسيط ✨',
                  desc: 'تصميم عريض مشرق بخط جانبي أنيق بلون السمة ليعبر عن روحك العملية المتطورة بنقاء كامل.',
                  badge: 'مجاني',
                  color: 'indigo-500',
                  industry: 'مهندسي البرمجيات والتقنية، الاستشاريين، المحللين الماليين',
                  miniature: (
                    <div className="w-16 h-20 border border-slate-205 rounded p-1 flex flex-col gap-0.5 bg-white">
                      <div className="h-1.5 bg-slate-400 w-1/2 rounded-xs border-r-2 border-indigo-500 pr-1"></div>
                      <div className="h-1 bg-slate-300 w-1/3 rounded-xs mb-1"></div>
                      <div className="grid grid-cols-12 gap-1">
                        <div className="col-span-8 space-y-1">
                          <div className="h-1 bg-slate-200 w-full rounded-xs"></div>
                          <div className="h-1 bg-slate-200 w-11/12 rounded-xs"></div>
                        </div>
                        <div className="col-span-4 bg-slate-50 rounded-xs p-0.5 space-y-0.5">
                          <div className="h-[2px] bg-indigo-200 w-full rounded-3xs"></div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'creative',
                  name: 'إبداعي ملون 🎯',
                  type: 'premium',
                  theme: 'حديث / شبكة ممتازة',
                  atsStatus: 'مرن وبصري ✨',
                  desc: 'قالب تفاعلي ذو عمود جانبي ناعم مدعم بدائرة الرموز وتفاصيل الأيقونات الأنيقة لتبرز هويتك المصممة.',
                  badge: 'متميز 💎',
                  color: 'purple-500',
                  industry: 'المصممين، التسويق الإلكتروني، الميديا، منشئي المحتوى',
                  miniature: (
                    <div className="w-16 h-20 border border-purple-200 rounded p-1 flex gap-1 bg-purple-50/10 bg-white">
                      <div className="w-2/5 bg-purple-50 rounded p-[2px] flex flex-col gap-1 items-center">
                        <div className="w-4 h-4 bg-purple-205 rounded-full"></div>
                        <div className="w-full h-1 bg-purple-300 rounded-3xs"></div>
                      </div>
                      <div className="w-3/5 flex flex-col gap-[3px]">
                        <div className="h-1.5 bg-purple-300 w-3/4 rounded-xs"></div>
                        <div className="h-1 bg-slate-200 w-full rounded-3xs"></div>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'bento',
                  name: 'شبكة بينتو اليابانية 🚀',
                  type: 'premium',
                  theme: 'صناديق شبكية / مستقبلي',
                  atsStatus: 'مستقبلي وعصري ✨',
                  desc: 'تصميم ثوري مقسم لبطاقات متناسقة تشبه منتجات آبل ومواقع المطورين الحديثة لتنسيق مهيب يثير الدهشة من الوهلة الأولى.',
                  badge: 'متميز 💎',
                  color: 'emerald-500',
                  industry: 'رواد الأعمال والشركات الناشئة، المبرمجين والتقنيين والجيل الحديث',
                  miniature: (
                    <div className="w-16 h-20 border border-emerald-250 rounded p-[3px] flex flex-col gap-[3px] bg-white">
                      <div className="grid grid-cols-2 gap-[2px]">
                        <div className="h-4 bg-emerald-50 rounded-xs"></div>
                        <div className="h-4 bg-slate-50 rounded-xs"></div>
                      </div>
                      <div className="h-6 bg-slate-50 rounded-xs p-[2px]">
                        <div className="w-2/3 h-1 bg-emerald-200 rounded-2xs mb-[2px]"></div>
                      </div>
                    </div>
                  )
                }
              ].map((tmpl) => {
                const isActive = data.templateId === tmpl.id;
                const isPremium = tmpl.type === 'premium';
                const hasAccess = !isPremium || currentUser?.isSubscribed || currentUser?.unlockedTemplates?.includes(tmpl.id);
                
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      if (!hasAccess) {
                        setShowTemplatesGallery(false);
                        if (onOpenPremiumModal) {
                          onOpenPremiumModal(tmpl.id);
                        } else {
                          addToast(`قالب ${tmpl.name} هو قالب متميز يتطلب التفعيل 💎`, 'info');
                        }
                        return;
                      }
                      setData(prev => ({ ...prev, templateId: tmpl.id as any }));
                      setShowTemplatesGallery(false);
                      addToast(`تم تفعيل قالب ${tmpl.name} بنجاح!`, 'success');
                    }}
                    className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-3 group relative text-right select-none ${isActive ? 'bg-indigo-50/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/10' : 'bg-slate-50/40 border-slate-205 hover:border-slate-300 hover:bg-white hover:shadow-xs'}`}
                  >
                    {/* Badge */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isPremium ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-800'}`}>
                        {tmpl.badge}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-mono font-bold">{tmpl.theme}</span>
                    </div>

                    {/* Content split */}
                    <div className="flex gap-3 items-center">
                      {/* CSS-drawn visual miniature */}
                      <div className="shrink-0 bg-slate-100 p-1.5 rounded-xl border border-slate-200 group-hover:scale-105 transition-transform">
                        {tmpl.miniature}
                      </div>

                      {/* Text */}
                      <div className="flex-1 space-y-1">
                        <h4 className="text-[12px] font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                          <span>{tmpl.name}</span>
                          {isActive && <span className="text-[10px] text-indigo-500 font-black">✓ مفعل</span>}
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                          {tmpl.desc}
                        </p>
                      </div>
                    </div>

                    {/* Extra details list */}
                    <div className="border-t border-slate-100 pt-2 space-y-1 text-[9px] text-slate-400 leading-relaxed">
                      <div>
                        <strong>أنظمة الفحص:</strong> <span className="text-emerald-600 font-bold">{tmpl.atsStatus}</span>
                      </div>
                      <div className="truncate">
                        <strong>التخصصات الموصى بها:</strong> <span className="font-semibold text-slate-600">{tmpl.industry}</span>
                      </div>
                    </div>

                    {/* Selection Indicator bar */}
                    {isActive ? (
                      <div className="absolute right-3 bottom-3 w-2 h-2 rounded-full bg-indigo-500 animate-ping overflow-hidden"></div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
              <span className="text-[10px] text-slate-400 leading-none">
                💡 تلميح: يمكنك تغيير لون سمة الخط والخلفية لأي قالب بنقرة واحدة من لوحة التحكم الرئيسية.
              </span>
              <button
                type="button"
                onClick={() => setShowTemplatesGallery(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-black cursor-pointer transition-all"
              >
                إغلاق المعرض
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
