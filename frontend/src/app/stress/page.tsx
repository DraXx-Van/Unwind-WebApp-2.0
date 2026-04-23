'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStressStore } from '@/store/stressStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { TabBar } from '@/components/dashboard/TabBar';

export default function StressDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { latestEntry, history, isLoading, fetchLatest, fetchHistory } = useStressStore();

  useEffect(() => {
    if (user?.id) {
      fetchLatest(user.id);
      fetchHistory(user.id);
    }
  }, [fetchLatest, fetchHistory, user?.id]);

  const isEntryFromToday = useMemo(() => {
     if (!latestEntry?.createdAt) return false;
     const entryDate = new Date(latestEntry.createdAt);
     const today = new Date();
     return entryDate.getDate() === today.getDate() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear();
  }, [latestEntry]);

  const levelLabels: Record<number, string> = {
    0: 'No Stress',
    1: 'Mild Stress',
    2: 'Moderate Stress',
    3: 'Elevated Stress',
    4: 'High Stress',
    5: 'Severe Stress',
  };

  const level = isEntryFromToday && latestEntry?.value !== undefined ? latestEntry.value : undefined;
  const label = level !== undefined ? levelLabels[level] : 'No Record Yet';

  // Compile 7-day rolling statistics
  const compiledStats = useMemo(() => {
     if (!history || history.length === 0) return { stressor: 'None', impact: 'None' };
     
     const last7Days = history.slice(0, 7);
     
     const stressorCounts: Record<string, number> = {};
     const impactCounts: Record<string, number> = {};

     last7Days.forEach(entry => {
        if (entry.stressor && entry.stressor !== 'None') {
           stressorCounts[entry.stressor] = (stressorCounts[entry.stressor] || 0) + 1;
        }
        if (entry.impact && entry.impact !== 'None') {
           impactCounts[entry.impact] = (impactCounts[entry.impact] || 0) + 1;
        }
     });

     const topStressor = Object.entries(stressorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
     const topImpact = Object.entries(impactCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

     return { stressor: topStressor, impact: topImpact };
  }, [history]);

  return (
    <div className="min-h-screen bg-[#fdfbf9] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Top Section - Orange Accent */}
      <div className="relative w-full bg-[#FE814B] px-6 pt-[60px] pb-[100px] text-white flex flex-col items-center">
        {/* Background Abstract Geometry */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {/* Triangular and circular shapes simulating the features_css.txt */}
          <div className="absolute top-[30px] left-[-20px] w-0 h-0 border-l-[80px] border-l-transparent border-t-[120px] border-t-white border-r-[80px] border-r-transparent opacity-20 -rotate-45"></div>
          <div className="absolute top-[80px] right-[10px] w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-b-white border-r-[60px] border-r-transparent opacity-20 rotate-12"></div>
          <div className="absolute top-[180px] right-[-50px] w-0 h-0 border-l-[120px] border-l-transparent border-t-[160px] border-t-white border-r-[120px] border-r-transparent opacity-10 -rotate-12"></div>
          <div className="absolute top-[140px] left-[30px] w-[50px] h-[50px] rounded-full border-[12px] border-white opacity-20"></div>
          <div className="absolute top-[180px] left-[-30px] w-[200px] h-[200px] bg-white rounded-full opacity-10"></div>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Nav */}
          <div className="w-full flex items-center mb-[32px] relative">
            <button onClick={() => router.push('/dashboard')} className="w-[36px] h-[36px] rounded-full border border-white/60 flex items-center justify-center hover:bg-white/10 transition-colors absolute left-0 z-20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 18L8 12L14 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="w-full text-center font-bold text-[17px] tracking-wide">Stress Level</h1>
          </div>

          <div className="flex flex-col items-center mt-6">
            <h2 className="text-[110px] leading-none font-extrabold tracking-tighter drop-shadow-sm transition-all">
              {isLoading ? '--' : (level !== undefined ? level : '-')}
            </h2>
            <p className="text-[22px] font-bold tracking-tight mt-1">
              {isLoading ? 'Loading...' : label}
            </p>
            {/* Added Stressor Subtext */}
            {!isLoading && isEntryFromToday && latestEntry?.stressor && latestEntry.stressor !== 'None' && (
              <p className="text-[15px] font-semibold opacity-90 tracking-wide mt-2 px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm shadow-sm">
                 Feeling {latestEntry.stressor}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Overlapping Curved Section Area & Content */}
      <div className="flex-1 bg-[#FDFBFACD] relative z-20 px-6 pt-[64px] pb-32">
        
        {/* The downward convex curve connecting top to bottom */}
        <div className="absolute top-0 left-0 w-full h-[60px] overflow-hidden -mt-[1px]">
            <svg viewBox="0 0 375 60" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 Q187.5,80 375,0 Z" fill="#FE814B" />
            </svg>
        </div>

        {/* Floating Action Button strictly placed on the curve */}
        <div className="absolute top-[4px] left-1/2 -translate-x-1/2 z-30">
            <Link href="/stress/add" className="w-[72px] h-[72px] bg-[#4B3425] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(75,52,37,0.3)] hover:scale-105 transition-transform border-[6px] border-[#FDFBFACD]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M19.4 15A1.65 1.65 0 0 0 21 13.35V10.65A1.65 1.65 0 0 0 19.4 9H18C17.7 8 17.3 7 16.7 6.2L17.7 5.2A1.65 1.65 0 0 0 17.7 2.85L15.8 0.95A1.65 1.65 0 0 0 13.45 0.95L12.45 1.95C11.65 1.65 10.65 1.65 9.85 1.95L8.85 0.95A1.65 1.65 0 0 0 6.5 0.95L4.6 2.85A1.65 1.65 0 0 0 4.6 5.2L5.6 6.2C5 7 4.6 8 4.3 9H2.9A1.65 1.65 0 0 0 1.25 10.65V13.35A1.65 1.65 0 0 0 2.9 15H4.3C4.6 16 5 17 5.6 17.8L4.6 18.8A1.65 1.65 0 0 0 4.6 21.15L6.5 23.05A1.65 1.65 0 0 0 8.85 23.05L9.85 22.05C10.65 22.35 11.65 22.35 12.45 22.05L13.45 23.05A1.65 1.65 0 0 0 15.8 23.05L17.7 21.15A1.65 1.65 0 0 0 17.7 18.8L16.7 17.8C17.3 17 17.7 16 18 15H19.4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </Link>
        </div>

        <div className="flex justify-between items-end mb-[18px]">
          <h2 className="text-[#4B3425] text-lg font-extrabold tracking-tight">Stress Stats</h2>
          <Link href="/stress/stats" className="text-[#9BB068] text-[13px] font-extrabold hover:underline tracking-wide">
            See All
          </Link>
        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Stressor Card */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col justify-between shadow-[0_8px_20px_rgba(75,52,37,0.04)] h-[170px] w-full">
             <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-[14px] font-extrabold text-[#4B3425] mb-1">Stressor <span className="text-[10px] text-[#A69B93] font-medium ml-1">(7d)</span></h3>
                   <p className="text-[13px] text-[#A69B93] font-medium leading-tight line-clamp-2 pr-2 capitalize">
                       {compiledStats.stressor}
                   </p>
                </div>
                {/* Warning Triangle Icon */}
                <div className="text-[#4B3425]">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17.01L12.01 16.9989" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.29 3.86L1.82 18C1.64539 18.3024 1.55299 18.6453 1.552 18.9945C1.55101 19.3438 1.64146 19.6871 1.81445 19.991C1.98744 20.2949 2.23675 20.5489 2.53772 20.7279C2.83868 20.9069 3.18082 21.0047 3.53 21H20.47C20.8192 21.0047 21.1613 20.9069 21.4623 20.7279C21.7633 20.5489 22.0126 20.2949 22.1856 19.991C22.3585 19.6871 22.449 19.3438 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32314 12.9812 3.15449C12.6817 2.98585 12.3437 2.89726 12 2.89726C11.6563 2.89726 11.3183 2.98585 11.0188 3.15449C10.7193 3.32314 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
             </div>
             
             {/* Staggered progress bars representing Stressor Data visually (aesthetic from ref image) */}
             <div className="flex flex-col gap-[7px] mt-2 mb-1">
                <div className="flex gap-[6px] h-[8px]">
                   <div className="bg-[#9BB068] w-[20%] rounded-full"></div>
                   <div className="bg-[#CDE1A5] w-[70%] rounded-full"></div>
                </div>
                <div className="flex gap-[6px] h-[8px]">
                   <div className="bg-[#9BB068] w-[45%] rounded-full"></div>
                   <div className="bg-[#EAECE4] w-[45%] rounded-full"></div>
                </div>
                <div className="flex gap-[6px] h-[8px]">
                   <div className="bg-[#CDE1A5] w-[100%] rounded-full"></div>
                </div>
                <div className="flex gap-[6px] h-[8px]">
                   <div className="bg-[#9BB068] w-[60%] rounded-full"></div>
                   <div className="bg-[#EAECE4] w-[30%] rounded-full"></div>
                </div>
             </div>
          </div>

          {/* Life Impact Card */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col justify-between shadow-[0_8px_20px_rgba(75,52,37,0.04)] h-[170px] w-full">
             <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-[14px] font-extrabold text-[#4B3425] mb-1">Impact <span className="text-[10px] text-[#A69B93] font-medium ml-1">(7d)</span></h3>
                   <p className="text-[13px] text-[#A69B93] font-medium leading-tight capitalize">
                       {compiledStats.impact}
                   </p>
                </div>
                {/* Flag Icon */}
                <div className="text-[#4B3425]">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 15S7 13 12 15 20 11 20 11V3S17 5 12 3 4 7 4 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 22V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
             </div>
             
             {/* Purple wave graph simulating the UI reference exactly with spikes */}
             <div className="mt-auto h-[60px] w-full relative mb-1 -ml-1">
                 <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full opacity-80" strokeLinecap="round">
                     <path d="M0,35 Q10,35 15,10 Q20,35 25,35 L33,10 L41,35 L49,10 L57,35 L65,10 L73,35 L81,10 L89,35 L97,15" fill="none" stroke="#A78DF5" strokeWidth="2.5" strokeLinejoin="round" />
                 </svg>
             </div>
          </div>

        </div>

      </div>
      
      <TabBar />
    </div>
  );
}
