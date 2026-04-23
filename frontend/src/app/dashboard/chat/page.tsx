"use client";

import { useEffect, useState } from 'react';
import { ChevronLeft, MessageCircle, Smile, Settings, ChevronDown, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/store/chatStore';
import { ConversationCard } from '@/components/chat/ConversationCard';
import { TabBar } from '@/components/dashboard/TabBar';
import { motion } from 'framer-motion';
import { authFetch } from '@/lib/api';

export default function ConversationsPage() {
    const { conversations, fetchConversations, deleteConversation, togglePinConversation, togglePinMentor, pinnedMentors, isLoading } = useChatStore();
    const [filter, setFilter] = useState('Newest');
    const [mentors, setMentors] = useState<any[]>([]);

    useEffect(() => {
        fetchConversations();
        
        // Fetch mentors
        authFetch('/mentor/my-mentors')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMentors(data);
            })
            .catch(console.error);
    }, [fetchConversations]);

    const handleDeleteMentor = async (mentorId: string) => {
        try {
            await authFetch(`/mentor/disconnect/${mentorId}`, { method: 'DELETE' });
            setMentors(prev => prev.filter(m => m.id !== mentorId));
        } catch (e) {
            console.error('Failed to disconnect mentor');
        }
    };

    const pinnedConversationsList = conversations.filter(c => c.isPinned);
    const unpinnedConversationsList = conversations.filter(c => !c.isPinned);
    
    const pinnedMentorsList = mentors.filter(m => pinnedMentors.includes(m.id));
    const unpinnedMentorsList = mentors.filter(m => !pinnedMentors.includes(m.id));

    const hasPinned = pinnedConversationsList.length > 0 || pinnedMentorsList.length > 0;

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans pb-32">
            {/* Orange Header Section */}
            <div className="bg-[#FE814B] rounded-b-[48px] pt-12 pb-10 px-6 shadow-lg relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <Link href="/dashboard" className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <ChevronLeft className="text-white w-6 h-6" />
                    </Link>
                </div>

                <div className="relative z-10">
                    <h1 className="text-white text-4xl font-extrabold tracking-tight mb-6">My Conversations</h1>
                    
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Smile className="text-white w-4 h-4" />
                            </div>
                            <span className="text-white font-bold text-sm">1571 Total</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="text-white w-4 h-4" />
                            </div>
                            <span className="text-white font-bold text-sm">32 Left this Month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="px-6 pt-8 flex-1">
                {/* Section: Pinned */}
                {hasPinned && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[#3a2e26] text-xl font-extrabold">Pinned</h2>
                        </div>
                        <div className="space-y-1 mb-10">
                            {/* Pinned Mentors */}
                            {pinnedMentorsList.map((mentor, idx) => (
                                <motion.div
                                    key={mentor.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <ConversationCard 
                                        id={`mentor-${mentor.id}`}
                                        title={`Dr. ${mentor.name}`}
                                        totalMessages={mentor.messageCount || 0}
                                        emotion="Neutral"
                                        type="mentor"
                                        isPinned={true}
                                        onMenuAction={(action) => {
                                            if (action === 'delete') handleDeleteMentor(mentor.id);
                                            if (action === 'pin') togglePinMentor(mentor.id);
                                        }}
                                    />
                                </motion.div>
                            ))}
                            {/* Pinned AI */}
                            {pinnedConversationsList.map((conv, idx) => (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (pinnedMentorsList.length + idx) * 0.1 }}
                                >
                                    <ConversationCard 
                                        id={conv.id}
                                        title={conv.title}
                                        totalMessages={conv.totalMessages ?? 0}
                                        emotion={conv.lastEmotion ?? 'Neutral'}
                                        type={conv.type}
                                        isPinned={true}
                                        onMenuAction={(action) => {
                                            if (action === 'delete') deleteConversation(conv.id);
                                            if (action === 'pin') togglePinConversation(conv.id);
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* Section: Recent */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#3a2e26] text-xl font-extrabold">Recent ({unpinnedConversationsList.length})</h2>
                    <button className="flex items-center gap-2 bg-[#F7F4F2] px-4 py-2 rounded-full border border-[#E8DDD9]">
                        <Calendar className="w-4 h-4 text-[#4B3425]" />
                        <span className="text-[#4B3425] text-sm font-bold">{filter}</span>
                        <ChevronDown className="w-4 h-4 text-[#4B3425]" />
                    </button>
                </div>

                <div className="space-y-1">
                    {/* Render AI Conversations */}
                    {unpinnedConversationsList.map((conv, idx) => (
                        <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ConversationCard 
                                id={conv.id}
                                title={conv.title}
                                totalMessages={conv.totalMessages ?? 0}
                                emotion={conv.lastEmotion ?? 'Neutral'}
                                type={conv.type}
                                isPinned={false}
                                onMenuAction={(action) => {
                                    if (action === 'delete') deleteConversation(conv.id);
                                    if (action === 'pin') togglePinConversation(conv.id);
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Section: Your Mentors (replaces Past mock) */}
                <div className="flex items-center justify-between mt-10 mb-6">
                    <h2 className="text-[#3a2e26] text-xl font-extrabold">Your Mentors ({unpinnedMentorsList.length})</h2>
                    <button className="p-2 text-[#4B3425]/40">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="space-y-1">
                    {unpinnedMentorsList.length === 0 && !hasPinned ? (
                        <p className="text-[#A69B93] text-sm font-bold text-center py-4 bg-[#F7F4F2] rounded-3xl border border-[#E8DDD9]">
                            No mentors linked. Connect using a mentor code.
                        </p>
                    ) : (
                        unpinnedMentorsList.map((mentor, idx) => (
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ConversationCard 
                                    id={`mentor-${mentor.id}`}
                                    title={`Dr. ${mentor.name}`}
                                    totalMessages={mentor.messageCount || 0}
                                    emotion="Neutral"
                                    type="mentor"
                                    isPinned={false}
                                    onMenuAction={(action) => {
                                        if (action === 'delete') handleDeleteMentor(mentor.id);
                                        if (action === 'pin') togglePinMentor(mentor.id);
                                    }}
                                />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <TabBar />
        </div>
    );
}
