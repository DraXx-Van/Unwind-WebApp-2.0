"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { User, X } from 'lucide-react'; // Fallback icons
import { cn } from '../ui/button';

export function StepGender() {
    const { gender, setGender, nextStep } = useAssessmentStore();

    const handleSelect = (selectedGender: 'Male' | 'Female') => {
        setGender(selectedGender);
        // Auto-advance or wait for user? Figma shows "Continue" button at bottom for other screens, but here maybe auto?
        // The screenshot for Gender has "Continue ->" disabled/enabled logic or just cards?
        // Screenshot 2 shows "I am Male" card selected. And "Prefer to skip, thanks X" button.
        // And a "Continue" button at the very bottom.
        // So selection state first, then continue.
    };

    const handleSkip = () => {
        setGender('Other'); // Or skip logic
        nextStep();
    };

    const handleContinue = () => {
        if (gender) {
            nextStep();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                What's your official gender?
            </h2>

            <div className="flex-1 space-y-6">
                {/* Male Option */}
                <button
                    onClick={() => handleSelect('Male')}
                    className={cn(
                        "w-full h-40 relative rounded-[32px] border-2 transition-all p-6 text-left flex flex-col justify-between overflow-hidden",
                        gender === 'Male'
                            ? "bg-white border-mindful-brown-80 shadow-md ring-2 ring-mindful-brown-80 ring-offset-2"
                            : "bg-white border-transparent hover:border-mindful-brown-20"
                    )}
                >
                    <span className="text-xl font-bold text-mindful-brown-80 z-10">I am Male</span>
                    <User size={80} className="absolute -bottom-4 -right-4 text-mindful-brown-20" />

                    {/* Selection Indicator */}
                    <div className={cn(
                        "w-6 h-6 rounded-full border-2 absolute top-6 right-6 flex items-center justify-center transition-colors",
                        gender === 'Male' ? "bg-mindful-brown-80 border-mindful-brown-80" : "border-mindful-brown-20"
                    )}>
                        {gender === 'Male' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                </button>

                {/* Female Option */}
                <button
                    onClick={() => handleSelect('Female')}
                    className={cn(
                        "w-full h-40 relative rounded-[32px] border-2 transition-all p-6 text-left flex flex-col justify-between overflow-hidden",
                        gender === 'Female'
                            ? "bg-white border-mindful-brown-80 shadow-md ring-2 ring-mindful-brown-80 ring-offset-2"
                            : "bg-white border-transparent hover:border-mindful-brown-20"
                    )}
                >
                    <span className="text-xl font-bold text-mindful-brown-80 z-10">I am Female</span>
                    <User size={80} className="absolute -bottom-4 -right-4 text-mindful-brown-20" />

                    {/* Selection Indicator */}
                    <div className={cn(
                        "w-6 h-6 rounded-full border-2 absolute top-6 right-6 flex items-center justify-center transition-colors",
                        gender === 'Female' ? "bg-mindful-brown-80 border-mindful-brown-80" : "border-mindful-brown-20"
                    )}>
                        {gender === 'Female' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                </button>
            </div>

            <div className="mt-8 space-y-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={!gender}
                >
                    Continue &rarr;
                </Button>

                <button
                    onClick={handleSkip}
                    className="w-full flex items-center justify-center gap-2 text-mindful-brown-60 font-bold py-2 hover:text-mindful-brown-80 transition-colors"
                >
                    Prefer to skip, thanks <X size={20} />
                </button>
            </div>
        </div>
    );
}
