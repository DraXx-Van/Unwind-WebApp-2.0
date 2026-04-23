"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMentorAuthStore, mentorAuthFetch } from '@/store/mentorAuthStore';
import { ChevronLeft, Calendar, Brain, HeartPulse, Activity } from 'lucide-react';
import Link from 'next/link';

export default function StudentDetailDashboard() {
    const router = useRouter();
    const params = useParams();
    const { mentor } = useMentorAuthStore();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!mentor) {
            router.replace('/mentor/login');
            return;
        }
        if (params?.id) {
            fetchStudentDetail(params.id as string);
        }
    }, [mentor, router, params]);

    const fetchStudentDetail = async (userId: string) => {
        setIsLoading(true);
        try {
            const res = await mentorAuthFetch(`/mentor/students/${userId}/details`);
            if (res.ok) {
                const details = await res.json();
                setData(details);
            } else {
                router.push('/mentor/dashboard');
            }
        } catch (e) {
            console.error('Error fetching student details:', e);
        }
        setIsLoading(false);
    };

    if (isLoading || !data) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#9BB068] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { student, moods, stressEntries, sleepEntries, journals } = data;

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-10">
            {/* Header */}
            <div className="bg-[#4B3425] pt-12 pb-6 px-6 relative">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <ChevronLeft className="text-white w-6 h-6" />
                    </button>
                    <h1 className="text-white font-extrabold text-xl">Student Details</h1>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md relative translate-y-12">
                    <h2 className="text-[#4B3425] font-extrabold text-2xl">{student.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{student.email}</p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Stress</span>
                            <div className="text-xl font-extrabold text-[#FE814B]">
                                {stressEntries.length ? Math.round(stressEntries.reduce((a: any, b: any) => a + b.value, 0) / stressEntries.length) : '-'} / 10
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Journals</span>
                            <div className="text-xl font-extrabold text-[#9BB068]">{journals.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-20 space-y-6">
                {/* Moods Section */}
                <div>
                    <h3 className="text-[#4B3425] font-extrabold text-lg mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-[#9BB068]" /> Recent Moods (7 Days)
                    </h3>
                    {moods.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No mood entries</p>
                    ) : (
                        <div className="flex overflow-x-auto gap-3 pb-2 snap-x">
                            {moods.map((m: any) => (
                                <div key={m.id} className="min-w-[120px] bg-[#F7F4F2] p-4 rounded-2xl snap-start border border-[#E8DDD9]">
                                    <div className="text-[10px] font-bold text-gray-400 mb-1">{new Date(m.date).toLocaleDateString()}</div>
                                    <div className="font-extrabold text-[#4B3425]">{m.mood}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Journals Section (Titles Only) */}
                <div>
                    <h3 className="text-[#4B3425] font-extrabold text-lg mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#9BB068]" /> Recent Journals
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">* Content is hidden for student privacy.</p>
                    
                    {journals.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No journal entries</p>
                    ) : (
                        <div className="space-y-3">
                            {journals.map((j: any) => (
                                <div key={j.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-extrabold text-[#4B3425]">{j.title || 'Untitled Entry'}</h4>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1">{new Date(j.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <span className="bg-[#E8DDD9] text-[#4B3425] px-3 py-1 rounded-full text-xs font-bold">
                                        Emotion: {j.emotion}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stress & Sleep Warning Note */}
                <div className="bg-[#FFF8F5] border border-[#FE814B]/30 rounded-2xl p-4 mt-8 flex items-start gap-3">
                    <Activity className="w-5 h-5 text-[#FE814B] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#4B3425]/80 font-medium">
                        Detailed stress and sleep metrics will be available in the next dashboard update.
                    </p>
                </div>
            </div>
        </div>
    );
}
