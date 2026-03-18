"use client";

import { Smile } from 'lucide-react';

export function MoodTrackerCard() {
    return (
        <div
            onClick={() => window.location.href = '/mood/stats'}
            className="w-full bg-[#f5f5f5] rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 mb-4 cursor-pointer hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-[24px] bg-[#e5e5e5] flex items-center justify-center text-[#5c4d44] shrink-0">
                    <Smile className="w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                    <span className="text-[#3a2e26] font-bold text-lg leading-tight">Mood Tracker</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#ffe4db] text-[#ff814b] text-[10px] font-bold px-2 py-0.5 rounded-full">SAD</span>
                        <span className="text-[#3a2e26] text-xs">→</span>
                        <span className="bg-[#f2f2f2] text-[#3a2e26] text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">NEUTRAL</span>
                        <span className="text-[#3a2e26] text-xs">→</span>
                        <span className="bg-[#e2ead5] text-[#8da666] text-[10px] font-bold px-2 py-0.5 rounded-full">HAPPY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
