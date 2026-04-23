"use client";

import { useState } from 'react';
import { ChevronLeft, Brain, UserCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

export default function NewChatPage() {
    const router = useRouter();
    const { joinMentor, startNewAiChat } = useChatStore();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleJoinMentor = async () => {
        if (code.length === 6) {
            const mentorId = await joinMentor(code);
            if (mentorId) {
                router.push(`/dashboard/chat/mentor-${mentorId}`);
            } else {
                setError('Invalid or expired code. Please check with your mentor.');
            }
        }
    };

    const handleStartAi = async () => {
        const id = await startNewAiChat('');
        router.push(`/dashboard/chat/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pt-12">
            <header className="flex items-center justify-between mb-12">
                <button onClick={() => router.back()} className="w-12 h-12 rounded-full bg-[#F7F4F2] flex items-center justify-center">
                    <ChevronLeft className="text-[#4B3425] w-6 h-6" />
                </button>
                <h1 className="text-[#4B3425] text-xl font-extrabold">New Session</h1>
                <div className="w-12" />
            </header>

            <div className="space-y-6">
                <button 
                    onClick={handleStartAi}
                    className="w-full bg-[#F7F4F2] p-6 rounded-32px flex items-center justify-between group hover:bg-[#E8DDD9] transition-colors text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <Brain className="text-[#9BB068] w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-[#4B3425] font-extrabold text-lg">AI Support</h3>
                            <p className="text-[#4B3425]/60 text-sm font-bold">Chat with UnwindAI</p>
                        </div>
                    </div>
                    <ArrowRight className="text-[#4B3425]/30 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Mentor Join Option */}
                <div className="bg-[#4B3425] p-6 rounded-32px text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <UserCircle2 className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg">Mentor Session</h3>
                            <p className="text-white/60 text-sm font-bold">Join using a shared code</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input 
                            type="text" 
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="ENTER 6-DIGIT CODE"
                            className="w-full bg-white/10 border border-white/20 rounded-2xl h-14 px-6 text-center text-xl font-bold tracking-[0.5em] placeholder:text-white/20 outline-none focus:bg-white/20 transition-all"
                        />
                        {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}
                        <button 
                            disabled={code.length < 6}
                            onClick={handleJoinMentor}
                            className="w-full bg-[#9BB068] h-14 rounded-2xl font-extrabold shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                        >
                            JOIN SESSION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
