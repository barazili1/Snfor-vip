
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, 
    Check, 
    Download, 
    ShieldCheck, 
    Fingerprint, 
    Terminal, 
    ChevronLeft,
    Globe,
    Zap
} from 'lucide-react';
import { Language, Platform } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

const dbbetDownloadUrl = "https://linebet.com/ar/registration?tag=d_4068340m_22611c_site";
const wowbetDownloadUrl = "https://refpa0320.com/L?tag=d_5285673m_110737c_&site=5285673&ad=110737";

const platformImages = {
    Linebet: 'https://image2url.com/r2/default/images/1773147437136-c8aeb00e-a11f-4907-adbe-3996b52dff17.jpg',
    WoWBET: 'WOW_CUSTOM'
};

const downloadUrls = {
    Linebet: dbbetDownloadUrl,
    WoWBET: wowbetDownloadUrl
};

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.15 + 0.05,
      height: Math.random() * 80 + 40,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {drops.map((drop) => (
        <MotionDiv
          key={drop.id}
          initial={{ y: -200 }}
          animate={{ y: '110vh' }}
          transition={{ duration: drop.duration, repeat: Infinity, ease: "linear", delay: drop.delay }}
          className="absolute bg-gradient-to-b from-cyan-600/0 via-cyan-600/40 to-cyan-600/0 w-[1px]"
          style={{ left: `${drop.left}%`, height: `${drop.height}px`, opacity: drop.opacity }}
        />
      ))}
    </div>
  );
};

export const Conditions: React.FC<{ 
    onComplete: (isAdmin: boolean, userId: string) => void; 
    onBack?: () => void; 
    language: Language; 
    onLanguageChange: (lang: Language) => void; 
    platform: Platform; 
}> = ({ onComplete, onBack, language, onLanguageChange, platform }) => {
    const isRtl = language === 'ar';
    const t = translations[language];
    const [copied, setCopied] = useState(false);
    const [userId, setUserId] = useState('');
    const [errors, setErrors] = useState<{ userId?: boolean; userIdLength?: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [overallProgress, setOverallProgress] = useState(0);
    const [statusText, setStatusText] = useState("UPLINK_INITIALIZING");

    const platformImg = platformImages[platform] || platformImages.Linebet;
    const downloadUrl = downloadUrls[platform] || downloadUrls.Linebet;
    const promoCode = 'Snfor77';

    const handleCopy = () => {
        playSound('toggle');
        navigator.clipboard.writeText(promoCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 15) {
            setUserId(val);
            if (val.length >= 8) setErrors(prev => ({ ...prev, userId: false, userIdLength: false }));
        }
    };

    const validateAndSubmit = async () => {
        playSound('click');
        const trimmedId = userId.trim();
        const isLengthValid = trimmedId.length >= 8 && trimmedId.length <= 15;
        const newErrors = { userId: !trimmedId, userIdLength: !isLengthValid && !!trimmedId };
        setErrors(newErrors);

        if (!newErrors.userId && !newErrors.userIdLength) {
            setIsSubmitting(true);
            setStatusText("SYSTEM UPLINK...");
            let isAdminVerified = trimmedId === '1726354290';
            const duration = 4000;
            const increment = 100 / (duration / 30);
            const timer = setInterval(() => {
                setOverallProgress(prev => {
                    const next = prev + increment;
                    if (next >= 33 && next < 66) setStatusText("VERIFYING DEPOSIT...");
                    if (next >= 66 && next < 95) setStatusText("VERIFYING ID...");
                    if (next >= 100) { setStatusText("AUTHENTICATED"); clearInterval(timer); return 100; }
                    return next;
                });
            }, 30);
            setTimeout(() => { playSound('success'); onComplete(isAdminVerified, trimmedId); }, duration + 500);
        }
    };

    return (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex flex-col h-full bg-[#020202] relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
            <RainEffect />
            
            {/* SCANLINE EFFECT */}
            <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* HUD BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-cyan-400/30" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-cyan-400/30" />
                <div className="absolute top-40 left-12 text-[6px] font-mono text-cyan-400 uppercase tracking-[0.8em] vertical-text">SANFOR_MISSION_BRIEFING_v4.5</div>
                <div className="absolute bottom-40 right-12 text-[6px] font-mono text-cyan-400 uppercase tracking-[0.8em] vertical-text rotate-180">UPLINK_COMMAND_CENTER</div>
            </div>

            {/* TOP BAR */}
            <MotionDiv dir="ltr" className="fixed top-0 left-0 right-0 h-20 bg-black/80 border-b border-white/5 flex items-center justify-between px-8 z-[100] backdrop-blur-2xl">
                <div className="flex items-center gap-5">
                    {onBack && (
                        <button onClick={() => { playSound('click'); onBack(); }} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all active:scale-95">
                            <ChevronLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black text-white tracking-[0.4em] uppercase italic leading-none">SANFOR <span className="text-cyan-400">VIP</span></h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">Command_Center_Active</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-10 px-5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 hover:border-cyan-400/30 transition-all active:scale-95">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    {language === 'en' ? 'ARABIC' : 'ENGLISH'}
                </button>
            </MotionDiv>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pt-32 pb-32 px-8 relative z-10 custom-scrollbar">
                <div className="max-w-md mx-auto">
                    
                    {/* VERTICAL STEPS LIST */}
                    <div className="flex flex-col gap-8">
                        
                        {/* STEP 01: INSTALL */}
                        <MotionDiv 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-950/40 border-2 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-cyan-400/20 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                                <Download className="w-32 h-32 text-cyan-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-[12px] font-black text-cyan-400 italic">01</div>
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-wider">{t.install_app}</h3>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">PHASE_INIT</span>
                                </div>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden shrink-0 shadow-2xl bg-black">
                                        {platformImg === 'WOW_CUSTOM' ? (
                                            <div className="w-full h-full bg-purple-600 flex items-center justify-center text-black font-black text-2xl">W</div>
                                        ) : (
                                            <img src={platformImg} className="w-full h-full object-cover" alt="" />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-zinc-400 italic leading-relaxed">{t.install_desc}</p>
                                </div>
                                <a href={downloadUrl} target="_blank" rel="noopener" className="group/btn relative w-full h-14 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-[0.98] transition-all italic shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    <Download className="w-5 h-5 relative z-10" /> <span className="relative z-10">{t.install_btn}</span>
                                </a>
                            </div>
                        </MotionDiv>

                        {/* STEP 02: PROMO */}
                        <MotionDiv 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-zinc-950/40 border-2 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-cyan-400/20 transition-all duration-500"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-[12px] font-black text-cyan-400 italic">02</div>
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-wider">{isRtl ? "كود المكافأة" : "PROMO CODE"}</h3>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">SYNC_KEY</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 italic mb-6">{isRtl ? "استخدم هذا الكود عند التسجيل للحصول على مكافأة VIP." : "Use this code during registration to unlock VIP rewards."}</p>
                                <div onClick={handleCopy} className="bg-black/60 border-2 border-white/5 p-6 rounded-2xl cursor-pointer group/copy hover:border-cyan-400/40 transition-all flex items-center justify-between shadow-inner">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-600 font-black uppercase block mb-2 tracking-widest">ENCRYPTION_KEY</span>
                                        <span className="text-2xl font-mono font-black text-white tracking-[0.3em]">{promoCode}</span>
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${copied ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-zinc-500 group-hover/copy:text-cyan-400 group-hover/copy:bg-cyan-400/10'}`}>
                                        {copied ? <Check className="w-6 h-6 stroke-[4px]" /> : <Copy className="w-6 h-6" />}
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* STEP 03: DEPOSIT */}
                        <MotionDiv 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-950/40 border-2 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-cyan-400/20 transition-all duration-500"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-[12px] font-black text-cyan-400 italic">03</div>
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-wider">{isRtl ? "الحد الأدنى للإيداع" : "MINIMUM DEPOSIT"}</h3>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">VAL_CHECK</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 italic mb-6">{isRtl ? "يجب إيداع المبلغ المذكور لتفعيل حسابك في النظام." : "Deposit the specified amount to activate your system account."}</p>
                                <div className="grid grid-cols-2 gap-4" dir="ltr">
                                    <div className="flex flex-col bg-black/60 p-5 rounded-2xl border-2 border-white/5 hover:border-cyan-400/20 transition-colors">
                                        <span className="text-[8px] font-mono text-zinc-600 uppercase mb-2 tracking-widest">USD_VAL</span>
                                        <span className="text-2xl font-mono font-black text-white">$7.00</span>
                                    </div>
                                    <div className="flex flex-col bg-black/60 p-5 rounded-2xl border-2 border-white/5 hover:border-cyan-400/20 transition-colors">
                                        <span className="text-[8px] font-mono text-zinc-600 uppercase mb-2 tracking-widest">EGP_VAL</span>
                                        <span className="text-2xl font-mono font-black text-white">350</span>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* STEP 04: VERIFY */}
                        <MotionDiv 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-950/40 border-2 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-cyan-400/20 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                                <ShieldCheck className="w-32 h-32 text-cyan-400" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-[12px] font-black text-cyan-400 italic">04</div>
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-wider">{t.verify_account}</h3>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">PHASE_AUTH</span>
                                </div>
                                
                                <div className="space-y-8">
                                    {/* ID INPUT SLOT */}
                                    <div className="relative group/input">
                                        <div className="absolute -top-2.5 left-6 px-3 bg-zinc-950 text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em] z-10 italic border border-white/5 rounded-full">USER_MATRIX_ID</div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center border-r-2 border-white/5">
                                                <Fingerprint className="w-5 h-5 text-cyan-400/40 group-focus-within/input:text-cyan-400 transition-colors" />
                                            </div>
                                            <input 
                                                type="tel" 
                                                value={userId} 
                                                onChange={handleUserIdChange} 
                                                placeholder="000000000" 
                                                className={`w-full bg-black/60 border-2 h-16 pl-20 pr-6 rounded-2xl text-white font-mono text-lg focus:outline-none transition-all placeholder:text-zinc-800 ${errors.userId || errors.userIdLength ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-cyan-400/40 focus:bg-cyan-400/5'}`} 
                                            />
                                        </div>
                                        {errors.userIdLength && (
                                            <p className="text-[10px] text-red-400 mt-2 px-4 italic">{isRtl ? "يجب أن يكون المعرف بين 8 و 15 رقماً" : "ID must be between 8 and 15 digits"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* MOCK SYSTEM LOGS */}
                        <div className="bg-black/60 border-2 border-white/5 rounded-3xl p-6 h-24 overflow-hidden relative shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none z-10" />
                            <div className="text-[7px] font-mono text-zinc-600 space-y-1.5 animate-pulse">
                                <p>[SYSTEM] INITIALIZING SECURITY CLEARANCE_v4.5...</p>
                                <p>[UPLINK] ESTABLISHING SECURE CONNECTION TO CORE_SERVER_01...</p>
                                <p>[AUTH] WAITING FOR USER MATRIX IDENTIFICATION_PHASE_04...</p>
                                <p>[SYNC] ENCRYPTION KEYS GENERATED SUCCESSFULLY_RSA_4096.</p>
                                <p>[LOG] MISSION_BRIEFING_LOADED_AT_{new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* INITIALIZE BUTTON */}
                    <div className="pt-16">
                        <button 
                            onClick={validateAndSubmit} 
                            disabled={isSubmitting} 
                            className="group relative w-full h-18 rounded-3xl bg-cyan-400 text-black font-black text-[14px] tracking-[0.5em] uppercase flex items-center justify-center gap-5 shadow-[0_25px_60px_rgba(34,211,238,0.3)] active:scale-[0.98] transition-all disabled:opacity-20 overflow-hidden italic"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative z-10">{isRtl ? "تأكيد الوصول" : "INITIALIZE UPLINK"}</span>
                            <Zap className="w-7 h-7 relative z-10 fill-current" />
                        </button>
                        
                        <div className="flex justify-center gap-12 mt-8 opacity-40">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={16} className="text-cyan-400" />
                                <span className="text-[9px] font-mono text-white uppercase tracking-widest">Secure_Uplink</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Terminal size={16} className="text-cyan-400" />
                                <span className="text-[9px] font-mono text-white uppercase tracking-widest">Verified_Auth</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBMISSION OVERLAY */}
            <AnimatePresence>
                {isSubmitting && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020202]/98 backdrop-blur-3xl p-10">
                        <MotionDiv initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-sm text-center">
                            <div className="bg-zinc-950 border-2 border-white/10 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-400/30" />
                                <div className="flex items-center justify-center mb-10">
                                    <div className="w-20 h-20 rounded-[2rem] bg-black border-2 border-cyan-400/30 flex items-center justify-center relative">
                                        <Terminal className="w-10 h-10 text-cyan-400 animate-pulse" />
                                        <div className="absolute inset-0 bg-cyan-400/10 blur-2xl rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4 mb-10 text-center">
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic leading-none">{statusText}</h3>
                                    <div className="text-4xl font-mono font-black text-cyan-400 italic leading-none">{Math.round(overallProgress)}%</div>
                                </div>
                                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden p-[2px]">
                                    <MotionDiv className="h-full bg-cyan-400 rounded-full shadow-[0_0_25px_#22d3ee]" style={{ width: `${overallProgress}%` }} />
                                </div>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
                .h-18 { height: 4.5rem; }
            `}</style>
        </MotionDiv>
    );
};
