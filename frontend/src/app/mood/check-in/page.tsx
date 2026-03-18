"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import Link from 'next/link';

// Mood definitions based on Figma/CSS
const MOODS = [
    {
        id: 'OVERWHELMED',
        label: 'Overwhelmed',
        color: '#A18FFF', // User specified
        faceColor: '#1C0070',
        icon: '/assets/Moods/1.svg',
    },
    {
        id: 'LOW',
        label: 'Low',
        color: '#FE814B', // User specified
        faceColor: '#702901',
        icon: '/assets/Moods/2.svg',
    },
    {
        id: 'NEUTRAL',
        label: 'Neutral',
        color: '#926247', // User specified
        faceColor: '#4F3422',
        icon: '/assets/Moods/3.svg',
    },
    {
        id: 'HAPPY',
        label: 'Happy',
        color: '#FFCE5C', // User specified
        faceColor: '#705600',
        icon: '/assets/Moods/4.svg',
    },
    {
        id: 'OVERJOYED',
        label: 'Overjoyed',
        color: '#9BB068', // User specified
        faceColor: '#3D4A26',
        icon: '/assets/Moods/5.svg',
    },
];

export default function MoodCheckInPage() {
    const router = useRouter();
    const { todayMood, fetchTodayMood, setTodayMood, isLoading } = useMoodStore();
    const [currentIndex, setCurrentIndex] = useState(2); // Default to Neutral (index 2)

    useEffect(() => {
        fetchTodayMood();
    }, [fetchTodayMood]);

    useEffect(() => {
        if (todayMood && todayMood.mood) {
            const index = MOODS.findIndex(m => m.id === todayMood.mood);
            if (index !== -1) setCurrentIndex(index);
        }
    }, [todayMood]);

    const currentMood = MOODS[currentIndex];

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentIndex < MOODS.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handleSave = async () => {
        await setTodayMood(currentMood.id);
        router.push('/mood/stats');
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 ease-in-out"
            style={{ backgroundColor: currentMood.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <header className="px-6 pt-12 pb-4 flex items-center justify-between relative z-10">
                <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center rounded-full border border-black/10 bg-white/20 backdrop-blur-sm">
                    <ChevronLeft className="w-6 h-6 text-[#4F3422]" />
                </Link>
                <div className="text-center">
                    <h1 className="text-lg font-bold text-[#4F3422]">Mood</h1>
                    <span className="text-xs font-semibold text-[#4F3422]/60 uppercase tracking-widest">Check-in</span>
                </div>
                <div className="w-12" /> {/* Spacer */}
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative z-10">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-xl font-bold text-white/90">Hey there!</span>
                        <h2 className="text-4xl font-[800] text-white leading-tight">
                            How did today<br />feel overall?
                        </h2>
                    </motion.div>
                </div>

                {/* Large Icon */}
                <div className="h-48 w-48 mb-10 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMood.id}
                            initial={{ scale: 0.8, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: -10 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <img
                                src={currentMood.icon}
                                alt={currentMood.label}
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Label Text */}
                <motion.div
                    key={`label-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <p className="text-white/80 text-lg font-medium mb-1">Today felt</p>
                    <h3 className="text-4xl font-[900] text-white tracking-tight">{currentMood.label}</h3>
                </motion.div>

                {/* Mood Selector - Curved Slider */}
                <div className="relative w-full max-w-sm h-24 flex items-center justify-center px-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 320 80">
                        {/* Curve Line */}
                        <path
                            d="M 10 40 Q 160 100 310 40"
                            fill="none"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="12 12"
                        />

                        {/* Interaction Dots */}
                        {MOODS.map((mood, index) => {
                            // Calculate position along the Quad Bezier curve
                            // Wider spread: P0=(10,40), P1=(160,100), P2=(310,40)
                            const t = index / (MOODS.length - 1);
                            const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 160 + t * t * 310;
                            const y = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 100 + t * t * 40;

                            const isSelected = index === currentIndex;
                            const isPassed = index < currentIndex;

                            return (
                                <g key={mood.id} onClick={() => setCurrentIndex(index)} className="cursor-pointer">
                                    {/* Outer Ring for Selected */}
                                    {isSelected && (
                                        <circle cx={x} cy={y} r="20" fill="none" stroke="white" strokeWidth="3" />
                                    )}

                                    {/* Main Dot */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={isSelected ? 10 : 8}
                                        fill={isSelected || isPassed ? "white" : "rgba(255,255,255,0.3)"}
                                        className="transition-all duration-300"
                                    />

                                    {/* Inner Dot for Selected */}
                                    {isSelected && (
                                        <circle cx={x} cy={y} r="5" fill={currentMood.faceColor} />
                                    )}

                                    {/* Click Target Area (Invisible larger circle) */}
                                    <circle cx={x} cy={y} r="24" fill="transparent" />
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </main>

            {/* Bottom Action */}
            <div className="absolute bottom-10 left-0 right-0 px-6 flex justify-center z-20">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full max-w-sm bg-white text-[#4F3422] h-16 rounded-full font-[800] text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:shadow-2xl disabled:opacity-70 disabled:pointer-events-none"
                    style={{ color: currentMood.faceColor }}
                >
                    {isLoading ? (
                        <span>Saving...</span>
                    ) : (
                        <>
                            <span>Save Today's Mood</span>
                            <Check className="w-6 h-6" strokeWidth={3} />
                        </>
                    )}
                </button>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/5 rounded-full blur-[80px]" />
            </div>
        </motion.div>
    );
}
