"use client";

import { MessageSquare, MoreVertical, Heart, TreePine, Triangle } from 'lucide-react';
import Link from 'next/link';

interface ConversationCardProps {
    id: string;
    title: string;
    totalMessages: number;
    emotion: string;
    type: 'ai' | 'mentor';
}

const EMOTION_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
    'Sad': { label: 'Sad', icon: '😔', color: '#ff814b', bg: '#ffe4db' },
    'Happy': { label: 'Happy', icon: '😊', color: '#ffce5c', bg: '#fff9e6' },
    'Overjoyed': { label: 'Overjoyed', icon: '😇', color: '#8da666', bg: '#eef3e8' },
    'Neutral': { label: 'Neutral', icon: '😐', color: '#926247', bg: '#f2ece9' },
};

export function ConversationCard({ id, title, totalMessages, emotion, type }: ConversationCardProps) {
    const emotionInfo = EMOTION_CONFIG[emotion] || EMOTION_CONFIG['Neutral'];

    // Icon mapping based on title keywords or just cycle them for mock
    const renderIcon = () => {
        if (title.toLowerCase().includes('breakup')) return <Heart className="w-8 h-8 text-[#5c7a33]" />;
        if (title.toLowerCase().includes('teacher')) return <TreePine className="w-8 h-8 text-[#5c7a33]" />;
        return <Triangle className="w-8 h-8 text-[#5c7a33] fill-[#5c7a33]" />;
    };

    return (
        <Link href={`/dashboard/chat/${id}`} className="block w-full mb-4">
            <div className="bg-white rounded-32px p-5 shadow-[0px_8px_16px_rgba(75,52,37,0.04)] border border-[#F7F4F2] flex items-center justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-4">
                    {/* Circle Icon */}
                    <div className="w-16 h-16 rounded-[28px] bg-[#f2f5eb] flex items-center justify-center overflow-hidden">
                         {renderIcon()}
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-1">
                        <h4 className="text-[#3a2e26] font-bold text-lg leading-tight line-clamp-1">{title}</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-lg bg-[#E8DDD9] flex items-center justify-center">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#4B3425]" />
                                </div>
                                <span className="text-[#4B3425]/60 text-xs font-bold">{totalMessages} Total</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div 
                                    className="px-2 py-0.5 rounded-full flex items-center gap-1"
                                    style={{ backgroundColor: emotionInfo.bg }}
                                >
                                    <span className="text-[10px]">{emotionInfo.icon}</span>
                                    <span className="text-[10px] font-bold" style={{ color: emotionInfo.color }}>{emotionInfo.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="p-2 text-[#4B3425]/30">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </Link>
    );
}
