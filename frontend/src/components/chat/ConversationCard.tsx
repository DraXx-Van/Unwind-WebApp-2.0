"use client";

import { useState } from 'react';
import { MessageSquare, MoreVertical, Heart, TreePine, Triangle, Pin, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ConversationCardProps {
    id: string;
    title: string;
    totalMessages?: number;
    emotion?: string;
    type: 'ai' | 'mentor';
    isPinned?: boolean;
    onMenuAction?: (action: 'pin' | 'delete') => void;
}

export function ConversationCard({ id, title, totalMessages = 0, type, isPinned, onMenuAction }: ConversationCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className="p-2 text-[#4B3425]/30 hover:bg-[#F7F4F2] rounded-full transition-colors"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                        <>
                            {/* Backdrop to close menu */}
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsMenuOpen(false);
                                }} 
                            />
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-lg border border-[#F7F4F2] z-50 py-2 overflow-hidden flex flex-col">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onMenuAction) onMenuAction('pin');
                                    }}
                                    className="px-4 py-2 text-sm text-[#4B3425] font-bold flex items-center gap-2 hover:bg-[#F7F4F2] transition-colors"
                                >
                                    <Pin className="w-4 h-4" />
                                    {isPinned ? 'Unpin' : 'Pin'}
                                </button>
                                {type !== 'mentor' && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsMenuOpen(false);
                                            if (onMenuAction) onMenuAction('delete');
                                        }}
                                        className="px-4 py-2 text-sm text-[#FE814B] font-bold flex items-center gap-2 hover:bg-[#FE814B]/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
