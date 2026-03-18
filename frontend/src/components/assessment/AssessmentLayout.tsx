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
            <header className="flex items-center justify-between h-12 mb-8 relative z-10">
                {!hideBack && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="w-12 h-12 rounded-full border border-mindful-brown-80">
                        <ChevronLeft className="w-6 h-6 text-mindful-brown-80" />
                    </Button>
                )}

                {/* Title or Step Indicator */}
                <div className="flex-1 text-center">
                    <span className="text-xl font-extrabold text-mindful-brown-80">Assessment</span>
                </div>

                {/* Step Counter */}
                <div className="flex items-center gap-1">
                    <span className="font-bold text-mindful-brown-80">{currentStep + 1}</span>
                    <span className="text-mindful-brown-60 text-sm font-medium">of {totalSteps}</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {title && (
                    <h1 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                        {title}
                    </h1>
                )}
                {children}
            </main>

            {/* Background Elements (if any, like the blobs in Figma) */}
            {/* Placeholder for background blobs */}
        </div>
    );
}
