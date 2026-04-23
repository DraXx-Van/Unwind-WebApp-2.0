"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Smile, Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', damping: 20 }
    }
};

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return;
        if (password.length < 6) return;
        const success = await register(name, email, password);
        if (success) {
            router.push('/assessment');
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans">
            {/* Top Decorative Section */}
            <div className="bg-[#4F3422] rounded-b-[48px] px-6 pt-10 pb-8 text-white relative overflow-hidden">
                {/* Decorative circles - with floating animation */}
                <motion.div 
                    animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" 
                />
                <motion.div 
                    animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" 
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-[#A28FFF] rounded-[28px] flex items-center justify-center shadow-2xl mb-6 relative rotate-3">
                        <Smile size={40} className="text-white" />
                        <motion.div
                            className="absolute -top-2 -right-2 w-8 h-8 bg-[#9BB068] rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>
                    <h1 className="text-[34px] font-black tracking-tight mb-2">Create Account</h1>
                    <p className="text-white/60 font-bold text-lg max-w-[240px]">Begin your mental wellness journey</p>
                </motion.div>
            </div>

            {/* Form Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 px-6 pt-10 pb-8 max-w-md mx-auto w-full"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Name Input */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-black text-[13px] uppercase tracking-widest pl-5 opacity-60">Full Name</label>
                        <div className="bg-white rounded-[24px] px-6 py-4 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-gray-100 flex items-center gap-4 focus-within:border-[#4F3422]/20 transition-all">
                            <User className="w-5 h-5 text-[#926247]/40" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-[17px] font-bold placeholder:text-gray-200"
                                value={name}
                                onChange={(e) => { setName(e.target.value); clearError(); }}
                                required
                                autoComplete="name"
                            />
                        </div>
                    </motion.div>

                    {/* Email Input */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-black text-[13px] uppercase tracking-widest pl-5 opacity-60">Email Address</label>
                        <div className="bg-white rounded-[24px] px-6 py-4 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-gray-100 flex items-center gap-4 focus-within:border-[#4F3422]/20 transition-all">
                            <Mail className="w-5 h-5 text-[#926247]/40" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-[17px] font-bold placeholder:text-gray-200"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-black text-[13px] uppercase tracking-widest pl-5 opacity-60">Password</label>
                        <div className="bg-white rounded-[24px] px-6 py-4 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-gray-100 flex items-center gap-4 focus-within:border-[#4F3422]/20 transition-all">
                            <Lock className="w-5 h-5 text-[#926247]/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 6 characters"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-[17px] font-bold placeholder:text-gray-200"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#926247]/30 hover:text-[#4F3422] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl text-sm font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                        variants={itemVariants}
                        type="submit"
                        disabled={isLoading || !name || !email || password.length < 6}
                        className="w-full h-[72px] bg-[#4F3422] text-white rounded-[28px] font-black text-xl shadow-[0_12px_32_rgba(79,52,34,0.3)] flex items-center justify-center gap-3 mt-4 transition-all hover:bg-[#3d281a] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Account <ArrowRight className="w-6 h-6" strokeWidth={3} />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Alternative Actions */}
                <motion.div variants={itemVariants} className="flex flex-col gap-4 mt-10 mb-8">
                    <div className="text-center mb-2">
                        <span className="text-[#926247] font-bold opacity-60 text-sm">Already have an account? </span>
                        <Link
                            href="/login"
                            className="text-[#4F3422] font-black hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                    
                    <div className="h-px bg-[#4F3422]/10 w-full mb-2" />
                    
                    <Link
                        href="/mentor/register"
                        className="w-full py-4 bg-white border border-[#4F3422]/10 text-[#4F3422] rounded-2xl font-black text-[12px] uppercase tracking-widest text-center shadow-sm hover:bg-white/80 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <UserPlus className="w-4 h-4 text-[#A28FFF]" /> Sign Up as a Mentor
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
