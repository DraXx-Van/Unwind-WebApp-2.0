
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MoreVertical, Edit2, Share2, Sliders } from 'lucide-react';
import { useJournalStore } from '@/store/journalStore';
import { format } from 'date-fns';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

export default function JournalViewPage() {
    const router = useRouter();
    // Note: Next.js 13+ App Router useParams
    const params = useParams();
    const id = params?.id as string;

    const { journals, fetchJournals, isLoading } = useJournalStore();
    const [journal, setJournal] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!journals.length) fetchJournals();
    }, [fetchJournals, journals.length]);

    useEffect(() => {
        if (journals.length && id) {
            const found = journals.find(j => j.id === id);
            setJournal(found);
        }
    }, [journals, id]);

    if (!journal && isLoading) return <div className="p-8 text-center text-[#4F3422]">Loading...</div>;
    if (!journal && !isLoading && journals.length > 0) return <div className="p-8 text-center text-[#4F3422]">Journal not found.</div>;

    const getEmotionIcon = (emotion: string) => {
        if (!emotion) return '/assets/Solid mood neutral.svg';
        switch (emotion.toLowerCase()) {
            case 'happy': return '/assets/Solid mood happy.svg';
            case 'calm': return '/assets/Solid mood happy.svg';
            case 'sad': return '/assets/Solid mood sad.svg';
            case 'angry': return '/assets/Solid mood sad.svg';
            case 'neutral': return '/assets/Solid mood neutral.svg';
            case 'depressed': return '/assets/Solid mood depressed.svg';
            case 'overjoyed': return '/assets/Solid mood overjoyed.svg';
            default: return '/assets/Solid mood neutral.svg';
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] flex flex-col">
            {/* Header - Brown Style */}
            <div className="bg-[#4F3422] rounded-b-[2.5rem] px-6 pt-12 pb-8 shadow-lg relative z-20 shrink-0 mb-6">
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-b-[2.5rem] z-0 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10 text-white">
                    <Link href="/journal/history" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        <img src="/assets/Journal_assets/Monotone chevron left.svg" alt="Back" className="w-6 h-6" />
                    </Link>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-white shadow-sm">{journal ? format(new Date(journal.createdAt), 'MMM dd, yyyy') : 'Loading...'}</h1>
                        <span className="text-xs text-white/80">{journal ? format(new Date(journal.createdAt), 'HH:mm') : ''}</span>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {journal && (
                <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
                    {/* Title & Emotion - Outside Card */}
                    <div className="mb-8 px-2">
                        <div className="flex items-start gap-4 mb-2">
                            <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full p-1 shadow-sm">
                                <img src={getEmotionIcon(journal.emotion)} alt={journal.emotion} className="w-full h-full" />
                            </div>
                            <h2 className="text-3xl font-black text-[#4F3422] leading-tight flex-1 pt-2">
                                {journal.title || 'Untitled'}
                            </h2>
                        </div>
                    </div>

                    {/* Content - Inside White Card */}
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E8DDD9]">
                        <article className="prose prose-brown max-w-none text-[#4F3422]/90 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                            {journal.content}
                        </article>
                    </div>


                </div>
            )}

            {/* Bottom Actions - Floating Pill Design */}
            <div className="fixed bottom-6 left-6 right-6 bg-white rounded-full shadow-2xl border border-gray-100 px-6 py-3 flex justify-between items-center z-50">
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-12 h-12 bg-[#FE814B] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform hover:bg-[#ff7135]"
                >
                    <img src="/assets/Journal_assets/25  trash.svg" alt="Delete" className="w-6 h-6 invert brightness-0" />
                </button>

                <div className="flex gap-6 pr-2">
                    <button className="text-[#4F3422] hover:bg-gray-100 p-2 rounded-full transition-colors"><Edit2 className="w-6 h-6" /></button>
                    <button className="text-[#4F3422] hover:bg-gray-100 p-2 rounded-full transition-colors"><Share2 className="w-6 h-6" /></button>
                    <button className="text-[#4F3422] hover:bg-gray-100 p-2 rounded-full transition-colors"><Sliders className="w-6 h-6" /></button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                    await useJournalStore.getState().deleteJournal(id);
                    router.push('/journal/history');
                }}
            />
        </div>
    );
}
