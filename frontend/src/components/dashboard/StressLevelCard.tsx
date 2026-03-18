"use client";

import { Brain } from 'lucide-react'; // Approximating Head Icon
import Link from 'next/link';

export function StressLevelCard() {
    return (
        <Link href="/stress" className="block w-full mb-4">
            <div className="w-full bg-[#fff9e5] rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div className="w-16 h-16 rounded-[24px] bg-[#ffebb0] flex items-center justify-center text-[#fcc419]">
                        <Brain className="w-6 h-6" strokeWidth={2.5} />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                        <span className="text-[#3a2e26] font-bold text-lg leading-tight">Stress Level</span>
                        <span className="text-[#3a2e26]/60 font-medium text-sm">Level 3 (Normal)</span>
                    </div>
                </div>

                {/* Visual (Right Side) - Segmented Bar Mock */}
                <div className="flex items-center gap-1.5">
                    <img
                        src="/assets/dashboard_assets/stressLevel.svg"
                        alt="Stress Level Bar"
                        className="h-4 w-auto object-contain"
                    />
                </div>
            </div>
        </Link>
    );
}
