"use client";

import { Brain } from 'lucide-react'; // Approximating Head Icon

interface StressLevelCardProps {
    level: number | null;
}

const STRESS_LABELS: Record<number, string> = {
    1: 'Level 1 (Very Relaxed)',
    2: 'Level 2 (Relaxed)',
    3: 'Level 3 (Normal)',
    4: 'Level 4 (Stressed)',
    5: 'Level 5 (Very Stressed)',
};

export function StressLevelCard({ level }: StressLevelCardProps) {
    const label = level ? STRESS_LABELS[level] || `Level ${level}` : 'Not assessed';

    return (
        <div className="w-full bg-[#fff9e5] rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 mb-4">
            <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-[24px] bg-[#ffebb0] flex items-center justify-center text-[#fcc419]">
                    <Brain className="w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                    <span className="text-[#3a2e26] font-bold text-lg leading-tight">Stress Level</span>
                    <span className="text-[#3a2e26]/60 font-medium text-sm">{label}</span>
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
    );
}
