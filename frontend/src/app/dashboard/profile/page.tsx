"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/dashboard/TabBar';
import { User, LogOut, Mail, Calendar, Shield } from 'lucide-react';
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
            {/* Header */}
            <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-12 pb-10 text-white shadow-lg relative z-10">
                <h1 className="text-3xl font-bold mb-2">Profile</h1>
                <p className="text-white/70 font-medium">Manage your account</p>
            </div>

            {/* Profile Content */}
            <div className="flex-1 px-6 pt-8 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Avatar */}
                    <div className="w-28 h-28 rounded-full bg-[#E8DDD9] flex items-center justify-center relative shadow-lg">
                        <span className="text-[#4F3422] font-extrabold text-4xl">{initials}</span>
                        <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-serenity-green-50 rounded-full flex items-center justify-center shadow-md border-3 border-white">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="text-center">
                        <h2 className="text-2xl font-extrabold text-[#4F3422]">{user.name}</h2>
                        <p className="text-[#926247] font-medium mt-1">Premium Member</p>
                    </div>

                    {/* Info Cards */}
                    <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#f0efff] flex items-center justify-center">
                                <Mail className="w-5 h-5 text-[#A28FFF]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#926247] font-medium">Email</p>
                                <p className="text-[#4F3422] font-bold">{user.email}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#f2f8eb] flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[#9BB068]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#926247] font-medium">Member Since</p>
                                <p className="text-[#4F3422] font-bold">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#fff0eb] flex items-center justify-center">
                                <User className="w-5 h-5 text-[#FE814B]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#926247] font-medium">Account ID</p>
                                <p className="text-[#4F3422] font-bold text-sm">{user.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full max-w-sm mt-6 h-14 bg-[#FE814B] text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-[#ff7135] transition-colors active:scale-95"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </motion.div>
            </div>

            <TabBar />
        </div>
    );
}
