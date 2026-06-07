import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to generate suggested resume summary
  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { personalInfo, skills, workExperience, education } = req.body;
      const currentApiKey = process.env.GEMINI_API_KEY;

      if (!currentApiKey) {
        return res.status(500).json({ 
          error: "مفتاح واجهة برمجة تطبيقات Gemini (GEMINI_API_KEY) غير متاح حالياً. يرجى إضافته من خلال قائمة Settings > Secrets في لوحة التحكم العلوية ومن ثم إعادة المحاولة." 
        });
      }

      // Initialize Gemini dynamically within the handler to support post-startup key updates
      const ai = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Build a detailed and context-rich prompt in Arabic for a professional summary.
      const prompt = `أنت خبير محترف ومستشار توظيف وموارد بشرية (HR). 
قم بكتابة ملخص مهني احترافي ومقنع وجذاب جداً للسيرة الذاتية (Resume Summary) باللغة العربية بناءً على البيانات التالية:

الاسم الكامل: ${personalInfo?.name || '-'}
المسمى الوظيفي المستهدف: ${personalInfo?.title || '-'}

المهارات والقدرات الكبرى:
${skills && skills.length > 0 ? skills.slice(0, 15).join('، ') : 'لم يتم تحديد مهارات بعد'}

الخبرة المهنية السابقة:
${workExperience && workExperience.length > 0 
  ? workExperience.map((w: any) => `- ${w.position} في ${w.company} (${w.startDate} - ${w.current ? 'الآن' : w.endDate}): ${w.description || 'وصف المهام والمسؤوليات الكبرى'}`).join('\n')
  : 'حديث التخرج أو يبحث عن بداية جديدة'}

التحصيل الدراسي:
${education && education.length > 0 
  ? education.map((e: any) => `- ${e.degree} في ${e.field} من ${e.school} (${e.startDate})`).join('\n')
  : 'غير محدد'}

شروط الملخص المهني المطلوب:
1. يجب أن يكون قصيراً جداً، بليغاً ومكثفاً، ومؤلفاً من 3 إلى 4 أسطر فقط (حوالي 50-70 كلمة).
2. يجب أن يتميز بأسلوب فخم، احترافي، ومقنع لجذب مسؤولي التوظيف على الفور.
3. التزم تماماً باللغة العربية الفصحى السليمة وقواعد النحو وتجنب الأخطاء اللغوية والإملائية.
4. ركز على الشغف بالريادة والابتكار، والقيمة المضافة التي يمكنك تقديمها للمؤسسة.
5. لا تضف أي نص تمهيدي أو استهلالي أو ختامي (مثل "هذا هو الملخص:" أو علامات اقتباس)، بل ابدأ بنص الملخص مباشرة ليتم نسخه فوراً.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const generatedSummary = response.text || "";
      res.json({ summary: generatedSummary.trim() });
    } catch (error: any) {
      console.error("Error generating summary:", error);
      res.status(500).json({ error: error?.message || "فشل في توليد الملخص" });
    }
  });

  // API Route to rewrite and improve job description
  app.post("/api/improve-experience", async (req, res) => {
    try {
      const { position, company, description } = req.body;
      const currentApiKey = process.env.GEMINI_API_KEY;

      if (!currentApiKey) {
        return res.status(500).json({ 
          error: "مفتاح واجهة برمجة تطبيقات Gemini (GEMINI_API_KEY) غير متاح حالياً. يرجى إضافته من خلال قائمة Settings > Secrets في لوحة التحكم العلوية ومن ثم إعادة المحاولة." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `أنت مستشار كتابة معتمد ومراجع سير ذاتية (Professional CV Editor).
قم بإعادة كتابة وتحسين المهام والخبرات المهنية التالية لتصبح غنية بالتأثير ونموذجية لمرشحي الوظائف الممتازين:

المسمى الوظيفي: ${position || 'موظف'}
الشركة/المؤسسة: ${company || 'غير محدد'}
الوصف الحالي أو المهام المكتوبة من الكاتب:
${description || 'تطوير، متابعة المشاريع، كتابة التقرير، تنظيم المواعيد'}

شروط إعادة الكتابة المطلوبة:
1. صياغة المهام بشكل قائم على الإنجاز والمسؤوليات الكبرى باستخدام "أفعال حركة قوية" (مثل: قادَ، طوَّرَ، حسَّنَ، نسَّقَ، حقَّقَ).
2. يجب تنظيم المقطع على هيئة نقاط نقطية مرتبة بوضوح (Bulleted List) وسهلة القراءة.
3. تجنب المصطلحات الضعيفة أو الكلمات الزائدة، واجعلها موجزة ومهنية للغاية.
4. التزم تماماً باللغة العربية الفصحى السليمة وقواعد النحو.
5. لا تضف أي نصوص ترحيبية أو تمهيدية، بل ابدأ بالنقاط مباشرة ليتمكن الكاتب من وضعها فوراً في حقل الوصف.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ description: (response.text || "").trim() });
    } catch (error: any) {
      console.error("Error improving experience:", error);
      res.status(500).json({ error: error?.message || "فشل في تحسين الوصف الوظيفي" });
    }
  });

  // API Route to suggest relevant skills
  app.post("/api/suggest-skills", async (req, res) => {
    try {
      const { title } = req.body;
      const currentApiKey = process.env.GEMINI_API_KEY;

      if (!currentApiKey) {
        return res.status(500).json({ 
          error: "مفتاح واجهة برمجة تطبيقات Gemini (GEMINI_API_KEY) غير متاح حالياً. يرجى إضافته من خلال قائمة Settings > Secrets في لوحة التحكم العلوية ومن ثم إعادة المحاولة." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `أنت خبير توظيف ومسؤول HR. اقترح أهم مهارات فنية وشخصية لازمة للمسمى الوظيفي التالي: "${title || 'مطور ويب'}".
أريد أن ترجع لي فقط مصفوفة جيسون بسيطة (JSON Array) من النصوص تحتوي على 8-10 مهارات باللغة العربية.
مثال للخرج المطلوب:
["البرمجة بـ React", "تصميم واجهات المستخدم", "العمل الجماعي", "حل المشكلات"]

لا تكتب أي كلمات تمهيدية أو شرح، فقط مصفوفة JSON صالحة للتفسير الفوري.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let jsonText = (response.text || "").trim();
      let skills: string[] = [];
      try {
        skills = JSON.parse(jsonText);
      } catch (e) {
        const matches = jsonText.match(/"([^"]+)"/g);
        if (matches) {
          skills = matches.map(m => m.replace(/"/g, ''));
        } else {
          skills = ["مهارة التواصل", "التفكير الإبداعي", "إدارة الوقت", "حل المشكلات الذكي"];
        }
      }

      res.json({ skills });
    } catch (error: any) {
      console.error("Error suggesting skills:", error);
      res.status(500).json({ error: error?.message || "فشل في توليد مهارات مقترحة" });
    }
  });

  // API Route to perform intelligent ATS compatibility check and review
  app.post("/api/analyze-cv-ats", async (req, res) => {
    try {
      const { cvData } = req.body;
      const currentApiKey = process.env.GEMINI_API_KEY;

      if (!currentApiKey) {
        return res.status(500).json({ 
          error: "مفتاح واجهة برمجة تطبيقات Gemini (GEMINI_API_KEY) غير متاح حالياً. يرجى إضافته من خلال قائمة Settings > Secrets في لوحة التحكم العلوية ومن ثم إعادة المحاولة." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `أنت خبير فني ومراجع أنظمة التوظيف المؤتمتة ومسؤول استقطاب كفاءات (ATS Auditor / HR Tech Specialist).
قم بتحليل وبحث السيرة الذاتية التالية باللغة العربية، لتقييم مدى توافقها ومطابقتها البرمجية الكاملة مع مرشحات الـ ATS وأنظمة التوظيف وحساب نسبة القبول والترشيح المتوقع.

إليك بيانات السيرة الذاتية الحالية للتفتيش الشامل:
- الاسم الكامل: ${cvData?.personalInfo?.name || "غير محدد"}
- المسمى الوظيفي المستهدف: ${cvData?.personalInfo?.title || "غير محدد"}
- رابط الموقع/اللينكد إن: ${cvData?.personalInfo?.website || "غير محدد"}
- الهاتف والبريد: ${cvData?.personalInfo?.phone || "غير محدد"} | ${cvData?.personalInfo?.email || "غير محدد"}

- نبذة ملخصة:
${cvData?.summary || "لم يتم تسجيل نبذة شخصية أو ملخص كافٍ."}

- الخبرة العملية:
${cvData?.workExperience && cvData.workExperience.length > 0
  ? cvData.workExperience.map((w: any) => `- ${w.position} في ${w.company} | ${w.startDate} إلى ${w.current ? 'الآن' : w.endDate}: ${w.description}`).join('\n')
  : "لا يوجد خبرة عملية حالياً."}

- التحصيل الدراسي:
${cvData?.education && cvData.education.length > 0
  ? cvData.education.map((e: any) => `- ${e.degree} في ${e.field} من ${e.school} في تفاصيل سنة ${e.startDate}`).join('\n')
  : "لا توجد حقول تعليم حالياً."}

- المهارات واللغات الحالية:
المهارات: ${(cvData?.skills || []).join('، ')}
اللغات: ${(cvData?.languages || []).map((l: any) => `${l.name} (${l.proficiency})`).join('، ')}

- المشاريع الحالية والشهادات المضافة:
المشاريع: ${(cvData?.projects || []).map((p: any) => `- ${p.name}: ${p.description}`).join('\n')}
الشهادات: ${(cvData?.certifications || []).map((c: any) => `- ${c.name} من جهة ${c.issuer}`).join('\n')}

المطلوب كشف كامل بصيغة JSON صالح للنواقل الفورية، يتضمن النقاط التالية في حقول جيسون باللغة العربية:
{
  "score": 85, // رقم صحيح بين 0 و 100 يعبر عن درجة جاهزية هذه السيرة لمطابقة ATS
  "strengths": [
    "الاسم واضح ومتناسق"،
    "توجد خبرات كافية بأفعال حركة متميزة..."
  ], // مصفوفة نصوص تصف نقاط القوة والتميز البرمجي الحالي
  "missingKeywords": [
    "الكلمة المفتاحية 1",
    "الكلمة المفتاحية 2"
  ], // أهم الكلمات الفنية والمفاهيم الشائعة لمسؤولي التوظيف في هذا التخصص والمفقودة من سيرته حالياً
  "structureIssues": [
    "تفتقد السيرة لتاريخ التخرج بشكل موحد",
    "توصيف مهام العمل يفتقد لإنجاز رقمي ملموس بالأعداد..."
  ], // أي ترتيب خاطئ، مشكلة في التواريخ، أو حقول خالية تخل بهيكلية الملف
  "formattingTips": [
    "تجنب استخدام الجداول المتداخلة أو الرسوم المعقدة التي تشوش القارئ",
    "احرص على استخدام صيغة PDF قياسية عند التحميل"
  ], // مصفوفة نصائح لرفع درجة التوافق والتنسيق القياسي
  "summaryFeedback": "ملاحظة بليغة مكتوبة بأسلوب مباشر ومحفز لتعديل النبذة"
}

لا تكتب أي مقدمات أو علامات شرح أو تعليقات خارج البنية، فقط كائن جيسون صالح (Valid JSON Object):`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(response.text || "{}");
    } catch (error: any) {
      console.error("Error in ATS check:", error);
      res.status(500).json({ error: error?.message || "فشل فحص السيرة الذاتية عبر أنظمة الـ ATS" });
    }
  });

  // Serve real sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://easycvmaker.com/</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://easycvmaker.com/#templates</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://easycvmaker.com/#blog</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://easycvmaker.com/#about</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://easycvmaker.com/#contact</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
  });

  // Serve real robots.txt
  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(`User-agent: *
Allow: /
Sitemap: https://easycvmaker.com/sitemap.xml`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
