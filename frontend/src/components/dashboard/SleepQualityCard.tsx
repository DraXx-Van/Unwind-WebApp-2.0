"use client";

import { Moon } from 'lucide-react';
import Link from 'next/link';

interface SleepQualityCardProps {
    quality: number | null;
    /** If true, quality is estimated from schedule/history, not from an actual logged session */
    isEstimated?: boolean;
    /** Live quality from today's sleep entry (0-100 scale) */
    liveQuality?: number | null;
}

export function SleepQualityCard({ quality, isEstimated, liveQuality }: SleepQualityCardProps) {
    // Prefer live tracked quality (0-100) over assessment baseline (1-5)
    const displayQuality = liveQuality != null ? liveQuality : quality;

    const getLabel = () => {
        if (liveQuality != null) {
            // Real tracked sleep — show score out of 100
            if (liveQuality >= 80) return `${liveQuality}% · Great Sleep`;
            if (liveQuality >= 60) return `${liveQuality}% · Fair Sleep`;
            if (liveQuality >= 40) return `${liveQuality}% · Light Sleep`;
            return `${liveQuality}% · Poor Sleep`;
        }
        if (!quality) return 'Not set — tap to configure';
        // Assessment baseline (1-5 → description)
        const SLEEP_LABELS: Record<number, string> = {
            1: 'Baseline: Very poor (~2h)',
            2: 'Baseline: Poor (~4h)',
            3: 'Baseline: Fair (~5h)',
            4: 'Baseline: Good (~7h)',
            5: 'Baseline: Excellent (~8h)',
        };
        return isEstimated
            ? `${SLEEP_LABELS[quality] || 'Estimated'} ✦`
            : (SLEEP_LABELS[quality] || 'Set up your schedule');
    };

    const cardColor = liveQuality != null
        ? liveQuality >= 70 ? '#e8f5e1' : liveQuality >= 40 ? '#f0efff' : '#fef0ea'
        : '#f0efff';
    const iconBg = liveQuality != null
        ? liveQuality >= 70 ? '#d4edbe' : liveQuality >= 40 ? '#e0deff' : '#fde0c8'
        : '#e0deff';
    const iconColor = liveQuality != null
        ? liveQuality >= 70 ? '#5a8a2e' : liveQuality >= 40 ? '#8e85ee' : '#d06030'
        : '#8e85ee';

    return (
        <Link href="/sleep" className="block w-full mb-4">
            <div
                className="w-full rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 hover:scale-[1.02] transition-transform cursor-pointer"
                style={{ backgroundColor: cardColor }}
            >
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-[24px] flex items-center justify-center" style={{ backgroundColor: iconBg, color: iconColor }}>
                        <Moon className="w-6 h-6" strokeWidth={2.5} />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                        <span className="text-[#3a2e26] font-bold text-lg leading-tight">
                            {liveQuality != null ? "Tonight's Sleep" : "Daily Sleep"}
                        </span>
                        <span className="text-[#3a2e26]/60 font-medium text-sm">{getLabel()}</span>
                        {isEstimated && liveQuality == null && (
                            <span className="text-[#3a2e26]/40 text-xs mt-0.5">✦ Estimated from your baseline</span>
                        )}
                    </div>
                </div>

                {/* Visual */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <img
                        src="/assets/dashboard_assets/sleep.svg"
                        alt="Sleep"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </Link>
    );
}
