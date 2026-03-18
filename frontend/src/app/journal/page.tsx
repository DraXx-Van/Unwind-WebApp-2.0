
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { useJournalStore } from '@/store/journalStore';
import { JournalHeatmap } from '@/components/journal/JournalHeatmap';
import { TabBar } from '@/components/dashboard/TabBar';

export default function JournalPage() {
    const { journals, fetchJournals } = useJournalStore();

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    const journalsThisYear = journals.length; // Simplified for now

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
                        <h1 className="text-6xl font-bold mb-2">{journalsThisYear}<span className="text-4xl opacity-70">/365</span></h1>
                        <p className="text-white/80 font-medium text-lg">Journals this year. Keep it Up!</p>
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

                {/* Floating Add Button sitting on the peak of the curve */}
                <div className="absolute -top-[72px] left-1/2 -translate-x-1/2">
                    <Link href="/journal/new" className="w-16 h-16 bg-[#4F3422] rounded-full flex items-center justify-center shadow-lg border-4 border-[#FAFAFA] hover:scale-105 transition-transform">
                        <Plus className="w-8 h-8 text-white" />
                    </Link>
                </div>

                <JournalHeatmap journals={journals} />

                <div className="mt-8 flex justify-between px-8 text-[#926247]/60">
                    {/* Bottom Nav Placeholders */}
                </div>
            </div>

            <TabBar />
        </div >
    );
}
