import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  type?: 'website' | 'article';
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  type = 'website',
  image = 'https://ais-pre-eyuqn3nji4mb3ynx3molir-483521497575.europe-west1.run.app/assets/og-image.jpg'
}) => {
  useEffect(() => {
    // Dynamic document title
    document.title = `${title} | EasyCVMaker`;

    // Help crawler simulations by setting attributes or meta tags
    const updateMetaTag = (selectors: string, property: string, content: string) => {
      let element = document.querySelector(selectors) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (selectors.includes('name')) {
          element.name = property;
        } else {
          element.setAttribute('property', property);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMetaTag('meta[name="description"]', 'description', description);
    updateMetaTag('meta[property="og:title"]', 'og:title', `${title} | EasyCVMaker`);
    updateMetaTag('meta[property="og:description"]', 'og:description', description);
    updateMetaTag('meta[property="og:type"]', 'og:type', type);
    updateMetaTag('meta[property="og:image"]', 'og:image', image);
    updateMetaTag('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'twitter:title', `${title} | EasyCVMaker`);
    updateMetaTag('meta[name="twitter:description"]', 'twitter:description', description);
  }, [title, description, type, image]);

  return null; // Side effect only
};

// Sitemap static helper for display and automated index
export const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
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
</urlset>`;

export const robotsContent = `User-agent: *
Allow: /
Sitemap: https://easycvmaker.com/sitemap.xml`;
