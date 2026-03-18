"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { cn } from '../ui/button'; // Assuming cn utility is here, or import from utils

export function StepStress() {
    const { stressLevel, setStressLevel, nextStep } = useAssessmentStore();

    // Default to 5 if not set, or maybe 1? User image shows 5 selected.
    const currentLevel = stressLevel || 5;

    const handleContinue = () => {
        if (stressLevel) {
            nextStep();
        } else {
            // Fallback if user didn't select, though default is 5
            setStressLevel(currentLevel);
            nextStep();
        }
    };

    const getStressLabel = (val: number) => {
        if (val <= 2) return "You Are Relaxed.";
        if (val === 3) return "You Are Doing Okay.";
        if (val >= 4) return "You Are Extremely Stressed Out.";
        return "";
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                {/* Back button is usually handled by layout, but if needed here: */}
                {/* <Button variant="ghost" size="icon" className="..."> <ChevronLeft /> </Button> */}
                {/* Layout handles header "Assessment 12 of 14" etc. */}
            </div>

            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-12 text-center leading-tight">
                How would you rate your<br />stress level?
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center">

                {/* Large Number Display */}
                <span className="text-[140px] font-extrabold text-mindful-brown-80 leading-none mb-16 tracking-tighter">
                    {currentLevel}
                </span>

                {/* 1-5 Selector Pill */}
                <div className="bg-white rounded-[100px] p-2 flex items-center justify-between gap-2 shadow-sm w-full max-w-xs mb-12">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            onClick={() => setStressLevel(val)}
                            className={cn(
                                "flex items-center justify-center text-xl font-bold transition-all duration-300",
                                // Base size for all
                                "w-12 h-12 rounded-full",
                                // Active State Styling (User Provided CSS)
                                currentLevel === val
                                    ? "bg-[#ED7E1C] text-white w-14 h-14 shadow-[0px_0px_0px_4px_rgba(254,129,75,0.25)]"
                                    : "text-mindful-brown-60 hover:text-mindful-brown-80"
                            )}
                            style={currentLevel === val ? {
                                // Specific user styles applied inline for exactness, overriding classes if needed
                                width: '64px',
                                height: '64px',
                                boxShadow: '0px 0px 0px 4px rgba(254, 129, 75, 0.25)',
                            } : {}}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                {/* Status Text */}
                <p className="text-mindful-brown-60 font-medium text-lg text-center">
                    {getStressLabel(currentLevel)}
                </p>
            </div>

            <div className="mt-8 pt-4 pb-8">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16 bg-mindful-brown-80 text-white hover:bg-mindful-brown-90"
                    onClick={handleContinue}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
