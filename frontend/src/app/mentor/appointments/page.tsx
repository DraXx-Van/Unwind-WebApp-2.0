"use client";

import { useEffect, useState } from 'react';
import { MentorTabBar } from '@/components/mentor/MentorTabBar';
import { Calendar, Clock, Video, User, ChevronRight } from 'lucide-react';
import { mentorAuthFetch } from '@/store/mentorAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function MentorAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        mentorAuthFetch('/appointments')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAppointments(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
            {/* Header */}
            <div className="bg-[#4B3425] pt-16 pb-10 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
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

                <div className="flex items-center gap-4 mb-2 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Calendar className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-white text-3xl font-black tracking-tight">Appointments</h1>
                        <p className="text-white/60 text-sm font-medium">Manage your student sessions</p>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-6">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#4B3425]/10 border-t-[#4B3425] rounded-full animate-spin" />
                        </div>
                    ) : appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((apt, idx) => (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[32px] p-6 shadow-sm border border-[#F7F4F2] relative overflow-hidden group hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#F7F4F2] rounded-full flex items-center justify-center">
                                                <User className="text-[#4B3425] w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-[#4B3425] font-black">{apt.student?.name}</h3>
                                                <p className="text-[#A69B93] text-xs font-bold uppercase tracking-wider">{apt.topic || 'General Session'}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            apt.status === 'CONFIRMED' ? "bg-[#9BB068]/10 text-[#9BB068]" : "bg-[#FE814B]/10 text-[#FE814B]"
                                        )}>
                                            {apt.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center text-sm font-bold text-[#4B3425]/70">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(apt.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {apt.meetLink && (
                                        <div className="mt-4 pt-4 border-t border-[#F7F4F2] flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[#9BB068] font-black text-xs uppercase tracking-widest">
                                                <Video className="w-4 h-4" />
                                                Meeting Ready
                                            </div>
                                            <a 
                                                href={apt.meetLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-[#9BB068] text-white rounded-xl shadow-lg active:scale-95 transition-transform"
                                            >
                                                <Video className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-[#F7F4F2] rounded-full flex items-center justify-center mb-6">
                                <Calendar className="w-10 h-10 text-[#4B3425]/20" />
                            </div>
                            <h3 className="text-xl font-black text-[#4B3425]">No Appointments</h3>
                            <p className="text-[#A69B93] max-w-xs mt-2 font-medium">
                                You don't have any scheduled sessions yet.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            
            <MentorTabBar />
        </div>
    );
}
