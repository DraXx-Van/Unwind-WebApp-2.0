
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ─── slide data ─── */
const slides = [
    {
        id: 0,
        bg: '#F7F4F2',
        illustrationSrc: '/assets/welcome_Screen_assets/Screen1.svg',
        illustrationAlt: 'Unwind mascot character',
        title: (
            <>
                Welcome to{' '}
                <span style={{ color: '#9BB068' }}>Unwind</span>
            </>
        ),
        subtitle: (
            <span className="flex justify-center items-center gap-1.5">
                Your mindful mental health AI companion for everyone, anywhere <Leaf className="w-[18px] h-[18px] text-[#9BB068]" />
            </span>
        ),
        tag: null as null | { label: string; bg: string; color: string },
    },
    {
        id: 1,
        bg: '#FFD2C2',
        illustrationSrc: '/assets/welcome_Screen_assets/Screen2.svg',
        illustrationAlt: 'Mood tracking illustration',
        title: (
            <>
                <span style={{ color: '#FE631B' }}>Intelligent</span>{' '}
                <span style={{ color: '#4B3425' }}>Mood Tracking & Emotion Insights</span>
            </>
        ),
        subtitle: null as null | React.ReactNode,
        tag: { label: 'STEP 2', bg: '#FFD2C2', color: '#FE814B' },
    },
    {
        id: 2,
        bg: '#FFEBC2',
        illustrationSrc: '/assets/welcome_Screen_assets/Screen3.svg',
        illustrationAlt: 'Mindful resources illustration',
        title: (
            <>
                <span style={{ color: '#4B3425' }}>Mindful</span>{' '}
                <span style={{ color: '#E0A500' }}>Resources</span>{' '}
                <span style={{ color: '#4B3425' }}>That Makes You Happy</span>
            </>
        ),
        subtitle: null as null | React.ReactNode,
        tag: { label: 'STEP 3', bg: '#FFEBC2', color: '#E0A500' },
    },
];

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({ 
        opacity: 1, 
        y: 0,
        transition: { delay: custom * 0.15, duration: 0.5, ease: "easeOut" }
    })
};

export default function Home() {
    const router = useRouter();
    const { token } = useAuthStore();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    useEffect(() => {
        if (token) router.push('/dashboard');
    }, [token, router]);

    const goNext = useCallback(() => {
        if (current < slides.length - 1) {
            setDirection(1);
            setCurrent((p) => p + 1);
        } else {
            router.push('/register');
        }
    }, [current, router]);

    const goTo = useCallback((index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    }, [current]);

    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 60) {
            if (diff > 0 && current < slides.length - 1) { setDirection(1); setCurrent((p) => p + 1); }
            else if (diff < 0 && current > 0) { setDirection(-1); setCurrent((p) => p - 1); }
        }
        setTouchStart(null);
    };

    if (token) return null;

    const slide = slides[current];

    return (
        <div
            className="relative min-h-screen overflow-hidden select-none"
            style={{ background: slide.bg, transition: 'background 0.45s ease' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <AnimatePresence custom={direction} mode="wait">
                <motion.div
                    key={slide.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring' as const, damping: 25, stiffness: 200, mass: 1 }}
                    className="flex flex-col min-h-screen"
                    style={{ background: slide.bg }}
                >

                    {/* ══════════════════════════════════════════════
                        SCREEN 1 — Welcome
                    ══════════════════════════════════════════════ */}
                    {slide.id === 0 && (
                        <div className="flex flex-col items-center flex-1 px-4">
                            {/* Logo pill */}
                            <motion.div 
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring' as const, damping: 12, delay: 0.2 }}
                                className="mt-16 w-16 h-16 rounded-full flex items-center justify-center shadow-lg" 
                                style={{ background: '#4B3425' }}
                            >
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="24" r="5" fill="white" />
                                    <circle cx="8"  cy="16" r="5" fill="white" />
                                    <circle cx="16" cy="8"  r="5" fill="white" />
                                    <circle cx="24" cy="16" r="5" fill="white" />
                                </svg>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                custom={1}
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                className="mt-6 text-[30px] leading-[38px] font-black text-center"
                                style={{ fontFamily: 'Urbanist, sans-serif', letterSpacing: '-0.02em', color: '#4B3425' }}
                            >
                                {slide.title}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                custom={2}
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                className="mt-4 text-[18px] leading-[160%] font-bold text-center max-w-[311px]"
                                style={{ color: 'rgba(31, 22, 15, 0.64)', fontFamily: 'Urbanist, sans-serif', letterSpacing: '-0.01em' }}
                            >
                                {slide.subtitle}
                            </motion.p>

                            {/* Illustration */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' as const }}
                                className="relative mt-8 w-[300px] h-[300px] flex-shrink-0"
                            >
                                <div className="absolute inset-0 bg-white rounded-full shadow-inner" />
                                <motion.div
                                    animate={{ 
                                        y: [0, -12, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={slide.illustrationSrc}
                                        alt={slide.illustrationAlt}
                                        fill
                                        className="object-contain z-10 p-6"
                                        priority
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Get Started button */}
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={goNext}
                                className="mt-10 flex items-center justify-center gap-4 px-8 active:scale-95 transition-transform shadow-xl"
                                style={{
                                    height: 56,
                                    background: '#4B3425',
                                    borderRadius: 1000,
                                    fontFamily: 'Urbanist, sans-serif',
                                }}
                            >
                                <span className="text-white text-[18px] font-black" style={{ letterSpacing: '-0.01em' }}>Get Started</span>
                                <ArrowRight className="text-white w-6 h-6" strokeWidth={3} />
                            </motion.button>

                            {/* Sign In link */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8 mb-10 text-center" 
                                style={{ fontFamily: 'Urbanist, sans-serif' }}
                            >
                                <span className="text-sm font-bold" style={{ color: 'rgba(31, 22, 15, 0.64)' }}>
                                    Already have an account?{' '}
                                </span>
                                <Link href="/login" className="text-sm font-black hover:underline" style={{ color: '#FE814B' }}>
                                    Sign In.
                                </Link>
                            </motion.div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════
                        SCREENS 2 & 3 — Feature slides
                    ══════════════════════════════════════════════ */}
                    {slide.id !== 0 && (
                        <div className="flex flex-col flex-1">

                            {/* ── Dot indicators ── */}
                            <div className="flex justify-center gap-3 pt-16 z-30 relative">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className="w-3 h-3 rounded-full transition-all duration-300"
                                        style={{
                                            background: i <= current ? '#4B3425' : 'transparent',
                                            border: i <= current ? 'none' : '1.5px solid #4B3425',
                                            width: i === current ? 24 : 12,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* ── Illustration ── */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative flex-1 z-0" 
                                style={{ minHeight: 280 }}
                            >
                                <Image
                                    src={slide.illustrationSrc}
                                    alt={slide.illustrationAlt}
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                            </motion.div>

                            {/* ── White curved card at bottom ── */}
                            <div className="relative z-10" style={{ marginTop: -40 }}>
                                {/* FIX: Use x: "-50%" in motion props to avoid transform clash, and ensure z-index */}
                                <motion.div
                                    initial={{ y: 200, x: "-50%" }}
                                    animate={{ y: 0, x: "-50%" }}
                                    transition={{ type: 'spring' as const, damping: 25, stiffness: 120 }}
                                    className="absolute z-0"
                                    style={{
                                        top: -60,
                                        left: '50%',
                                        width: '200vw',
                                        height: 160,
                                        background: '#FFFFFF',
                                        borderRadius: '50%',
                                        boxShadow: '0px -17px 38px rgba(75,52,37,0.05), 0px -69px 69px rgba(75,52,37,0.04)',
                                    }}
                                />

                                <div
                                    className="relative z-10 flex flex-col items-center px-6 pb-20"
                                    style={{ background: '#FFFFFF', paddingTop: 28 }}
                                >
                                    {/* Step tag */}
                                    {slide.tag && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex items-center justify-center rounded-full mb-6 shadow-sm border border-black/5"
                                            style={{ background: slide.tag.bg, padding: '8px 16px' }}
                                        >
                                            <span
                                                style={{
                                                    color: slide.tag.color,
                                                    fontFamily: 'Urbanist, sans-serif',
                                                    fontSize: 13,
                                                    fontWeight: 900,
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {slide.tag.label}
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Heading */}
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-[30px] leading-[38px] font-black text-center max-w-[311px]"
                                        style={{ fontFamily: 'Urbanist, sans-serif', letterSpacing: '-0.02em' }}
                                    >
                                        {slide.title}
                                    </motion.h2>

                                    {/* Arrow button */}
                                    <motion.button
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring' as const, damping: 10, delay: 0.6 }}
                                        onClick={goNext}
                                        className="mt-8 flex items-center justify-center active:scale-90 transition-all shadow-2xl hover:shadow-[0_12px_32px_rgba(75,52,37,0.3)]"
                                        style={{
                                            width: 80, height: 80,
                                            background: '#4B3425',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        <ArrowRight className="text-white w-7 h-7" strokeWidth={3} />
                                    </motion.button>
                                </div>
                            </div>

                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
