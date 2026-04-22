'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSleepStore } from '@/store/sleepStore';

export default function AddSleep() {
  const router = useRouter();
  const { addEntry, isLoading } = useSleepStore();

  const [duration, setDuration] = useState(8);
  const [sleepTime, setSleepTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [quality, setQuality] = useState(3);

  // Derive duration automatically if needed, or let user set it manually
  // Keeping it simple with manual slider + time inputs for now to match the user request.

  const handleSave = async () => {
    await addEntry('user-1', {
      duration,
      sleepTime,
      wakeTime,
      quality,
    });
    router.push('/sleep');
  };

  return (
    <div className="min-h-screen bg-[#FDFBFACD] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-[#8e85ee] rounded-b-[40px] pt-12 pb-8 px-6 text-white relative shadow-sm z-10">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-medium tracking-wide">Log Sleep</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-32 overflow-y-auto">
        
        {/* Quality Selector */}
        <section className="mb-10 text-center">
          <h2 className="text-[#3F3D56] text-xl font-bold mb-6">How was your sleep?</h2>
          <div className="text-6xl font-extrabold text-[#8e85ee] mb-2">{quality}</div>
          <div className="text-gray-400 font-medium mb-8">Out of 5 (5 is Best)</div>
          
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8e85ee]"
          />
        </section>

        {/* Timings */}
        <section className="mb-10 flex gap-4">
          <div className="flex-1 bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0ece9]">
            <label className="block text-sm text-gray-400 font-medium mb-2">Bedtime</label>
            <input 
              type="time" 
              value={sleepTime} 
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full text-xl font-bold text-[#3F3D56] bg-transparent outline-none"
            />
          </div>
          <div className="flex-1 bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0ece9]">
            <label className="block text-sm text-gray-400 font-medium mb-2">Wake up</label>
            <input 
              type="time" 
              value={wakeTime} 
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full text-xl font-bold text-[#3F3D56] bg-transparent outline-none"
            />
          </div>
        </section>

        {/* Duration Slider */}
        <section className="mb-10">
          <h3 className="text-[#3F3D56] font-bold text-lg mb-4">Total duration logged (hours)</h3>
          <input 
            type="number" 
            step="0.5"
            min="0"
            max="24"
            value={duration} 
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full bg-white p-5 rounded-[24px] shadow-sm border border-[#f0ece9] text-xl font-bold text-[#3F3D56] outline-none"
          />
        </section>

      </div>

      {/* Sticky Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFBFACD] via-[#FDFBFACD] to-transparent">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-[#3F3D56] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-black transition-colors shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : null}
          {isLoading ? 'Saving...' : 'Save Sleep Entry'}
        </button>
      </div>
    </div>
  );
}
