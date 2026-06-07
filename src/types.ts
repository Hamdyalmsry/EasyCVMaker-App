export type CVTemplateId = 'minimalist' | 'corporate' | 'creative' | 'bento' | 'classic' | 'modern' | 'compact';

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Language {
  id: string;
  language: string;
  level: string; // e.g. "مبتدئ", "متوسط", "متقدم", "اللغة الأم"
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CVData {
  id: string;
  userId: string;
  title: string;
  templateId: CVTemplateId;
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  updatedAt: string;
  colorTheme?: string; // Hex or tailwind class
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isAdmin?: boolean;
  country?: string; // e.g. 'EG', 'SA', 'AE', etc.
  unlockedTemplates?: string[]; // e.g. ['creative', 'bento']
  isSubscribed?: boolean; // subscription status
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or styled text
  author: string;
  date: string;
  image: string;
  readTime: string;
  tags: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
