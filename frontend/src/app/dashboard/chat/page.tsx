"use client";

import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, MessageCircle, Smile, Settings, ChevronDown, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import { useChatStore, Conversation } from '@/store/chatStore';
import { ConversationCard } from '@/components/chat/ConversationCard';
import { TabBar } from '@/components/dashboard/TabBar';
import { motion, AnimatePresence } from 'framer-motion';
import { authFetch } from '@/lib/api';

export default function ConversationsPage() {
    const { conversations, fetchConversations, deleteConversation, togglePinConversation, togglePinMentor, pinnedMentors, isLoading } = useChatStore();
    const [filter, setFilter] = useState('Newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [mentors, setMentors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    // ─── Stats Calculation ──────────────────────────────────────────────────
    
    const stats = useMemo(() => {
        const totalMessages = conversations.reduce((acc, conv) => acc + (conv.totalMessages || 0), 0) + 
                             mentors.reduce((acc, m) => acc + (m.messageCount || 0), 0);
        
        // Mocking "Left this Month" - typically from a quota or limit
        const monthlyLimit = 2000;
        const sentThisMonth = totalMessages; // In a real app, you'd filter by date
        const leftThisMonth = Math.max(0, monthlyLimit - sentThisMonth);
        
        return { totalMessages, leftThisMonth };
    }, [conversations, mentors]);

    // ─── Sorting & Filtering ───────────────────────────────────────────────

    const sortedConversations = useMemo(() => {
        let list = [...conversations];
        
        if (searchQuery) {
            list = list.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return list.sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return filter === 'Newest' ? dateB - dateA : dateA - dateB;
        });
    }, [conversations, filter, searchQuery]);

    const filteredMentors = useMemo(() => {
        let list = [...mentors];
        if (searchQuery) {
            list = list.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return list;
    }, [mentors, searchQuery]);

    const pinnedConversationsList = sortedConversations.filter(c => c.isPinned);
    const unpinnedConversationsList = sortedConversations.filter(c => !c.isPinned);
    
    const pinnedMentorsList = filteredMentors.filter(m => pinnedMentors.includes(m.id));
    const unpinnedMentorsList = filteredMentors.filter(m => !pinnedMentors.includes(m.id));

    const hasPinned = pinnedConversationsList.length > 0 || pinnedMentorsList.length > 0;

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans pb-32">
            {/* Orange Header Section */}
            <div className="bg-[#FE814B] rounded-b-[48px] pt-12 pb-10 px-6 shadow-lg relative overflow-hidden">
                {/* Background Decor - with floating animation */}
                <motion.div 
                    animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
                    className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" 
                />
                <motion.div 
                    animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
                    className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" 
                />
                
                <div className="absolute top-1/4 right-1/4 w-4 h-4 border-2 border-white/10 rounded-full" />
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/10 rotate-45" />
                <div className="absolute bottom-1/4 right-1/3 w-6 h-6 border-2 border-white/5 rotate-12" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <Link href="/dashboard" className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <ChevronLeft className="text-white w-6 h-6" />
                    </Link>
                    
                    {/* Search Bar */}
                    <div className="flex-1 ml-4 h-12 bg-white/10 backdrop-blur-md rounded-full px-5 flex items-center gap-3 border border-white/10">
                        <Search className="w-4 h-4 text-white/60" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search chats..."
                            className="bg-transparent border-none outline-none text-white text-sm font-bold placeholder:text-white/40 w-full"
                        />
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-white text-4xl font-extrabold tracking-tight mb-6">My Conversations</h1>
                    
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Smile className="text-white w-4 h-4" />
                            </div>
                            <span className="text-white font-bold text-sm">{stats.totalMessages} Total</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="text-white w-4 h-4" />
                            </div>
                            <span className="text-white font-bold text-sm">{stats.leftThisMonth} Left this Month</span>
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
                <div className="flex items-center justify-between mb-6 relative">
                    <h2 className="text-[#3a2e26] text-xl font-extrabold">Recent ({unpinnedConversationsList.length})</h2>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-[#F7F4F2] px-4 py-2 rounded-full border border-[#E8DDD9] active:scale-95 transition-all"
                        >
                            <Calendar className="w-4 h-4 text-[#4B3425]" />
                            <span className="text-[#4B3425] text-sm font-bold">{filter}</span>
                            <ChevronDown className={`w-4 h-4 text-[#4B3425] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                                >
                                    {['Newest', 'Oldest'].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setFilter(opt); setIsFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === opt ? 'bg-[#FE814B] text-white' : 'text-[#4B3425] hover:bg-gray-50'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
                    
                    {unpinnedConversationsList.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-[#A69B93] font-bold text-sm italic">No recent conversations found.</p>
                        </div>
                    )}
                </div>

                {/* Section: Your Mentors */}
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
