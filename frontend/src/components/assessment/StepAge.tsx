"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { useRef, useEffect } from 'react';
import { cn } from '../ui/button';

export function StepAge() {
    const { age, setAge, nextStep } = useAssessmentStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const ages = Array.from({ length: 85 }, (_, i) => i + 16); // 16 to 100

    // CONSTANTS
    const ROW_HEIGHT = 128; // Matches h-32
    const CONTAINER_HEIGHT = ROW_HEIGHT * 3; // 384px - Show 3 items (1 center, 1 above, 1 below partially)

    // Auto-scroll to selected age on mount
    useEffect(() => {
        if (scrollRef.current && age) {
            const index = ages.indexOf(age);
            if (index !== -1) {
                const top = index * ROW_HEIGHT;
                scrollRef.current.scrollTop = top;
            }
        }
    }, []);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const scrollTop = scrollRef.current.scrollTop;
        // Round to nearest item
        const index = Math.round(scrollTop / ROW_HEIGHT);
        const newAge = ages[index];

        if (newAge && newAge !== age) {
            setAge(newAge);
        }
    };

    const handleContinue = () => {
        if (age) {
            nextStep();
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden absolute inset-0 px-4 pb-8 pt-4">

            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mt-12 mb-4 text-center leading-tight z-10 shrink-0">
                What's your age?
            </h2>

            {/* Centering Container */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative w-full">

                {/* Fixed Height Wrapper for strict alignment */}
                <div className="relative w-full" style={{ height: CONTAINER_HEIGHT }}>

                    {/* Green Oval - Static Center of Wrapper */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-serenity-green-50 rounded-[60px] shadow-sm z-0 pointer-events-none" />

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="absolute inset-0 w-full overflow-y-auto snap-y snap-mandatory no-scrollbar z-10 overscroll-contain"
                        style={{
                            scrollBehavior: 'smooth',
                            // Fade mask
                            maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)'
                        }}
                    >
                        {/* Padding Top/Bottom = 1 Row Height.
                     This puts index 0 at center when scrolled to top?
                     Top = 0.
                     Padding Top = 128.
                     Item 0 starts at 128.
                     Center of wrapper is 384 / 2 = 192.
                     Item 0 height is 128. Center is 128 + 64 = 192.
                     PERFECT MATCH.
                 */}
                        <div
                            className="flex flex-col items-center w-full"
                            style={{
                                paddingTop: ROW_HEIGHT,
                                paddingBottom: ROW_HEIGHT
                            }}
                        >
                            {ages.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => {
                                        setAge(a);
                                        if (scrollRef.current) {
                                            const index = ages.indexOf(a);
                                            scrollRef.current.scrollTo({ top: index * ROW_HEIGHT, behavior: 'smooth' });
                                        }
                                    }}
                                    className="w-full shrink-0 flex items-center justify-center snap-center transition-all duration-300 leading-none"
                                    style={{ height: ROW_HEIGHT }}
                                >
                                    <span
                                        className={cn(
                                            "font-extrabold transition-all duration-300",
                                            age === a
                                                ? "text-7xl text-white scale-110"
                                                : "text-4xl text-mindful-brown-20 scale-100"
                                        )}
                                    >
                                        {a}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-4 pt-4 pb-8 z-20 shrink-0 bg-mindful-brown-10">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
