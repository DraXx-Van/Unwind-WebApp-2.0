"use client";

import { FileText } from 'lucide-react';
import Link from 'next/link';

interface MindfulJournalCardProps {
    count: number;
}

export function MindfulJournalCard({ count }: MindfulJournalCardProps) {
    const streakText = count > 0 ? `${count} Entries` : 'Start journaling';

    return (
        <Link href="/journal" className="w-full bg-[#fff0eb] rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 mb-4 transition-transform active:scale-95">
            <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-[24px] bg-[#ffe4db] flex items-center justify-center text-[#ff814b]">
                    <FileText className="w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                    <span className="text-[#3a2e26] font-bold text-lg leading-tight">Mindful Journal</span>
                    <span className="text-[#3a2e26]/60 font-medium text-sm">{streakText}</span>
                </div>
            </div>

            {/* Visual (Right Side) - Heatmap Grid Mock */}
            <div className="w-20 h-20 flex items-center justify-center">
                <img
                    src="/assets/dashboard_assets/mindful%20journal.svg"
                    alt="Journal Heatmap"
                    className="w-full h-full object-contain"
                />
            </div>
        </Link>
    );
}
