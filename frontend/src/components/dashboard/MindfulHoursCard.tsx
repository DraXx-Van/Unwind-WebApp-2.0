"use client";

import { Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function MindfulHoursCard({ totalMinutes = 0, done }: { totalMinutes?: number; done?: boolean }) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.floor(totalMinutes % 60);
    const progress = Math.min(100, (totalMinutes / 480) * 100);

    return (
        <Link href="/mindful" className="block w-full h-full">
            <div className="w-full bg-white rounded-[32px] p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(75,52,37,0.06)] border border-[#4B3425]/5 h-full min-h-[180px] active:scale-[0.98] transition-all cursor-pointer overflow-hidden group">
                <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#9BB068]/10 flex items-center justify-center text-[#9BB068] shadow-sm group-hover:rotate-6 transition-transform">
                        <Clock className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                        <p className="text-[#4B3425]/30 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Activity</p>
                        <p className="text-[#4B3425] font-black text-xs leading-none">Mindful Hours</p>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <span className="text-[#4B3425] font-black text-2xl leading-none">{hours}h {mins}m</span>
                    <span className="text-[#4B3425]/40 font-black text-[10px] uppercase tracking-widest mt-1">8h Daily Goal</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[#4B3425]/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-[#9BB068]"
                        />
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-[#FDFBF9] border border-[#4B3425]/5 flex items-center justify-center text-[#4B3425]/30 shadow-sm group-hover:bg-[#4B3425] group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
