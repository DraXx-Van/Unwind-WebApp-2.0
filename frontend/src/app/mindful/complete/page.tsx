
'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import Link from 'next/navigation';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Home, Sparkles, Award, Heart } from 'lucide-react';

const FloatingConfetti = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ y: -20, opacity: 0, scale: 0 }}
    animate={{ 
      y: [0, -100, -200], 
      opacity: [0, 1, 0],
      x: [0, (Math.random() - 0.5) * 200],
      rotate: [0, 360]
    }}
    transition={{ 
      duration: 3 + Math.random() * 2, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute z-20 pointer-events-none"
    style={{ 
        left: `${Math.random() * 100}%`,
        bottom: '20%'
    }}
  >
     <div className={`w-2 h-2 rounded-full ${['bg-[#9BB068]', 'bg-[#FE814B]', 'bg-[#FCEFCE]'][Math.floor(Math.random() * 3)]}`} />
  </motion.div>
);

function CompletePageContent() {
  const searchParams = useSearchParams();
  const activity = searchParams.get('activity') || 'Mindful Session';
  const duration = searchParams.get('duration') || '1'; 
  const durationSec = searchParams.get('durationSec');
  
  let displayDuration = `${duration}M`;
  if (durationSec) {
     const secs = parseInt(durationSec, 10);
     const m = Math.floor(secs / 60);
     const s = secs % 60;
     if (m > 0 && s > 0) displayDuration = `${m}M ${String(s).padStart(2, '0')}S`;
     else if (m > 0) displayDuration = `${m}M`;
     else displayDuration = `${s}S`;
  }
  
  const playedRef = useRef(false);

  useEffect(() => {
    if (!playedRef.current) {
        const audio = new Audio('/audio_assets/freesound_community-level-win-6416.mp3');
        audio.play().catch((e) => {
            if (e.name !== 'AbortError') console.log('Audio play failed:', e);
        });
        playedRef.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans relative overflow-hidden">
        
        {/* Animated Background Confetti */}
        {Array.from({ length: 15 }).map((_, i) => (
            <FloatingConfetti key={i} delay={i * 0.2} />
        ))}

        {/* Top Nav */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-30 pt-14 px-6 flex items-center mb-6"
        >
           <button onClick={() => window.location.href = '/mindful'} className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#4B3425] flex items-center justify-center text-[#4B3425] hover:bg-black/5 transition-colors absolute left-6">
             <ChevronLeft className="w-6 h-6" strokeWidth={3} />
           </button>
           <h1 className="w-full text-center font-black text-[19px] text-[#4B3425] tracking-wide ml-4">Mindful Exercise</h1>
        </motion.div>

        {/* Top Content */}
        <div className="pt-2 px-8 flex flex-col items-center z-20">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="w-16 h-16 rounded-3xl bg-[#9BB068]/10 flex items-center justify-center mb-6"
            >
                <Award className="w-8 h-8 text-[#9BB068]" strokeWidth={2.5} />
            </motion.div>

            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[42px] leading-[1.1] font-black text-[#4B3425] text-center mb-5 tracking-tight"
            >
                Exercise<br/>Completed!
            </motion.h1>
            
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[20px] text-[#766A65] font-bold mb-8"
            >
                {activity}
            </motion.p>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-2 border-[#4B3425] rounded-full px-6 py-2.5 flex items-center justify-center gap-3 bg-white shadow-sm"
            >
                <Sparkles className="w-4 h-4 text-[#FE814B]" />
                <span className="text-[#4B3425] text-[13px] font-black tracking-widest uppercase">
                    Duration: {displayDuration}
                </span>
            </motion.div>
        </div>

        {/* Dome Background */}
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-0 w-full h-[65%] overflow-hidden z-0 pointer-events-none"
        >
           <div className="absolute top-0 left-[-50%] w-[200%] h-[150%] bg-[#FFD2C2]" style={{ borderRadius: '50% 50% 0 0' }}></div>
        </motion.div>

        {/* Illustration - CENTERING FIX */}
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", damping: 20 }}
            className="absolute bottom-0 w-full flex justify-center z-10 pointer-events-none"
        >
             <motion.div 
                animate={{ 
                    y: [0, -10, 0],
                }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="w-[125%] max-w-[600px] mb-12 translate-x-[4%] sm:translate-x-[2%]"
             >
                 <Image 
                    src="/assets/Features_assets/Group 1 (1).svg" 
                    alt="Exercise Complete" 
                    width={600} 
                    height={600} 
                    className="w-full h-auto object-contain object-bottom"
                    priority
                 />
             </motion.div>
        </motion.div>

        {/* Sticky Bottom Home Button */}
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-8 left-0 px-8 w-full z-30"
        >
            <button 
              onClick={() => window.location.href = '/mindful'}
              className="w-full bg-[#4B3425] text-white py-5 rounded-[2rem] font-black text-[19px] tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-[0_12px_40px_rgba(75,52,37,0.25)] flex items-center justify-center gap-3"
            >
              Back to Home 
              <Home className="w-5 h-5" strokeWidth={3} />
            </button>
        </motion.div>
    </div>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center font-black text-[#4B3425] uppercase tracking-widest text-sm">Finishing Up...</div>}>
      <CompletePageContent />
    </Suspense>
  );
}
