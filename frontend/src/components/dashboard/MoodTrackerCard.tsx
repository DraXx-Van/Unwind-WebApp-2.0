'use client';

import { SmilePlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function MoodTrackerCard() {
    return (
        <Link href="/mood/stats" className="block w-full h-full">
            <div className="w-full bg-[#FFF9E5] rounded-[32px] p-5 flex flex-col justify-between shadow-sm border border-white h-full min-h-[180px] active:scale-[0.98] transition-all cursor-pointer overflow-hidden group">
                <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFEBB0] flex items-center justify-center text-[#FFCE5C] shadow-sm">
                        <SmilePlus className="w-6 h-6 fill-[#FFCE5C] stroke-[#4B3425]" strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                        <p className="text-[#FFCE5C]/80 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Trends</p>
                        <p className="text-[#4B3425] font-black text-xs leading-none">Mood Patterns</p>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <span className="text-[#4B3425] font-black text-2xl leading-none">Improving</span>
                    <div className="flex items-center gap-1 mt-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#9BB068]" />
                         <span className="text-[#9BB068] font-black text-[9px] uppercase tracking-widest">Upwards Trend</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-[#FE814B] border-2 border-[#FFF9E5]" />
                         <div className="w-6 h-6 rounded-full bg-[#FFCE5C] border-2 border-[#FFF9E5]" />
                         <div className="w-6 h-6 rounded-full bg-[#9BB068] border-2 border-[#FFF9E5]" />
                    </div>
                    <div className="flex-1 text-right">
                        <TrendingUp className="w-5 h-5 text-[#9BB068] ml-auto" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
