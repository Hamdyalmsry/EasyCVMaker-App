export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  priceAmount: number; // For premium templates
  formattedPrice: string;
}

export const COUNTRIES: CountryConfig[] = [
  { code: 'EG', name: 'جمهورية مصر العربية', flag: '🇪🇬', currencyCode: 'EGP', currencySymbol: 'ج.م', priceAmount: 50, formattedPrice: '٥٠ ج.م' },
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦', currencyCode: 'SAR', currencySymbol: 'ر.س', priceAmount: 4, formattedPrice: '٤ ر.س' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪', currencyCode: 'AED', currencySymbol: 'د.إ', priceAmount: 4, formattedPrice: '٤ د.إ' },
  { code: 'KW', name: 'دولة الكويت', flag: '🇰🇼', currencyCode: 'KWD', currencySymbol: 'د.ك', priceAmount: 0.35, formattedPrice: '٠.٣٥ د.ك' },
  { code: 'QA', name: 'دولة قطر', flag: '🇶🇦', currencyCode: 'QAR', currencySymbol: 'ر.ق', priceAmount: 4, formattedPrice: '٤ ر.ق' },
  { code: 'JO', name: 'المملكة الأردنية الهاشمية', flag: '🇯🇴', currencyCode: 'JOD', currencySymbol: 'د.أ', priceAmount: 0.75, formattedPrice: '٠.٧٥ د.أ' },
  { code: 'US', name: 'الولايات المتحدة والدول الأخرى', flag: '🇺🇸', currencyCode: 'USD', currencySymbol: '$', priceAmount: 1.25, formattedPrice: '$١.٢٥' },
];

export const getCountryByCode = (code?: string): CountryConfig => {
  if (!code) return COUNTRIES[0]; // Egypt as default
  const match = COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase() || c.currencyCode.toUpperCase() === code.toUpperCase());
  return match || COUNTRIES[0];
};

export const getCountryByUserLocation = (locationString?: string): CountryConfig => {
  if (!locationString) return COUNTRIES[0];
  const loc = locationString.toLowerCase();
  if (loc.includes('مصر') || loc.includes('egypt') || loc.includes('eg')) return COUNTRIES[0];
  if (loc.includes('سعودية') || loc.includes('saudi') || loc.includes('sa')) return COUNTRIES[1];
  if (loc.includes('إمارات') || loc.includes('uae') || loc.includes('emirates') || loc.includes('ae')) return COUNTRIES[2];
  if (loc.includes('كويت') || loc.includes('kuwait') || loc.includes('kw')) return COUNTRIES[3];
  if (loc.includes('قطر') || loc.includes('qatar') || loc.includes('qa')) return COUNTRIES[4];
  if (loc.includes('أردن') || loc.includes('jordan') || loc.includes('jo')) return COUNTRIES[5];
  return COUNTRIES[6]; // default to USD
};
