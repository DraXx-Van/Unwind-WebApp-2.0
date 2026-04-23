"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { mentorAuthFetch, useMentorAuthStore } from '@/store/mentorAuthStore';

export default function MentorStudentChatPage() {
    const router = useRouter();
    const params = useParams();
    const studentId = params?.studentId as string;
    
    const { token, mentor } = useMentorAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [studentName, setStudentName] = useState('Student');
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mentor || !token) {
            router.replace('/mentor/login');
            return;
        }

        if (studentId) {
            // Fetch student info
            mentorAuthFetch(`/mentor/students/${studentId}/details`)
                .then(res => res.json())
                .then(data => {
                    if (data?.student?.name) setStudentName(data.student.name);
                })
                .catch(console.error);

            // Fetch history
            mentorAuthFetch(`/chat/history/${studentId}/${mentor.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMessages(data);
                })
                .catch(console.error);
        }
    }, [mentor, token, studentId, router]);

    useEffect(() => {
        if (!token || !mentor || !studentId) return;

        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
            auth: { token }
        });

        newSocket.on('connect', () => {
            newSocket.emit('joinRoom', { studentId, mentorId: mentor.id });
        });

        newSocket.on('newMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token, mentor, studentId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (text: string) => {
        if (!socket || !mentor) return;
        socket.emit('sendMessage', {
            studentId,
            mentorId: mentor.id,
            content: text,
        });
    };

    return (
        <div className="flex flex-col h-screen bg-[#FDFDFD]">
            <header className="bg-[#4B3425] px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm z-10 text-white">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="text-white w-6 h-6" />
                    </button>

                    <div className="text-center">
                        <h1 className="text-white text-lg font-extrabold tracking-tight">
                            {studentName}
                        </h1>
                        <span className="text-white/60 text-xs font-medium">Active Session</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <MoreVertical className="text-white w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto pt-8 pb-32 space-y-2 scroll-smooth px-6 bg-[#FDFDFD]">
                <div className="w-full flex justify-center mb-8">
                    <span className="text-[#4B3425]/40 text-xs font-bold uppercase tracking-wider">End-to-End Encrypted Session</span>
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
                                sender={msg.senderType === 'mentor' ? 'user' : 'bot'} // From mentor's POV, mentor is 'user' (right), student is 'bot' (left)
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}
