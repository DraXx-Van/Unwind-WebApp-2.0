
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { useJournalStore } from '@/store/journalStore';
import { JournalHeatmap } from '@/components/journal/JournalHeatmap';
import { TabBar } from '@/components/dashboard/TabBar';

import { isToday } from '@/lib/dateUtils';

export default function JournalPage() {
    const { journals, fetchJournals } = useJournalStore();
    const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Yearly'>('Yearly');

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    const currentYear = new Date().getFullYear();
    const journalsThisYear = journals.filter(j => new Date(j.createdAt).getFullYear() === currentYear).length;
    
    const filteredJournals = journals.filter(j => {
        if (timeframe === 'Daily') return isToday(j.createdAt);
        if (timeframe === 'Weekly') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(j.createdAt) >= weekAgo;
        }
        return new Date(j.createdAt).getFullYear() === currentYear;
    });

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            {/* Header Section - Brown Curve with SVG Background */}
            <div className="h-[480px] relative px-6 pt-12 text-white flex flex-col items-center bg-[#926247] overflow-hidden">
                {/* SVG Background */}
                <img
                    src="/assets/Journal_assets/bg.svg"
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-100"
                />

                {/* Content Overlay */}
                <div className="relative z-10 w-full flex flex-col items-center">
                    {/* Check if we need to adjust z-index or opacity based on the SVG content */}

                    {/* Nav */}
                    <div className="w-full flex items-center justify-between mb-8">
                        <Link href="/dashboard" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <img src="/assets/Journal_assets/Monotone chevron left.svg" alt="Back" className="w-6 h-6" />
                        </Link>
                        <span className="font-bold text-xl">Health Journal</span>
                        <div className="w-10"></div> {/* Spacer */}
                    </div>

                    {/* Stats */}
                    <div className="mt-8 flex flex-col items-center">
                        <div className="flex gap-2 mb-4 bg-white/10 p-1 rounded-full backdrop-blur-md">
                            {(['Daily', 'Weekly', 'Yearly'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${timeframe === t ? 'bg-white text-[#926247]' : 'text-white/60 hover:text-white'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <h1 className="text-6xl font-bold mb-2">
                            {timeframe === 'Yearly' ? journalsThisYear : filteredJournals.length}
                            <span className="text-4xl opacity-70">/{timeframe === 'Yearly' ? '365' : timeframe === 'Weekly' ? '7' : '1'}</span>
                        </h1>
                        <p className="text-white/80 font-medium text-lg">Journals {timeframe.toLowerCase()}. Keep it Up!</p>
                    </div>
                </div>
            </div>

            {/* Body Content with Upward Curve using SVG */}
            <div className="flex-1 bg-[#FAFAFA] relative z-20 px-6 pt-6 pb-10 -mt-20">
                {/* Custom SVG Curve */}
                <div className="absolute top-[-40px] left-0 w-full h-[40px] overflow-hidden">
                    <svg viewBox="0 0 375 40" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,40 L0,20 Q187.5,-20 375,20 L375,40 Z" fill="#FAFAFA" />
                    </svg>
                </div>

                {/* Add Button (Floating Center) - Absolute to move it correctly over the tab bar */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div className="relative top-[-72px] pointer-events-auto">
                        <button className="w-16 h-16 bg-[#9BB068] rounded-full flex items-center justify-center shadow-[0px_16px_32px_rgba(155,176,104,0.5)] transition-transform active:scale-95 border-4 border-white">
                            <Plus className="text-white w-8 h-8" strokeWidth={3} />
                        </button>
                    </div>
                </div>
                <JournalHeatmap journals={journals} />

                {/* Recent Entries List */}
                <div className="mt-10">
                    <h3 className="text-[#4F3422] font-bold text-lg mb-4">Recent Entries</h3>
                    <div className="flex flex-col gap-4">
                        {filteredJournals.length > 0 ? (
                            filteredJournals.slice(0, 10).map((j, i) => (
                                <div key={j.id || i} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{j.emotion === 'happy' ? '🙂' : j.emotion === 'sad' ? '☹️' : j.emotion === 'angry' ? '😡' : j.emotion === 'calm' ? '😌' : '😐'}</span>
                                            <h4 className="font-bold text-[#4F3422]">{j.title || 'Untitled'}</h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(j.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[#4F3422]/70 text-sm line-clamp-2 leading-relaxed">
                                        {j.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-40">
                                <p className="text-sm font-medium">No journals for this timeframe.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TabBar />
        </div >
    );
}
