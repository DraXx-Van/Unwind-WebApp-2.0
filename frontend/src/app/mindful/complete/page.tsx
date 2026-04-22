'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function CompletePageContent() {
  const searchParams = useSearchParams();
  const activity = searchParams.get('activity') || 'Mindful Session';
  const duration = searchParams.get('duration') || '1'; // fallback string
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
    // Prevent strict mode double-play
    if (!playedRef.current) {
        // Play positive chime sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch((e) => console.log('Audio play failed (browser policy):', e));
        playedRef.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans relative overflow-hidden">
        
        {/* Top Nav */}
        <div className="relative z-30 pt-14 px-6 flex items-center mb-6">
           <Link href="/mindful" className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#4B3425] flex items-center justify-center text-[#4B3425] hover:bg-black/5 transition-colors absolute left-6">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           </Link>
           <h1 className="w-full text-center font-extrabold text-[19px] text-[#4B3425] tracking-wide ml-4">Mindful Exercise</h1>
        </div>

        {/* Top Content */}
        <div className="pt-2 px-8 flex flex-col items-center z-20">
            <h1 className="text-[38px] leading-[1.1] font-extrabold text-[#4B3425] text-center mb-5 tracking-tight">
                Exercise<br/>Completed!
            </h1>
            
            <p className="text-[18px] text-[#766A65] font-medium mb-6">
                {activity}
            </p>

            <div className="border-[1.5px] border-[#4B3425] rounded-[32px] px-5 py-[8px] flex items-center justify-center gap-[10px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4B3425" strokeWidth="2.5"/>
                    <path d="M12 6V12L15 15" stroke="#4B3425" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[#4B3425] text-[12px] font-extrabold tracking-[0.08em] uppercase mt-[1px]">
                    Duration: {displayDuration}
                </span>
            </div>
        </div>

        {/* Bottom Half Background Wide Dome Curve */}
        <div className="absolute bottom-0 left-0 w-full h-[56%] overflow-hidden z-0 pointer-events-none">
           <div className="absolute top-0 left-[-50%] w-[200%] h-[150%] bg-[#FCEFCE]" style={{ borderRadius: '50% 50% 0 0' }}></div>
        </div>

        {/* Illustration */}
        <div className="absolute bottom-[20px] w-full flex justify-center z-10 pointer-events-none">
             {/* Scale up so it fills correctly edge-to-edge as seen in reference */}
             <div className="w-[120%] ml-[-5%]">
                 <Image 
                    src="/assets/Features_assets/exercise-completeIllustration.svg" 
                    alt="Exercise Complete" 
                    width={500} 
                    height={500} 
                    className="w-full object-contain object-bottom translate-y-[28px]"
                    priority
                 />
             </div>
        </div>

        {/* Sticky Bottom Home Button */}
        <div className="absolute bottom-8 left-0 px-6 w-full z-30">
            <Link 
              href="/mindful"
              className="w-full bg-[#4B3425] text-white py-[20px] rounded-[32px] font-extrabold text-[18px] tracking-wide hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_8px_30px_rgba(75,52,37,0.2)] flex items-center justify-center gap-3"
            >
              Back to Home 
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8C7.97056 3.02944 16.0294 3.02944 21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6V14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="10" y="12" width="4" height="4" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
        </div>
    </div>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center font-bold text-[#4B3425]">Loading...</div>}>
      <CompletePageContent />
    </Suspense>
  );
}
