
"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ChevronLeft, Play, PenLine, CheckCircle2, Info, ArrowRight, Video, Image as ImageIcon,
    Wind, Droplets, Globe, Activity as ActivityIcon, Home, Target, ClipboardList, Moon, Sparkles, Trophy, Sun, Repeat, Clock
} from 'lucide-react';
import { LIBRARY_ACTIVITIES, ActivityType, ActivityCategory } from '@/data/libraryActivities';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TabBar } from '@/components/dashboard/TabBar';

const ICON_MAP: Record<string, any> = {
    Wind,
    PenLine,
    Droplets,
    Globe,
    Activity: ActivityIcon,
    Home,
    Target,
    ClipboardList,
    Moon,
    Sparkles,
    Trophy,
    Sun,
    Repeat
};

const CATEGORY_COLORS: Record<ActivityCategory, string> = {
    stress: '#9BB068',
    anxiety: '#FE814B',
    sleep: '#7C6AFF',
    mood: '#FFCE5C',
    focus: '#BDA193',
    overthinking: '#4B3425',
};

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState<'steps' | 'media'>('steps');

    const activity = LIBRARY_ACTIVITIES.find(a => a.id === id);

    if (!activity) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black text-[#4B3425] mb-2">Activity not found</h1>
                <button onClick={() => router.back()} className="text-[#9BB068] font-bold">Go back</button>
            </div>
        );
    }

    const handleAction = () => {
        if (activity.type === 'mindful') {
            const params = new URLSearchParams({
                activityName: activity.title,
                duration: (activity.duration || 5).toString(),
                category: activity.category
            });
            router.push(`/mindful/add?${params.toString()}`);
        } else if (activity.type === 'journal') {
            const params = new URLSearchParams({
                title: activity.title,
                prompt: activity.prompt || ''
            });
            router.push(`/journal/new?${params.toString()}`);
        } else if (activity.type === 'real') {
            setIsCompleted(true);
        }
    };

    const headerBgColor = CATEGORY_COLORS[activity.category] || '#9BB068';
    const isDarkBg = activity.category === 'overthinking' || activity.category === 'sleep';
    const textColor = isDarkBg ? '#FFFFFF' : '#4B3425';
    
    const IconComponent = ICON_MAP[activity.iconName] || Wind;

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32">
            {/* Header / Hero */}
            <div 
                className="pt-12 pb-24 px-6 rounded-b-[48px] relative overflow-hidden shadow-lg"
                style={{ backgroundColor: headerBgColor }}
            >
                {/* Brand Background Pattern */}
                <img 
                    src="/assets/Journal_assets/bg.svg" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0" 
                />

                {/* Decorative Geometric Shapes (Triangle/Circle) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
                    {/* Circle */}
                    <div 
                        className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-[24px] border-white/10" 
                    />
                    {/* Triangle-ish / Diamond */}
                    <div 
                        className="absolute top-1/3 -left-12 w-32 h-32 rotate-[25deg] bg-white/5 rounded-3xl backdrop-blur-[2px]" 
                    />
                    {/* Secondary Circle */}
                    <div 
                        className="absolute bottom-4 right-1/4 w-16 h-16 rounded-full bg-white/10" 
                    />
                </div>


                <button 
                    onClick={() => router.back()}
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-8 backdrop-blur-md shadow-sm border border-white/20 hover:bg-white/40 transition-all relative z-20"
                >
                    <ChevronLeft className="w-6 h-6" style={{ color: textColor }} />
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-2 mb-4">
                         <span 
                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: textColor }}
                        >
                            {activity.category}
                        </span>
                        {activity.duration && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/10" style={{ color: textColor }}>
                                {activity.duration} MINS
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-black leading-tight mb-4" style={{ color: textColor }}>
                        {activity.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 mb-8 opacity-80" style={{ color: textColor }}>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{activity.timeRequired}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Best For: {activity.bestFor}</span>
                        </div>
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                        <IconComponent className="w-10 h-10 text-[#4B3425]" strokeWidth={1.5} />
                    </div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="px-6 -mt-12 relative z-20">
                <div className="bg-white rounded-[32px] p-6 shadow-[0px_24px_48px_rgba(75,52,37,0.1)] border border-[#F7F4F2]">
                    
                    {/* Media Tabs (Only if media exists) */}
                    {(activity.imageUrl || activity.videoUrl) && (
                        <div className="flex bg-[#F7F4F2] p-1.5 rounded-2xl mb-8">
                            <button 
                                onClick={() => setActiveTab('steps')}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2",
                                    activeTab === 'steps' ? "bg-white text-[#4B3425] shadow-sm" : "text-[#4B3425]/40"
                                )}
                            >
                                <Info className="w-3.5 h-3.5" />
                                Instructions
                            </button>
                            <button 
                                onClick={() => setActiveTab('media')}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2",
                                    activeTab === 'media' ? "bg-white text-[#4B3425] shadow-sm" : "text-[#4B3425]/40"
                                )}
                            >
                                <Video className="w-3.5 h-3.5" />
                                Visual Guide
                            </button>
                        </div>
                    )}

                    <div className="min-h-[300px]">
                        {activeTab === 'steps' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {/* Why this helps */}
                                <div className="mb-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F7F4F2] text-[#4B3425]">
                                            <Info className="w-4 h-4" />
                                        </div>
                                        <h2 className="text-[#4B3425] font-black text-lg tracking-tight">Why this helps</h2>
                                    </div>
                                    <p className="text-[#4B3425]/70 font-bold leading-relaxed text-[15px]">
                                        {activity.why}
                                    </p>
                                </div>

                                {/* How to do it */}
                                <div className="mb-10">
                                    <h2 className="text-[#4B3425] font-black text-lg mb-6 tracking-tight">How to do it</h2>
                                    <div className="space-y-6">
                                        {activity.steps.map((step, index) => (
                                            <div key={index} className="flex gap-4 items-start">
                                                <div className="w-9 h-9 rounded-xl bg-[#F7F4F2] flex items-center justify-center shrink-0 shadow-sm border border-[#4B3425]/5">
                                                    <span className="text-[#4B3425] font-black text-xs">{index + 1}</span>
                                                </div>
                                                <p className="text-[#4B3425]/60 font-bold text-[14px] leading-relaxed pt-1.5">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                {/* Image Display */}
                                {activity.imageUrl && (
                                    <div className="rounded-2xl overflow-hidden bg-[#F7F4F2] border border-[#4B3425]/5 shadow-inner">
                                        <div className="px-4 py-3 flex items-center gap-2 border-b border-[#4B3425]/5">
                                            <ImageIcon className="w-4 h-4 text-[#9BB068]" />
                                            <span className="text-[10px] font-black text-[#4B3425]/40 uppercase tracking-widest">Process Illustration</span>
                                        </div>
                                        <img src={activity.imageUrl} alt={activity.title} className="w-full h-auto" />
                                    </div>
                                )}

                                {/* Video Display */}
                                {activity.videoUrl && (
                                    <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-xl border-4 border-[#F7F4F2]">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${activity.videoUrl}`} 
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {!activity.imageUrl && !activity.videoUrl && (
                                    <div className="py-20 text-center">
                                        <p className="text-[#4B3425]/40 font-bold">Visual guide coming soon</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAction}
                        disabled={isCompleted && activity.type === 'real'}
                        className={cn(
                            "w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0px_12px_24px_rgba(75,52,37,0.2)] mt-6",
                            isCompleted && activity.type === 'real'
                                ? "bg-[#9BB068] text-white"
                                : "bg-[#4B3425] text-white hover:bg-[#3A281D]"
                        )}
                    >
                        {activity.type === 'mindful' && <Play className="fill-current w-5 h-5" />}
                        {activity.type === 'journal' && <PenLine className="w-5 h-5" />}
                        {activity.type === 'real' && <CheckCircle2 className="w-5 h-5" />}
                        
                        {activity.type === 'mindful' ? 'Start Exercise' : 
                         activity.type === 'journal' ? 'Start Writing' : 
                         isCompleted ? 'Activity Completed' : 'Mark as Done'}

                        {!isCompleted && <ArrowRight className="w-5 h-5 ml-1" />}
                    </button>
                </div>
            </div>

            {/* Bottom Navigation Bar */}
            <TabBar />
        </div>
    );
}
