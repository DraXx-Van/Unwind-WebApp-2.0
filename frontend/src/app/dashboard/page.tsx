"use client";

import { useEffect, useState } from 'react';
import { TabBar } from '@/components/dashboard/TabBar';
import { FreudScoreCard } from '@/components/dashboard/FreudScoreCard';
import { MoodLevelCard } from '@/components/dashboard/MoodLevelCard';
import { HealthJournalCard } from '@/components/dashboard/HealthJournalCard';
import { SleepQualityCard } from '@/components/dashboard/SleepQualityCard';
import { MindfulJournalCard } from '@/components/dashboard/MindfulJournalCard';
import { MindfulHoursCard } from '@/components/dashboard/MindfulHoursCard';
import { StressLevelCard } from '@/components/dashboard/StressLevelCard';
import { MoodTrackerCard } from '@/components/dashboard/MoodTrackerCard';
import { DailyCheckCard } from '@/components/dashboard/DailyCheckCard';
import { Bell } from 'lucide-react';

export default function DashboardPage() {
    const [dateStr, setDateStr] = useState('');
    useEffect(() => {
        setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32">
            {/* Brown Header Section */}
            <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-6 pb-8 mb-6 text-white shadow-lg relative z-10 overflow-hidden">
                {/* Decorative circle illustration - same as journal page */}
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-b-[40px] z-0 pointer-events-none select-none" />
                {/* Top Row: Date & Notification */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-2 opacity-80">
                        <span className="text-sm font-medium">{dateStr}</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#654630] flex items-center justify-center relative">
                        <Bell className="w-5 h-5 text-white" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF9500] rounded-full border border-[#4F3422]"></span>
                    </button>
                </div>

                {/* Greeting & Avatar */}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden relative bg-[#E8DDD9]">
                        {/* Placeholder Avatar - Use Image component in real app */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#4F3422] font-bold text-xl">JD</div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Hi, Jain!</h1>
                        {/* Stats Row */}
                        <div className="flex items-center gap-3 mt-1 text-sm font-medium opacity-90">
                            <span className="flex items-center gap-1"><span className="text-[#FF9500]">★</span> Pro</span>
                            <span className="flex items-center gap-1"><span className="text-[#FF9500]">✿</span> 80%</span>
                            <span className="flex items-center gap-1"><span className="text-[#FF9500]">☺</span> Happy</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar Omitted as requested */}
            </div>

            {/* Dashboard Content */}
            <div className="flex flex-col gap-6">

                {/* Daily Engagement Card - always at the top */}
                <DailyCheckCard />

                {/* Metrics Section */}
                <div className="flex flex-col gap-3">
                    <div className="px-6 flex justify-between items-center">
                        <h2 className="text-[#4F3422] font-bold text-lg">Mental Health Metrics</h2>
                        <button className="text-[#926247]"><span className="text-xl">⋮</span></button>
                    </div>
                    {/* Horizontal Scroll Highlights */}
                    <div className="overflow-x-auto flex gap-4 px-6 pb-4 items-center hide-scrollbar">
                        <FreudScoreCard />
                        <MoodLevelCard />
                        <HealthJournalCard />
                    </div>
                </div>

                {/* Tracker Section */}
                <div className="px-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-[#4F3422] font-bold text-lg">Mindful Tracker</h2>
                        <button className="text-[#926247]"><span className="text-xl">⋮</span></button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <MindfulHoursCard />
                        <SleepQualityCard />
                        <MindfulJournalCard />
                        <StressLevelCard />
                        <MoodTrackerCard />
                    </div>
                </div>

            </div>

            {/* Bottom Navigation */}
            <TabBar />
        </div>
    );
}
