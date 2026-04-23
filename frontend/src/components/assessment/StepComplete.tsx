"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, PartyPopper, AlertTriangle } from 'lucide-react';

export function StepComplete() {
    const router = useRouter();
    const { submitAssessment, isSubmitting, submitError, isSubmitted, resetAssessment } = useAssessmentStore();

    useEffect(() => {
        submitAssessment();
    }, [submitAssessment]);

    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                resetAssessment();
                router.push('/dashboard');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted, resetAssessment, router]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            {isSubmitting && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-24 h-24 rounded-full bg-serenity-green-50/20 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-serenity-green-50 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-mindful-brown-80">
                        Saving your assessment...
                    </h2>
                    <p className="text-mindful-brown-60 font-medium">
                        We&apos;re personalizing your experience
                    </p>
                </motion.div>
            )}

            {isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2, damping: 10 }}
                        className="w-28 h-28 rounded-full bg-serenity-green-50 flex items-center justify-center shadow-[0px_16px_48px_rgba(155,176,104,0.4)]"
                    >
                        <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                    </motion.div>

                    <h2 className="text-3xl font-extrabold text-mindful-brown-80 leading-tight">
                        You're all set! <PartyPopper className="inline w-7 h-7 ml-1" />
                    </h2>
                    <p className="text-mindful-brown-60 font-medium text-lg max-w-xs">
                        Your personal wellness profile is ready. Taking you to your dashboard now...
                    </p>

                    {/* Animated dots */}
                    <div className="flex gap-2 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-serenity-green-50"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {submitError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-mindful-brown-80">
                        Something went wrong
                    </h2>
                    <p className="text-mindful-brown-60 font-medium">
                        {submitError}
                    </p>
                    <button
                        onClick={() => submitAssessment()}
                        className="mt-4 px-8 py-3 bg-mindful-brown-80 text-white rounded-full font-bold text-lg hover:bg-mindful-brown-60 transition-colors"
                    >
                        Try Again
                    </button>
                </motion.div>
            )}
        </div>
    );
}
