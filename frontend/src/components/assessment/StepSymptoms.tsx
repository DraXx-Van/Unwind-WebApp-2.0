"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { cn } from '../ui/button';
import { X } from 'lucide-react';

const SYMPTOMS_LIST = [
    'Social Withdrawal', 'Feeling Numbness', 'Feeling Sad', 'Depressed',
    'Angry', 'Anxious', 'Insomnia', 'Fatigue', 'Mood Swings', 'Panic Attacks'
];

export function StepSymptoms() {
    const { symptoms, setSymptoms, nextStep } = useAssessmentStore();

    const toggleSymptom = (symptom: string) => {
        if (symptoms.includes(symptom)) {
            setSymptoms(symptoms.filter(s => s !== symptom));
        } else {
            setSymptoms([...symptoms, symptom]);
        }
    };

    const handleContinue = () => {
        nextStep();
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                Do you have other mental health symptoms?
            </h2>

            <div className="flex-1 flex flex-col">
                {/* Illustration/Graphic area */}
                <div className="w-full h-48 bg-mindful-brown-10 rounded-[32px] mb-8 flex items-center justify-center">
                    <span className="text-mindful-brown-60 font-bold">Illustration Here</span>
                </div>

                {/* Input Box Simulation */}
                <div className="bg-white rounded-[32px] p-4 border-2 border-mindful-brown-20 min-h-[120px] mb-4">
                    <div className="flex flex-wrap gap-2">
                        {symptoms.map(s => (
                            <span key={s} className="bg-serenity-green-50/20 text-serenity-green-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                {s}
                            </span>
                        ))}
                        <span className="text-mindful-brown-60 text-sm font-medium py-1">
                            {symptoms.length === 0 ? "Select or type..." : ""}
                        </span>
                    </div>
                </div>

                {/* Most Common Chips */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-mindful-brown-60">Most Common:</h3>
                    <div className="flex flex-wrap gap-2">
                        {SYMPTOMS_LIST.map(s => {
                            const isSelected = symptoms.includes(s);
                            return (
                                <button
                                    key={s}
                                    onClick={() => toggleSymptom(s)}
                                    className={cn(
                                        "px-4 py-2 rounded-full font-bold text-sm transition-all border",
                                        isSelected
                                            ? "bg-system-orange text-white border-system-orange"
                                            : "bg-white text-mindful-brown-60 border-mindful-brown-20 hover:border-mindful-brown-60"
                                    )}
                                >
                                    {s} {isSelected && <X size={14} className="inline ml-1" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4">
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
