'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMindfulSession() {
  const router = useRouter();

  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [activity, setActivity] = useState(''); // New input

  const handleStart = () => {
    if (!activity.trim()) return;
    router.push(`/mindful/timer?activity=${encodeURIComponent(activity)}&min=${minutes}&sec=${seconds}&category=CHIRPING BIRDS`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans relative">
      {/* Header - Simple transparent */}
      <div className="pt-14 px-6 flex items-center mb-8">
        <button onClick={() => router.back()} className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#4B3425] flex items-center justify-center text-[#4B3425] hover:bg-black/5 transition-colors absolute left-6 z-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="w-full text-center font-extrabold text-[19px] text-[#4B3425] tracking-wide ml-4">Add Mindful Exercise</h1>
      </div>

      <div className="flex-1 px-8 flex flex-col items-center">
        
        {/* Name Input */}
        <div className="w-full mb-10 max-w-[320px]">
           <label className="text-[#4B3425] text-[22px] font-extrabold text-center block mb-4 tracking-tight">Name of your exercise?</label>
           <input 
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g. Deep Meditation"
              className="w-full bg-white text-[#4B3425] px-6 py-4 rounded-[24px] font-bold text-lg text-center shadow-[0_4px_15px_rgba(75,52,37,0.04)] outline-none border-2 border-transparent focus:border-[#9BB068] transition-colors placeholder:text-[#A69B93]"
           />
        </div>

        {/* Main Title */}
        <h2 className="text-[#4B3425] text-[22px] leading-[1.15] font-extrabold text-center mb-6 max-w-[320px] tracking-tight">
          How long do you want to do this exercise?
        </h2>

        {/* Inputs */}
        <div className="flex items-center justify-center gap-4 mb-10 w-full">
           <div className="relative">
              <input
                 type="number"
                 className="w-[140px] h-[140px] bg-[#9BB068] text-white rounded-[40px] text-center text-[56px] font-extrabold shadow-[0_4px_15px_rgba(155,176,104,0.3)] outline-none placeholder:text-white/50"
                 value={minutes.toString().padStart(2, '0')}
                 onChange={(e) => {
                    const str = e.target.value.replace(/^0+/, '');
                    setMinutes(Math.min(99, Math.max(0, parseInt(str || '0'))));
                 }}
              />
              <span className="absolute bottom-4 left-0 w-full text-center text-white/80 font-bold text-xs uppercase tracking-widest">MIN</span>
           </div>
           
           <div className="relative">
              <input
                 type="number"
                 className="w-[140px] h-[140px] bg-white text-[#4B3425] rounded-[40px] text-center text-[56px] font-extrabold shadow-[0_4px_15px_rgba(75,52,37,0.04)] outline-none placeholder:text-[#4B3425]/50 border border-gray-50"
                 value={seconds.toString().padStart(2, '0')}
                 onChange={(e) => {
                    const str = e.target.value.replace(/^0+/, '');
                    setSeconds(Math.min(59, Math.max(0, parseInt(str || '0'))));
                 }}
              />
              <span className="absolute bottom-4 left-0 w-full text-center text-[#A69B93] font-bold text-xs uppercase tracking-widest">SEC</span>
           </div>
        </div>

        {/* Sound Pill */}
        <button className="bg-[#EEDDCA] text-[#A6785D] px-8 py-3.5 rounded-full font-bold text-xs tracking-[0.1em] uppercase flex items-center gap-3 active:scale-95 transition-transform hover:bg-[#e4d1bd]">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M8 12H10M12 8V16M16 10V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
           </svg>
           Sound: Chirping Birds
        </button>

      </div>

      {/* Sticky Bottom Start Button */}
      <div className="px-6 pb-12 w-full mt-auto">
        <button 
          onClick={handleStart}
          disabled={!activity.trim() || (minutes === 0 && seconds === 0)}
          className="w-full bg-[#4B3425] text-white py-[22px] rounded-[32px] font-extrabold text-[19px] tracking-wide hover:scale-[1.02] transition-transform shadow-[0_8px_30px_rgba(75,52,37,0.2)] disabled:opacity-70 flex items-center justify-center gap-3 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          Start Exercise 
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2.5"/>
             <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
