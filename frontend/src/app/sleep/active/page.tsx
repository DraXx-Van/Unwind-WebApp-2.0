'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSleepStore } from '@/store/sleepStore';

// Reusable Swipe Button Component
const SwipeButton = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [swiped, setSwiped] = useState(false);
  const [drag, setDrag] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (swiped) return;
    isDragging.current = true;
    startX.current = e.clientX - drag;
    const thumb = e.currentTarget as HTMLDivElement;
    thumb.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || swiped || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const maxDrag = containerWidth - 56; // 56 is approx width of the thumb + padding
    
    let newDrag = e.clientX - startX.current;
    if (newDrag < 0) newDrag = 0;
    if (newDrag > maxDrag) newDrag = maxDrag;
    
    setDrag(newDrag);

    if (newDrag >= maxDrag * 0.95) {
      setSwiped(true);
      isDragging.current = false;
      onComplete();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    if (!swiped) {
      setDrag(0); // Snap back
    }
    const thumb = e.currentTarget as HTMLDivElement;
    thumb.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-16 bg-[#4F3422] rounded-[2rem] flex items-center px-2 overflow-hidden shadow-lg touch-none"
    >
      <div className="absolute w-full text-center text-white font-semibold text-sm pointer-events-none opacity-90 pl-10 tracking-wide">
        {text}
      </div>
      <div 
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center z-10 cursor-grab active:cursor-grabbing shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-transform duration-75"
        style={{ transform: `translateX(${drag}px)`, transition: isDragging.current ? 'none' : 'transform 0.3s ease-out' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="text-[#4F3422] font-black text-lg tracking-tighter" style={{ marginLeft: '2px' }}>&rsaquo;&rsaquo;</span>
      </div>
    </div>
  );
};

function SleepActiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'sleep'; // 'sleep' or 'wake'
  const { addEntry } = useSleepStore();
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Track sleep start time in local storage or state to calculate duration on wake
  // We will just simulate getting 8.25h for the prompt's stats requirement if they wake up
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwipeComplete = async () => {
    if (mode === 'sleep') {
      // Just visually transition or navigate back to dashboard with state saying "sleeping"
      // In real app, we'd log the sleep start time. Here we route to wake mode for testing.
      setTimeout(() => {
        router.push('/sleep/active?mode=wake');
      }, 500);
    } else {
      // mode === 'wake'
      // Create actual SleepEntry
      const sleepTime = '22:15';
      const wakeTime = '06:30';
      const duration = 8.25; // 8.25 hours
      const rem = 2.14;  // Mocked corresponding to the Figma UI
      const core = 6.04; 
      const post = 0.2;  // 12 mins
      
      await addEntry('user-1', {
        duration,
        sleepTime,
        wakeTime,
        quality: 5,
        rem,
        core,
        post
      });
      
      setTimeout(() => {
        router.push('/sleep');
      }, 500);
    }
  };

  const isSleep = mode === 'sleep';
  const displayTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  
  // Audio effect for waking up
  useEffect(() => {
    if (!isSleep) {
      // Create a gentle wake-up beep using Web Audio API instead of a file
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playBeep = () => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
          
          osc.start(audioCtx.currentTime);
          osc.stop(audioCtx.currentTime + 0.5);
        };
        
        playBeep();
        const interval = setInterval(playBeep, 2000);
        return () => {
            clearInterval(interval);
            audioCtx.close();
        };
      } catch (e) {
        console.error("Audio failed", e);
      }
    }
  }, [isSleep]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FDFBF9] flex flex-col justify-between">
      {/* Dynamic Background Art */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-end justify-center overflow-hidden">
        {isSleep ? (
            // Sleeping character placeholder art mimicking the Figma
            <div className="w-full h-[50vh] relative flex justify-center items-end bottom-10">
              <div className="absolute bottom-8 w-[120%] h-48 bg-white/50 rounded-[50%] blur-xl opacity-80 z-0"></div>
              {/* Blanket */}
              <div className="w-full h-40 bg-white rounded-t-[4rem] absolute bottom-12 z-20 shadow-[-10px_-20px_40px_rgba(0,0,0,0.02)] border-t border-gray-100 flex justify-center">
                  <div className="w-24 h-4 rounded-full bg-gray-100 mt-4 opacity-50"></div>
              </div>
              {/* Character Base */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Hair */}
                <div className="w-32 h-24 bg-[#4F3422] rounded-full absolute -top-8 -left-4 blur-[1px]"></div>
                {/* Face & body */}
                <div className="w-48 h-32 bg-[#FEA26B] rounded-[3rem] rotate-[-5deg] relative flex items-center justify-center opacity-90">
                    {/* Closed Eye */}
                    <div className="w-8 h-3 border-b-4 border-[#4F3422] rounded-full absolute right-8 top-10 rotate-[-10deg]"></div>
                    {/* Smile */}
                    <div className="w-10 h-6 bg-white border-2 border-[#4F3422] rounded-b-full absolute right-8 top-16 rotate-[-10deg]"></div>
                    <div className="w-16 h-16 bg-[#FDE047] rounded-full absolute -bottom-6 -left-6 opacity-40 blur-lg"></div>
                </div>
              </div>
            </div>
        ) : (
            // Waking character placeholder art
            <div className="w-full h-[50vh] relative flex justify-center items-end bottom-10">
              {/* Rays */}
              <div className="absolute inset-0 bg-[#FE814B] opacity-5 blur-[100px] rounded-full scale-150 transform translate-y-20"></div>
              <div className="relative z-10 flex flex-col items-center bottom-20">
                {/* Hair */}
                <div className="w-40 h-16 bg-[#4F3422] rounded-full absolute -top-4 -left-10 rotate-[-15deg]"></div>
                {/* Arms stretching */}
                <div className="w-32 h-8 bg-[#FEA26B] absolute -left-20 top-10 rotate-[-30deg] rounded-full"></div>
                <div className="w-32 h-8 bg-[#FEA26B] absolute -right-20 top-0 rotate-[30deg] rounded-full"></div>
                {/* Face / shirt */}
                <div className="w-32 h-40 bg-gray-400 rounded-t-[3rem] relative flex justify-center">
                    <div className="w-16 h-20 bg-[#FEA26B] absolute -top-10 rounded-[2rem] flex flex-col items-center justify-center">
                        <div className="w-4 h-2 border-t-4 border-[#4F3422] rounded-full mt-2 "></div>
                    </div>
                </div>
              </div>
            </div>
        )}
      </div>

      {/* Typography Overlay */}
      <div className="relative z-20 flex flex-col items-center pt-20 px-6">
        <div className="px-4 py-1.5 rounded-full border-2 border-gray-200 text-[#A8988C] text-[10px] font-bold tracking-widest uppercase mb-10 bg-white/50 backdrop-blur-sm shadow-sm">
          {isSleep ? 'ALARM AT 06:00' : 'GOOD MORNING!'}
        </div>
        
        <h1 className="text-[1.75rem] font-bold text-[#4F3422] tracking-tight mb-2 text-center">
          {isSleep ? 'Good Night, Shinomiya!' : 'Wake Up, Shinomiya!'}
        </h1>
        
        <div className="flex items-baseline justify-center">
          <span className="text-[5.5rem] font-black tracking-tighter text-[#4F3422] leading-none">
            {displayTime.split(':')[0]}
          </span>
          <span className="text-[5.5rem] font-black tracking-tighter text-[#A8988C] leading-none mb-1 shadow-sm">
            :{displayTime.split(':')[1]}
          </span>
        </div>

        <div className="mt-8 flex items-center gap-2 bg-[#F3EFEA] px-5 py-2 rounded-full border border-[rgba(79,52,34,0.05)] shadow-inner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8988C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span className="text-sm font-bold text-[#A8988C]">Duration</span>
          <span className="text-sm font-black text-[#FEA26B] ml-1">{isSleep ? '00h 00m' : '08h 15m'}</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative w-full px-6 pb-12 z-20">
         <SwipeButton 
           text={isSleep ? "Swipe to Sleep!" : "Swipe to Wake Up!"} 
           onComplete={handleSwipeComplete} 
         />
      </div>
    </div>
  );
}

export default function SleepActivePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center font-bold text-[#4F3422]">Loading...</div>}>
      <SleepActiveContent />
    </Suspense>
  );
}
