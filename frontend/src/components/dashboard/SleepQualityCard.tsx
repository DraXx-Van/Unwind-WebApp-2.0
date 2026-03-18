"use client";

import { Sparkles } from 'lucide-react';

export function SleepQualityCard() {
    return (
        <div className="w-full bg-[#f0efff] rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 mb-4">
            <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-[24px] bg-[#e0deff] flex items-center justify-center text-[#8e85ee]">
                    <Sparkles className="w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                    <span className="text-[#3a2e26] font-bold text-lg leading-tight">Sleep Quality</span>
                    <span className="text-[#3a2e26]/60 font-medium text-sm">Insomniac (~2h Avg)</span>
                </div>
            </div>

            {/* Visual (Right Side) - Target/Radar Chart Mock */}
            <div className="relative w-16 h-16 flex items-center justify-center">
                <img
                    src="/assets/dashboard_assets/sleep.svg"
                    alt="Sleep Quality Chart"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
}
