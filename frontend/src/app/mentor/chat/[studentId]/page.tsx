"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { mentorAuthFetch, useMentorAuthStore } from '@/store/mentorAuthStore';
import { ConfirmSlotModal } from '@/components/chat/ConfirmSlotModal';

export default function MentorStudentChatPage() {
    const router = useRouter();
    const params = useParams();
    const studentId = params?.studentId as string;
    
    const { token, mentor } = useMentorAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [studentName, setStudentName] = useState('Student');
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

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

    const handleConfirmAppointment = async (meetLink: string) => {
        if (!selectedAppointmentId) return;
        try {
            await mentorAuthFetch(`/appointments/${selectedAppointmentId}/confirm`, {
                method: 'PATCH',
                body: JSON.stringify({ meetLink }),
            });
            setIsConfirmOpen(false);
            setSelectedAppointmentId(null);
        } catch (e) {
            console.error('Failed to confirm appointment', e);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#FDFDFD]">
            <header className="bg-[#4B3425] px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm z-10 text-white relative overflow-hidden">
                {/* Background Decor - with floating animation */}
                <motion.div 
                    animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" 
                />
                <motion.div 
                    animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" 
                />
                
                <div className="absolute top-1/4 right-1/4 w-4 h-4 border-2 border-white/10 rounded-full" />
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/10 rotate-45" />
                <div className="absolute bottom-1/4 right-1/3 w-6 h-6 border-2 border-white/5 rotate-12" />

                <div className="flex items-center justify-between relative z-10">
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
                                sender={msg.senderType === 'mentor' ? 'user' : 'bot'}
                                type={msg.type}
                                appointmentId={msg.appointmentId}
                                onConfirm={(id) => {
                                    setSelectedAppointmentId(id);
                                    setIsConfirmOpen(true);
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <ChatInput onSendMessage={handleSendMessage} />

            <ConfirmSlotModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAppointment}
            />
        </div>
    );
}
