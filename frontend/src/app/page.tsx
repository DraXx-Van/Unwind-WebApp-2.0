"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
        subtitle: 'Your mindful mental health AI companion for everyone, anywhere 🌿',
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
                <span style={{ color: '#4B3425' }}>Mood Tracking &amp; Emotion Insights</span>
            </>
        ),
        subtitle: null as null | string,
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
        subtitle: null as null | string,
        tag: { label: 'STEP 3', bg: '#FFEBC2', color: '#E0A500' },
    },
];

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
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
                    transition={{ type: 'tween', duration: 0.38, ease: 'easeInOut' }}
                    className="flex flex-col min-h-screen"
                    style={{ background: slide.bg }}
                >

                    {/* ══════════════════════════════════════════════
                        SCREEN 1 — Welcome
                    ══════════════════════════════════════════════ */}
                    {slide.id === 0 && (
                        <div className="flex flex-col items-center flex-1 px-4">
                            {/* Logo pill */}
                            <div className="mt-16 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#4B3425' }}>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="9.78" cy="19.56" r="6.22" fill="white" />
                                    <circle cx="0"    cy="9.78"  r="6.22" fill="white" />
                                    <circle cx="9.78" cy="0"     r="6.22" fill="white" />
                                    <circle cx="19.56" cy="9.78" r="6.22" fill="white" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h1
                                className="mt-6 text-[30px] leading-[38px] font-extrabold text-center"
                                style={{ fontFamily: 'Urbanist, sans-serif', letterSpacing: '-0.02em', color: '#4B3425' }}
                            >
                                {slide.title}
                            </h1>

                            {/* Subtitle */}
                            <p
                                className="mt-4 text-[18px] leading-[160%] font-medium text-center max-w-[311px]"
                                style={{ color: 'rgba(31, 22, 15, 0.64)', fontFamily: 'Urbanist, sans-serif', letterSpacing: '-0.01em' }}
                            >
                                {slide.subtitle}
                            </p>

                            {/* Illustration — white circle background as in Figma */}
                            <div className="relative mt-8 w-[300px] h-[300px] flex-shrink-0">
                                <div className="absolute inset-0 bg-white rounded-full" />
                                <Image
                                    src={slide.illustrationSrc}
                                    alt={slide.illustrationAlt}
                                    fill
                                    className="object-contain z-10"
                                    priority
                                />
                            </div>

                            {/* Get Started button */}
                            <button
                                onClick={goNext}
                                className="mt-10 flex items-center justify-center gap-4 px-6 active:scale-95 transition-transform"
                                style={{
                                    height: 56,
                                    background: '#4B3425',
                                    borderRadius: 1000,
                                    fontFamily: 'Urbanist, sans-serif',
                                }}
                            >
                                <span className="text-white text-[18px] font-extrabold" style={{ letterSpacing: '-0.01em' }}>Get Started</span>
                                <ArrowRight className="text-white w-6 h-6" strokeWidth={2.5} />
                            </button>

                            {/* Sign In link */}
                            <div className="mt-8 mb-10 text-center" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                                <span className="text-sm font-medium" style={{ color: 'rgba(31, 22, 15, 0.64)' }}>
                                    Already have an account?{' '}
                                </span>
                                <Link href="/login" className="text-sm font-bold hover:underline" style={{ color: '#FE814B' }}>
                                    Sign In.
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════
                        SCREENS 2 & 3 — Feature slides
                    ══════════════════════════════════════════════ */}
                    {slide.id !== 0 && (
                        <div className="flex flex-col flex-1">

                            {/* ── Dot indicators (floating over coloured bg) ── */}
                            <div className="flex justify-center gap-3 pt-16 z-30 relative">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className="w-3 h-3 rounded-full transition-all duration-300"
                                        style={{
                                            background: i <= current ? '#4B3425' : 'transparent',
                                            border: i <= current ? 'none' : '1.5px solid #4B3425',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* ── Full-bleed illustration — sits on coloured background ── */}
                            <div className="relative flex-1" style={{ minHeight: 280 }}>
                                <Image
                                    src={slide.illustrationSrc}
                                    alt={slide.illustrationAlt}
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                            </div>

                            {/* ── White curved card at bottom ──
                                A very wide, very tall rounded rectangle whose top arc
                                creates the concave curve seen in the Figma design.
                            ── */}
                            <div className="relative" style={{ marginTop: -40 }}>
                                {/* The arc — overflow hidden on parent clips it */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -60,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '200vw',
                                        height: 160,
                                        background: '#FFFFFF',
                                        borderRadius: '50%',
                                        boxShadow: '0px -17px 38px rgba(75,52,37,0.05), 0px -69px 69px rgba(75,52,37,0.04)',
                                    }}
                                />

                                {/* White content below the arc */}
                                <div
                                    className="relative z-10 flex flex-col items-center px-6 pb-20"
                                    style={{ background: '#FFFFFF', paddingTop: 28 }}
                                >
                                    {/* Step tag */}
                                    {slide.tag && (
                                        <div
                                            className="flex items-center justify-center rounded-full mb-6"
                                            style={{ background: slide.tag.bg, padding: '8px 12px' }}
                                        >
                                            <span
                                                style={{
                                                    color: slide.tag.color,
                                                    fontFamily: 'Urbanist, sans-serif',
                                                    fontSize: 12,
                                                    fontWeight: 800,
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {slide.tag.label}
                                            </span>
                                        </div>
                                    )}

                                    {/* Heading */}
                                    <h2
                                        className="text-[30px] leading-[38px] font-extrabold text-center max-w-[311px]"
                                        style={{ fontFamily: 'Urbanist, sans-serif', letterSpacing: '-0.02em' }}
                                    >
                                        {slide.title}
                                    </h2>

                                    {/* Arrow button */}
                                    <button
                                        onClick={goNext}
                                        className="mt-8 flex items-center justify-center active:scale-90 transition-transform"
                                        style={{
                                            width: 80, height: 80,
                                            background: '#4B3425',
                                            borderRadius: '50%',
                                            boxShadow: '0 8px 24px rgba(75,52,37,0.25)',
                                        }}
                                    >
                                        <ArrowRight className="text-white w-6 h-6" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
