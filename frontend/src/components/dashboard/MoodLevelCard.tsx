"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Frown, Smile, Meh } from 'lucide-react';
import { useMoodStore } from '@/store/moodStore';

const MOOD_CONFIG = {
    'OVERJOYED': { color: '#9BB068', label: 'Overjoyed', icon: Smile },
    'HAPPY': { color: '#FFCE5C', label: 'Happy', icon: Smile },
    'NEUTRAL': { color: '#E8DDD9', label: 'Neutral', icon: Meh },
    'LOW': { color: '#FE814B', label: 'Low', icon: Frown },
    'OVERWHELMED': { color: '#A28FFF', label: 'Overwhelmed', icon: Frown },
};

export function MoodLevelCard() {
    const router = useRouter();
    const { todayMood, fetchTodayMood } = useMoodStore();

    useEffect(() => {
        fetchTodayMood();
    }, [fetchTodayMood]);

    const moodConfig = todayMood?.mood ? MOOD_CONFIG[todayMood.mood as keyof typeof MOOD_CONFIG] : null;
    const Icon = moodConfig ? moodConfig.icon : Frown; // Default icon

    return (
        <div
            onClick={() => router.push('/mood/check-in')}
            className="relative w-[180px] h-[220px] rounded-32px shadow-lg flex flex-col justify-between overflow-hidden shrink-0 cursor-pointer transition-transform hover:scale-105"
            style={{
                backgroundColor: '#FFCE5C',
                boxShadow: `0px 16px 32px #FFCE5C40`
            }}
        >
            {/* Header & Content */}
            <div className="p-5 pb-0 flex flex-col z-10 w-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 rounded-full border-2 border-black/10 flex items-center justify-center bg-white/20 shrink-0 backdrop-blur-sm">
                        <Icon className="text-white w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="text-white/80 font-bold text-base leading-tight mt-1">Today</span>
                </div>
                {/* Main Value */}
                <h3 className="text-white font-extrabold text-3xl tracking-tight leading-8">
                    {moodConfig ? moodConfig.label : 'Check-in'}
                </h3>
            </div>

            {/* Bar Chart Visualization - Contained */}
            <div className="w-full mt-auto flex justify-center px-4 pb-4">
                <img
                    src="/assets/dashboard_assets/mood_card.svg"
                    alt="Mood Chart"
                    className="w-full h-24 object-contain object-bottom opacity-50"
                />
            </div>
        </div>
    );
}
