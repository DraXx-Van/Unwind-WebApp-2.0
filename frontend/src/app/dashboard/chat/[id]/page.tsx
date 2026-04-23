"use client";

import { useEffect, useRef } from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { MentorChatClient } from '@/components/chat/MentorChatClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { currentMessages, fetchMessages, sendAiMessage, isTyping, clearCurrentMessages } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    const isMentorChat = typeof id === 'string' && id.startsWith('mentor-');
    const mentorId = isMentorChat ? id.replace('mentor-', '') : null;

    useEffect(() => {
        if (id && !isMentorChat) {
            fetchMessages(id as string);
        }
        return () => {
            if (!isMentorChat) clearCurrentMessages();
        };
    }, [id, isMentorChat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentMessages, isTyping]);

    if (isMentorChat && mentorId) {
        return <MentorChatClient mentorId={mentorId} />;
    }

    return (
        <div className="flex flex-col h-screen bg-[#F7F4F2]">
            <header className="bg-white px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm z-10">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-full bg-[#F7F4F2] flex items-center justify-center"
                    >
                        <ChevronLeft className="text-[#4B3425] w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-[#4B3425] text-xl font-extrabold tracking-tight">UnwindAI</h1>
                        <span className="text-[#926247]/60 text-xs font-medium">Mental Health Support</span>
                    </div>

                    <button className="w-12 h-12 rounded-full border border-[#E8DDD9] flex items-center justify-center">
                        <MoreVertical className="text-[#926247] w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto pt-8 pb-32 space-y-2 scroll-smooth"
            >
                {/* Date divider */}
                <div className="w-full flex justify-center mb-8">
                    <div className="flex items-center gap-4 w-full px-6">
                        <div className="flex-1 h-px bg-[#4B3425]/10" />
                        <span className="text-[#4B3425]/40 text-sm font-bold">Today</span>
                        <div className="flex-1 h-px bg-[#4B3425]/10" />
                    </div>
                </div>

                {/* Empty state */}
                {currentMessages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center pt-16 px-8 gap-4">
                        <div className="w-20 h-20 rounded-full bg-[#E8DDD9] flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-1 p-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-2.5 h-2.5 bg-[#926247] rounded-full" />
                                ))}
                            </div>
                        </div>
                        <h3 className="text-[#4B3425] text-lg font-extrabold text-center">Hi, I'm UnwindAI</h3>
                        <p className="text-[#4B3425]/60 text-sm font-medium text-center leading-relaxed">
                            I'm here to listen, support, and guide you. Feel free to share what's on your mind — this is a safe space.
                        </p>
                    </div>
                )}

                {/* Messages */}
                <AnimatePresence>
                    {currentMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageBubble
                                text={msg.content}
                                sender={msg.role === 'user' ? 'user' : 'bot'}
                            />
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="px-4 flex justify-start mb-6"
                        >
                            <div className="flex items-end gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F7F4F2] flex items-center justify-center shrink-0">
                                    <div className="grid grid-cols-2 gap-0.5 p-1.5">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 bg-[#BDA193] rounded-full" />
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#E8DDD9] rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5 shadow-sm">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-[#926247] rounded-full"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            <ChatInput onSendMessage={(text) => sendAiMessage(id as string, text)} />
        </div>
    );
}
