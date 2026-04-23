
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/dashboard/TabBar';
import { User, LogOut, Mail, Calendar, Shield, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
    const router = useRouter();
    const { user, token, logout } = useAuthStore();

    useEffect(() => {
        if (!token) router.push('/login');
    }, [token, router]);

    if (!token || !user) return null;

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            {/* Header with Decorative Elements */}
            <div className="bg-[#4F3422] rounded-b-[3rem] px-6 pt-12 pb-12 text-white shadow-lg relative z-10 overflow-hidden">
                {/* Brand Background Pattern */}
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-[#9BB068]" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Account</span>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform">
                             <Settings className="w-5 h-5 text-white/80" />
                        </button>
                    </div>
                    
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Personal Settings</p>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">Profile</h1>
                    <p className="text-white/60 font-bold text-sm">Manage your account details and preferences</p>
                </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 px-6 pt-10 pb-32 -mt-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-8"
                >
                    {/* Avatar Group - Gradient Removed */}
                    <div className="relative group">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-[0_20px_40px_rgba(75,52,37,0.08)] relative z-10 border border-gray-50 overflow-hidden">
                             <div className="w-full h-full rounded-[2rem] bg-[#E8DDD9] flex items-center justify-center relative">
                                 <span className="text-[#4F3422] font-black text-5xl tracking-tighter">{initials}</span>
                                 <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#9BB068] rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                                     <Shield className="w-4 h-4 text-white" strokeWidth={3} />
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* Name Section */}
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-[#4F3422] tracking-tight">{user.name}</h2>
                        <div className="mt-2 flex items-center justify-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#9BB068]" />
                             <p className="text-[#926247] font-black uppercase tracking-widest text-[10px] opacity-60">Premium Member</p>
                        </div>
                    </div>

                    {/* Info Cards Grid */}
                    <div className="w-full max-w-sm flex flex-col gap-4 mt-2">
                        <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-white flex items-center gap-5 active:scale-[0.98] transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-[#f0efff] flex items-center justify-center shadow-inner">
                                <Mail className="w-6 h-6 text-[#A28FFF]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-[#4F3422]/40 font-black uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-[#4F3422] font-black text-lg tracking-tight">{user.email}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-white flex items-center gap-5 active:scale-[0.98] transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-[#f2f8eb] flex items-center justify-center shadow-inner">
                                <Calendar className="w-6 h-6 text-[#9BB068]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-[#4F3422]/40 font-black uppercase tracking-widest mb-1">Member Since</p>
                                <p className="text-[#4F3422] font-black text-lg tracking-tight">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-white flex items-center gap-5 active:scale-[0.98] transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-[#fff0eb] flex items-center justify-center shadow-inner">
                                <User className="w-6 h-6 text-[#FE814B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-[#4F3422]/40 font-black uppercase tracking-widest mb-1">Account Identity</p>
                                <p className="text-[#4F3422] font-black text-lg tracking-tight">{user.id.slice(0, 12).toUpperCase()}...</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="w-full max-w-sm pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full h-16 bg-[#FE814B] text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(254,129,75,0.2)] hover:bg-[#ff7135] transition-all active:scale-95 border-b-4 border-[#e06b3a]"
                        >
                            <LogOut className="w-5 h-5" strokeWidth={3} /> Sign Out Account
                        </button>
                        <p className="text-center text-[10px] font-black text-[#4F3422]/30 uppercase tracking-widest mt-6 px-4 leading-relaxed">
                            Secured and encrypted session. <br/> Version 2.4.0 High-Fidelity
                        </p>
                    </div>
                </motion.div>
            </div>

            <TabBar />
        </div>
    );
}
