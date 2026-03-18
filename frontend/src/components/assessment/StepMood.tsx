"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { cn } from '../ui/button';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

export function StepMood() {
    const { mood, setMood, nextStep } = useAssessmentStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mood constants
    const MOOD_DATA = [
        { val: 1, label: "I Feel Terrible", color: "text-red-500", icon: "Solid mood depressed.svg" },
        { val: 2, label: "I Feel Bad", color: "text-orange-500", icon: "Solid mood sad.svg" },
        { val: 3, label: "I Feel Neutral", color: "text-yellow-500", icon: "Solid mood neutral.svg" },
        { val: 4, label: "I Feel Good", color: "text-serenity-green-50", icon: "Solid mood happy.svg" },
        { val: 5, label: "I Feel Fantastic", color: "text-green-600", icon: "Solid mood overjoyed.svg" },
    ];

    // Create selection of 3 sets for infinite illusion
    // Set 0: [1,2,3,4,5] (Buffer)
    // Set 1: [1,2,3,4,5] (Active)
    // Set 2: [1,2,3,4,5] (Buffer)
    const ITEMS = [...MOOD_DATA, ...MOOD_DATA, ...MOOD_DATA];
    const ITEM_WIDTH = 100; // Fixed width per item
    const SET_WIDTH = ITEM_WIDTH * 5; // 500px

    // Helper to get effective mood from index
    const moodValue = mood || 3;
    const currentMoodConfig = MOOD_DATA.find(m => m.val === moodValue) || MOOD_DATA[2];

    const handleContinue = () => {
        if (mood) {
            nextStep();
        }
    };

    // Auto-scroll to selected mood in the MIDDLE SET on mount
    useEffect(() => {
        if (scrollRef.current && moodValue) {
            // Find index of mood in the second set (indexes 5 to 9)
            // mood 1 -> index 5
            const index = 5 + (moodValue - 1);

            setTimeout(() => {
                if (scrollRef.current) {
                    scrollToIndex(index, 'instant');
                }
            }, 0);
        }
    }, []);

    const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
        if (!scrollRef.current) return;

        // With padding-inline: calc(50% - 50px)
        // Item 0 is centered at ScrollLeft = 0
        // Item i is centered at ScrollLeft = i * ITEM_WIDTH
        const scrollLeft = index * ITEM_WIDTH;
        scrollRef.current.scrollTo({ left: scrollLeft, behavior });
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const scrollLeft = scrollRef.current.scrollLeft;

        // Simple accurate index calculation thanks to correct padding
        const rawIndex = Math.round(scrollLeft / ITEM_WIDTH);

        // Infinite Scroll Logic
        if (scrollLeft < 450) {
            scrollRef.current.scrollLeft += SET_WIDTH;
            return;
        } else if (scrollLeft > 950) {
            scrollRef.current.scrollLeft -= SET_WIDTH;
            return;
        }

        // Calculate selected mood
        const normalizedIndex = rawIndex % 5;
        const selectedMoodVal = normalizedIndex + 1;

        if (selectedMoodVal !== moodValue) {
            setMood(selectedMoodVal);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-4 text-center leading-tight">
                How would you describe your mood?
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center w-full relative">

                {/* Mood Label */}
                <p className={cn("text-xl font-bold transition-colors mb-8", currentMoodConfig.color)}>
                    {currentMoodConfig.label}
                </p>

                {/* Big Preview Icon */}
                <div className="relative w-40 h-40 mb-20 transition-all duration-300">
                    <Image
                        src={`/assets/${currentMoodConfig.icon}`}
                        alt="Current Mood"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Infinite Picker Container */}
                <div className="w-full h-32 relative flex items-center justify-center">

                    {/* Anchor Pointer - Copy Vector.svg rotated 180, Increased Size */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-10 h-10">
                        <Image
                            src="/assets/Copy Vector.svg"
                            alt="Arrow"
                            fill
                            className="object-contain rotate-180"
                        />
                    </div>

                    {/* Scroll Area */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar flex items-center"
                        style={{
                            // Fade mask
                            maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                            // Removed scrollBehavior: 'smooth' to fix infinite loop "jump"
                        }}
                    >
                        <div
                            className="flex items-center"
                            style={{
                                // Precise padding for centering logic
                                paddingLeft: 'calc(50% - 50px)',
                                paddingRight: 'calc(50% - 50px)',
                                width: 'max-content'
                            }}
                        >
                            {ITEMS.map((item, i) => (
                                <div
                                    key={i}
                                    className="relative flex items-center justify-center snap-center transition-all duration-300"
                                    style={{ width: `${ITEM_WIDTH}px`, height: `${ITEM_WIDTH}px` }}
                                >
                                    <button
                                        onClick={() => scrollToIndex(i)}
                                        className={cn(
                                            // Smaller icons (w-20 h-20), full color
                                            "relative w-14 h-14 transition-all duration-300 flex items-center justify-center scale-100 opacity-100 grayscale-0",
                                            // Scale up selected item ONLY
                                            item.val === moodValue ? "scale-125" : "scale-100"
                                        )}
                                    >
                                        <Image
                                            src={`/assets/${item.icon}`}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>

            <div className="mt-8 pt-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={!mood}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
