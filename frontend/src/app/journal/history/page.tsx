
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, MoreVertical, Filter, Clock } from 'lucide-react';
import { useJournalStore } from '@/store/journalStore';
import { format, isToday, isYesterday, startOfWeek, addDays, isSameDay } from 'date-fns';
import { TabBar } from '@/components/dashboard/TabBar';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

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
            {/* Header */}
            <div className="bg-[#4F3422] rounded-b-[2.5rem] px-6 pt-8 pb-8 mb-6 shadow-lg relative z-20">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/journal" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        <img src="/assets/Journal_assets/Monotone chevron left.svg" alt="Back" className="w-6 h-6" />
                    </Link>
                    {/* Menu icon removed as requested */}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">My Journals</h1>

                {/* Date / Filter Bar (Dynamic) */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar w-full py-4">
                        {weekDays.map((date, i) => {
                            const isSelected = isSameDay(date, selectedDate);
                            const dayName = format(date, 'EEE');
                            const dayNum = format(date, 'd');

                            return (
                                <Link
                                    key={i}
                                    href={`/journal/history?date=${format(date, 'yyyy-MM-dd')}`}
                                    className={`flex flex-col items-center justify-center min-w-[3.5rem] h-20 rounded-full transition-all ${isSelected
                                        ? 'bg-white text-[#4F3422] shadow-md scale-105 ring-4 ring-[#4F3422]/20'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                        }`}
                                >
                                    <span className="text-xs font-medium mb-1">{dayName}</span>
                                    <span className="text-lg font-bold">{dayNum}</span>
                                    {/* Dot indicator for journals (mock logic for now or could use actual data) */}
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-[#4F3422]' : 'bg-white/30'}`}></div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="px-6 mb-4">
                <div className="flex justify-between items-center text-[#926247] text-sm font-medium">
                    <span className="font-bold text-[#4F3422]">Timeline</span>
                    <button
                        onClick={() => window.location.href = '/journal/history'}
                        className="flex items-center gap-1 text-[#926247] hover:text-[#4F3422] transition-colors"
                    >
                        Show Newest <Filter className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>

            {/* Timeline List */}
            <div className="px-6 pb-20 relative">
                {/* Vertical Line Removed - Handled per item for precise connection */}

                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Loading journals...</div>
                ) : (
                    sortedDates.map((dateKey) => (
                        <div key={dateKey} className="mb-8">
                            <h3 className="ml-16 text-[#926247] font-semibold mb-6 text-lg">{getDateLabel(dateKey)}</h3>
                            <div className="flex flex-col">
                                {filteredJournals[dateKey].map((journal, index, array) => (
                                    <Link href={`/journal/view/${journal.id}`} key={journal.id} className="relative flex gap-6 items-start pb-8 last:pb-0 group">
                                        {/* Connector Line - Only between items */}
                                        {index < array.length - 1 && (
                                            <div className="absolute left-[38px] top-[28px] bottom-[-28px] w-1 bg-[#4F3422] opacity-30 z-0"></div>
                                        )}
                                        {/* Time Node - Updated Design */}
                                        <div className="w-20 flex-shrink-0 flex flex-col items-center z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-[#4F3422] text-white flex flex-col items-center justify-center gap-0.5 shadow-md border-2 border-[#FDFBF9]">
                                                <Clock className="w-4 h-4 opacity-80" />
                                                <span className="text-xs font-bold tracking-wide">
                                                    {format(new Date(journal.createdAt), 'HH:mm')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative group active:scale-95 transition-transform">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[#4F3422] line-clamp-1">{journal.title || 'Untitled'}</h4>
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full w-fit shrink-0 ${getEmotionColor(journal.emotion)}`}>
                                                    <img src={getEmotionIcon(journal.emotion)} alt={journal.emotion} className="w-4 h-4" />
                                                    <span className="text-xs font-medium">{capitalize(journal.emotion)}</span>
                                                </div>
                                            </div>
                                            <p className="text-[#926247] text-sm line-clamp-2 leading-relaxed opacity-80 mb-2">
                                                {journal.content}
                                            </p>

                                            {/* Footer Actions */}
                                            <div className="pt-3 border-t border-gray-50 flex items-center justify-end">
                                                <button
                                                    onClick={async (e) => {
                                                        e.preventDefault(); // Prevent navigation
                                                        e.stopPropagation();
                                                        setDeleteModal({ isOpen: true, journalId: journal.id });
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center bg-[#FE814B] rounded-full text-white shadow-md hover:scale-110 transition-transform"
                                                >
                                                    <img src="/assets/Journal_assets/25  trash.svg" alt="Delete" className="w-4 h-4 invert brightness-0" />
                                                </button>
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
            <TabBar />

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={async () => {
                    if (deleteModal.journalId) {
                        await useJournalStore.getState().deleteJournal(deleteModal.journalId);
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

