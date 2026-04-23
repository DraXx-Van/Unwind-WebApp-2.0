'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSleepStore } from '@/store/sleepStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Calendar, ChevronDown } from 'lucide-react';

export default function SleepSchedulePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { schedule, fetchSchedule, setSchedule } = useSleepStore();

  const [sleepTime, setSleepTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [snoozeLength, setSnoozeLength] = useState(3);
  const [repeatMode, setRepeatMode] = useState<'Today' | 'Everyday'>('Everyday');
  const [autoStats, setAutoStats] = useState(true);
  const [autoAlarm, setAutoAlarm] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSchedule();
    }
  }, [fetchSchedule, user?.id]);

  useEffect(() => {
    if (schedule) {
      setSleepTime(schedule.sleepTime);
      setWakeTime(schedule.wakeTime);
      setSnoozeLength(schedule.snoozeLength);
      setRepeatMode(schedule.isToday ? 'Today' : 'Everyday');
      setAutoStats(schedule.autoStats);
      setAutoAlarm(schedule.autoAlarm);
    }
  }, [schedule]);

  const formatTime = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleSetSchedule = async () => {
    if (!user?.id) return;
    await setSchedule({
      isEveryday: repeatMode === 'Everyday',
      isToday: repeatMode === 'Today',
      sleepTime,
      wakeTime,
      snoozeLength,
      autoStats,
      autoAlarm,
    });
    router.push('/sleep');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-32 font-sans px-6 pt-12">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={() => router.back()} className="w-12 h-12 rounded-full border-2 border-[#Eae6e1] flex items-center justify-center bg-white text-[#4B3425] hover:bg-gray-50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <h1 className="text-[34px] font-extrabold text-[#4B3425] mb-8 tracking-tight">Edit Sleep schedule</h1>

      {/* Time Selectors */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative cursor-pointer">
          <label className="block text-[#4B3425] font-bold text-sm mb-2">Sleep At</label>
          <div className="bg-white rounded-full px-4 py-3 border border-[#Eae6e1] shadow-sm flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 text-[#4B3425] font-semibold">
              <Calendar className="w-5 h-5" />
              {formatTime(sleepTime)}
            </div>
            <ChevronDown className="w-5 h-5 text-[#4B3425] opacity-50" />
          </div>
          <input
             type="time"
             value={sleepTime}
             onChange={(e) => setSleepTime(e.target.value)}
             className="absolute top-8 left-0 w-full h-[52px] opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex-1 relative cursor-pointer">
          <label className="block text-[#4B3425] font-bold text-sm mb-2">Wake Up At</label>
          <div className="bg-white rounded-full px-4 py-3 border border-[#Eae6e1] shadow-sm flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 text-[#4B3425] font-semibold">
              <Calendar className="w-5 h-5" />
              {formatTime(wakeTime)}
            </div>
            <ChevronDown className="w-5 h-5 text-[#4B3425] opacity-50" />
          </div>
          <input
             type="time"
             value={wakeTime}
             onChange={(e) => setWakeTime(e.target.value)}
             className="absolute top-8 left-0 w-full h-[52px] opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Repeat Snooze Slider */}
      <div className="mb-10">
        <label className="block text-[#4B3425] font-bold text-sm mb-4">Repeat Snooze</label>
        <div className="relative w-full h-2 bg-[#EAE6E1] rounded-full mt-2 mb-2">
            {/* Active Track Gradient */}
            <div 
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#C2D6A2] to-[#9BB068]"
                style={{ width: `${((snoozeLength - 1) / 4) * 100}%` }}
            ></div>
            
            {/* Standard Range Slider invisibly overlapping to capture scrub */}
            <input 
                type="range" 
                min="1" 
                max="5" 
                value={snoozeLength} 
                onChange={(e) => setSnoozeLength(parseInt(e.target.value))}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {/* Custom Thumb */}
            <div 
                className="absolute top-1/2 -content-1/2 w-6 h-6 bg-[#9BB068] rounded-full shadow border-2 border-white pointer-events-none transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${((snoozeLength - 1) / 4) * 100}%` }}
            ></div>
        </div>
        <div className="flex justify-between text-xs font-semibold text-gray-400 px-1 mt-3">
          <span>1</span>
          <span className="text-[#4B3425]">3</span>
          <span>5</span>
        </div>
      </div>

      {/* Simplified Repeat Options (Today / Everyday) */}
      <div className="mb-10">
        <label className="block text-[#4B3425] font-bold text-sm mb-4">Auto Repeat</label>
        <div className="flex gap-4">
          <div 
            onClick={() => setRepeatMode('Today')}
            className={`flex-1 flex items-center justify-between px-5 py-4 rounded-3xl cursor-pointer transition-colors border-2 shadow-sm ${repeatMode === 'Today' ? 'bg-[#9BB068] border-[#9BB068] text-white' : 'bg-white border-[#Eae6e1] text-[#4B3425]'}`}
          >
            <span className="font-bold text-lg">Today</span>
            {repeatMode === 'Today' ? (
               <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-transparent">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
               </div>
            ) : (
               <div className="w-6 h-6 rounded-full border-2 border-[#Eae6e1] bg-white"></div>
            )}
          </div>

          <div 
            onClick={() => setRepeatMode('Everyday')}
            className={`flex-1 flex items-center justify-between px-5 py-4 rounded-3xl cursor-pointer transition-colors border-2 shadow-sm ${repeatMode === 'Everyday' ? 'bg-[#9BB068] border-[#9BB068] text-white' : 'bg-white border-[#Eae6e1] text-[#4B3425]'}`}
          >
            <span className="font-bold text-lg">Everyday</span>
            {repeatMode === 'Everyday' ? (
               <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-transparent">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
               </div>
            ) : (
               <div className="w-6 h-6 rounded-full border-2 border-[#Eae6e1] bg-white"></div>
            )}
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-6 mb-12">
        {/* Toggle 1 */}
        <div className="flex justify-between items-center">
          <span className="text-[#4B3425] font-bold text-sm">Auto Display Sleep Stats</span>
          <button 
            onClick={() => setAutoStats(!autoStats)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${autoStats ? 'bg-[#9BB068]' : 'bg-[#EAE6E1]'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${autoStats ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="flex justify-between items-center">
          <span className="text-[#4B3425] font-bold text-sm">Auto Set Alarm</span>
          <button 
            onClick={() => setAutoAlarm(!autoAlarm)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${autoAlarm ? 'bg-[#9BB068]' : 'bg-[#EAE6E1]'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${autoAlarm ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-auto">
        <button 
          onClick={handleSetSchedule}
          className="w-full bg-[#FE814B] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Set Sleep Schedule <span className="text-2xl font-normal leading-none mb-0.5">+</span>
        </button>
      </div>

    </div>
  );
}
