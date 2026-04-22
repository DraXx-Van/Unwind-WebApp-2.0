"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Smile, Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-mindful-brown-10 flex flex-col">
            {/* Top Decorative Section */}
            <div className="bg-[#4F3422] rounded-b-[48px] px-6 pt-16 pb-14 text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-[#A28FFF] rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                        <Smile size={40} className="text-white" />
                        <motion.div
                            className="absolute -top-1 -right-1 w-7 h-7 bg-serenity-green-50 rounded-full flex items-center justify-center shadow-md"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create Account</h1>
                    <p className="text-white/70 font-medium text-lg">Begin your mental wellness journey</p>
                </motion.div>
            </div>

            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex-1 px-6 pt-8 pb-8 max-w-md mx-auto w-full"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-bold text-sm pl-1">Full Name</label>
                        <div className="bg-white rounded-full px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                            <User className="w-5 h-5 text-[#926247]/50" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-lg font-medium placeholder:text-gray-300"
                                value={name}
                                onChange={(e) => { setName(e.target.value); clearError(); }}
                                required
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-bold text-sm pl-1">Email</label>
                        <div className="bg-white rounded-full px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#926247]/50" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-lg font-medium placeholder:text-gray-300"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#4F3422] font-bold text-sm pl-1">Password</label>
                        <div className="bg-white rounded-full px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-[#926247]/50" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                className="bg-transparent outline-none flex-1 text-[#4F3422] text-lg font-medium placeholder:text-gray-300"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#926247]/50 hover:text-[#4F3422] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {password.length > 0 && password.length < 6 && (
                            <span className="text-xs text-[#FE814B] font-medium pl-5">Password must be at least 6 characters</span>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-sm font-medium text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !name || !email || password.length < 6}
                        className="w-full h-16 bg-[#4F3422] text-white rounded-full font-extrabold text-xl shadow-xl flex items-center justify-center gap-3 mt-4 transition-all hover:bg-[#3d281a] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Account <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
                            </>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-8">
                    <span className="text-[#926247] font-medium">Already have an account? </span>
                    <Link
                        href="/login"
                        className="text-[#4F3422] font-bold hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
