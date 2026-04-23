"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface AssessmentLayoutProps {
    children: React.ReactNode;
    title?: string;
    hideBack?: boolean;
}

export function AssessmentLayout({ children, title, hideBack = false }: AssessmentLayoutProps) {
    const { currentStep, totalSteps, prevStep } = useAssessmentStore();
    const router = useRouter();

    // Don't show progress on the last (Complete) screen
    const isLastStep = currentStep >= totalSteps - 1;
    const progress = Math.round(((currentStep) / (totalSteps - 1)) * 100);

    const handleBack = () => {
        if (currentStep > 0) {
            prevStep();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="h-[100dvh] bg-mindful-brown-10 flex flex-col px-4 pt-4 pb-8 max-w-md mx-auto relative overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between h-12 mb-4 relative z-10">
                {!hideBack && !isLastStep && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="w-12 h-12 rounded-full border border-mindful-brown-80">
                        <ChevronLeft className="w-6 h-6 text-mindful-brown-80" />
                    </Button>
                )}

                {/* Title */}
                <div className="flex-1 text-center">
                    <span className="text-xl font-extrabold text-mindful-brown-80">
                        {isLastStep ? 'All done!' : 'Assessment'}
                    </span>
                </div>

                {/* Step counter (only on non-final steps) */}
                {!isLastStep && (
                    <div className="flex items-center gap-1 min-w-[48px] justify-end">
                        <span className="font-bold text-mindful-brown-80">{currentStep + 1}</span>
                        <span className="text-mindful-brown-60 text-sm font-medium">of {totalSteps - 1}</span>
                    </div>
                )}
            </header>

            {/* Progress Bar */}
            {!isLastStep && (
                <div className="w-full h-1.5 bg-mindful-brown-20 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-system-orange rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                {title && (
                    <h1 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                        {title}
                    </h1>
                )}
                {children}
            </main>
        </div>
    );
}
