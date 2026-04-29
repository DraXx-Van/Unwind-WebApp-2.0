"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMentorAuthStore, mentorAuthFetch } from '@/store/mentorAuthStore';
import { UserCircle2, Copy, LogOut, Users, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MentorTabBar } from '@/components/mentor/MentorTabBar';

export default function MentorDashboard() {
    const router = useRouter();
    const { mentor, logout } = useMentorAuthStore();
    const [students, setStudents] = useState<any[]>([]);
    const [activeCode, setActiveCode] = useState<{ code: string; expiresAt: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!mentor) {
            router.replace('/mentor/login');
            return;
        }
        fetchDashboardData();
    }, [mentor, router]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [codeRes, studentsRes] = await Promise.all([
                mentorAuthFetch('/mentor/code/active'),
                mentorAuthFetch('/mentor/students')
            ]);

            if (codeRes.ok) {
                const text = await codeRes.text();
                const codeData = text ? JSON.parse(text) : null;
                setActiveCode(codeData || null);
            }
            if (studentsRes.ok) {
                const studentData = await studentsRes.json();
                setStudents(studentData);
            }
        } catch (e) {
            console.error('Error fetching dashboard data:', e);
        }
        setIsLoading(false);
    };

    const handleGenerateCode = async () => {
        try {
            const res = await mentorAuthFetch('/mentor/code/generate', { method: 'POST' });
            if (res.ok) {
                const newCode = await res.json();
                setActiveCode(newCode);
            }
        } catch (e) {
            console.error('Error generating code:', e);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/mentor/login');
    };

    if (!mentor) return null;

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-10">
            {/* Header */}
            <div className="bg-[#4B3425] rounded-b-[48px] pt-12 pb-10 px-6 shadow-lg relative overflow-hidden">
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
                
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#9BB068] flex items-center justify-center">
                            <UserCircle2 className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-white font-extrabold text-lg">Dr. {mentor.name}</h2>
                            <p className="text-white/60 text-sm">{mentor.specialization}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <LogOut className="text-white w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="px-6 -mt-6 relative z-20 space-y-6">
                {/* Active Code Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#4B3425] font-extrabold text-lg mb-2">Session Code</h3>
                    <p className="text-sm text-gray-500 mb-4">Share this 6-digit code with your students so they can connect with you.</p>

                    {activeCode ? (
                        <div className="flex items-center justify-between bg-[#F7F4F2] rounded-2xl p-4 border border-[#E8DDD9]">
                            <div className="tracking-[0.5em] text-3xl font-extrabold text-[#4B3425]">
                                {activeCode.code}
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(activeCode.code)}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                            >
                                <Copy className="w-5 h-5 text-[#9BB068]" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerateCode}
                            className="w-full bg-[#9BB068] text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-[#8ca05a] transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" /> Generate New Code
                        </button>
                    )}
                </div>

                {/* Students List */}
                <div>
                    <div className="flex items-center justify-between mb-4 mt-8">
                        <h3 className="text-[#4B3425] font-extrabold text-xl flex items-center gap-2">
                            <Users className="w-6 h-6 text-[#9BB068]" /> Your Students
                        </h3>
                        <span className="bg-[#E8DDD9] text-[#4B3425] px-3 py-1 rounded-full text-sm font-bold">
                            {students.length} Total
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="w-8 h-8 border-4 border-[#9BB068] border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="bg-[#F7F4F2] rounded-3xl p-8 text-center border border-[#E8DDD9]">
                            <p className="text-[#4B3425]/60 font-medium">No students linked yet.</p>
                            <p className="text-[#4B3425]/40 text-sm mt-2">Generate a session code and share it with your students.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((student, idx) => (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={`/mentor/dashboard/student/${student.id}`}>
                                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-[#9BB068] hover:shadow-md transition-all group flex items-center justify-between">
                                            <div>
                                                <h4 className="text-[#4B3425] font-extrabold text-lg">{student.name}</h4>
                                                <div className="flex gap-4 mt-2">
                                                    {student.latestMood && (
                                                        <span className="text-xs font-bold bg-[#F7F4F2] px-2 py-1 rounded-md text-[#4B3425]">
                                                            Mood: {student.latestMood}
                                                        </span>
                                                    )}
                                                    {student.latestStress !== null && (
                                                        <span className="text-xs font-bold bg-[#F7F4F2] px-2 py-1 rounded-md text-[#4B3425]">
                                                            Stress: {student.latestStress}/10
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-[#F7F4F2] flex items-center justify-center group-hover:bg-[#9BB068] transition-colors">
                                                <ChevronRight className="w-5 h-5 text-[#4B3425] group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <MentorTabBar />
        </div>
    );
}
