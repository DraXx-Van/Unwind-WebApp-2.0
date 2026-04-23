"use client";

import { PenLine, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function MindfulJournalCard({ count = 0 }: { count?: number }) {
    return (
        <Link href="/journal" className="block w-full h-full">
            <div className="w-full bg-[#FFF3ED] rounded-[32px] p-5 flex flex-col justify-between shadow-sm border border-white h-full min-h-[180px] active:scale-[0.98] transition-all cursor-pointer overflow-hidden group">
                <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFE4D6] flex items-center justify-center text-[#FE814B] shadow-sm">
                        <PenLine className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                        <p className="text-[#FE814B]/50 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Writing</p>
                        <p className="text-[#4B3425] font-black text-xs leading-none">Journaling</p>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <span className="text-[#4B3425] font-black text-2xl leading-none">{count} Entries</span>
                    <span className="text-[#4B3425]/40 font-black text-[10px] uppercase tracking-widest mt-1">Total Reflections</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1 flex gap-1 items-center h-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div 
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    i <= count ? 'bg-[#FE814B]' : 'bg-[#4B3425]/5'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#FE814B] shadow-sm group-hover:bg-[#FE814B] group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
