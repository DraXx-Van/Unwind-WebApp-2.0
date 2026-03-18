"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { HelpCircle } from 'lucide-react'; // Fallback icon

export function StepProfessionalHelp() {
    const { hasSoughtProfessionalHelp, setProfessionalHelp, nextStep } = useAssessmentStore();

    const handleSelect = (val: boolean) => {
        setProfessionalHelp(val);
    };

    const handleContinue = () => {
        if (hasSoughtProfessionalHelp !== null) {
            nextStep();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                Have you sought professional help before?
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Illustration Placeholder */}
                <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-mindful-brown-10 rounded-full scale-90 opacity-50 blur-2xl" />
                    <HelpCircle size={100} className="text-mindful-brown-20 relative z-10" />
                    {/* Add question marks around if possible */}
                </div>

                {/* Selection Buttons */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleSelect(true)}
                        className={`h-16 rounded-[100px] font-bold text-xl border-2 transition-all ${hasSoughtProfessionalHelp === true
                                ? "bg-serenity-green-50 border-serenity-green-50 text-white shadow-lg"
                                : "bg-white border-transparent text-mindful-brown-80 hover:bg-mindful-brown-10"
                            }`}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleSelect(false)}
                        className={`h-16 rounded-[100px] font-bold text-xl border-2 transition-all ${hasSoughtProfessionalHelp === false
                                ? "bg-serenity-green-50 border-serenity-green-50 text-white shadow-lg"
                                : "bg-white border-transparent text-mindful-brown-80 hover:bg-mindful-brown-10"
                            }`}
                    >
                        No
                    </button>
                </div>
            </div>

            <div className="mt-8 pt-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={hasSoughtProfessionalHelp === null}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
