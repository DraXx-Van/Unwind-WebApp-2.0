"use client";

import { Sparkles } from 'lucide-react';

interface SleepQualityCardProps {
    quality: number | null;
}

const SLEEP_LABELS: Record<number, string> = {
    1: 'Very Poor (~2h Avg)',
    2: 'Poor (~4h Avg)',
    3: 'Fair (~6h Avg)',
    4: 'Good (~7h Avg)',
    5: 'Excellent (~8h Avg)',
};

export function SleepQualityCard({ quality }: SleepQualityCardProps) {
    const label = quality ? SLEEP_LABELS[quality] || `Level ${quality}` : 'Not assessed';

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
                    <span className="text-[#3a2e26]/60 font-medium text-sm">{label}</span>
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
