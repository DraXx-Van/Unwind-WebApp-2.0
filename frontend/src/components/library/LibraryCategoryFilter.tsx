"use client";

import { ActivityCategory } from '@/data/libraryActivities';
import { cn } from '@/lib/utils';
import { Wind, Waves, Target, Moon, Sun, Repeat } from 'lucide-react';

const CATEGORIES: { id: ActivityCategory; label: string; icon: any }[] = [
    { id: 'stress', label: 'Stress Relief', icon: Wind },
    { id: 'anxiety', label: 'Anxiety', icon: Waves },
    { id: 'focus', label: 'Focus', icon: Target },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'mood', label: 'Mood Boost', icon: Sun },
    { id: 'overthinking', label: 'Overthinking', icon: Repeat },
];

// User defined premium color palette
const CATEGORY_COLORS: Record<ActivityCategory | 'all', string> = {
    all: '#9BB068',
    stress: '#9BB068',       // Green
    anxiety: '#FE814B',      // Orange
    sleep: '#A18FFF',        // Purple
    mood: '#FFCE5C',         // Yellow
    focus: '#BDA193',        // Beige
    overthinking: '#4B3425', // Dark Brown
};

interface LibraryCategoryFilterProps {
    activeCategory: ActivityCategory | 'all';
    onCategoryChange: (category: ActivityCategory | 'all') => void;
}

export function LibraryCategoryFilter({ activeCategory, onCategoryChange }: LibraryCategoryFilterProps) {
    return (
        <div className="w-full overflow-x-auto hide-scrollbar flex items-center gap-3 px-6 py-2">
             <button
                onClick={() => onCategoryChange('all')}
                className={cn(
                    "whitespace-nowrap px-8 py-3.5 rounded-full font-black text-sm transition-all border-2",
                    activeCategory === 'all'
                        ? "bg-[#9BB068] text-white border-[#9BB068] shadow-lg shadow-[#9BB068]/20"
                        : "bg-white text-[#4B3425]/40 border-[#F7F4F2] hover:border-[#9BB068]/20"
                )}
            >
                All
            </button>
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const activeColor = CATEGORY_COLORS[cat.id];
                
                return (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={cn(
                            "whitespace-nowrap px-6 py-3.5 rounded-full font-black text-sm transition-all border-2 flex items-center gap-2",
                            isActive ? "text-white shadow-lg" : "bg-white text-[#4B3425]/40 border-[#F7F4F2]"
                        )}
                        style={{ 
                            backgroundColor: isActive ? activeColor : undefined,
                            borderColor: isActive ? activeColor : undefined,
                            boxShadow: isActive ? `0px 8px 16px ${activeColor}33` : undefined
                        }}
                    >
                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#4B3425]/20")} />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
