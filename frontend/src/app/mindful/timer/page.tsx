'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMindfulStore } from '@/store/mindfulStore';
import Link from 'next/link';

function TimerPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addEntry, updateEntry } = useMindfulStore();

  const activity = searchParams.get('activity') || 'Mindful Session';
  const category = searchParams.get('category') || 'NATURE';
  const initialMin = parseInt(searchParams.get('min') || '25', 10);
  const initialSec = parseInt(searchParams.get('sec') || '0', 10);
  const sessionId = searchParams.get('sessionId');
  
  const initialTotalSeconds = initialMin * 60 + initialSec;

  const [timeLeft, setTimeLeft] = useState(initialTotalSeconds);
  const [isPlaying, setIsPlaying] = useState(true);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsPlaying(false);
      if (isPlaying) { // prevent double trigger
         handleCompletion();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleCompletion = async () => {
     // Saved full time elapsed
     const durationPlayedSec = initialTotalSeconds; 
     const playedMinutesFloat = parseFloat((durationPlayedSec / 60).toFixed(2));

     if (durationPlayedSec > 0) {
         if (sessionId) {
              await updateEntry(sessionId, playedMinutesFloat);
         } else {
              await addEntry('user-1', {
                  activity: activity,
                  duration: playedMinutesFloat,
                  plannedDuration: parseFloat((initialTotalSeconds / 60).toFixed(2)),
                  category: category,
                  timeOfDay: 'MORNING'
              });
         }
     }

     // Route to completion screen
     router.push(`/mindful/complete?activity=${encodeURIComponent(activity)}&durationSec=${initialTotalSeconds}`);
  };

  const handleExitEarly = async () => {
     // Partial time logged on abort
     const durationPlayedSec = initialTotalSeconds - timeLeft;
     const playedMinutesFloat = parseFloat((durationPlayedSec / 60).toFixed(2));
     
     if (durationPlayedSec > 0) {
         if (sessionId) {
              await updateEntry(sessionId, playedMinutesFloat);
         } else {
              await addEntry('user-1', {
                  activity: activity,
                  duration: playedMinutesFloat,
                  plannedDuration: parseFloat((initialTotalSeconds / 60).toFixed(2)),
                  category: category,
                  timeOfDay: 'MORNING'
              });
         }
     }
     // Directly discard rendering modal and quietly return to Mindful tracking Home
     router.push('/mindful');
  };

  // Format time
  const displayMin = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const displaySec = (timeLeft % 60).toString().padStart(2, '0');

  // Ring calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = timeLeft / initialTotalSeconds;
  const strokeDashoffset = circumference - (progressPercent * circumference);

  return (
    <div className="min-h-screen bg-[#9BB068] relative flex flex-col font-sans overflow-hidden">
      
      {/* Background Vectors based on timer_css.txt */}
      {/* Top right wave curve */}
      <div className="absolute top-[35px] right-[25px] opacity-40">
         <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 80 Q 30 110 60 70 T 120 60" stroke="#7D944D" strokeWidth="12" strokeLinecap="round" fill="none" />
         </svg>
      </div>

      <div className="absolute top-[-30px] right-[100px] opacity-40">
         <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="26" stroke="#7D944D" strokeWidth="10" fill="none" strokeDasharray="60 30" />
         </svg>
      </div>

      <div className="absolute top-[280px] right-[30px] opacity-[0.32]">
         <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="12" fill="#7D944D" />
         </svg>
      </div>

      {/* Vector: left: -204px; top: 140px; w:280, h:272 */}
      <div className="absolute w-[280px] h-[272px] rounded-full bg-[#7D944D] opacity-[0.32]" style={{ left: '-204px', top: '140px' }}></div>
      
      {/* Vector: left: -37px; top: 593px; w:149, h:137 */}
      <div className="absolute w-[180px] h-[70px] rounded-[100px] border-[14px] border-[#7D944D] opacity-[0.32] rotate-[-45deg]" style={{ left: '-30px', top: '580px' }}></div>

      {/* Vector: bottom right opacity 64 */}
      <div className="absolute w-[140px] h-[140px] rounded-full bg-[#7D944D] opacity-[0.24] border-[26px] border-[#7D944D]" style={{ right: '-50px', bottom: '-50px', background: 'transparent' }}></div>

      {/* Top Nav */}
      <div className="relative z-10 pt-14 px-6 flex items-center mb-8">
        <button onClick={handleExitEarly} className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#FFFFFF] flex items-center justify-center text-[#FFFFFF] hover:bg-white/10 transition-colors absolute left-6 z-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="w-full text-center font-extrabold text-[19px] text-[#FFFFFF] tracking-wide ml-4">Mindful Exercise</h1>
      </div>

      <div className="relative z-10 flex-1 px-8 flex flex-col items-center">
        
        {/* Main Title - Task Name */}
        <h2 className="text-white text-[38px] leading-[1.1] font-extrabold text-center mt-[48px] mb-[64px] tracking-tight max-w-[300px] break-words">
          {activity}
        </h2>

        {/* Circular Timer Ring */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            {/* Background Ring */}
            <svg viewBox="0 0 200 200" className="absolute top-0 left-0 w-[180px] h-[180px] -rotate-90">
                <circle cx="100" cy="100" r={80} fill="none" stroke="#B4C48D" strokeWidth="16" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r={80} 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="16" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
            </svg>

            {/* Play / Pause Toggle inside Ring */}
            <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="w-[80px] h-[80px] rounded-full flex items-center justify-center z-10 outline-none transform transition-transform active:scale-[0.85]"
            >
               {isPlaying ? (
                  // Pause Icon (two thick white bars)
                  <div className="flex gap-[8px] items-center justify-center">
                     <div className="w-[12px] h-[36px] bg-white rounded-full"></div>
                     <div className="w-[12px] h-[36px] bg-white rounded-full"></div>
                  </div>
               ) : (
                  // Play Icon
                  <div className="ml-1 w-0 h-0 border-t-[16px] border-t-transparent border-l-[26px] border-l-white border-b-[16px] border-b-transparent rounded-sm"></div>
               )}
            </button>
        </div>

        {/* Time Remaining */}
        <div className="mt-[48px] text-[40px] font-extrabold text-white tracking-tight leading-none drop-shadow-sm">
           {displayMin}:{displaySec}
        </div>

      </div>

      {/* Sticky Bottom Home Button */}
      <div className="absolute bottom-8 left-0 px-6 w-full z-20">
          <button 
             onClick={handleExitEarly}
             className="w-full bg-[#4B3425] text-white py-[20px] rounded-[32px] font-extrabold text-[18px] tracking-wide hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_8px_30px_rgba(75,52,37,0.2)] flex items-center justify-center gap-3"
          >
             Back to Home
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8C7.97056 3.02944 16.0294 3.02944 21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6V14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="10" y="12" width="4" height="4" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
      </div>

    </div>
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#9BB068] flex items-center justify-center font-bold text-white">Loading...</div>}>
      <TimerPageContent />
    </Suspense>
  );
}
