'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMindfulStore } from '@/store/mindfulStore';
import Link from 'next/link';
import { MoreHorizontal, Plus } from 'lucide-react';
import { TabBar } from '@/components/dashboard/TabBar';

export default function MindfulDashboard() {
  const router = useRouter();
  const { history, fetchHistory, latestEntry } = useMindfulStore();

  useEffect(() => {
    fetchHistory('user-1');
  }, [fetchHistory]);

  const totalDuration = latestEntry ? latestEntry.duration : 0;

  // Calculate total daily mindful hours dynamically
  const today = new Date().toDateString();
  const todaysSessions = history.filter(session => new Date(session.createdAt).toDateString() === today);
  const totalMinsToday = todaysSessions.reduce((acc, session) => acc + (session.duration || 0), 0);
  
  const h = Math.floor(totalMinsToday / 60);
  const m = Math.floor(totalMinsToday % 60);

  let formattedTime;
  if (h > 0 && m > 0) {
     formattedTime = (
        <h2 className="text-[52px] font-bold leading-[0.8] tracking-tight">
           {h}<span className="text-[32px] font-bold tracking-normal opacity-90 mx-[2px] mr-2">h</span>
           {m}<span className="text-[32px] font-bold tracking-normal opacity-90 mx-[2px]">m</span>
        </h2>
     );
  } else if (h > 0) {
     formattedTime = (
        <h2 className="text-[66px] font-bold leading-[0.8] tracking-tight">{h}<span className="text-[40px] font-bold tracking-normal leading-[0.8]">h</span></h2>
     );
  } else {
     formattedTime = (
        <h2 className="text-[66px] font-bold leading-[0.8] tracking-tight">{m}<span className="text-[40px] font-bold tracking-normal leading-[0.8]">m</span></h2>
     );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans relative overflow-x-hidden">
      {/* Header Section - Slate */}
      <div className="relative w-full bg-[#879297] px-6 pt-[60px] pb-[96px] text-white flex flex-col items-center">
        {/* SVG Background Canvas Lines Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
           <svg width="100%" height="100%" viewBox="0 0 375 440" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,0 Q100,200 -50,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M0,0 Q150,220 0,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M50,0 Q200,240 50,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M100,0 Q250,260 100,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M150,0 Q300,280 150,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M200,0 Q350,300 200,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M250,0 Q400,320 250,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M300,0 Q450,340 300,500" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M350,0 Q500,360 350,500" stroke="white" strokeWidth="1" fill="none"/>
           </svg>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Nav */}
          <div className="w-full flex items-center mb-[42px] relative">
            <Link href="/dashboard" className="w-[36px] h-[36px] rounded-full border-[1.5px] border-white/60 flex items-center justify-center hover:bg-white/10 transition-colors absolute left-0 z-20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h1 className="w-full text-center font-bold text-lg tracking-wide">Mindful Hours</h1>
          </div>

          {/* Arc Progress */}
          <div className="relative w-[320px] h-[160px] mt-2 mb-2 flex justify-center">
            <div className="absolute top-0 left-0 w-[320px] h-[320px]">
              <svg viewBox="0 0 200 200" className="w-[320px] h-[320px] -rotate-180 drop-shadow-sm">
                {/* Background track */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="18" strokeDasharray="283 566" strokeLinecap="round" />
                {/* Progress track */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="18" strokeDasharray="200 566" strokeLinecap="round" />
              </svg>
            </div>
            {/* Inner Text positioned flush with the cut bottom of the arch */}
            <div className="absolute bottom-[4px] w-full text-center flex flex-col items-center justify-end z-10 bg-transparent">
              {formattedTime}
              <p className="text-white/90 text-[12px] font-extrabold tracking-widest mt-3 mb-1 uppercase">Today's Duration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content - Z-index 20 ensures this stacks over the empty space but receives the curve from itself */}
      <div className="flex-1 bg-[#FDFBF9] relative z-20 px-5 pt-[68px] pb-32">
        {/* 
          This is the downward convex curve pushing down into this white <div>'s space filling it with #879297.
        */}
        <div className="absolute top-0 left-0 w-full h-[48px] overflow-hidden -mt-[1px]">
            <svg viewBox="0 0 375 48" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 Q187.5,64 375,0 Z" fill="#879297" />
            </svg>
        </div>

        {/* Floating Add Button sitting precisely on the crest of the curve */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 z-30">
            <Link href="/mindful/add" className="w-[66px] h-[66px] bg-[#4B3425] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-[5px] border-[#FDFBF9]">
                <Plus className="w-[30px] h-[30px] text-white" strokeWidth={1.5} />
            </Link>
        </div>

        <div className="flex justify-between items-center mb-5 mt-[10px] px-1">
          <h2 className="text-[#4B3425] text-[19px] font-extrabold tracking-[0.015em]">Mindful Hour History</h2>
          <button className="text-[#A59F9B] hover:text-[#4B3425]">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {history.length > 0 ? (
            history.map((session, i) => {
              const plannedDur = session.plannedDuration || Math.max(session.duration, 1);
              const isCompleted = session.duration >= plannedDur;
              const widthPercent = (session.duration / plannedDur) * 100;

              const formatDuration = (val: number) => {
                 const m = Math.floor(val);
                 const s = Math.round((val - m) * 60);
                 return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
              };

              const remainingMins = plannedDur - session.duration;

              return (
                <div key={session.id || i} className="bg-white rounded-[22px] p-[14px] px-[16px] flex items-center shadow-[0_4px_18px_rgba(75,52,37,0.05)] w-full">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-2.5">
                      <h3 className="font-extrabold text-[#4B3425] text-[14.5px] leading-tight line-clamp-1 w-[110px]">
                        {session.activity}
                      </h3>
                      <span className="bg-[#F6EBE5] text-[#A6785D] text-[9.5px] font-extrabold uppercase px-[9px] py-[3.5px] rounded-[8.5px] tracking-[0.05em] text-center flex-shrink-0">
                        {session.category}
                      </span>
                    </div>
                    <div className="w-full bg-[#EAECE4] h-[6px] rounded-full mb-[5px] overflow-hidden">
                       <div className="bg-[#9BB068] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(widthPercent, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-[#A69B93]">
                      <span>{formatDuration(session.duration)}</span>
                      <span>{formatDuration(plannedDur)}</span>
                    </div>
                  </div>
                  
                  {isCompleted ? (
                     <span className="bg-[#9BB068] text-white text-[10px] font-extrabold uppercase px-3 py-[6px] rounded-[12px] tracking-wider shadow-sm flex-shrink-0">
                         Completed
                     </span>
                  ) : (
                     <Link 
                        href={`/mindful/timer?activity=${encodeURIComponent(session.activity)}&category=${encodeURIComponent(session.category)}&min=${Math.floor(remainingMins)}&sec=${Math.round((remainingMins - Math.floor(remainingMins)) * 60)}&sessionId=${session.id}`}
                        className="w-[44px] h-[44px] flex-shrink-0 bg-[#F6EBE5] rounded-[15px] flex items-center justify-center transform transition-transform active:scale-95 shadow-sm"
                     >
                       <div className="w-0 h-0 border-t-[6.5px] border-t-transparent border-l-[11px] border-l-[#A6785D] border-b-[6.5px] border-b-transparent ml-[2.5px]"></div>
                     </Link>
                  )}
                </div>
              );
            })
          ) : (
            <>
              {/* Static examples matching reference image exactly */}
              <div className="bg-white rounded-[22px] p-[14px] px-[16px] flex items-center shadow-[0_4px_18px_rgba(75,52,37,0.05)] w-full">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-3 mb-2.5">
                    <h3 className="font-extrabold text-[#4B3425] text-[14.5px] leading-tight tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[125px]">
                      Breathing Exercise
                    </h3>
                    <div className="bg-[#F8F2EF] text-[#A6785D] text-[9.5px] font-extrabold uppercase px-[9px] py-[4px] rounded-[8px] tracking-[0.05em] flex-shrink-0">
                      CHIRPING BIRDS
                    </div>
                  </div>
                  <div className="w-full bg-[#EAECE4] h-[6px] rounded-full mb-[5px] overflow-hidden">
                     <div className="bg-[#9BB068] h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-extrabold text-[#A69B93]">
                    <span>05:02</span>
                    <span>5:50:00</span>
                  </div>
                </div>
                <button className="w-[44px] h-[44px] flex-shrink-0 bg-[#F8F2EF] rounded-[15px] flex items-center justify-center transform transition-transform active:scale-95">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#A6785D] border-b-[6px] border-b-transparent ml-[3px]"></div>
                </button>
              </div>

              <div className="bg-white rounded-[22px] p-[14px] px-[16px] flex items-center shadow-[0_4px_18px_rgba(75,52,37,0.05)] w-full">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-3 mb-2.5">
                    <h3 className="font-extrabold text-[#4B3425] text-[14.5px] leading-tight tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[125px]">
                      Breathing Exercise
                    </h3>
                    <div className="bg-[#F8F2EF] text-[#A6785D] text-[9.5px] font-extrabold uppercase px-[9px] py-[4px] rounded-[8px] tracking-[0.05em] flex-shrink-0">
                      CHIRPING BIRDS
                    </div>
                  </div>
                  <div className="w-full bg-[#EAECE4] h-[6px] rounded-full mb-[5px] overflow-hidden">
                     <div className="bg-[#9BB068] h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-extrabold text-[#A69B93]">
                    <span>05:02</span>
                    <span>20:00</span>
                  </div>
                </div>
                <button className="w-[44px] h-[44px] flex-shrink-0 bg-[#F8F2EF] rounded-[15px] flex items-center justify-center transform transition-transform active:scale-95">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#A6785D] border-b-[6px] border-b-transparent ml-[3px]"></div>
                </button>
              </div>
              
              <div className="bg-white rounded-[22px] p-[14px] px-[16px] flex items-center shadow-[0_4px_18px_rgba(75,52,37,0.05)] w-full">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-3 mb-2.5">
                    <h3 className="font-extrabold text-[#4B3425] text-[14.5px] leading-tight tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[125px]">
                      Session 1
                    </h3>
                    <div className="bg-[#F8F2EF] text-[#A6785D] text-[9.5px] font-extrabold uppercase px-[9px] py-[4px] rounded-[8px] tracking-[0.05em] flex-shrink-0">
                      DEEP BREATHING
                    </div>
                  </div>
                  <div className="w-full bg-[#EAECE4] h-[6px] rounded-full mb-[5px] overflow-hidden">
                     <div className="bg-[#9BB068] h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-extrabold text-[#A69B93]">
                    <span>05:02</span>
                    <span>35:00</span>
                  </div>
                </div>
                <button className="w-[44px] h-[44px] flex-shrink-0 bg-[#F8F2EF] rounded-[15px] flex items-center justify-center transform transition-transform active:scale-95">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#A6785D] border-b-[6px] border-b-transparent ml-[3px]"></div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Home Dashboard style boundary TabBar */}
      <TabBar />
    </div>
  );
}
