"use client";

import { ArrowRight, Wind, PenLine, Droplets, Globe, Activity as ActivityIcon, Home, Target, ClipboardList, Moon, Sparkles, Trophy, Sun, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Activity, ActivityCategory } from '@/data/libraryActivities';
import { motion } from 'framer-motion';

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

// User defined premium color palette
const CATEGORY_COLORS: Record<ActivityCategory, string> = {
    stress: '#9BB068',       // Green
    anxiety: '#FE814B',      // Orange
    sleep: '#A18FFF',        // Purple
    mood: '#FFCE5C',         // Yellow
    focus: '#BDA193',        // Beige
    overthinking: '#4B3425', // Dark Brown
};

interface ActivityCardProps {
    activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/library/${activity.id}`);
    };

    const activeColor = CATEGORY_COLORS[activity.category];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative w-full bg-white rounded-32px p-5 shadow-[0px_8px_16px_rgba(75,52,37,0.04)] border border-[#F7F4F2] transition-all hover:shadow-md active:scale-[0.98]"
            onClick={handleClick}
        >
            <div className="flex items-center gap-4">
                {/* Icon Section */}
                <div className="w-16 h-16 rounded-2xl bg-[#F7F4F2] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComponent className="w-8 h-8 text-[#4B3425]" strokeWidth={1.5} activity={activity} />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span 
                            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${activeColor}15`, color: activeColor }}
                        >
                            {activity.type}
                        </span>
                        {activity.duration && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#F7F4F2] text-[#4B3425]/40">
                                {activity.duration}m
                            </span>
                        )}
                    </div>
                    <h3 className="text-[#4B3425] font-black text-lg leading-tight mb-0.5">{activity.title}</h3>
                    <p className="text-[#4B3425]/40 text-xs font-bold line-clamp-1">{activity.description}</p>
                </div>

                {/* CTA Section */}
                <div className="shrink-0 ml-2">
                    <div className="w-10 h-10 rounded-full bg-[#F7F4F2] flex items-center justify-center text-[#4B3425]/20 group-hover:bg-[#4B3425] group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function IconComponent({ className, strokeWidth, activity }: { className: string, strokeWidth: number, activity: Activity }) {
    const Icon = ICON_MAP[activity.iconName] || Wind;
    return <Icon className={className} strokeWidth={strokeWidth} />;
}
