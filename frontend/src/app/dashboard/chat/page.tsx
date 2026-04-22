"use client";

import { TabBar } from '@/components/dashboard/TabBar';
import { MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            {/* Header */}
            <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-12 pb-10 text-white shadow-lg relative z-10">
                <h1 className="text-3xl font-bold mb-2">AI Chat Support</h1>
                <p className="text-white/70 font-medium">Your mindful companion</p>
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
                        <MessageCircle className="w-12 h-12 text-[#4F3422]" strokeWidth={2} />
                        <motion.div
                            className="absolute -top-1 -right-1 w-8 h-8 bg-[#9BB068] rounded-full flex items-center justify-center shadow-md"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#4F3422]">Coming Soon</h2>
                    <p className="text-[#926247] font-medium text-lg max-w-xs leading-relaxed">
                        A compassionate AI companion to help you through tough moments and celebrate your wins.
                    </p>

                    <div className="mt-4 flex gap-2">
                        {['🧘', '💭', '🌱'].map((emoji, i) => (
                            <motion.span
                                key={i}
                                className="text-3xl"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                            >
                                {emoji}
                            </motion.span>
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
