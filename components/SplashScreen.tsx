
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

const MotionDiv = motion.div as any;

interface SplashScreenProps {
  onComplete: () => void;
  language?: Language;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'en' }) => {
  const [exit, setExit] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const isArabic = language === 'ar';
  const logoUrl = "https://image2url.com/r2/default/images/1773147279768-d0d66ffa-ae4b-4560-b1b9-1dd3bd5a1eea.jpeg";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 3500;
    let startTime: number;
    let animationFrame: number;

    const updateProgress = () => {
      const now = performance.now();
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${calculatedProgress}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${Math.floor(calculatedProgress)}%`;
      }
      if (dotsRef.current) {
        const dots = dotsRef.current.children;
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i] as HTMLElement;
          if (calculatedProgress > (i + 1) * 20) {
            dot.style.backgroundColor = '#22d3ee';
            dot.style.boxShadow = '0 0 8px rgba(34,211,238,0.8)';
            dot.style.transform = 'scale(1.25)';
          } else {
            dot.style.backgroundColor = '#27272a';
            dot.style.boxShadow = 'none';
            dot.style.transform = 'scale(1)';
          }
        }
      }

      if (calculatedProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => setExit(true), 500);
        setTimeout(() => {
          onCompleteRef.current();
        }, 1200);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out
      ${exit ? 'opacity-0 scale-105 blur-xl' : 'opacity-100'}
      ${isArabic ? 'font-ar' : 'font-en'}`}>
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        <MotionDiv
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          {/* Logo Frame */}
          <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <img 
              src={logoUrl} 
              alt="Logo"
              className="w-full h-full object-cover select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 via-transparent to-transparent" />
          </div>
          
          {/* Outer Glow */}
          <div className="absolute -inset-4 bg-cyan-400/10 blur-2xl rounded-full -z-10 animate-pulse" />
        </MotionDiv>

        <MotionDiv
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl font-black tracking-[0.2em] text-white uppercase italic">
            SANFOR <span className="text-cyan-400">VIP</span>
          </h1>
          <div className="h-0.5 w-12 bg-cyan-400/50 mx-auto mt-2 rounded-full" />
        </MotionDiv>
      </div>

      {/* Bottom Progress Section */}
      <div className="absolute bottom-20 w-full max-w-[280px] flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-end px-1 mb-1">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {isArabic ? 'جاري التحميل' : 'INITIALIZING'}
          </span>
          <span ref={progressTextRef} className="text-sm font-black font-mono text-cyan-400 italic">
            0%
          </span>
        </div>

        {/* Unique Progress Bar Design */}
        <div className="relative w-full h-1.5 bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
          {/* Segmented Track Pattern */}
          <div className="absolute inset-0 opacity-20 flex justify-between px-1">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-white/10" />
            ))}
          </div>

          <div
            ref={progressBarRef}
            style={{ width: '0%' }}
            className="relative h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] will-change-[width]"
          >
            {/* Animated Highlight */}
            <MotionDiv
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </div>
        </div>

        {/* Status Dots */}
        <div ref={dotsRef} className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 h-1 rounded-full transition-all duration-500 bg-zinc-800" 
            />
          ))}
        </div>
      </div>

      <style>{`
        .font-ar { font-family: 'Cairo', sans-serif !important; }
        .font-en { font-family: 'Inter', sans-serif !important; }
      `}</style>
    </div>
  );
};
