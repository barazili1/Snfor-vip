
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Platform, 
  Language 
} from '../types';
import { 
  Check, 
  ChevronRight, 
  Terminal,
  Globe,
  ShieldCheck,
  Cpu,
  Loader2,
  Zap
} from 'lucide-react';
import { playSound } from '../services/audio';

const MotionDiv = motion.div as any;

interface SelectionScreenProps {
  onSelect: (platform: Platform) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.2 + 0.05,
      height: Math.random() * 60 + 30,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {drops.map((drop) => (
        <MotionDiv
          key={drop.id}
          initial={{ y: -200 }}
          animate={{ y: '110vh' }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            ease: "linear",
            delay: drop.delay,
          }}
          className="absolute bg-gradient-to-b from-cyan-600/0 via-cyan-600/40 to-cyan-600/0 w-[1px]"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
};

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, language, onLanguageChange }) => {
  const [selected, setSelected] = useState<Platform>('Linebet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const isRtl = language === 'ar';

  const platforms = [
    {
      id: 'Linebet' as Platform,
      name: 'Linebet',
      img: 'https://image2url.com/r2/default/images/1773147437136-c8aeb00e-a11f-4907-adbe-3996b52dff17.jpg',
      code: 'UPLINK_01',
      region: 'EU_WEST_1',
      load: 'STABLE'
    },
    {
      id: 'WoWBET' as Platform,
      name: 'WoWBET',
      img: 'WOW_CUSTOM',
      code: 'UPLINK_02',
      region: 'US_EAST_2',
      load: 'OPTIMAL'
    }
  ];

  const statusSteps = [
    isRtl ? "جاري تهيئة مصفوفة الاتصال" : "Initializing connection matrix",
    isRtl ? "تجاوز جدار الحماية المشفر" : "Bypassing encrypted firewall",
    isRtl ? "مزامنة بروتوكول SANFOR VIP" : "Syncing SANFOR VIP protocol",
    isRtl ? "تم إنشاء الرابط الآمن" : "Secure link established"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Hex Grid Pattern
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
      ctx.lineWidth = 1;
      const size = 40;
      for (let y = 0; y < canvas.height + size; y += size * 1.5) {
        for (let x = 0; x < canvas.width + size; x += size * Math.sqrt(3)) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (isConnecting) {
      const duration = 3000;
      const interval = 30;
      const stepValue = 100 / (duration / interval);
      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + stepValue;
          if (next >= 20 && !activeSteps.includes(0)) setActiveSteps(s => [...s, 0]);
          if (next >= 50 && !activeSteps.includes(1)) setActiveSteps(s => [...s, 1]);
          if (next >= 75 && !activeSteps.includes(2)) setActiveSteps(s => [...s, 2]);
          if (next >= 95 && !activeSteps.includes(3)) setActiveSteps(s => [...s, 3]);
          if (next >= 100) { clearInterval(timer); return 100; }
          return next;
        });
      }, interval);
      const finishTimer = setTimeout(() => { onSelect(selected); }, duration + 500);
      return () => { clearInterval(timer); clearTimeout(finishTimer); };
    }
  }, [isConnecting, onSelect, selected, activeSteps]);

  const handleProceed = () => {
    playSound('click');
    setIsConnecting(true);
  };

  return (
    <div className={`flex flex-col h-full bg-[#020202] relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <RainEffect />
      
      {/* SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* HUD DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-cyan-400/30" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-cyan-400/30" />
        <div className="absolute top-40 left-12 text-[6px] font-mono text-cyan-400 uppercase tracking-[0.8em] vertical-text">SANFOR_CORE_SYSTEM_v4.5</div>
        <div className="absolute bottom-40 right-12 text-[6px] font-mono text-cyan-400 uppercase tracking-[0.8em] vertical-text rotate-180">ENCRYPTION_LAYER_ACTIVE</div>
      </div>

      {/* TOP BAR */}
      <MotionDiv 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 bg-black/80 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-2xl"
      >
          <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute -inset-2 bg-cyan-400/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative w-11 h-11 rounded-xl bg-zinc-950 border border-cyan-400/30 flex items-center justify-center overflow-hidden shadow-2xl">
                    <img src="https://image2url.com/r2/default/images/1773147279768-d0d66ffa-ae4b-4560-b1b9-1dd3bd5a1eea.jpeg" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-black text-white tracking-[0.4em] uppercase italic leading-none">
                  SANFOR <span className="text-cyan-400">VIP</span>
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">System_Online_Secure</span>
                </div>
              </div>
          </div>
          <button 
              onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
              className="h-10 px-5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 hover:border-cyan-400/30 transition-all active:scale-95"
          >
              <Globe className="w-4 h-4 text-cyan-400" />
              {language === 'en' ? 'ARABIC' : 'ENGLISH'}
          </button>
      </MotionDiv>

      <div className="flex-1 flex flex-col pt-32 pb-12 px-8 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-md mx-auto w-full">
          
          <div className="text-center mb-16 relative">
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
              <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.5em] mb-2 block italic">MISSION_OBJECTIVE</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                {isRtl ? "اختر المنصة" : "SELECT UPLINK"}
              </h2>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-400/40" />
                <div className="w-1.5 h-1.5 rotate-45 border border-cyan-400/50" />
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-400/40" />
              </div>
            </MotionDiv>
          </div>

          <div className="space-y-6">
            {platforms.map((p, idx) => (
              <MotionDiv
                key={p.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.15 }}
              >
                <button 
                  onClick={() => { playSound('click'); setSelected(p.id); }}
                  disabled={isConnecting}
                  className={`group relative w-full rounded-[2rem] transition-all duration-500 overflow-hidden flex items-center p-5 border-2 ${
                    selected === p.id 
                      ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_50px_rgba(34,211,238,0.1)]' 
                      : 'border-white/5 bg-zinc-950/40 hover:border-white/10'
                  }`}
                >
                  {/* CARD DECORATIONS */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 blur-3xl rounded-full transition-opacity duration-500 ${selected === p.id ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="absolute top-4 right-6 text-[6px] font-mono text-zinc-700 uppercase tracking-widest">{p.region}</div>

                  <div className="relative">
                    <div className={`absolute -inset-1 bg-cyan-400/20 blur-md rounded-2xl transition-opacity duration-500 ${selected === p.id ? 'opacity-100' : 'opacity-0'}`} />
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black shrink-0 shadow-2xl">
                      {p.img === 'WOW_CUSTOM' ? (
                        <div className="w-full h-full bg-purple-600 flex items-center justify-center text-black font-black text-4xl">W</div>
                      ) : (
                        <img 
                          src={p.img} 
                          alt={p.name} 
                          className={`w-full h-full object-cover transition-all duration-1000 ${
                            selected === p.id ? 'grayscale-0 scale-110 opacity-100' : 'grayscale opacity-20 scale-100'
                          }`} 
                        />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-t from-cyan-400/40 via-transparent to-transparent transition-opacity duration-500 ${selected === p.id ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>

                  <div className={`flex-1 px-8 flex flex-col ${isRtl ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${selected === p.id ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]' : 'bg-zinc-800'}`} />
                      <span className={`text-[7px] font-black uppercase tracking-[0.3em] ${selected === p.id ? 'text-cyan-400' : 'text-zinc-600'}`}>
                        {p.code}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{p.name}</h3>
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[6px] font-mono text-zinc-500 uppercase tracking-widest">LOAD: {p.load}</div>
                      <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[6px] font-mono text-zinc-500 uppercase tracking-widest">PING: {Math.floor(Math.random() * 20 + 10)}ms</div>
                    </div>
                  </div>

                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${selected === p.id ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'bg-white/5 text-zinc-800'}`}>
                      {selected === p.id ? <Check className="w-6 h-6 stroke-[4px]" /> : <ChevronRight className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />}
                    </div>
                  </div>
                </button>
              </MotionDiv>
            ))}
          </div>

          <div className="mt-16 space-y-6">
            <button 
              onClick={handleProceed}
              disabled={isConnecting}
              className="group relative w-full h-16 rounded-2xl bg-cyan-400 text-black font-black text-[12px] tracking-[0.5em] uppercase flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(34,211,238,0.25)] active:scale-[0.98] transition-all disabled:opacity-20 overflow-hidden italic"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">{isRtl ? "بدء المزامنة" : "INITIALIZE SYNC"}</span>
              <Zap className="w-6 h-6 relative z-10 fill-current" />
            </button>
            
            <div className="flex justify-center gap-10 opacity-20">
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-cyan-400" />
                 <span className="text-[8px] font-mono text-white uppercase tracking-widest">Secure_Uplink</span>
               </div>
               <div className="flex items-center gap-2">
                 <Cpu size={14} className="text-cyan-400" />
                 <span className="text-[8px] font-mono text-white uppercase tracking-widest">Core_Sync</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONNECTION OVERLAY */}
      <AnimatePresence>
        {isConnecting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020202]/98 backdrop-blur-3xl p-8">
             <MotionDiv 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 1.05 }}
               className="w-full max-w-sm"
             >
                <div className="bg-zinc-950 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/20" />
                  
                  <div className="flex flex-col items-center mb-10">
                    <div className="relative mb-8">
                      <div className="absolute -inset-6 bg-cyan-400/20 blur-2xl rounded-full animate-pulse" />
                      <div className="relative w-24 h-24 rounded-[2rem] bg-black border border-cyan-400/30 flex items-center justify-center">
                          <Terminal className="w-12 h-12 text-cyan-400 animate-pulse" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-[0.3em] italic leading-none">{isRtl ? "جاري الربط" : "ESTABLISHING"}</h4>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.5em] mt-3 italic">SANFOR_ENCRYPTION_v4.5</span>
                  </div>

                  <div className="space-y-4 mb-10">
                     {statusSteps.map((step, i) => (
                       <div key={i} className={`flex items-center gap-5 transition-all duration-500 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'} ${activeSteps.includes(i) ? 'opacity-100' : 'opacity-10'}`}>
                         <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${activeSteps.includes(i) ? 'bg-cyan-400/10 border-cyan-400/50' : 'border-zinc-800'}`}>
                           {activeSteps.includes(i) ? <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3px]" /> : <Loader2 className="w-3.5 h-3.5 text-zinc-800 animate-spin" />}
                         </div>
                         <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">{step}</span>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">{isRtl ? "التقدم" : "UPLINK"}</span>
                      <span className="text-3xl font-black text-cyan-400 font-mono italic">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden p-[2px]">
                       <MotionDiv 
                         className="h-full bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]" 
                         style={{ width: `${progress}%` }} 
                       />
                    </div>
                  </div>
                </div>
             </MotionDiv>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
      `}</style>
    </div>
  );
};
