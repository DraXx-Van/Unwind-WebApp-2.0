'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMindfulStore } from '@/store/mindfulStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Plus, ChevronDown, Wind } from 'lucide-react';
import { TabBar } from '@/components/dashboard/TabBar';
import { isToday, isWithinDays } from '@/lib/dateUtils';

type FilterMode = 'Daily' | 'Weekly';

export default function MindfulDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { history, fetchHistory } = useMindfulStore();
  const [filter, setFilter] = useState<FilterMode>('Daily');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchHistory(user.id);
    }
  }, [fetchHistory, user?.id]);

  // Always calculate from all history
  const now = new Date();
  const todayStr = now.toDateString();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const filteredSessions = history.filter(session => {
    if (filter === 'Daily') {
      return isToday(session.createdAt);
    } else {
      return isWithinDays(session.createdAt, 7);
    }
  });

  // Total duration for the arc
  const totalMinsToday = history
    .filter(s => isToday(s.createdAt))
    .reduce((acc, s) => acc + (s.duration || 0), 0);

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
      {/* Header Section */}
      <div className="relative w-full bg-[#879297] px-6 pt-[60px] pb-[96px] text-white flex flex-col items-center">
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
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="18" strokeDasharray="283 566" strokeLinecap="round" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="18"
                  strokeDasharray={`${Math.min((totalMinsToday / 480) * 283, 283)} 566`}
                  strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute bottom-[4px] w-full text-center flex flex-col items-center justify-end z-10 bg-transparent">
              {formattedTime}
              <p className="text-white/90 text-[12px] font-extrabold tracking-widest mt-3 mb-1 uppercase">Today's Duration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 bg-[#FDFBF9] relative z-20 px-5 pt-[68px] pb-32">
        <div className="absolute top-0 left-0 w-full h-[48px] overflow-hidden -mt-[1px]">
          <svg viewBox="0 0 375 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 Q187.5,64 375,0 Z" fill="#879297" />
          </svg>
        </div>

        {/* Floating Add Button */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 z-30">
          <Link href="/mindful/add" className="w-[66px] h-[66px] bg-[#4B3425] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-[5px] border-[#FDFBF9]">
            <Plus className="w-[30px] h-[30px] text-white" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Header with Filter Dropdown */}
        <div className="flex justify-between items-center mb-5 mt-[10px] px-1">
          <h2 className="text-[#4B3425] text-[19px] font-extrabold tracking-[0.015em]">Mindful Hour History</h2>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-[#F6EBE5] text-[#A6785D] font-bold text-sm px-3 py-1.5 rounded-full hover:bg-[#EDD9CE] transition-colors"
            >
              {filter}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#EAE6E1] rounded-2xl shadow-lg z-40 overflow-hidden min-w-[110px]">
                {(['Daily', 'Weekly'] as FilterMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setFilter(mode); setDropdownOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm font-bold text-left transition-colors ${filter === mode ? 'bg-[#F6EBE5] text-[#A6785D]' : 'text-[#4B3425] hover:bg-[#FDFBF9]'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex flex-col gap-3.5">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, i) => {
              const plannedDur = session.plannedDuration || Math.max(session.duration, 1);
              const isCompleted = session.duration >= plannedDur;
              const widthPercent = (session.duration / plannedDur) * 100;

              const formatDuration = (val: number) => {
                const m = Math.floor(val);
                const s = Math.round((val - m) * 60);
                return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
              };

              const remainingMins = plannedDur - session.duration;
              const sessionDate = new Date(session.createdAt);
              const isToday = sessionDate.toDateString() === todayStr;
              const dateLabel = isToday ? 'Today' : sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
                      {filter === 'Weekly' && !isToday && (
                        <span className="text-[#A69B93] text-[9px] font-semibold flex-shrink-0">{dateLabel}</span>
                      )}
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
                      Done
                    </span>
                  ) : (
                    <Link
                      href={`/mindful/timer?activity=${encodeURIComponent(session.activity)}&category=${encodeURIComponent(session.category)}&min=${Math.floor(plannedDur)}&sec=0`}
                      className="w-[44px] h-[44px] flex-shrink-0 bg-[#F6EBE5] rounded-[15px] flex items-center justify-center transform transition-transform active:scale-95 shadow-sm"
                    >
                      <div className="w-0 h-0 border-t-[6.5px] border-t-transparent border-l-[11px] border-l-[#A6785D] border-b-[6.5px] border-b-transparent ml-[2.5px]"></div>
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F6EBE5] flex items-center justify-center mb-4">
                <Wind className="w-10 h-10 text-[#A6785D]" />
              </div>
              <p className="text-[#4B3425] font-bold text-base">No sessions {filter === 'Daily' ? 'today' : 'this week'}</p>
              <p className="text-[#A69B93] text-sm mt-1">Tap + to start a mindful exercise</p>
            </div>
          )}
        </div>
      </div>

      <TabBar />
    </div>
  );
}
