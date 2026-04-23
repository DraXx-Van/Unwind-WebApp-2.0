"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react';
import { useMoodStore } from '@/store/moodStore';
import { motion } from 'framer-motion';
import { TabBar } from '@/components/dashboard/TabBar';
import { isToday, isWithinDays } from '@/lib/dateUtils';

// Mood definitions using 'Solid' icons from assets root as requested
const MOOD_CONFIG: Record<string, { label: string; color: string; score: number; icon: string }> = {
    'OVERWHELMED': { label: 'Overwhelmed', color: '#A18FFF', score: 1, icon: '/assets/Solid mood depressed.svg' },
    'LOW': { label: 'Low', color: '#FE814B', score: 2, icon: '/assets/Solid mood sad.svg' },
    'NEUTRAL': { label: 'Neutral', color: '#926247', score: 3, icon: '/assets/Solid mood neutral.svg' },
    'HAPPY': { label: 'Happy', color: '#FFCE5C', score: 4, icon: '/assets/Solid mood happy.svg' },
    'OVERJOYED': { label: 'Overjoyed', color: '#9BB068', score: 5, icon: '/assets/Solid mood overjoyed.svg' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MoodStatsPage() {
    const { history, todayMood, fetchHistory, fetchTodayMood } = useMoodStore();

    useEffect(() => {
        fetchHistory();
        fetchTodayMood();
    }, [fetchHistory, fetchTodayMood]);

    // Process history to map to current week (Mon-Sun)
    const weeklyData = useMemo(() => {
        const week = new Array(7).fill(null);

        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);
        monday.setHours(0, 0, 0, 0);

        history.forEach((entry) => {
            if (!entry.date) return;
            
            // Check if entry falls on one of our target dates in the current week
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                
                // Compare components for same day regardless of time
                const sessionDate = new Date(entry.date);
                if (
                    sessionDate.getDate() === d.getDate() &&
                    sessionDate.getMonth() === d.getMonth() &&
                    sessionDate.getFullYear() === d.getFullYear()
                ) {
                    week[i] = entry;
                }
            }
        });

        if (todayMood) {
            const now = new Date();
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                if (
                    now.getDate() === d.getDate() &&
                    now.getMonth() === d.getMonth() &&
                    now.getFullYear() === d.getFullYear()
                ) {
                    week[i] = { ...todayMood, date: now.toISOString() };
                }
            }
        }
        return week;
    }, [history, todayMood]);


    const displayMood = todayMood && MOOD_CONFIG[todayMood.mood]
        ? MOOD_CONFIG[todayMood.mood]
        : MOOD_CONFIG['NEUTRAL'];

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
            {/* Top Section */}
            <div className="relative h-[560px] w-full overflow-hidden" style={{ backgroundColor: '#E8DDD9' }}>
                {/* Background SVG - Clean */}
                <img
                    src="/assets/Moods/Frame (1).svg"
                    alt="Background Pattern"
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
                />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col items-center pt-12 px-6 h-full text-[#4F3422]">

                    {/* Header */}
                    <div className="w-full flex items-center justify-between mb-8">
                        <Link href="/dashboard" className="w-12 h-12 rounded-full border border-[#4F3422]/20 flex items-center justify-center hover:bg-[#4F3422]/5 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <span className="font-bold text-xl">Mood</span>
                        <div className="px-3 py-1 bg-[#D4C3BC] rounded-full text-xs font-bold text-[#4F3422] uppercase tracking-wider">
                            Level 3
                        </div>
                    </div>

                    {/* Main Mood Display */}
                    <div className="mt-4 flex flex-col items-center">
                        <span className="text-lg font-medium opacity-80 mb-[-5px]">Your mood is</span>
                        <h1 className="text-6xl font-black tracking-tight mb-8" style={{ color: '#3A281C' }}>
                            {displayMood.label}
                        </h1>

                        {/* Face & Arrows */}
                        <div className="flex items-center gap-6">
                            <ChevronLeft className="w-6 h-6 opacity-30" />
                            <div
                                className="w-40 h-40 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
                                style={{ backgroundColor: displayMood.color + '40' }} // Light Bg
                            >
                                <img
                                    src={displayMood.icon}
                                    alt={displayMood.label}
                                    className="w-full h-full object-contain p-4"
                                />
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-30" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section (Statistics) - Adjusted height and removed top rounding */}
            <div className="flex-1 bg-white relative z-20 px-6 pt-0 pb-20 -mt-20">

                {/* INVERTED SVG Curve (Concave White / Convex Beige) */}
                <div className="absolute top-[-40px] left-0 w-full h-[40px] overflow-hidden">
                    <svg viewBox="0 0 375 40" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,0 Q187.5,40 375,0 L375,40 L0,40 Z" fill="white" />
                    </svg>
                </div>

                {/* Header - Slightly more space */}
                <div className="w-full flex items-center justify-between mb-8 pt-6">
                    <h2 className="text-[#4F3422] text-2xl font-extrabold tracking-tight">Weekly Activity</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-5 h-5 text-[#4F3422]/60" />
                    </button>
                </div>

                {/* Bar Chart Container - Increased height to h-56 for better visibility */}
                <div className="w-full h-56 relative">
                    {/* Grid Lines (Dashed) - Consistent Opacity */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 py-2">
                        {[5, 4, 3, 2, 1].map((score) => (
                            <div key={score} className="w-full flex items-center gap-2">
                                <span className="text-[8px] font-bold text-gray-300 w-8 text-right">
                                    {score === 5 ? 'GREAT' : score === 3 ? 'OKAY' : score === 1 ? 'BAD' : ''}
                                </span>
                                <div className="flex-1 h-px border-t border-dashed border-gray-200" />
                            </div>
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-between px-2 z-10">
                        {weeklyData.map((entry, index) => {
                            const hasData = entry && MOOD_CONFIG[entry.mood];
                            const config = hasData ? MOOD_CONFIG[entry.mood] : null;
                            const heightPercentage = config ? (config.score / 5) * 100 : 0;

                            const isPlaceholder = !hasData;
                            const displayHeight = isPlaceholder ? 0 : heightPercentage;
                            const barColor = isPlaceholder ? 'transparent' : config?.color;

                            return (
                                <div key={index} className="flex flex-col items-center gap-2 w-8 group relative h-full justify-end">
                                    {/* Icon on top on hover */}
                                    {hasData && (
                                        <div className="w-5 h-5 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                                            <img src={config?.icon} alt={config?.label} className="w-full h-full" />
                                        </div>
                                    )}

                                    {/* The Bar */}
                                    <div className="relative w-full flex items-end justify-center h-full">
                                        {isPlaceholder && (
                                            <div className="w-full h-3 rounded-t-full bg-gray-100 absolute bottom-0" />
                                        )}

                                        {hasData && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${displayHeight}%` }}
                                                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                                                className="w-full rounded-t-full rounded-b-lg relative shadow-md"
                                                style={{
                                                    height: `${displayHeight}%`,
                                                    backgroundColor: barColor
                                                }}
                                            >
                                                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 opacity-60">
                                                    <img src={config?.icon} alt="" className="w-full h-full brightness-0 invert opacity-60" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">{DAYS[index]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Floating Action Button (Add) - Relaxed spacing */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30">
                    <Link href="/mood/check-in" className="w-16 h-16 bg-[#9BB068] rounded-full flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-transform hover:scale-105">
                        <Plus className="w-8 h-8 text-white" />
                    </Link>
                </div>
            </div>

            <TabBar />
        </div>
    );
}
