
import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from './Grid';
import { updateAppleGridData } from '../services/database';
import { playSound } from '../services/audio';
import { GameState, PredictionResult, AccessKey, Language, Platform } from '../types';
import { translations } from '../translations';
import { 
    Target,
    Zap,
    RotateCcw,
    Users,
    Globe,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 1.5 + 0.8,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.2 + 0.05,
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
          className="absolute bg-gradient-to-b from-blue-600/0 via-blue-600 to-blue-600/0 w-[1px] transform-gpu"
          style={{ left: `${drop.left}%`, height: `${drop.height}px`, opacity: drop.opacity }}
        />
      ))}
    </div>
  );
};

interface AppleGameProps {
  onBack: () => void;
  accessKeyData: AccessKey | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  platform: Platform;
}

export const AppleGame: React.FC<AppleGameProps> = ({ onBack, accessKeyData, language, onLanguageChange, platform }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [isUpdating, setIsUpdating] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState(0); 
  const t = translations[language];
  const isRtl = language === 'ar';
  const [onlineUsersCount, setOnlineUsersCount] = useState(() => Math.floor(Math.random() * (1000 - 50 + 1)) + 50);

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(() => {
    try {
        const saved = localStorage.getItem('fortune-ai-last-result');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.path)) return parsed;
        }
    } catch (e) {}
    return null;
  });

  const [revealRotten, setRevealRotten] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setOnlineUsersCount(prev => {
            const change = Math.floor(Math.random() * 7) - 3;
            return Math.min(1000, Math.max(50, prev + change));
        });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (currentResult) {
          if (gameState === GameState.IDLE) setGameState(GameState.PREDICTED);
      }
  }, [currentResult, gameState]);

  const handlePredict = async () => {
    if (gameState === GameState.ANALYZING) return;
    setPredictionProgress(0);
    setGameState(GameState.ANALYZING);
    playSound('predict');
    setPredictionProgress(15);
    await new Promise(r => setTimeout(r, 700));
    setPredictionProgress(45);
    await new Promise(r => setTimeout(r, 1000));
    setPredictionProgress(80);
    await new Promise(r => setTimeout(r, 800));
    const path: number[] = [Math.floor(Math.random() * 5)];
    const result: PredictionResult = {
        path,
        confidence: 100, 
        analysis: language === 'ar' ? "تم تحديد المسار الآمن." : "SAFE PATH IDENTIFIED.",
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        gridData: [[true, true, true, true, true]] // All apples are good as requested
    };
    setPredictionProgress(100);
    playSound('success');
    setTimeout(() => {
        setGameState(GameState.PREDICTED);
        setCurrentResult(result);
    }, 400);
  };

  const handleNewGame = async () => {
      if (isUpdating) return;
      setIsUpdating(true);
      playSound('click');
      await updateAppleGridData(platform);
      await new Promise(r => setTimeout(r, 600));
      setGameState(GameState.IDLE);
      setCurrentResult(null);
      setRevealRotten(false);
      setIsUpdating(false);
      playSound('success');
  };

  const isAnalyzing = gameState === GameState.ANALYZING;

  const platformImages = {
    Linebet: 'https://image2url.com/r2/default/images/1773147437136-c8aeb00e-a11f-4907-adbe-3996b52dff17.jpg',
    WoWBET: 'WOW_CUSTOM'
  };
  const platformImg = platformImages[platform] || platformImages.Linebet;

  return (
    <div className={`flex flex-col h-screen relative pt-0 select-none bg-black overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
        <RainEffect />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,1)_100%)]" />
        </div>
        <MotionDiv initial={{ y: -100 }} animate={{ y: 0 }} dir="ltr" className="fixed top-0 left-0 right-0 z-[100] h-14 bg-zinc-950/80 border-b border-blue-400/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-between px-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 flex-row">
                <button onClick={() => { playSound('click'); onBack(); }} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-blue-400/10 hover:border-blue-400/30 flex items-center justify-center transition-all active:scale-90 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col items-start">
                    <div className="border border-blue-400/20 rounded-[8px] px-2 py-1 bg-black/50 flex items-center gap-2.5 backdrop-blur-xl">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-blue-400/30">
                            {platformImg === 'WOW_CUSTOM' ? (
                                <div className="w-full h-full bg-purple-600 flex items-center justify-center text-black font-black text-[10px]">W</div>
                            ) : (
                                <img 
                                    src={platformImg} 
                                    alt="Logo" 
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <h1 className="text-[9px] font-black text-white tracking-[0.1em] uppercase leading-none font-mono">
                            UPLINK: <span className="text-blue-400">{accessKeyData?.key || "8963007529"}</span>
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end opacity-40">
                    <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest">System_Status: Optimal</span>
                    <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-0.5 bg-blue-400/30" />)}
                    </div>
                </div>
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-blue-400/10 hover:border-blue-400/30 active:scale-95 transition-all flex items-center justify-center shadow-lg group">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-400 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[9px] font-black uppercase font-mono tracking-tighter">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>
        </MotionDiv>

        <div className={`flex-1 overflow-y-auto custom-scrollbar pt-14 pb-6 px-6 relative z-10 flex flex-col justify-center items-center ${isRtl ? 'text-right' : 'text-left'}`}>
            {/* Platform Logo above the row */}
            <MotionDiv initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-zinc-950 p-1">
                    <div className="w-full h-full rounded-[1.6rem] overflow-hidden border border-white/5">
                        {platformImg === 'WOW_CUSTOM' ? (
                            <div className="w-full h-full bg-purple-600 flex items-center justify-center text-black font-black text-4xl">W</div>
                        ) : (
                            <img src={platformImg} alt="Platform Logo" className="w-full h-full object-cover" />
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-[10px] font-black text-white tracking-[0.5em] uppercase italic opacity-80">{platform}</h2>
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                </div>
            </MotionDiv>

            <MotionDiv layout initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-12 group z-10 shrink-0 transform-gpu w-full max-w-sm">
                <div className={`bg-zinc-950/50 backdrop-blur-[30px] p-4 rounded-[2.5rem] border transition-all duration-700 overflow-hidden min-h-[120px] flex flex-col justify-center items-center ${isAnalyzing ? 'border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-white/10'}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_100%)] pointer-events-none" />
                    
                    {/* Corner Accents */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-blue-400/20 rounded-tl-lg pointer-events-none" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-blue-400/20 rounded-tr-lg pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-blue-400/20 rounded-bl-lg pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-blue-400/20 rounded-br-lg pointer-events-none" />

                    <AnimatePresence>
                        {isAnalyzing && (
                            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-blue-400/5 z-40 pointer-events-none overflow-hidden">
                              <MotionDiv animate={{ y: ['-100%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent transform-gpu" />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                    <Grid path={currentResult?.path || []} isAnalyzing={isAnalyzing} predictionId={currentResult?.id} revealRotten={revealRotten} gridData={currentResult?.gridData} language={language} />
                </div>
                
                <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-950 border border-blue-400/20 px-4 py-1.5 rounded-xl z-30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex-row">
                    <div className="flex items-center gap-2 flex-row">
                        <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-blue-400 animate-ping' : 'bg-blue-400/40'}`} />
                        <span className="text-[8px] font-mono text-white tracking-[0.2em] uppercase font-black">{isAnalyzing ? 'SCANNING' : 'LINKED'}</span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-2 flex-row">
                        <Users className="w-3.5 h-3.5 text-blue-400/60" />
                        <span className="text-[10px] font-black text-white font-mono tracking-tighter">{onlineUsersCount.toLocaleString()}</span>
                    </div>
                </MotionDiv>
            </MotionDiv>

            <div className="w-full max-w-sm relative z-10 shrink-0">
                <div className="flex flex-row gap-3">
                    <button onClick={handlePredict} disabled={isAnalyzing || isUpdating} className={`group relative flex-[1.5] h-16 rounded-[20px] overflow-hidden transition-all active:scale-[0.97] ${isAnalyzing ? 'bg-zinc-900 cursor-wait' : 'bg-white shadow-[0_10px_20px_rgba(59,130,246,0.15)] hover:bg-zinc-100'}`}>
                        {isAnalyzing && (
                            <MotionDiv 
                                initial={{ width: 0 }} 
                                animate={{ width: `${predictionProgress}%` }} 
                                className="absolute inset-y-0 bg-blue-500/20 pointer-events-none transform-gpu" 
                            />
                        )}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            {isAnalyzing ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                    <span className="text-[10px] font-black tracking-[0.5em] text-blue-500 uppercase italic font-en">DECRYPTING_...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 flex-row">
                                    <Zap className="w-5 h-5 text-black fill-current" />
                                    <span className="text-sm font-black tracking-[0.4em] text-black uppercase italic">{isRtl ? "ابدأ" : "START"}</span>
                                </div>
                            )}
                        </div>
                    </button>

                    <button onClick={handleNewGame} disabled={isUpdating || isAnalyzing} className="group relative flex-1 h-16 rounded-[20px] bg-zinc-950 text-zinc-400 hover:text-white transition-all active:scale-[0.97] flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                        <RotateCcw className={`w-5 h-5 ${isUpdating ? 'animate-spin text-blue-500' : ''}`} />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase italic">{isRtl ? "إعادة" : "RESTART"}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
