"use client";

import { useEffect, useRef } from 'react';
import { ChevronLeft, Search, Grid, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { currentMessages, fetchMessages, sendMessage, isLoading, conversations } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    const conversation = conversations.find(c => c.id === id);
    const isAi = conversation?.type === 'ai' || id === 'ai';

    useEffect(() => {
        if (id) fetchMessages(id as string);
    }, [id, fetchMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentMessages]);

    return (
        <div className="flex flex-col h-screen bg-[#F7F4F2]">
            <header className="bg-white px-6 pt-12 pb-6 rounded-b-32px shadow-sm z-10">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-full bg-[#F7F4F2] flex items-center justify-center"
                    >
                        <ChevronLeft className="text-[#4B3425] w-6 h-6" />
                    </button>

                    <h1 className="text-[#4B3425] text-xl font-extrabold tracking-tight">
                        {isAi ? 'Doctor Freud.AI' : 'Mentor Session'}
                    </h1>

                    <div className="flex items-center gap-2">
                        <button className="w-12 h-12 rounded-full border border-[#E8DDD9] flex items-center justify-center">
                            <Search className="text-[#926247] w-6 h-6" />
                        </button>
                        <button className="w-12 h-12 rounded-full border border-[#E8DDD9] flex items-center justify-center">
                            <Grid className="text-[#926247] w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Body */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto pt-8 pb-32 space-y-2 scroll-smooth"
            >
                <div className="w-full flex justify-center mb-8">
                    <div className="flex items-center gap-4 w-full px-6">
                        <div className="flex-1 h-px bg-[#4B3425]/10" />
                        <span className="text-[#4B3425]/40 text-sm font-bold">Today</span>
                        <div className="flex-1 h-px bg-[#4B3425]/10" />
                    </div>
                </div>

                <AnimatePresence>
                    {currentMessages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageBubble 
                                text={msg.text}
                                sender={msg.sender}
                                emotion={msg.emotion}
                                dataUpdated={msg.dataUpdated}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input */}
            <ChatInput onSendMessage={(text) => sendMessage(id as string, text)} />
        </div>
    );
}
