"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { authFetch } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function MentorChatClient({ mentorId }: { mentorId: string }) {
    const router = useRouter();
    const { token, user } = useAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch history first
        if (user && mentorId) {
            authFetch(`/chat/history/${user.id}/${mentorId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMessages(data);
                })
                .catch(console.error);
        }
    }, [user, mentorId]);

    useEffect(() => {
        if (!token || !user) return;

        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
            auth: { token }
        });

        newSocket.on('connect', () => {
            newSocket.emit('joinRoom', { studentId: user.id, mentorId });
        });

        newSocket.on('newMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token, user, mentorId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (text: string) => {
        if (!socket || !user) return;
        socket.emit('sendMessage', {
            studentId: user.id,
            mentorId,
            content: text,
        });
    };

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

                    <h1 className="text-[#4B3425] text-xl font-extrabold tracking-tight">
                        Mentor Session
                    </h1>

                    <div className="flex items-center gap-2">
                        <button className="w-12 h-12 rounded-full border border-[#E8DDD9] flex items-center justify-center">
                            <MoreVertical className="text-[#926247] w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto pt-8 pb-32 space-y-2 scroll-smooth px-6">
                <div className="w-full flex justify-center mb-8">
                    <span className="text-[#4B3425]/40 text-xs font-bold uppercase tracking-wider">Session Started</span>
                </div>

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageBubble 
                                text={msg.content}
                                sender={msg.senderType === 'student' ? 'user' : 'mentor'}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}
