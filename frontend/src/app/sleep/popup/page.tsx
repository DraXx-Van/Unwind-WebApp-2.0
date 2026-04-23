'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronUp, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useSleepStore, sleptToday } from '@/store/sleepStore';

// Returns minutes until/since a given "HH:MM" time (positive = future, negative = past)
function minsUntil(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  return (target.getTime() - now.getTime()) / 60000;
}

import { useAuthStore } from '@/store/authStore';

export default function SleepPopupOverlay() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    schedule,
    latestEntry,
    activeSleepStart,
    initTimer,
    startSleep,
    endSleep,
    clearSleep,
  } = useSleepStore();

  const [now, setNow] = useState(new Date());
  const [isEnding, setIsEnding] = useState(false);
  const [tooShort, setTooShort] = useState(false);

  // How many minutes the current sleep session has lasted
  const elapsedMins = activeSleepStart
    ? Math.floor((Date.now() - new Date(activeSleepStart).getTime()) / 60000)
    : 0;

  // Minimum real sleep before we save — anything shorter is likely accidental
  const MIN_SLEEP_MINS = 30;

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

  // Allow starting sleep any time within the sleep window (sleep → wake, crossing midnight)
  // OR if no schedule: always allow (manual log)
  const canStart = (() => {
    if (!schedule?.sleepTime || !schedule?.wakeTime) return true; // no schedule = always allow
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
    const [sh, sm] = schedule.sleepTime.split(':').map(Number);
    const [wh, wm] = schedule.wakeTime.split(':').map(Number);
    const sleepMins = sh * 60 + sm;
    const wakeMins  = wh * 60 + wm;
    if (sleepMins > wakeMins) {
      return nowMins >= sleepMins || nowMins < wakeMins;
    }
    return nowMins >= sleepMins && nowMins < wakeMins;
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
    const hrs = Math.floor(elapsedMins / 60);
    const mins = elapsedMins % 60;
    if (hrs > 0) return `${hrs}h ${mins}m sleeping`;
    return `${elapsedMins}m sleeping`;
  })();

  const handleStartSleep = () => {
    if (!canStart || doneToday) return;
    startSleep();
    router.push('/sleep');
  };

  const handleWakeUp = async () => {
    if (isEnding || !activeSleepStart) return;

    // Block saving if sleep is shorter than MIN_SLEEP_MINS — show discard UI instead
    if (elapsedMins < MIN_SLEEP_MINS) {
      setTooShort(true);
      return;
    }

    setIsEnding(true);
    await endSleep(user?.id || 'user-1');
    router.push('/sleep/stats');
  };

  const handleDiscard = () => {
    clearSleep();
    setTooShort(false);
    router.push('/sleep');
  };

  const handleSaveAnyway = async () => {
    if (isEnding) return;
    setIsEnding(true);
    setTooShort(false);
    await endSleep(user?.id || 'user-1');
    router.push('/sleep/stats');
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-b from-[#2E2015] to-[#120D0A] flex flex-col items-center justify-between font-sans overflow-hidden z-[100]">

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-[#FE814B]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Too-Short Sleep Modal ─────────────────────────────────────────── */}
      {tooShort && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-[#1E1510] border border-white/10 rounded-3xl p-7 w-full max-w-sm flex flex-col items-center gap-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#FE814B]/15 flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#FE814B]" />
            </div>
            <div className="text-center">
              <h2 className="text-white font-bold text-xl mb-2">Too soon!</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                You've only been sleeping for <span className="text-[#FE814B] font-bold">{elapsedMins} min</span>.
                Logging this would give you incorrect sleep data.
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => { setTooShort(false); }}
                className="w-full py-3.5 bg-[#A89CFC] text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform"
              >
                ↩ Keep sleeping
              </button>
              <button
                onClick={handleDiscard}
                className="w-full py-3.5 bg-white/10 text-white/80 font-semibold rounded-2xl text-sm active:scale-95 transition-transform"
              >
                Cancel & discard session
              </button>
              <button
                onClick={handleSaveAnyway}
                className="text-white/30 text-xs font-medium py-1"
              >
                Save {elapsedMins}m anyway (not recommended)
              </button>
            </div>
          </div>
        </div>
      )}

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
        <h1 className="text-2xl font-bold text-white text-center leading-snug mb-6 flex flex-col items-center">
          {doneToday ? (
            <><span>Sleep logged!</span><span className="flex items-center gap-1.5">Rest well <Moon className="w-5 h-5 text-blue-300" /></span></>
          ) : mode === 'SLEEP' ? (
            <><span>It's Time to bed</span><span className="flex items-center gap-1.5">Sweet dreams! <Moon className="w-5 h-5 text-blue-300" /></span></>
          ) : (
            <><span>Good Morning!</span><span className="flex items-center gap-1.5">Time to Rise <Sun className="w-5 h-5 text-yellow-400" /></span></>
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
              <span className="flex items-center justify-center gap-1">Sleep button unlocks {minsLeft > 10 ? `in ~${minsLeft} min` : 'soon'} <Clock className="w-3.5 h-3.5" /></span>
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
