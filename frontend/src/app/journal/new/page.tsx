
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, Camera, FileText, X } from 'lucide-react';
import { useJournalStore } from '@/store/journalStore';

const EMOTIONS = [
    { id: 'angry', emoji: '😡', label: 'Angry', color: 'bg-red-200' },
    { id: 'sad', emoji: '☹️', label: 'Sad', color: 'bg-orange-200' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-200' },
    { id: 'happy', emoji: '🙂', label: 'Happy', color: 'bg-yellow-200' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-200' },
];

export default function AddJournalPage() {
    const router = useRouter();
    const { addJournal, isLoading } = useJournalStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

    // Draft Recovery
    useEffect(() => {
        const savedDraft = localStorage.getItem('journal_draft');
        if (savedDraft) {
            try {
                const { title: dTitle, content: dContent, emotion: dEmotion } = JSON.parse(savedDraft);
                setTitle(dTitle || '');
                setContent(dContent || '');
                setSelectedEmotion(dEmotion || null);
            } catch (e) {
                console.error("Failed to parse journal draft", e);
            }
        }
    }, []);

    // Auto-save
    useEffect(() => {
        if (content || title || selectedEmotion) {
            localStorage.setItem('journal_draft', JSON.stringify({ title, content, emotion: selectedEmotion }));
        }
    }, [title, content, selectedEmotion]);

    const handleSubmit = async () => {
        if (!content || !selectedEmotion) return;

        await addJournal({
            title: title || 'Untitled Journal',
            content,
            emotion: selectedEmotion,
        });

        localStorage.removeItem('journal_draft');
        router.push('/journal');
    };

    return (
        <div className="h-screen bg-[#FDFBF9] flex flex-col overflow-hidden">
            {/* Header - Brown Style */}
            <div className="bg-[#4F3422] rounded-b-[2.5rem] px-6 pt-12 pb-8 shadow-lg relative z-20 shrink-0">
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-b-[2.5rem] z-0 pointer-events-none" />
                <div className="flex flex-col items-start gap-6 relative z-10">
                    <Link href="/journal" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        <img src="/assets/Journal_assets/Monotone chevron left.svg" alt="Back" className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl font-bold text-white pl-1">Add New Journal</h1>
                </div>
            </div>

            <div className="flex-1 px-6 flex flex-col gap-5 pt-6 pb-28">
                {/* Title Input */}
                <div className="flex flex-col gap-3">
                    <label className="text-[#4F3422] font-semibold text-lg">Journal Title</label>
                    <div className="bg-white rounded-full px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Feeling Bad Again"
                            className="bg-transparent outline-none flex-1 text-[#4F3422] text-xl font-medium placeholder:text-gray-300"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button onClick={() => setTitle('')}>
                            {title && <X className="w-5 h-5 text-gray-400" />}
                        </button>
                    </div>
                </div>

                {/* Emotion Selector */}
                <div className="flex flex-col gap-4">
                    <label className="text-[#4F3422] font-bold text-lg">Select Your Emotion</label>
                    <div className="flex justify-between items-center px-2">
                        {[
                            { id: 'depressed', label: 'Depressed', src: '/assets/Solid mood depressed.svg' },
                            { id: 'sad', label: 'Sad', src: '/assets/Solid mood sad.svg' },
                            { id: 'neutral', label: 'Neutral', src: '/assets/Solid mood neutral.svg' },
                            { id: 'happy', label: 'Happy', src: '/assets/Solid mood happy.svg' },
                            { id: 'overjoyed', label: 'Overjoyed', src: '/assets/Solid mood overjoyed.svg' },
                        ].map((emo) => {
                            const isSelected = selectedEmotion === emo.id;
                            const isDimmed = selectedEmotion && !isSelected;

                            return (
                                <button
                                    key={emo.id}
                                    onClick={() => setSelectedEmotion(emo.id)}
                                    className={`transition-all duration-200 rounded-full ${isSelected
                                        ? 'scale-125 shadow-lg ring-4 ring-[#E8DDD9] bg-[#E8DDD9]'
                                        : isDimmed
                                            ? 'opacity-50 grayscale hover:opacity-100'
                                            : 'hover:scale-110 active:scale-95'
                                        }`}
                                >
                                    <img src={emo.src} alt={emo.label} className="w-14 h-14" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Input */}
                <div className="flex flex-col gap-3 flex-1 min-h-0">
                    <label className="text-[#4F3422] font-bold text-lg">Write Your Entry</label>
                    <div className="bg-[#FDFBF9] rounded-[32px] p-6 shadow-[inset_0px_2px_8px_rgba(0,0,0,0.02)] border border-[#E8DDD9] flex-1 relative flex flex-col overflow-hidden">
                        <textarea
                            className="flex-1 w-full resize-none outline-none bg-transparent text-[#4F3422] text-2xl leading-relaxed placeholder:text-[#926247]/40 font-medium"
                            placeholder="I had a bad day today..."
                            value={content}
                            maxLength={300}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="pt-4 flex justify-between items-center text-gray-400 shrink-0">
                            <div className="flex gap-4">
                                <button className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <img src="/assets/Journal_assets/Monotone undo.svg" alt="Undo" className="w-6 h-6" />
                                </button>
                                <button className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <img src="/assets/Journal_assets/Monotone redo.svg" alt="Redo" className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 font-medium">
                                <button className="flex items-center gap-2 hover:text-[#4F3422] px-4 py-2 bg-gray-50 rounded-xl transition-colors">
                                    <Camera className="w-5 h-5" />
                                    <span className="text-sm">Add Photo</span>
                                </button>
                                <span className="text-sm">{content.length}/300</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-8 left-6 right-6">
                <button
                    onClick={handleSubmit}
                    disabled={!content || !selectedEmotion || isLoading}
                    className={`w-full h-16 rounded-full flex items-center justify-center gap-2 text-white font-bold text-xl shadow-lg transition-all ${content && selectedEmotion && !isLoading ? 'bg-[#4F3422] hover:bg-[#3d281a] scale-100' : 'bg-gray-300 cursor-not-allowed scale-95 opacity-80'
                        }`}
                >
                    {isLoading ? 'Saving...' : (
                        <>
                            Create Journal <Check className="w-6 h-6" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
