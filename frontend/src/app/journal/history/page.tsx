
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, MoreVertical, Filter, Clock, Sparkles } from 'lucide-react';
import { useJournalStore } from '@/store/journalStore';
import { format, isToday, isYesterday, startOfWeek, addDays, isSameDay } from 'date-fns';
import { TabBar } from '@/components/dashboard/TabBar';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

function JournalHistoryContent() {
    const { journals, fetchJournals, isLoading } = useJournalStore();
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; journalId: string | null }>({ isOpen: false, journalId: null });

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    // Group journals by date
    const groupedJournals = journals.reduce((acc, journal) => {
        const date = new Date(journal.createdAt);
        const dateKey = format(date, 'yyyy-MM-dd');
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(journal);
        return acc;
    }, {} as Record<string, typeof journals>);

    // Handle date filtering from query param
    const searchParams = useSearchParams();
    const dateFilter = searchParams.get('date');
    const selectedDate = dateFilter ? new Date(dateFilter) : new Date();

    const filteredJournals = dateFilter
        ? Object.keys(groupedJournals)
            .filter(date => date === dateFilter)
            .reduce((obj, key) => {
                obj[key] = groupedJournals[key];
                return obj;
            }, {} as typeof groupedJournals)
        : groupedJournals;


    const sortedDates = Object.keys(filteredJournals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Generate dates for the top bar (Week view centered on selected date)
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const getEmotionColor = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'happy': return 'bg-yellow-100 text-yellow-700';
            case 'sad': return 'bg-orange-100 text-orange-700';
            case 'angry': return 'bg-red-100 text-red-700';
            case 'calm': return 'bg-green-100 text-green-700';
            case 'neutral': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getEmotionIcon = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'happy': return '/assets/Solid mood happy.svg';
            case 'calm': return '/assets/Solid mood happy.svg'; // Fallback
            case 'sad': return '/assets/Solid mood sad.svg';
            case 'angry': return '/assets/Solid mood sad.svg'; // Fallback
            case 'neutral': return '/assets/Solid mood neutral.svg';
            case 'depressed': return '/assets/Solid mood depressed.svg';
            case 'overjoyed': return '/assets/Solid mood overjoyed.svg';
            default: return '/assets/Solid mood neutral.svg';
        }
    };

    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMM dd, yyyy');
    };

    // Helper to capitalize first letter
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="min-h-screen bg-[#FDFBF9] pb-24">
            {/* Header with Decorative Elements */}
            <div className="bg-[#4F3422] rounded-b-[2.5rem] px-6 pt-8 pb-8 mb-6 shadow-lg relative z-20 overflow-hidden">
                {/* Brand Background Pattern */}
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/journal" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-white/5 backdrop-blur-sm">
                            <img src="/assets/Journal_assets/Monotone chevron left.svg" alt="Back" className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-[#9BB068]" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">History</span>
                        </div>
                    </div>
                    
                    <div className="flex items-end justify-between mb-2">
                        <div>
                             <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Your Journey So Far</p>
                             <h1 className="text-3xl font-black text-white tracking-tight leading-none">My Journals</h1>
                        </div>
                    </div>

                    {/* Date / Filter Bar (Dynamic) */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar w-full py-2">
                            {weekDays.map((date, i) => {
                                const isSelected = isSameDay(date, selectedDate);
                                const dayName = format(date, 'EEE');
                                const dayNum = format(date, 'd');

                                return (
                                    <Link
                                        key={i}
                                        href={`/journal/history?date=${format(date, 'yyyy-MM-dd')}`}
                                        className={`flex flex-col items-center justify-center min-w-[3.5rem] h-20 rounded-[24px] transition-all relative ${isSelected
                                            ? 'bg-white text-[#4F3422] shadow-xl scale-105 z-10'
                                            : 'bg-white/10 text-white/50 hover:bg-white/20 backdrop-blur-md'
                                            }`}
                                    >
                                        <span className="text-[10px] font-black uppercase mb-1">{dayName}</span>
                                        <span className="text-xl font-black tracking-tighter">{dayNum}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-[#9BB068]' : 'bg-white/20'}`}></div>
                                        
                                        {isSelected && (
                                            <motion.div 
                                                layoutId="selectedDay"
                                                className="absolute inset-0 rounded-[24px] border-2 border-white ring-4 ring-[#4F3422]/10 pointer-events-none"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 mb-4">
                <div className="flex justify-between items-center text-[#926247] text-sm font-medium">
                    <span className="font-bold text-[#4F3422] uppercase tracking-widest text-[10px] opacity-40">Timeline</span>
                    <button
                        onClick={() => window.location.href = '/journal/history'}
                        className="flex items-center gap-2 text-[#926247] hover:text-[#4F3422] transition-colors bg-white px-3 py-1.5 rounded-xl shadow-sm border border-[#4F3422]/5"
                    >
                        <Filter className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Newest First</span>
                    </button>
                </div>
            </div>

            {/* Timeline List */}
            <div className="px-6 pb-20 relative">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                        <div className="w-10 h-10 border-4 border-[#4F3422]/10 border-t-[#4F3422] rounded-full animate-spin" />
                        <p className="text-[#4F3422] text-xs font-black uppercase tracking-widest">Retreiving Memories...</p>
                    </div>
                ) : (
                    sortedDates.map((dateKey) => (
                        <div key={dateKey} className="mb-10">
                            <div className="flex items-center gap-3 mb-6 ml-4">
                                <div className="w-2 h-2 rounded-full bg-[#9BB068]" />
                                <h3 className="text-[#4F3422] font-black text-lg tracking-tight">{getDateLabel(dateKey)}</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {filteredJournals[dateKey].map((journal, index) => (
                                    <Link href={`/journal/view/${journal.id}`} key={journal.id} className="relative group active:scale-[0.98] transition-all">
                                        <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-white flex gap-5">
                                            {/* Time Column */}
                                            <div className="flex flex-col items-center justify-center min-w-[56px] border-r border-[#4F3422]/5 pr-4">
                                                <span className="text-[#4F3422] font-black text-sm">
                                                    {format(new Date(journal.createdAt), 'HH:mm')}
                                                </span>
                                                <span className="text-[#4F3422]/30 text-[9px] font-black uppercase tracking-widest">Time</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-black text-[#4F3422] text-base leading-tight pr-4">{journal.title || 'Untitled'}</h4>
                                                    <div className={`w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                        <img src={getEmotionIcon(journal.emotion)} alt={journal.emotion} className="w-6 h-6" />
                                                    </div>
                                                </div>
                                                <p className="text-[#4F3422]/50 text-sm line-clamp-2 leading-relaxed font-bold">
                                                    {journal.content}
                                                </p>
                                                
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                         <div className={`w-2 h-2 rounded-full ${getEmotionColor(journal.emotion).split(' ')[0].replace('bg-', 'bg-opacity-100 bg-')}`} />
                                                         <span className="text-[#4F3422]/30 text-[9px] font-black uppercase tracking-widest">{journal.emotion}</span>
                                                    </div>
                                                    <button
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setDeleteModal({ isOpen: true, journalId: journal.id });
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center bg-[#FE814B]/10 text-[#FE814B] rounded-xl hover:bg-[#FE814B] hover:text-white transition-all group/trash"
                                                    >
                                                        <img src="/assets/Journal_assets/25  trash.svg" alt="Delete" className="w-4 h-4 group-hover/trash:invert group-hover/trash:brightness-0" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <TabBar />

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={async () => {
                    if (deleteModal.journalId) {
                        await useJournalStore.getState().deleteJournal(deleteModal.journalId);
                        setDeleteModal({ isOpen: false, journalId: null });
                    }
                }}
            />
        </div>
    );
}

export default function JournalHistoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center text-[#926247] font-semibold">Loading History...</div>}>
            <JournalHistoryContent />
        </Suspense>
    );
}
