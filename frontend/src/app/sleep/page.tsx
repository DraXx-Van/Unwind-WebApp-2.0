'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSleepStore, sleptToday } from '@/store/sleepStore';
import Link from 'next/link';
import { Moon, Sun, Plus, BellRing } from 'lucide-react';
import { TabBar } from '@/components/dashboard/TabBar';

// Returns true if the scheduled sleep time is within the next `windowMins` minutes
function isSleepTimeSoon(sleepTimeHHMM: string, windowMins = 10): boolean {
  const [h, m] = sleepTimeHHMM.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);

  // Handle overnight case: if target is before now, it's tomorrow
  if (target <= now) target.setDate(target.getDate() + 1);

  const diffMs = target.getTime() - now.getTime();
  const diffMins = diffMs / 60000;
  return diffMins >= 0 && diffMins <= windowMins;
}

export default function SleepDashboard() {
  const router = useRouter();
  const {
    latestEntry, schedule, weeklyQuality, isLoading,
    activeSleepStart,
    fetchLatest, fetchSchedule, fetchWeeklyQuality, initTimer,
  } = useSleepStore();

  useEffect(() => {
    initTimer();
    fetchLatest('user-1');
    fetchSchedule('user-1');
    fetchWeeklyQuality('user-1');
  }, [fetchLatest, fetchSchedule, fetchWeeklyQuality, initTimer]);

  // Proximity & timer state
  const sleepSoon = schedule ? isSleepTimeSoon(schedule.sleepTime, 10) : false;
  const isSleeping = !!activeSleepStart;
  const doneToday = sleptToday(latestEntry);

  const qualityScore = weeklyQuality > 0 ? weeklyQuality : (latestEntry?.quality || 0);
  let qualityText = "No Data Yet";
  if (qualityScore > 0) {
    qualityText = qualityScore <= 30 ? 'Insomniac' : qualityScore <= 70 ? 'Average Sleeper' : 'Great Sleeper';
  }

  const formatTime = (time24: string) => {
    if (!time24) return '--:--';
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    const [hours, minutes] = parts;
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const todayStr = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  // Calculations for Stats (Based on actual entry duration, or 0)
  const duration = latestEntry?.duration || 0;
  
  // Averages based on sleep science: REM ~25%, Core ~55%
  const remValue = (duration * 0.25).toFixed(1);
  const coreValue = (duration * 0.55).toFixed(1);

  // SVG Dashboard Arrays (Circumference = 2 * pi * r = 2 * 3.1415 * 40 = 251.2)
  const remOffset = duration > 0 ? 251.2 * (1 - 0.25) : 251.2;
  const coreOffset = duration > 0 ? 251.2 * (1 - 0.55) : 251.2;

  const displaySleep = schedule?.sleepTime || '--:--';
  const displayWake = schedule?.wakeTime || '--:--';

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Top Purple Section */}
      <div className="bg-[#A89CFC] pt-14 pb-28 px-6 relative flex flex-col items-center overflow-hidden z-0">
        {/* Abstract Blobs */}
        <div className="absolute top-10 left-5 w-40 h-40 bg-white/10 rounded-[40px] rotate-12 blur-[1px]"></div>
        <div className="absolute top-40 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[1px]"></div>
        
        {/* Header Ribbon */}
        <div className="w-full flex justify-between items-center relative z-10 mb-8">
          <Link href="/" className="w-10 h-10 border border-white/80 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="text-white font-bold text-lg absolute left-1/2 -translate-x-1/2">Sleep Quality</span>
          <div className="w-10 h-10"></div>
        </div>

        {/* Level & Status */}
        <div className="flex flex-col items-center relative z-10 mb-4">
          <h1 className="text-[72px] sm:text-[84px] font-extrabold text-white leading-none tracking-tight drop-shadow-sm mb-1">
            {qualityScore > 0 ? qualityScore : '--'}
          </h1>
          <p className="text-white/90 text-[18px] sm:text-[20px] font-medium tracking-wide">
            {qualityScore > 0 ? `You are ${qualityText}.` : qualityText}
          </p>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="bg-white flex-1 w-full -mt-12 relative z-10 px-6 pt-10 pb-32 flex flex-col items-center">
        
        {/* Custom SVG Curve */}
        <div className="absolute top-[-39px] left-0 w-full h-[40px] overflow-hidden pointer-events-none">
            <svg viewBox="0 0 375 40" preserveAspectRatio="none" className="w-full h-[41px]">
                <path d="M0,40 L0,20 Q187.5,-20 375,20 L375,40 Z" fill="#FFFFFF" />
            </svg>
        </div>

        {/* Floating Add Button */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30">
          <Link href="/sleep/schedule" className="w-[68px] h-[68px] bg-[#4B3425] rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition-transform active:scale-95">
            <Plus className="text-white w-8 h-8" strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── Sleeping Right Now Indicator ── */}
        {isSleeping && !doneToday && (
          <div className="w-full max-w-sm mb-4">
            <div className="bg-[#A89CFC]/15 border border-[#A89CFC]/40 rounded-3xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#A89CFC] animate-pulse"></div>
                <div>
                  <p className="text-[#4B3425] font-bold text-[13px]">Sleeping now</p>
                  <p className="text-[#4B3425]/60 text-[11px] font-medium">
                    Started at {activeSleepStart ? new Date(activeSleepStart).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
              <Link href="/sleep/popup" className="bg-[#A89CFC] text-white text-xs font-bold px-4 py-2 rounded-full">
                Wake Up
              </Link>
            </div>
          </div>
        )}

        {/* ── Bedtime Soon Banner ── */}
        {sleepSoon && !isSleeping && !doneToday && (
          <div className="w-full max-w-sm mb-4">
            <Link href="/sleep/popup">
              <div className="bg-[#4B3425] rounded-3xl px-5 py-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-[13px]">Almost bedtime!</p>
                    <p className="text-white/60 text-[11px] font-medium">Sleep time at {schedule ? formatTime(schedule.sleepTime) : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-full">
                  <BellRing className="w-3.5 h-3.5" />
                  Start Sleep
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* ── Today's Sleep Completed Banner ── */}
        {doneToday && latestEntry && (
          <div className="w-full max-w-sm mb-4">
            <Link href="/sleep/stats">
              <div className="bg-[#4B3425] rounded-3xl px-5 py-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9BB068] flex items-center justify-center flex-shrink-0">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-[13px]">Tonight's sleep completed ✓</p>
                    <p className="text-white/60 text-[11px] font-medium">
                      {latestEntry.duration.toFixed(1)}h · {formatTime(latestEntry.sleepTime)} → {formatTime(latestEntry.wakeTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs font-bold">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Stats</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="w-full max-w-sm flex justify-between items-center mb-6">
          <h2 className="text-[#4B3425] text-[18px] font-bold tracking-tight">Sleep Overview ({todayStr})</h2>
          <button className="text-[#9BB068] text-[14px] font-medium hover:underline transition-all">
            See All
          </button>
        </div>

        {/* Content Block (Switch between Empty State and 4-Card Grid) */}
        {!schedule ? (
          
          <div className="w-full max-w-sm flex flex-col items-center mt-8 mb-8 px-4 text-center">
            <div className="w-20 h-20 mb-6 bg-[#FAF9F7] rounded-full flex items-center justify-center border-2 border-[#EAE6E1]">
              <Moon className="w-8 h-8 text-[#4B3425] opacity-60" />
            </div>
            <h3 className="text-[#4B3425] font-extrabold text-xl mb-3 tracking-tight">No Schedule Set</h3>
            <p className="text-[#4B3425]/70 text-sm mb-8 px-4 leading-relaxed font-medium">Set your sleep parameters to start tracking biological phases and calculate weekly quality.</p>
            <Link href="/sleep/schedule" className="w-full bg-[#FE814B] text-white py-4 rounded-full font-bold text-base shadow-md hover:scale-[1.02] active:scale-95 transition-transform">
              Configure Schedule Now
            </Link>
          </div>

        ) : (

          <div className="w-full max-w-sm grid grid-cols-2 gap-4">
            
            {/* Card 1: REM Progress */}
            <div className="bg-white rounded-[28px] p-5 border border-[#F0EBE6] shadow-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-2">
                <span className="text-[#4B3425] font-extrabold text-[15px]">Rem</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4B3425]">
                   <path d="M20 12v6" /><path d="M4 12v6" /><path d="M2 18h20" /><path d="M4 12V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" /><circle cx="12" cy="11" r="1.5" /><path d="M9 7L15 7" />
                </svg>
              </div>
              <div className="relative w-[88px] h-[88px] flex items-center justify-center mt-2 group">
                <svg className="w-full h-full -rotate-90 absolute" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EAE6E1" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#9BB068" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={remOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <span className="text-[#4B3425] font-bold text-[19px] z-10 pt-1">{duration > 0 ? `${remValue}h` : '--'}</span>
              </div>
            </div>

            {/* Card 2: Core Progress */}
            <div className="bg-white rounded-[28px] p-5 border border-[#F0EBE6] shadow-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-2">
                <span className="text-[#4B3425] font-extrabold text-[15px]">Core</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4B3425]">
                   <path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /><path d="M20 11H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1z" /><path d="M8 11v1" />
                </svg>
              </div>
              <div className="relative w-[88px] h-[88px] flex items-center justify-center mt-2 group">
                <svg className="w-full h-full -rotate-90 absolute" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EAE6E1" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FE814B" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={coreOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <span className="text-[#4B3425] font-bold text-[19px] z-10 pt-1">{duration > 0 ? `${coreValue}h` : '--'}</span>
              </div>
            </div>

            {/* Card 3: Start Sleeping */}
            <div className="bg-white rounded-[28px] p-5 border border-[#F0EBE6] shadow-sm flex flex-col items-start justify-between min-h-[140px]">
               <div className="w-10 h-10 bg-[#FAF9F7] text-[#4B3425] rounded-[14px] flex items-center justify-center border border-[#F0EBE6]">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <circle cx="12" cy="7" r="4" />
                     <path d="M5.5 15C5.5 15 8.5 14 12 14C15.5 14 18.5 15 18.5 15" />
                   </svg>
               </div>
               <div className="flex flex-col mt-4">
                  <span className="text-[#4B3425] font-bold text-[13px] mb-1">Start Sleeping</span>
                  <div className="text-[#4B3425] font-semibold text-[22px] flex items-baseline gap-1">
                     {schedule ? formatTime(displaySleep).split(' ')[0] : '--:--'} <span className="text-[#FE814B] text-[13px] font-bold uppercase">{schedule ? formatTime(displaySleep).split(' ')[1] : ''}</span>
                  </div>
               </div>
            </div>

            {/* Card 4: Wake Up */}
            <div className="bg-white rounded-[28px] p-5 border border-[#F0EBE6] shadow-sm flex flex-col items-start justify-between min-h-[140px]">
               <div className="w-10 h-10 bg-[#FAF9F7] text-[#4B3425] rounded-[14px] flex items-center justify-center border border-[#F0EBE6]">
                   <Sun className="w-5 h-5" strokeWidth={2.5} />
               </div>
               <div className="flex flex-col mt-4">
                  <span className="text-[#4B3425] font-bold text-[13px] mb-1">Wake Up</span>
                  <div className="text-[#4B3425] font-semibold text-[22px] flex items-baseline gap-1">
                     {schedule ? formatTime(displayWake).split(' ')[0] : '--:--'} <span className="text-[#FE814B] text-[13px] font-bold uppercase">{schedule ? formatTime(displayWake).split(' ')[1] : ''}</span>
                  </div>
               </div>
            </div>

          </div>
        )}
        
      </div>
      
      <TabBar />
    </div>
  );
}
