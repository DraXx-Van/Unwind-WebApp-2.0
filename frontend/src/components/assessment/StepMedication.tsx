"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Pill, Cookie, Ban, XCircle } from 'lucide-react';
import { cn } from '../ui/button';

export function StepMedication() {
    const { medications, setMedications, nextStep } = useAssessmentStore();

    const toggleMedication = (label: string) => {
        // Logic: "None" or "Prefer not to say" should clear others?
        // For now, simple toggles.
        // If "None" is clicked, clear others and set "None".

        const isNone = label === 'None';
        const isSkip = label === 'Skip';

        if (isNone || isSkip) {
            setMedications([label]);
            return;
        }

        // If selecting a drug, remove None/Skip
        let newMeds = medications.filter(m => m !== 'None' && m !== 'Skip');

        if (newMeds.includes(label)) {
            newMeds = newMeds.filter(m => m !== label);
        } else {
            newMeds.push(label);
        }
        setMedications(newMeds);
    };

    const hasSelection = medications.length > 0;

    const handleContinue = () => {
        if (hasSelection) {
            nextStep();
        }
    };

    const OPTIONS = [
        { id: 'Prescribed', label: 'Prescribed Medications', icon: Pill },
        { id: 'OTC', label: 'Over the Counter Supplements', icon: Cookie },
        { id: 'None', label: 'I\'m not taking any', icon: Ban },
        { id: 'Skip', label: 'Prefer not to say', icon: XCircle },
    ];

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                Are you taking any medications?
            </h2>

            <div className="flex-1 grid grid-cols-2 gap-4">
                {OPTIONS.map((opt) => {
                    const isSelected = medications.includes(opt.id);
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => toggleMedication(opt.id)}
                            className={cn(
                                "rounded-[32px] p-4 flex flex-col justify-between aspect-square transition-all border-2",
                                isSelected
                                    ? "bg-serenity-green-50 border-serenity-green-50 text-white shadow-lg"
                                    : "bg-white border-transparent text-mindful-brown-80 hover:bg-mindful-brown-10"
                            )}
                        >
                            <Icon size={32} className={isSelected ? "text-white" : "text-mindful-brown-80"} />
                            <span className="text-lg font-bold text-left leading-tight">
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 pt-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={!hasSelection}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
