"use client";

import { TabBar } from '@/components/dashboard/TabBar';
import { BarChart2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function InsightsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            {/* Header */}
            <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-12 pb-10 text-white shadow-lg relative z-10">
                <h1 className="text-3xl font-bold mb-2">Insights</h1>
                <p className="text-white/70 font-medium">Track your mental health trends</p>
            </div>

            {/* Coming Soon Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center gap-6"
                >
                    <div className="w-28 h-28 rounded-full bg-[#E8DDD9] flex items-center justify-center relative">
                        <BarChart2 className="w-12 h-12 text-[#4F3422]" strokeWidth={2} />
                        <motion.div
                            className="absolute -top-1 -right-1 w-8 h-8 bg-[#A28FFF] rounded-full flex items-center justify-center shadow-md"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <TrendingUp className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#4F3422]">Coming Soon</h2>
                    <p className="text-[#926247] font-medium text-lg max-w-xs leading-relaxed">
                        Deep analytics and trends across your mood, journal, and sleep data — all in one place.
                    </p>

                    <div className="mt-4 flex gap-3">
                        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-4 rounded-full bg-[#E8DDD9]"
                                initial={{ height: 8 }}
                                animate={{ height: h }}
                                transition={{ delay: i * 0.1, duration: 0.6, type: 'spring' }}
                            />
                        ))}
                    </div>

                    <Link
                        href="/dashboard"
                        className="mt-6 px-8 py-3 bg-[#4F3422] text-white rounded-full font-bold text-lg hover:bg-[#3d281a] transition-colors shadow-md"
                    >
                        Back to Dashboard
                    </Link>
                </motion.div>
            </div>

            <TabBar />
        </div>
    );
}
