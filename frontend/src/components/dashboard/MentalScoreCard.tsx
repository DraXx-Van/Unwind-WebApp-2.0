"use client";

import { Heart } from 'lucide-react';
import Link from 'next/link';

interface MentalScoreCardProps {
    score: number | null;
    label: string | null;
    checkinComplete?: boolean;
}

export function MentalScoreCard({ score, label, checkinComplete }: MentalScoreCardProps) {
    const hasScore = score != null;

    // Stroke offset: 283 = full circumference (2π × 45)
    const strokeOffset = hasScore ? 283 - (score / 100) * 220 : 283;

    return (
        <div className="relative w-[180px] h-[220px] rounded-[32px] bg-[#9BB068] shadow-[0px_16px_32px_rgba(155,176,104,0.15)] p-5 flex flex-col justify-between overflow-hidden shrink-0">
            {/* Header */}
            <div className="flex justify-between items-start z-10 w-full">
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-transparent shrink-0">
                    <Heart className="text-white w-4 h-4 fill-transparent stroke-[3px]" />
                </div>
                <span className="text-white font-bold text-base leading-tight mt-1 text-right w-full">Mental Score</span>
            </div>

            {/* Circular Gauge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[120px] h-[120px] flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Track */}
                    <circle
                        cx="60" cy="60" r="45"
                        stroke="#B4C48D" strokeWidth="10" fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray="220"
                        strokeDashoffset="-35"
                        className="opacity-60"
                    />
                    {/* Progress — shows empty ring when no score */}
                    <circle
                        cx="60" cy="60" r="45"
                        stroke={hasScore ? "#F2F5EB" : "#B4C48D"}
                        strokeWidth="10" fill="transparent"
                        strokeDasharray="283"
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="drop-shadow-sm transition-all duration-700"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute flex flex-col items-center justify-center text-center px-2">
                    {hasScore ? (
                        <>
                            <span className="text-[#F2F5EB] font-extrabold text-3xl leading-none">{score}</span>
                            <span className="text-[#E5EAD7] font-semibold text-xs mt-1">{label}</span>
                        </>
                    ) : (
                        <Link href="/mood/log" className="flex flex-col items-center gap-0.5">
                            <span className="text-[#F2F5EB] font-extrabold text-2xl leading-none">--</span>
                            <span className="text-[#E5EAD7] font-semibold text-[10px] mt-1 text-center leading-tight">
                                Log mood &amp; stress
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
