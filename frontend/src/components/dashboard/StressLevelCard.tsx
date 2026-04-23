"use client";

import { Zap } from 'lucide-react';
import Link from 'next/link';

interface StressLevelCardProps {
    level: number | null;
}

const STRESS_LABELS: Record<number, string> = {
    1: 'Very Relaxed',
    2: 'Relaxed',
    3: 'Normal',
    4: 'Stressed',
    5: 'Very Stressed',
};

const STRESS_SHORT_LABELS: Record<number, string> = {
    1: 'Calm',
    2: 'Balanced',
    3: 'Normal',
    4: 'High',
    5: 'Alert',
};

export function StressLevelCard({ level }: StressLevelCardProps) {
    const label = level ? STRESS_SHORT_LABELS[level] || 'Normal' : 'Unset';
    const intensity = level || 0;

    return (
        <Link href="/stress" className="block w-full h-full">
            <div className="w-full bg-[#FFF3ED] rounded-[32px] p-5 flex flex-col justify-between shadow-sm border border-white h-full min-h-[180px] active:scale-[0.98] transition-all cursor-pointer overflow-hidden group">
                <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFEBB0] flex items-center justify-center text-[#FE814B] shadow-sm">
                        <Zap className="w-6 h-6 fill-[#FE814B]" strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                        <p className="text-[#FE814B]/50 text-[9px] font-black uppercase tracking-widest leading-none mb-1">State</p>
                        <p className="text-[#4B3425] font-black text-xs leading-none">Stress Level</p>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <span className="text-[#4B3425] font-black text-2xl leading-none">{label}</span>
                    <span className="text-[#4B3425]/40 font-black text-[10px] uppercase tracking-widest mt-1">Intensity: {intensity}/5</span>
                </div>

                <div className="flex items-center gap-1.5 h-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                            key={i}
                            className={`h-2.5 w-full rounded-full transition-all duration-500 ${
                                i <= intensity 
                                    ? 'bg-[#FE814B]' 
                                    : 'bg-[#4B3425]/5'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </Link>
    );
}
