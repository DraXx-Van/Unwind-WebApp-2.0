'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronUp, ArrowLeft } from 'lucide-react';
import { useSleepStore, sleptToday } from '@/store/sleepStore';

// Returns minutes until/since a given "HH:MM" time (positive = future, negative = past)
function minsUntil(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  return (target.getTime() - now.getTime()) / 60000;
}

export default function SleepPopupOverlay() {
  const router = useRouter();
  const {
    schedule,
    latestEntry,
    activeSleepStart,
    initTimer,
    startSleep,
    endSleep,
  } = useSleepStore();

  const [now, setNow] = useState(new Date());
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    initTimer();
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [initTimer]);

  // Determine current mode
  const isSleeping = !!activeSleepStart;
  const mode: 'SLEEP' | 'WAKE' = isSleeping ? 'WAKE' : 'SLEEP';

  // Already slept today — nothing to do
  const doneToday = sleptToday(latestEntry);

  // Time-lock: only allow start within ±10 min of scheduled sleep time
  const canStart = (() => {
    if (!schedule?.sleepTime) return false;
    const mins = minsUntil(schedule.sleepTime);
    // Allow from -10 min (past) to +10 min (future)
    return mins >= -10 && mins <= 10;
  })();

  const minsLeft = schedule?.sleepTime ? Math.round(minsUntil(schedule.sleepTime)) : null;

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  function formatDisplay(hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  const scheduledSleep = schedule?.sleepTime ? formatDisplay(schedule.sleepTime) : '--:--';
  const scheduledWake = schedule?.wakeTime ? formatDisplay(schedule.wakeTime) : '--:--';

  const elapsedLabel = (() => {
    if (!activeSleepStart) return null;
    const diffMs = now.getTime() - new Date(activeSleepStart).getTime();
    const totalMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs > 0) return `${hrs}h ${mins}m sleeping`;
    return `${mins}m sleeping`;
  })();

  const handleStartSleep = () => {
    if (!canStart || doneToday) return;
    startSleep();
    // Navigate back to dashboard — user will see "Sleeping now" banner
    router.push('/sleep');
  };

  const handleWakeUp = async () => {
    if (isEnding) return;
    setIsEnding(true);
    await endSleep('user-1');
    router.push('/sleep/stats');
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-b from-[#2E2015] to-[#120D0A] flex flex-col items-center justify-between font-sans overflow-hidden z-[100]">

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-[#FE814B]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-14 left-6 z-30">
        <button
          onClick={() => router.push('/sleep')}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Top Section */}
      <div className="pt-24 flex flex-col items-center z-10 w-full px-6">

        {/* Mode Badge */}
        <div className={`text-white/90 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-8 ${
          doneToday
            ? 'bg-green-700'
            : mode === 'WAKE'
            ? 'bg-[#A89CFC]/80'
            : 'bg-[#A4431B]'
        }`}>
          {doneToday
            ? '✓ SLEEP LOGGED TODAY'
            : isSleeping
            ? (elapsedLabel?.toUpperCase() ?? 'SLEEPING')
            : (minsLeft !== null && minsLeft > 0
              ? `BEDTIME IN ${minsLeft} MIN`
              : `ALARM AT ${scheduledWake}`)}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white text-center leading-snug mb-6">
          {doneToday ? (
            <>Sleep logged!<br />Rest well 🌙</>
          ) : mode === 'SLEEP' ? (
            <>Its Time to bed<br />Sweet dreams! 🌙</>
          ) : (
            <>Good Morning!<br />Time to Rise ☀️</>
          )}
        </h1>

        {/* Hero Time */}
        <div className="text-[88px] font-extrabold text-white leading-none tracking-tight mb-8">
          {formattedTime}
        </div>

        {/* Sub Info */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-white/80" />
          <span className="text-white text-sm font-medium">
            {isSleeping ? 'slept at' : 'wake up at'}
          </span>
          <div className="border border-white text-white px-5 py-2 rounded-full font-bold text-sm tracking-widest">
            {isSleeping
              ? (activeSleepStart
                  ? formatDisplay(
                      new Date(activeSleepStart).getHours().toString().padStart(2, '0') +
                      ':' +
                      new Date(activeSleepStart).getMinutes().toString().padStart(2, '0')
                    )
                  : '--:--')
              : scheduledWake}
          </div>
        </div>

        {/* Time-lock warning (SLEEP mode, not yet in window) */}
        {!isSleeping && !doneToday && !canStart && minsLeft !== null && minsLeft > 0 && (
          <div className="mt-6 bg-white/10 rounded-2xl px-5 py-3 text-center">
            <p className="text-white/70 text-sm font-medium">
              Sleep button unlocks {minsLeft > 10 ? `in ~${minsLeft} min` : 'soon'} 🕐
            </p>
            <p className="text-white/40 text-xs mt-1">Scheduled: {scheduledSleep}</p>
          </div>
        )}
      </div>

      {/* Background Illustration */}
      <img
         src="/assets/Features_assets/sleep.svg"
         alt="Sleep illustration"
         className="absolute bottom-[-10%] sm:bottom-[-20%] left-0 w-full h-[65vh] object-cover object-top z-0 pointer-events-none opacity-90"
      />

      {/* Bottom Curve CTA */}
      {!doneToday && (
        <div className="absolute bottom-0 w-full z-20 flex flex-col items-center">
          <div
            className={`w-full bg-[#FDFBF9] h-32 pt-4 flex flex-col items-center justify-start transition-colors ${
              mode === 'SLEEP'
                ? canStart
                  ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
                  : 'cursor-not-allowed opacity-70'
                : 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
            }`}
            style={{ borderTopLeftRadius: '50% 40px', borderTopRightRadius: '50% 40px' }}
            onClick={mode === 'SLEEP' ? handleStartSleep : handleWakeUp}
          >
            <div className="w-full h-full flex flex-col items-center pt-2">
              <ChevronUp className="w-6 h-6 text-[#4B3425] mb-1 animate-bounce" />
              <span className="text-[#4B3425] font-bold text-lg tracking-wide lowercase">
                {mode === 'SLEEP'
                  ? (canStart ? 'start sleep' : `unlocks at ${scheduledSleep}`)
                  : (isEnding ? 'saving...' : 'wake up → save')}
              </span>
              {mode === 'WAKE' && elapsedLabel && (
                <span className="text-[#4B3425]/50 text-xs mt-1">{elapsedLabel}</span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
