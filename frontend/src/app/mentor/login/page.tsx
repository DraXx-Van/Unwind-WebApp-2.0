"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCircle2, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useMentorAuthStore } from '@/store/mentorAuthStore';
import { motion } from 'framer-motion';

export default function MentorLoginPage() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useMentorAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        const success = await login(email, password);
        if (success) {
            router.push('/mentor/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-mindful-brown-10 flex flex-col">
            <div className="bg-[#4B3425] rounded-b-[48px] px-6 pt-16 pb-14 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-[#9BB068] rounded-full flex items-center justify-center shadow-lg mb-6">
                        <UserCircle2 size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Mentor Portal</h1>
                    <p className="text-white/70 font-medium text-lg">Sign in to support your students</p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex-1 px-6 pt-10 pb-8 max-w-md mx-auto w-full"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-bold text-sm pl-1">Email</label>
                        <div className="bg-white rounded-full px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#926247]/50" />
                            <input
                                type="email"
                                placeholder="mentor@example.com"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-lg font-medium placeholder:text-gray-300"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-bold text-sm pl-1">Password</label>
                        <div className="bg-white rounded-full px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-[#926247]/50" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-lg font-medium placeholder:text-gray-300"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#926247]/50 hover:text-[#4F3422] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-sm font-medium text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full h-16 bg-[#9BB068] text-white rounded-full font-extrabold text-xl shadow-xl flex items-center justify-center gap-3 mt-4 transition-all hover:bg-[#8ca05a] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <span className="text-[#926247] font-medium">New mentor? </span>
                    <Link href="/mentor/register" className="text-[#4F3422] font-bold hover:underline">
                        Apply Here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
