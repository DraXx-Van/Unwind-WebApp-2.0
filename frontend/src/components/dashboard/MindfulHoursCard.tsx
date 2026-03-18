"use client";

import { Clock } from 'lucide-react';
import Link from 'next/link';

export function MindfulHoursCard() {
    return (
        <Link href="/mindful" className="block w-full mb-4">
            <div className="w-full bg-[#f2f8eb] rounded-[32px] p-4 pr-6 flex items-center justify-between shadow-sm h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div className="w-16 h-16 rounded-[24px] bg-[#e2ead5] flex items-center justify-center text-[#8da666]">
                        <Clock className="w-6 h-6" strokeWidth={2.5} />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                        <span className="text-[#3a2e26] font-bold text-lg leading-tight">Mindful Hours</span>
                        <span className="text-[#3a2e26]/60 font-medium text-sm">2.5h/8h</span>
                    </div>
                </div>

                {/* Visual (Right Side) - Wavy Line Graph Mock */}
                <div className="w-24 h-12 relative flex items-center justify-center">
                    <img
                        src="/assets/dashboard_assets/mindfulHours.svg"
                        alt="Mindful Hours Graph"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </Link>
    );
}
