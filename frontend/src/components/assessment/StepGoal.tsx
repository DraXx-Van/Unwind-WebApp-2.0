"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Check, Heart, Smile } from 'lucide-react'; // Icons as placeholders
import { cn } from '../ui/button';

const GOALS = [
    { id: 'stress', label: 'I wanna reduce stress', icon: Heart },
    { id: 'ai-therapy', label: 'I wanna try AI Therapy', icon: Smile },
    { id: 'trauma', label: 'I want to cope with trauma', icon: Heart }, // Replace with Flag if available
    { id: 'better-person', label: 'I want to be a better person', icon: Smile },
    { id: 'try-app', label: 'Just trying out the app, mate!', icon: Heart }, // Replace with Can
];

export function StepGoal() {
    const { goal, setGoal, nextStep } = useAssessmentStore();

    const handleContinue = () => {
        if (goal) {
            nextStep();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                What's your health goal for today?
            </h2>

            <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                {GOALS.map((item) => {
                    const isSelected = goal === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setGoal(item.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-[100px] transition-all duration-200 border-2",
                                isSelected
                                    ? "bg-serenity-green-50/20 border-serenity-green-50 shadow-md"
                                    : "bg-white border-transparent hover:bg-white/80"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center",
                                    isSelected ? "text-serenity-green-50" : "text-optimistic-gray-30"
                                )}>
                                    <Icon size={20} />
                                </div>
                                <span className={cn(
                                    "text-lg font-bold",
                                    isSelected ? "text-mindful-brown-80" : "text-mindful-brown-60"
                                )}>
                                    {item.label}
                                </span>
                            </div>

                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                isSelected ? "bg-serenity-green-50 border-serenity-green-50" : "border-optimistic-gray-30"
                            )}>
                                {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto pt-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={!goal}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
