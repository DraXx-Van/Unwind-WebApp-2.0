"use client";

import { MentorTabBar } from '@/components/mentor/MentorTabBar';
import { useMentorAuthStore, mentorAuthFetch } from '@/store/mentorAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentorChatIndexPage() {
    const router = useRouter();
    const { mentor } = useMentorAuthStore();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!mentor) {
            router.replace('/mentor/login');
            return;
        }
        fetchStudents();
    }, [mentor, router]);

    const fetchStudents = async () => {
        try {
            const res = await mentorAuthFetch('/mentor/students');
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
            {/* Header */}
            <div className="bg-[#4B3425] rounded-b-[48px] pt-12 pb-10 px-6 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-white text-3xl font-extrabold tracking-tight mb-2">Messages</h1>
                    <p className="text-white/70 font-medium">Chat with your assigned students</p>
                </div>
            </div>

            <div className="px-6 pt-8">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-[#9BB068] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : students.length === 0 ? (
                    <div className="bg-[#F7F4F2] rounded-3xl p-8 text-center border border-[#E8DDD9] mt-4">
                        <p className="text-[#4B3425]/60 font-medium">No active chats.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {students.map((student, idx) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/mentor/chat/${student.id}`}>
                                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-[#9BB068] transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#F7F4F2] flex items-center justify-center">
                                                <MessageCircle className="w-6 h-6 text-[#9BB068]" />
                                            </div>
                                            <div>
                                                <h4 className="text-[#4B3425] font-extrabold text-lg">{student.name}</h4>
                                                <p className="text-[#A69B93] text-sm">Tap to chat</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#A69B93]" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <MentorTabBar />
        </div>
    );
}
