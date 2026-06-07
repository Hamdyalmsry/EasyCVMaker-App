import React from 'react';
import { X, FileCode, CheckCircle2, Download, Copy } from 'lucide-react';
import { sitemapContent, robotsContent } from './SEO';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose, addToast }) => {
  if (!isOpen) return null;

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    addToast(`تم نسخ محتويات ملف ${title} بنجاح إلى حافظتك!`, 'success');
  };

  const handleDownload = (text: string, fileName: string, mimeType: string) => {
    try {
      const blob = new Blob([text], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast(`تم تحميل ملف ${fileName} المخصص لموقعك بنجاح! 📥`, 'success');
    } catch (error) {
      addToast('فشل في تحميل الملف، يرجى المحاولة لاحقاً', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in" style={{ direction: 'rtl' }}>
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-slate-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="p-2.5 bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded-xl">
            <FileCode className="w-6 h-6" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-black text-white">ملفات المواقع وتحسين محركات البحث (SEO Sitemaps)</h3>
            <p className="text-xs text-slate-400 mt-0.5">معدلات الأرشفة والخرائط القياسية لـ Google Bot و Bing Crawler لتعزيز تصدر موقعك</p>
          </div>
        </div>

        {/* Sitemap Block */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">مخرجات ملف sitemap.xml القياسي لتسهيل الأرشفة:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(sitemapContent, 'sitemap.xml')}
                  className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:bg-cyan-950/40 border border-cyan-900/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ ملف XML</span>
                </button>
                <button
                  onClick={() => handleDownload(sitemapContent, 'sitemap.xml', 'application/xml')}
                  className="flex items-center gap-1 text-[11px] font-bold bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل sitemap.xml 📥</span>
                </button>
              </div>
            </div>
            <pre className="bg-slate-950 text-slate-300 text-[10px] leading-relaxed p-4 rounded-xl max-h-48 overflow-y-auto border border-slate-850 font-mono text-left" style={{ direction: 'ltr' }}>
              {sitemapContent}
            </pre>
          </div>

          {/* Robots Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">مخرجات ملف robots.txt لإرشاد عناكيب البحث والمؤرشفات:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(robotsContent, 'robots.txt')}
                  className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:bg-cyan-950/40 border border-cyan-900/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ ملف txt</span>
                </button>
                <button
                  onClick={() => handleDownload(robotsContent, 'robots.txt', 'text/plain')}
                  className="flex items-center gap-1 text-[11px] font-bold bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل robots.txt 📥</span>
                </button>
              </div>
            </div>
            <pre className="bg-slate-950 text-slate-300 text-xs leading-relaxed p-4 rounded-xl border border-slate-850 font-mono text-left" style={{ direction: 'ltr' }}>
              {robotsContent}
            </pre>
          </div>

          {/* Verification Badge */}
          <div className="flex items-start gap-2.5 bg-emerald-950/40 border border-emerald-900/40 p-4 rounded-2xl text-xs text-slate-300 text-right">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-white mb-0.5">الملفات مطابقة بالكامل لشروط الإيداع ومحركات البحث العالمية 🚀</strong>
              تم بناء هذه الملفات والروابط القياسية وفقاً لمعايير الـ SEO الحديثة لتأمين الفهرسة التلقائية والسريعة لـ EasyCVMaker ومختلف صفحات السير الذاتية والمواضيع والمقالات التعليمية العامة في مراتب البحث الأولى مثل دمج الـ HTML Head Tag ومحاذاة الروبوتات.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
