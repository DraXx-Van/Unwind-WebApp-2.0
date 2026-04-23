
'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMindfulStore } from '@/store/mindfulStore';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Save, LogOut, Play, Volume2, VolumeX, Minus, Plus, Settings2 } from 'lucide-react';

// Background animated element component
const FloatingElement = ({ children, delay = 0, duration = 10, x = [0, 20, 0], y = [0, 30, 0], rotate = [0, 10, 0], className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1],
      x: x,
      y: y,
      rotate: rotate
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut" as const,
      delay: delay
    }}
    className={`absolute pointer-events-none ${className}`}
  >
    {children}
  </motion.div>
);

function TimerPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addEntry, updateEntry } = useMindfulStore();
  const { user } = useAuthStore();

  const activity = searchParams.get('activityName') || searchParams.get('activity') || 'Mindful Session';
  const category = searchParams.get('category') || 'NATURE';
  const soundFile = searchParams.get('soundFile');
  const soundName = searchParams.get('soundName');
  
  const urlDuration = searchParams.get('duration');
  const initialMin = urlDuration ? parseInt(urlDuration, 10) : parseInt(searchParams.get('min') || '25', 10);
  const initialSec = urlDuration ? 0 : parseInt(searchParams.get('sec') || '0', 10);
  
  const sessionId = searchParams.get('sessionId');
  const initialTotalSeconds = initialMin * 60 + initialSec;

  const [timeLeft, setTimeLeft] = useState(initialTotalSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Initialize audio
  useEffect(() => {
    if (soundFile && typeof window !== 'undefined') {
      const audio = new Audio(soundFile);
      audio.loop = true;
      audio.volume = volume;
      audio.muted = isMuted;
      audioRef.current = audio;
      
      if (isPlaying && !isMuted) {
        playPromiseRef.current = audio.play();
        playPromiseRef.current.catch(e => {
            if (e.name !== 'AbortError') console.log("Audio play failed:", e);
        });
      }
    }
    
    return () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        if (playPromiseRef.current) {
            playPromiseRef.current.then(() => {
                audio.pause();
                audio.src = "";
            }).catch(() => {
                audio.pause();
                audio.src = "";
            });
        } else {
            audio.pause();
            audio.src = "";
        }
        audioRef.current = null;
      }
    };
  }, [soundFile]);

  // Handle Play/Pause & Mute changes
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying && !isMuted) {
        playPromiseRef.current = audio.play();
        playPromiseRef.current.catch(e => {
            if (e.name !== 'AbortError') console.log("Play failed:", e);
        });
    } else {
        if (playPromiseRef.current) {
            playPromiseRef.current.then(() => {
                audio.pause();
            }).catch(() => {
                audio.pause();
            });
        } else {
            audio.pause();
        }
    }
  }, [isPlaying, isMuted]);

  // Handle Volume & Mute property directly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedStart = localStorage.getItem('mindful_timer_start');
    const storedDuration = localStorage.getItem('mindful_timer_duration');
    const storedActivity = localStorage.getItem('mindful_timer_activity');

    if (storedStart && storedDuration && storedActivity === activity) {
      const startTime = parseInt(storedStart, 10);
      const duration = parseInt(storedDuration, 10);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        localStorage.removeItem('mindful_timer_start');
      }
    } else {
      localStorage.setItem('mindful_timer_start', Date.now().toString());
      localStorage.setItem('mindful_timer_duration', initialTotalSeconds.toString());
      localStorage.setItem('mindful_timer_activity', activity);
      setTimeLeft(initialTotalSeconds);
    }
  }, [activity, initialTotalSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
           if (prev <= 1) {
              localStorage.removeItem('mindful_timer_start');
           }
           return prev - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsPlaying(false);
      if (isPlaying) { 
         handleCompletion();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleCompletion = async () => {
     localStorage.removeItem('mindful_timer_start');
     const durationPlayedSec = initialTotalSeconds; 
     const playedMinutesFloat = parseFloat((durationPlayedSec / 60).toFixed(2));

     if (durationPlayedSec > 0) {
         if (sessionId) {
              await updateEntry(sessionId, playedMinutesFloat);
         } else {
              await addEntry(user?.id || 'user-1', {
                  activity: activity,
                  duration: playedMinutesFloat,
                  plannedDuration: parseFloat((initialTotalSeconds / 60).toFixed(2)),
                  category: category,
                  timeOfDay: 'MORNING'
              });
         }
     }

     router.push(`/mindful/complete?activity=${encodeURIComponent(activity)}&durationSec=${initialTotalSeconds}`);
  };

  const handleExitConfirm = async (shouldSave: boolean) => {
     const durationPlayedSec = initialTotalSeconds - timeLeft;
     localStorage.removeItem('mindful_timer_start');
     
     if (shouldSave && durationPlayedSec > 10) {
         const playedMinutesFloat = parseFloat((durationPlayedSec / 60).toFixed(2));
         if (sessionId) {
              await updateEntry(sessionId, playedMinutesFloat);
         } else {
              await addEntry(user?.id || 'user-1', {
                  activity: activity,
                  duration: playedMinutesFloat,
                  plannedDuration: parseFloat((initialTotalSeconds / 60).toFixed(2)),
                  category: category,
                  timeOfDay: 'MORNING'
              });
         }
     }
     router.push('/dashboard');
  };

  const displayMin = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const displaySec = (timeLeft % 60).toString().padStart(2, '0');

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = timeLeft / initialTotalSeconds;
  const strokeDashoffset = circumference - (progressPercent * circumference);

  return (
    <div className="min-h-screen bg-[#9BB068] relative flex flex-col font-sans overflow-hidden">
      
      {/* Background Animated Elements */}
      <FloatingElement 
        duration={15} 
        x={[0, 40, 0]} 
        y={[0, 20, 0]} 
        rotate={[0, 5, 0]}
        className="top-[10%] right-[-5%]"
      >
         <svg width="240" height="240" viewBox="0 0 120 120" fill="none">
            <path d="M 0 80 Q 30 110 60 70 T 120 60" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
         </svg>
      </FloatingElement>

      <FloatingElement 
        duration={12} 
        x={[0, -30, 0]} 
        y={[0, 40, 0]} 
        delay={2}
        className="top-[40%] left-[-10%]"
      >
         <div className="w-64 h-64 rounded-full border-[20px] border-white/20" />
      </FloatingElement>

      {/* Top Nav - INCREASED Z-INDEX AND HIT AREA */}
      <div className="relative z-[60] pt-14 px-6 flex items-center justify-between mb-8 pointer-events-auto">
        <button 
            onClick={() => setShowExitModal(true)} 
            className="w-[48px] h-[48px] rounded-full border-[1.5px] border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:bg-white/10 transition-all active:scale-[0.8] cursor-pointer"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>
        <h1 className="font-black text-[19px] text-[#FFFFFF] tracking-wide pointer-events-none">Mindful Session</h1>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowVolumeControl(!showVolumeControl)} 
                className={`w-[48px] h-[48px] rounded-full border-[1.5px] border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] transition-all active:scale-[0.8] cursor-pointer ${showVolumeControl ? 'bg-white text-[#9BB068]' : 'hover:bg-white/10'}`}
            >
              <Settings2 className="w-6 h-6" />
            </button>
            <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`w-[48px] h-[48px] rounded-full border-[1.5px] border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] transition-all active:scale-[0.8] cursor-pointer ${isMuted ? 'bg-white text-[#9BB068]' : 'hover:bg-white/10'}`}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* Volume Slider - Animated Overlay */}
      <AnimatePresence>
        {showVolumeControl && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="absolute top-36 right-6 z-[70] bg-white rounded-[32px] p-5 shadow-2xl flex flex-col items-center gap-5 border border-gray-100"
            >
                <button onClick={(e) => { e.stopPropagation(); setVolume(v => Math.min(1, v + 0.1)) }} className="w-10 h-10 bg-[#F7F4F2] rounded-2xl text-[#4B3425] active:scale-90 transition-transform flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                </button>
                <div className="h-40 w-2.5 bg-[#F7F4F2] rounded-full relative overflow-hidden">
                    <motion.div 
                        className="absolute bottom-0 left-0 right-0 bg-[#9BB068]"
                        initial={{ height: "50%" }}
                        animate={{ height: `${volume * 100}%` }}
                    />
                </div>
                <button onClick={(e) => { e.stopPropagation(); setVolume(v => Math.max(0, v - 0.1)) }} className="w-10 h-10 bg-[#F7F4F2] rounded-2xl text-[#4B3425] active:scale-90 transition-transform flex items-center justify-center">
                    <Minus className="w-5 h-5" />
                </button>
                <span className="text-[12px] font-black text-[#4B3425] opacity-40">{Math.round(volume * 100)}%</span>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 px-8 flex flex-col items-center justify-center -mt-20">
        
        <div className="mb-4">
             <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-white/60" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{soundName || 'No Sound'}</span>
            </div>
        </div>

        <h2 className="text-white text-[32px] leading-[1.1] font-black text-center mb-16 tracking-tight max-w-[300px] break-words">
          {activity}
        </h2>

        {/* Circular Timer Ring */}
        <div className="relative w-[240px] h-[240px] flex items-center justify-center mb-12">
            <svg viewBox="0 0 200 200" className="absolute top-0 left-0 w-full h-full -rotate-90">
                <circle cx="100" cy="100" r={80} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <motion.circle 
                  cx="100" 
                  cy="100" 
                  r={80} 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="12" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
            </svg>

            <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="w-[100px] h-[100px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center z-10 outline-none transform transition-all active:scale-[0.85] hover:bg-white/20 cursor-pointer"
            >
               {isPlaying ? (
                  <div className="flex gap-2 items-center justify-center pointer-events-none">
                     <div className="w-[8px] h-[28px] bg-white rounded-full"></div>
                     <div className="w-[8px] h-[28px] bg-white rounded-full"></div>
                  </div>
               ) : (
                  <Play className="fill-white text-white w-8 h-8 ml-1 pointer-events-none" />
               )}
            </button>
        </div>

        <div className="text-[72px] font-black text-white tracking-tighter leading-none mb-4">
           {displayMin}:{displaySec}
        </div>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Minutes Remaining</p>

      </div>

      {/* Exit Early Button */}
      <div className="px-8 pb-12 w-full z-20">
          <button 
             onClick={() => setShowExitModal(true)}
             className="w-full bg-[#4B3425] text-white py-5 rounded-[24px] font-black text-lg tracking-wide shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
             End Session Early
          </button>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="absolute inset-0 bg-[#4B3425]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#FE814B]/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-[#FE814B]" />
              </div>
              <h3 className="text-2xl font-black text-[#4B3425] mb-2">End your session?</h3>
              <p className="text-[#4B3425]/40 font-bold mb-8">You're doing great! Would you like to save your progress or just exit?</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleExitConfirm(true)}
                  className="w-full py-4 bg-[#4B3425] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#3A281D] transition-colors cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  Save and Exit
                </button>
                <button 
                  onClick={() => handleExitConfirm(false)}
                  className="w-full py-4 bg-[#F7F4F2] text-[#4B3425] rounded-2xl font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Exit Without Saving
                </button>
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="w-full py-4 text-[#4B3425]/40 font-black cursor-pointer"
                >
                  Resume Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#9BB068] flex items-center justify-center font-bold text-white uppercase tracking-widest text-sm">Initializing Timer...</div>}>
      <TimerPageContent />
    </Suspense>
  );
}
