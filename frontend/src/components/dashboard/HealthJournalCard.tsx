"use client";

import { FilePlus } from 'lucide-react';
import Link from 'next/link';

interface HealthJournalCardProps {
    count: number;
    done?: boolean;
}

export function HealthJournalCard({ count }: HealthJournalCardProps) {
    return (
        <Link href="/journal" className="relative w-[180px] h-[220px] rounded-32px bg-[#A28FFF] shadow-[0px_16px_32px_rgba(162,143,255,0.15)] flex flex-col justify-between overflow-hidden shrink-0 transition-transform active:scale-95">
            {/* Header & Content */}
            <div className="p-5 pb-0 flex flex-col z-10 w-full">
                <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center bg-transparent shrink-0">
                        <FilePlus className="text-white w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-bold text-base leading-tight mt-1 text-right">Health<br />Journal</span>
                </div>
                {/* Main Value */}
                <h3 className="text-white font-extrabold text-3xl tracking-tight mb-2">{count}<span className="text-white/60 text-xl font-semibold">/365</span></h3>
            </div>

            {/* Heatmap Grid Visualization - Contained */}
            <div className="w-full mt-auto flex justify-center px-4 pb-4">
                <img
                    src="/assets/dashboard_assets/journal_card.svg"
                    alt="Journal Heatmap"
                    className="w-full h-24 object-contain object-bottom"
                />
            </div>
        </Link>
    );
}
