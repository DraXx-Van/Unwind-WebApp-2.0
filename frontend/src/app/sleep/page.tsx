'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSleepStore } from '@/store/sleepStore';
import Link from 'next/link';
import { Sparkles, Moon, Sun, Clock } from 'lucide-react';

export default function SleepDashboard() {
  const router = useRouter();
  const { latestEntry, isLoading, fetchLatest } = useSleepStore();

  useEffect(() => {
    fetchLatest('user-1');
  }, [fetchLatest]);

  return (
    <div className="min-h-screen bg-[#FDFBFACD] pb-32 font-sans overflow-x-hidden">
      {/* 
        Top Section
        Color: #8e85ee (from SleepQualityCard)
      */}
      <div className="bg-[#8e85ee] rounded-b-[40px] pt-12 pb-24 px-6 text-white relative shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-medium tracking-wide">Sleep Quality</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col items-center mt-4">
          <span className="text-sm uppercase tracking-wider text-white/80 font-semibold mb-2">Last Night</span>
          {isLoading ? (
            <div className="h-16 w-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : latestEntry ? (
            <>
              <div className="text-6xl font-bold mb-2">{latestEntry.duration}h</div>
              <div className="text-lg bg-white/20 px-6 py-2 rounded-full font-medium shadow-sm flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Level {latestEntry.quality}
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl font-bold mb-2">--</div>
              <div className="text-sm bg-white/20 px-4 py-1.5 rounded-full font-medium">
                No Record Yet
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <div className="flex justify-center -mt-8 relative z-10">
        <Link href="/sleep/add">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-transform cursor-pointer border-4 border-[#FDFBFACD]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#8e85ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Bottom Content Area */}
      <div className="px-6 mt-8">
        <h2 className="text-[#3F3D56] text-xl font-bold mb-6 tracking-tight">Sleep Details</h2>

        {latestEntry ? (
          <div className="space-y-4">
            {/* Start Sleeping */}
            <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0ece9] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8e85ee]/10 text-[#8e85ee] rounded-[16px] flex items-center justify-center">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Start Sleeping</p>
                  <p className="text-[#3F3D56] font-bold text-lg">{latestEntry.sleepTime}</p>
                </div>
              </div>
            </div>

            {/* Wake Up */}
            <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0ece9] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-400 rounded-[16px] flex items-center justify-center">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Wake Up</p>
                  <p className="text-[#3F3D56] font-bold text-lg">{latestEntry.wakeTime}</p>
                </div>
              </div>
            </div>

            {/* Total Duration */}
            <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0ece9] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-400 rounded-[16px] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Duration</p>
                  <p className="text-[#3F3D56] font-bold text-lg">{latestEntry.duration} hours</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0ece9] text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-[#8e85ee]/10 text-[#8e85ee] rounded-full flex items-center justify-center mb-4">
                <Moon className="w-8 h-8" />
             </div>
            <p className="text-gray-400 font-medium">No sleep logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
