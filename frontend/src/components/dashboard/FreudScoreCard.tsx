"use client";

import { Heart } from 'lucide-react';

interface FreudScoreCardProps {
    score: number | null;
    label: string | null;
}

export function FreudScoreCard({ score, label }: FreudScoreCardProps) {
    const displayScore = score ?? '--';
    const displayLabel = label ?? 'N/A';

    // Calculate stroke offset based on score (283 = full circumference)
    const strokeOffset = score ? 283 - (score / 100) * 183 : 183;

    return (
        <div className="relative w-[180px] h-[220px] rounded-[32px] bg-[#9BB068] shadow-[0px_16px_32px_rgba(155,176,104,0.15)] p-5 flex flex-col justify-between overflow-hidden shrink-0">
            {/* Header */}
            <div className="flex justify-between items-start z-10 w-full">
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-transparent shrink-0">
                    <Heart className="text-white w-4 h-4 fill-transparent stroke-[3px]" />
                </div>
                <span className="text-white font-bold text-base leading-tight mt-1 text-right w-full">Freud Score</span>
            </div>

            {/* Circular Gauge Visualization */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[120px] h-[120px] flex items-center justify-center">
                {/* Background Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Track */}
                    <circle
                        cx="60"
                        cy="60"
                        r="45"
                        stroke="#B4C48D"
                        strokeWidth="10"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray="220" // Leave gap at bottom
                        strokeDashoffset="-35" // Rotate gap to bottom
                        className="opacity-60"
                    />
                    {/* Progress */}
                    <circle
                        cx="60"
                        cy="60"
                        r="45"
                        stroke="#F2F5EB"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray="283" // 2 * PI * 45
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="drop-shadow-sm transition-all duration-700"
                    />
                </svg>

                {/* Centered Score */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[#F2F5EB] font-extrabold text-3xl leading-none">{displayScore}</span>
                    <span className="text-[#E5EAD7] font-semibold text-xs mt-1">{displayLabel}</span>
                </div>
            </div>
        </div>
    );
}
