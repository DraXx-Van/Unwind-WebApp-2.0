"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { cn } from '../ui/button';
import Image from 'next/image';

const SLEEP_OPTIONS = [
    { val: 5, label: 'Excellent', hours: '7-9 HOURS', icon: 'Solid mood overjoyed.svg', color: 'text-serenity-green-50' },
    { val: 4, label: 'Good', hours: '6-7 HOURS', icon: 'Solid mood happy.svg', color: 'text-yellow-500' },
    { val: 3, label: 'Fair', hours: '5 HOURS', icon: 'Solid mood neutral.svg', color: 'text-orange-400' },
    { val: 2, label: 'Poor', hours: '3-4 HOURS', icon: 'Solid mood sad.svg', color: 'text-orange-600' },
    { val: 1, label: 'Worst', hours: '< 3 HOURS', icon: 'Solid mood depressed.svg', color: 'text-red-600' },
];

export function StepSleep() {
    const { sleepQuality, setSleepQuality, nextStep } = useAssessmentStore();

    const handleContinue = () => {
        if (sleepQuality) {
            nextStep();
        }
    };

    const getProgressHeight = (val: number) => {
        switch (val) {
            case 5: return '90%';
            case 4: return '70%';
            case 3: return '50%';
            case 2: return '30%';
            case 1: return '10%';
            default: return '50%';
        }
    };

    const getTopPosition = (val: number) => {
        switch (val) {
            case 5: return '10%';
            case 4: return '30%';
            case 3: return '50%';
            case 2: return '70%';
            case 1: return '90%';
            default: return '50%';
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                How would you rate your sleep quality?
            </h2>

            <div className="flex-1 relative flex items-center justify-between px-2">
                {/* Labels Left */}
                <div className="flex flex-col justify-between h-[400px] flex-1 py-4 pr-2">
                    {SLEEP_OPTIONS.map((opt) => (
                        <button
                            key={opt.val}
                            onClick={() => setSleepQuality(opt.val)}
                            className={cn(
                                "text-left transition-all duration-300",
                                sleepQuality === opt.val ? "opacity-100 translate-x-1" : "opacity-40"
                            )}
                        >
                            <div className={cn("text-xl font-bold", sleepQuality === opt.val ? "text-mindful-brown-80" : "text-mindful-brown-60")}>
                                {opt.label}
                            </div>
                            <div className="text-xs font-bold text-mindful-brown-40 opacity-80">{opt.hours}</div>
                        </button>
                    ))}
                </div>

                {/* Vertical Slider Visual */}
                <div className="relative h-[400px] w-16 flex justify-center mx-2">
                    {/* Slider Track (Static Background) */}
                    <div className="absolute top-0 bottom-0 w-4 bg-mindful-brown-10 rounded-full z-0 left-1/2 -translate-x-1/2" />

                    {/* Orange Loading Bar (Progress) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 bg-system-orange rounded-b-full rounded-t-lg transition-all duration-500 z-10"
                        style={{ height: sleepQuality ? `calc(100% - ${getTopPosition(sleepQuality)})` : '50%' }}
                    />

                    {/* Interaction Overlay */}
                    <div className="absolute inset-0 flex flex-col z-20">
                        {[5, 4, 3, 2, 1].map(val => (
                            <button
                                key={val}
                                className="flex-1 w-full"
                                onClick={() => setSleepQuality(val)}
                                aria-label={`Select ${val}`}
                            />
                        ))}
                    </div>

                    {/* Thumb / Knob - Using Frame.svg */}
                    <div
                        className="absolute w-20 h-20 transition-all duration-300 flex items-center justify-center z-30 pointer-events-none"
                        style={{ top: sleepQuality ? getTopPosition(sleepQuality) : '50%', transform: 'translate(-50%, -50%)', left: '50%' }}
                    >
                        {/* The Frame.svg is the thumb itself */}
                        <div className="relative w-full h-full drop-shadow-md">
                            <Image
                                src="/assets/Frame.svg"
                                alt="Slider Thumb"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Icons Right - Kept Visible */}
                <div className="flex flex-col justify-between h-[400px] py-4 pl-2">
                    {SLEEP_OPTIONS.map((opt) => {
                        return (
                            <button
                                key={opt.val}
                                onClick={() => setSleepQuality(opt.val)}
                                className={cn(
                                    "transition-all duration-300 w-12 h-12 relative flex items-center justify-center",
                                    sleepQuality === opt.val ? "scale-125" : "scale-100"
                                )}
                            >
                                <Image
                                    src={`/assets/${opt.icon}`}
                                    alt={opt.label}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 pt-4 pb-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={!sleepQuality}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
