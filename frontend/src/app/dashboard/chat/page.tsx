"use client";

import { useEffect, useState } from 'react';
import { ChevronLeft, MessageCircle, Smile, Plus, Settings, ChevronDown, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/store/chatStore';
import { ConversationCard } from '@/components/chat/ConversationCard';
import { TabBar } from '@/components/dashboard/TabBar';
import { motion } from 'framer-motion';

export default function ConversationsPage() {
    const { conversations, fetchConversations, isLoading } = useChatStore();
    const [filter, setFilter] = useState('Newest');

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans pb-32">
            {/* Orange Header Section */}
            <div className="bg-[#FE814B] rounded-b-[48px] pt-12 pb-10 px-6 shadow-lg relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <Link href="/dashboard" className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <ChevronLeft className="text-white w-6 h-6" />
                    </Link>
                </div>

                <div className="relative z-10">
                    <h1 className="text-white text-4xl font-extrabold tracking-tight mb-6">My Conversations</h1>
                    
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Smile className="text-white w-4 h-4" />
                            </div>
                            <span className="text-white font-bold text-sm">1571 Total</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="text-white w-4 h-4" />
                            </div>
                            <span className="text-white font-bold text-sm">32 Left this Month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="px-6 pt-8 flex-1">
                {/* Section: Recent */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#3a2e26] text-xl font-extrabold">Recent (4)</h2>
                    <button className="flex items-center gap-2 bg-[#F7F4F2] px-4 py-2 rounded-full border border-[#E8DDD9]">
                        <Calendar className="w-4 h-4 text-[#4B3425]" />
                        <span className="text-[#4B3425] text-sm font-bold">{filter}</span>
                        <ChevronDown className="w-4 h-4 text-[#4B3425]" />
                    </button>
                </div>

                <div className="space-y-1">
                    {conversations.map((conv, idx) => (
                        <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ConversationCard 
                                id={conv.id}
                                title={conv.title}
                                totalMessages={conv.totalMessages}
                                emotion={conv.lastEmotion}
                                type={conv.type}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Section: Past */}
                <div className="flex items-center justify-between mt-10 mb-6">
                    <h2 className="text-[#3a2e26] text-xl font-extrabold">Past (16)</h2>
                    <button className="p-2 text-[#4B3425]/40">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="opacity-60 grayscale-[0.5]">
                     <ConversationCard 
                        id="past-1"
                        title="More Xans this Xmas..."
                        totalMessages={478}
                        emotion="Sad"
                        type="ai"
                    />
                </div>
            </div>

            {/* Floating Add Button (Moved to bottom-right to avoid overlap) */}
            <div className="fixed bottom-36 right-8 z-40">
                <Link href="/dashboard/chat/new">
                    <button className="w-16 h-16 bg-[#9BB068] rounded-full flex items-center justify-center shadow-[0px_16px_32px_rgba(155,176,104,0.5)] transition-transform active:scale-95 border-4 border-white hover:scale-110">
                        <Plus className="text-white w-8 h-8" strokeWidth={3} />
                    </button>
                </Link>
            </div>

            <TabBar />
        </div>
    );
}
