
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Music, X, Check } from 'lucide-react';

const SOUNDS = [
  { id: 'healing', name: 'Healing Sound (639 Hz)', file: '/audio_assets/sonorahealing-healing-sound-639-hz-mp3-452271.mp3' },
  { id: 'comedy', name: 'Funny Background', file: '/audio_assets/starostin-comedy-cartoon-funny-background-music-492540.mp3' },
  { id: 'none', name: 'No Sound', file: '' }
];

function AddMindfulSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [activity, setActivity] = useState('');
  const [selectedSound, setSelectedSound] = useState(SOUNDS[0]);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  // Pre-fill from URL params
  useEffect(() => {
    const activityName = searchParams.get('activityName') || searchParams.get('activity');
    const duration = searchParams.get('duration');
    const min = searchParams.get('min');
    const sec = searchParams.get('sec');

    if (activityName) setActivity(activityName);
    if (duration) setMinutes(parseInt(duration, 10));
    else if (min) setMinutes(parseInt(min, 10));
    
    if (sec) setSeconds(parseInt(sec, 10));
  }, [searchParams]);

  const handleStart = () => {
    if (!activity.trim()) return;
    const params = new URLSearchParams({
        activityName: activity,
        min: minutes.toString(),
        sec: seconds.toString(),
        soundFile: selectedSound.file,
        soundName: selectedSound.name
    });
    router.push(`/mindful/timer?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans relative overflow-hidden">
      {/* Header */}
      <div className="pt-14 px-6 flex items-center mb-8">
        <button onClick={() => router.back()} className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#4B3425] flex items-center justify-center text-[#4B3425] hover:bg-black/5 transition-colors absolute left-6 z-20">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="w-full text-center font-black text-[19px] text-[#4B3425] tracking-wide">Add Mindful Exercise</h1>
      </div>

      <div className="flex-1 px-8 flex flex-col items-center">
        
        {/* Name Input */}
        <div className="w-full mb-10 max-w-[320px]">
           <label className="text-[#4B3425] text-[22px] font-black text-center block mb-4 tracking-tight">Name of your exercise?</label>
           <input 
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g. Deep Meditation"
              className="w-full bg-white text-[#4B3425] px-6 py-4 rounded-[24px] font-black text-lg text-center shadow-[0_4px_20px_rgba(75,52,37,0.04)] outline-none border-2 border-transparent focus:border-[#9BB068] transition-all placeholder:text-[#A69B93]"
           />
        </div>

        {/* Main Title */}
        <h2 className="text-[#4B3425] text-[22px] leading-[1.15] font-black text-center mb-6 max-w-[320px] tracking-tight">
          How long do you want to do this exercise?
        </h2>

        {/* Time Inputs */}
        <div className="flex items-center justify-center gap-4 mb-10 w-full">
           <div className="relative">
              <input
                 type="number"
                 className="w-[140px] h-[140px] bg-[#9BB068] text-white rounded-[40px] text-center text-[56px] font-black shadow-[0_8px_20px_rgba(155,176,104,0.3)] outline-none placeholder:text-white/50"
                 value={minutes.toString().padStart(2, '0')}
                 onChange={(e) => {
                    const str = e.target.value.replace(/^0+/, '');
                    setMinutes(Math.min(99, Math.max(0, parseInt(str || '0'))));
                 }}
              />
              <span className="absolute bottom-4 left-0 w-full text-center text-white/80 font-black text-[10px] uppercase tracking-widest">MIN</span>
           </div>
           
           <div className="relative">
              <input
                 type="number"
                 className="w-[140px] h-[140px] bg-white text-[#4B3425] rounded-[40px] text-center text-[56px] font-black shadow-[0_8px_20px_rgba(75,52,37,0.04)] outline-none placeholder:text-[#4B3425]/50 border border-gray-50"
                 value={seconds.toString().padStart(2, '0')}
                 onChange={(e) => {
                    const str = e.target.value.replace(/^0+/, '');
                    setSeconds(Math.min(59, Math.max(0, parseInt(str || '0'))));
                 }}
              />
              <span className="absolute bottom-4 left-0 w-full text-center text-[#A69B93] font-black text-[10px] uppercase tracking-widest">SEC</span>
           </div>
        </div>

        {/* Sound Pill */}
        <button 
            onClick={() => setShowSoundPicker(true)}
            className="bg-[#EEDDCA] text-[#A6785D] px-8 py-3.5 rounded-full font-black text-[11px] tracking-[0.15em] uppercase flex items-center gap-3 active:scale-95 transition-all hover:bg-[#e4d1bd] shadow-sm"
        >
           <Music className="w-4 h-4" />
           Sound: {selectedSound.name}
        </button>

      </div>

      {/* Start Button */}
      <div className="px-6 pb-12 w-full mt-auto">
        <button 
          onClick={handleStart}
          disabled={!activity.trim() || (minutes === 0 && seconds === 0)}
          className="w-full bg-[#4B3425] text-white py-[22px] rounded-[32px] font-black text-[19px] tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-[0_8px_30px_rgba(75,52,37,0.2)] disabled:opacity-70 flex items-center justify-center gap-3 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          Start Exercise 
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
        </button>
      </div>

      {/* Sound Picker Sheet */}
      <AnimatePresence>
        {showSoundPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSoundPicker(false)}
              className="fixed inset-0 bg-[#4B3425]/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[70] p-8 pb-12 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#4B3425] tracking-tight">Select Sound</h3>
                <button 
                    onClick={() => setShowSoundPicker(false)}
                    className="w-10 h-10 rounded-full bg-[#F7F4F2] flex items-center justify-center"
                >
                    <X className="w-5 h-5 text-[#4B3425]" />
                </button>
              </div>

              <div className="space-y-3">
                {SOUNDS.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => {
                        setSelectedSound(sound);
                        setShowSoundPicker(false);
                    }}
                    className={`w-full p-6 rounded-[24px] flex items-center justify-between transition-all ${
                        selectedSound.id === sound.id 
                        ? 'bg-[#9BB068] text-white shadow-lg shadow-[#9BB068]/20' 
                        : 'bg-[#F7F4F2] text-[#4B3425] hover:bg-[#efede9]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedSound.id === sound.id ? 'bg-white/20' : 'bg-[#4B3425]/5'
                        }`}>
                            <Music className="w-5 h-5" />
                        </div>
                        <span className="font-black text-lg">{sound.name}</span>
                    </div>
                    {selectedSound.id === sound.id && <Check className="w-6 h-6" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AddMindfulSession() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddMindfulSessionContent />
        </Suspense>
    );
}
