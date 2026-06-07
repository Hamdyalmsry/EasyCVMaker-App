import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Sparkles, Check, X, AlertCircle, Coins, Heart, Globe, Wallet } from 'lucide-react';
import { User } from '../types';
import { COUNTRIES, getCountryByCode } from '../data/countryData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  templateId?: 'creative' | 'bento' | string;
  onSuccess: (updatedUser: User) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onOpenAuth: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  templateId,
  onSuccess,
  addToast,
  onOpenAuth
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('EG');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'fawry'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [walletPhone, setWalletPhone] = useState('');
  const [fawryCode, setFawryCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Sync country code with current user's profile
  useEffect(() => {
    if (currentUser?.country) {
      setSelectedCountryCode(currentUser.country);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const currentCountryConfig = getCountryByCode(selectedCountryCode);
  const currencySymbol = currentCountryConfig.currencySymbol;
  const priceAmount = currentCountryConfig.priceAmount;

  // Let's offer:
  // 1. Single Premium Template Unlock: 50 EGP value
  // 2. Full Month All-Inclusive VIP Subscription: 150 EGP value (or discounted to 100)
  const singlePrice = priceAmount;
  const vipPrice = Math.round(priceAmount * 2.5 * 100) / 100;

  const handleProcessPayment = (buyType: 'single' | 'subscription') => {
    if (!currentUser) {
      addToast('يرجى تسجيل الدخول أو إنشاء حساب أولاً لإتمام تفعيل طلبك وحفظه بسحابك الشخصي!', 'info');
      onOpenAuth();
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvc)) {
      addToast('فضلاً، أكمل ملء بيانات البطاقة الائتمانية للتأكيد التجريبي', 'error');
      return;
    }
    if (paymentMethod === 'wallet' && !walletPhone) {
      addToast('يرجى كتابة رقم الهاتف للمحفظة الإلكترونية لإرسال طلب الدفع المباشر', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Setup updated user credentials
      const unlocked = currentUser.unlockedTemplates ? [...currentUser.unlockedTemplates] : [];
      let nextSubscribed = currentUser.isSubscribed || false;

      if (buyType === 'single' && templateId) {
        if (!unlocked.includes(templateId)) {
          unlocked.push(templateId);
        }
      } else {
        nextSubscribed = true;
      }

      const updatedUser: User = {
        ...currentUser,
        country: selectedCountryCode,
        unlockedTemplates: unlocked,
        isSubscribed: nextSubscribed
      };

      // Save user to memory/local registry
      const usersRaw = localStorage.getItem('easycv_users');
      if (usersRaw) {
        try {
          const users: User[] = JSON.parse(usersRaw);
          const index = users.findIndex(u => u.id === currentUser.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('easycv_users', JSON.stringify(users));
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Save user as current session
      localStorage.setItem('easycv_current_user', JSON.stringify(updatedUser));
      onSuccess(updatedUser);

      setIsLoading(false);
      setIsDone(true);

      const getTemplateName = (id?: string) => {
        switch (id) {
          case 'creative': return 'الإبداعي الحديث';
          case 'bento': return 'بانتو المستقبلي';
          case 'modern': return 'العصري الأنيق';
          case 'compact': return 'المكثف العملي';
          default: return 'المهني المتميز';
        }
      };

      const purchaseMsg = buyType === 'single'
        ? `🎉 تم شراء وإلغاء قفل قالب "${getTemplateName(templateId)}" بنجاح فوري!`
        : `👑 مبارك! شرفتنا بالإشتراك في العضوية الاحترافية للوصول لجميع قوالب وأدوات الذكاء الاصطناعي بلا حدود!`;
      addToast(purchaseMsg, 'success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in text-slate-800" style={{ direction: 'rtl' }}>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-slide-up duration-350 flex flex-col max-h-[90vh]">
        
        {/* Colorful Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white text-right relative shrink-0">
          <div className="absolute top-4 left-4">
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-white/15 text-[10px] font-black uppercase tracking-wider text-amber-300">
              💎 خطط الترقية والاستكشاف المتميزة
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            افتح روائع قوالب التوظيف الاحترافية
          </h3>
          <p className="text-xs text-blue-100 mt-2 leading-relaxed">
            وفق طلبك، بعض القوالب مجانية تماماً لتسهيل انطلاقتك، والقوالب الفنية المصممة بأعلى معايير الـ ATS متاحة عبر تفعيلها الفردي أو الاشتراك المتكامل.
          </p>
        </div>

        {/* Modal Main Contenct Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-right">
          
          {isDone ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-800">نشكرك لثقتك الغالية في منصة EasyCVMaker!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                تم تفعيل باقتك والمزامنة بنجاح على سيرفراتنا الشخصية. يمكنك الآن استخدام القوالب وتصديرها وتحميلها كملفات PDF فائقة التخصيص والألوان فوراً.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                العودة ومواصلة التعديل ⚡
              </button>
            </div>
          ) : (
            <>
              {/* Country Selection Dropdown for Currency conversion */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-black text-slate-800 mb-0.5 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span>تغيير الدولة لعرض العملة المقابلة:</span>
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    يقوم الموقع تلقائياً بتحويل الـ 50 جنيه وسعر الترقية لعملتك المحلية لراحتك الكاملة.
                  </p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => {
                      setSelectedCountryCode(e.target.value);
                      // Set default logical credentials on change
                      if (e.target.value === 'EG') setPaymentMethod('wallet'); // default to vodafone cash / instapay style for Egypt
                      else setPaymentMethod('card');
                    }}
                    className="w-full sm:w-56 text-xs bg-white border border-slate-200 focus:border-indigo-500 p-2.5 rounded-xl text-slate-800 font-extrabold pr-8 cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.currencyCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Two Pricing Tiers Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Single Template Option */}
                <div className={`border rounded-2xl p-5 relative transition-all flex flex-col justify-between ${templateId ? 'border-amber-400 bg-amber-50/15 ring-2 ring-amber-400/20 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  {templateId && (
                    <span className="absolute -top-3 right-4 bg-amber-400 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">
                      طلبك النشط حالياً ⚡
                    </span>
                  )}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-1">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>قفل القالب الحالي فقط</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal min-h-[32px]">
                      ترخيص دائم للاستخدام، التعديل والتصدير اللامحدود لقالب {templateId === 'creative' ? '«الإبداعي الحديث»' : templateId === 'bento' ? '«بانتو المستقبلي»' : templateId === 'modern' ? '«العصري الأنيق»' : templateId === 'compact' ? '«المكثف العملي»' : '«النموذج المحدد»'} لوحده.
                    </p>
                    <div className="my-4">
                      <span className="text-2xl font-black text-slate-800">{singlePrice}</span>
                      <span className="text-[11px] font-bold text-slate-500 mr-1">{currencySymbol} / يدفع لمرة واحدة فقط</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleProcessPayment('single')}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-black bg-slate-900 text-white hover:bg-slate-850 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isLoading ? 'جاري الاتصال بالسيرفر...' : `تفعيل هذا القالب بـ ${singlePrice} ${currencySymbol}`}
                  </button>
                </div>

                {/* PRO Plan VIP Subscription */}
                <div className="border border-indigo-200 bg-indigo-50/20 rounded-2xl p-5 relative shadow-md flex flex-col justify-between hover:shadow-lg hover:border-indigo-400 transition-all">
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    أفضل المزايا والقيمة 🔥
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>اشتراك فئة VIP الكامل</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal min-h-[32px]">
                      افتح جميع القوالب الحالية والمستقبلية غير المحدودة مع ميزة الذكاء الاصطناعي والصياغة والتصدير اللامتناهي.
                    </p>
                    <div className="my-4">
                      <span className="text-2xl font-black text-indigo-700">{vipPrice}</span>
                      <span className="text-[11px] font-bold text-indigo-500 mr-1">{currencySymbol} / شهرياً مع إلغاء مرن بروبوت الدعم</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleProcessPayment('subscription')}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-750 text-white transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isLoading ? 'جاري الاتصال بالسيرفر...' : `ترقية الحساب الشامل بـ ${vipPrice} ${currencySymbol}`}
                  </button>
                </div>

              </div>

              {/* Secure Checkout details */}
              <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>بوابة دفع آمنة مشفرة 100% (SSL)</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {selectedCountryCode === 'EG' ? (
                      <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        فوري / فودافون كاش ومحافظ أخرى 📱
                      </span>
                    ) : (
                      <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                        بطاقة ائتمان / مدى / Apple Pay 💳
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated Payment Inputs toggle depending on country/method */}
                <div className="flex items-center gap-2 border-b border-transparent pb-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${paymentMethod === 'card' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>بطاقة بنكية / فيزا</span>
                  </button>
                  {selectedCountryCode === 'EG' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${paymentMethod === 'wallet' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>فودافون كاش / إنستاباي</span>
                    </button>
                  )}
                  {selectedCountryCode === 'EG' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('fawry')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${paymentMethod === 'fawry' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      <span>⚡ فوري مسبق الدفع</span>
                    </button>
                  )}
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">رقم البطاقة</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="4123 4567 8901 2345"
                        className="w-full text-xs p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 text-left font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">تاريخ الانتهاء</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-xs p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">الرمز السري CVC</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full text-xs p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 text-center font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">رقم المحفظة الإلكترونية (فودافون / اتصالات / أورانج كاش أو تيلدا)</label>
                    <input
                      type="text"
                      maxLength={11}
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="01012345678"
                      className="w-full text-xs p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 text-left font-mono"
                    />
                    <span className="block text-[9px] text-slate-400 mt-1">سيصلك إشعار دفع فوري على هاتفك لتأكيد التحويل بضغطة زر.</span>
                  </div>
                )}

                {paymentMethod === 'fawry' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">الرقم المرجعي لفوري أو فواتير الهاتف</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value="998246371"
                        className="w-full text-xs p-2.5 border border-slate-200 bg-slate-100 rounded-xl text-slate-600 font-mono text-center select-all font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('998246371');
                          addToast('تم نسخ كود فوري بنجاح! توجه لأقرب ماكينة للدفع الفوري.', 'success');
                        }}
                        className="px-4 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                      >
                        نسخ الكود 📋
                      </button>
                    </div>
                    <span className="block text-[9px] text-slate-400 mt-1">يمكنك استخدام هذا الكود للتسديد الفوري في أي منفذ فوري أو محفظة بنكية بنجاح.</span>
                  </div>
                )}

                {!currentUser && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-right">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                        أنت تتصفح كزائر حالياً. يرجى تسجيل حسابك أولاً ليتمكن التطبيق من تأمين قوالبك وحفظ تقدمك مدى الحياة.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer info lockup */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center shrink-0 flex items-center justify-center gap-1 text-[9.5px] text-slate-400">
          <span>صمم بكل ❤️ وشغف ويسر لمساعدتك بالتألق. جميع الحقوق محفوظة لـ EasyCVMaker © ٢٠٢٦</span>
        </div>

      </div>
    </div>
  );
};
