
import React, { useMemo } from 'react';

interface ParticlesProps {
  theme?: 'dark' | 'light';
  count?: number;
}

export const Particles: React.FC<ParticlesProps> = ({ theme = 'dark', count = 30 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, [count]);

  const color = theme === 'dark' ? 'bg-red-500' : 'bg-red-400';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${color} animate-float-particle`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${-p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .animate-float-particle {
          animation-name: float-particle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
