"use client";

import { Moon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SleepQualityCard({ quality, liveQuality }: { quality: number | null; liveQuality: number | null }) {
    // Priority: liveQuality (tracked) > quality (assessment baseline)
    const displayValue = liveQuality ?? (quality ? quality * 20 : null);
    const score = displayValue ?? 0;
    
    const r = 24;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;

    return (
        <Link href="/sleep" className="block w-full">
            <div className="w-full bg-[#EEF0FF] rounded-[32px] p-6 flex items-center justify-between shadow-sm border border-white hover:scale-[1.01] transition-transform cursor-pointer overflow-hidden">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[24px] bg-[#D7DCFF] flex items-center justify-center text-[#7C6AFF] shadow-sm">
                        <Moon className="w-8 h-8 fill-[#7C6AFF]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-[#4B3425] font-black text-xl leading-tight mb-1">Sleep Quality</h3>
                        <p className="text-[#7C6AFF]/60 text-[10px] font-black uppercase tracking-widest">Optimal Sleep · {score}%</p>
                    </div>
                </div>

                <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(124, 106, 255, 0.1)" strokeWidth="6" />
                        <motion.circle 
                            initial={{ strokeDashoffset: circ }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            cx="40" cy="40" r={r} fill="none" 
                            stroke="#7C6AFF" strokeWidth="6" 
                            strokeDasharray={circ}
                            strokeLinecap="round" 
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[#7C6AFF] font-black text-sm">
                        {score}%
                    </span>
                </div>
            </div>
        </Link>
    );
}
