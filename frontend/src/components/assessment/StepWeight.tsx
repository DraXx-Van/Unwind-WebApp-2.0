"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { cn } from '../ui/button';

export function StepWeight() {
    const { weight, setWeight, weightUnit, setWeightUnit, nextStep } = useAssessmentStore();

    const handleContinue = () => {
        nextStep();
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeight(Number(e.target.value));
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                What's your weight?
            </h2>

            {/* Unit Toggle */}
            <div className="flex justify-center mb-12">
                <div className="bg-white rounded-full p-1 flex shadow-sm border border-mindful-brown-10">
                    <button
                        onClick={() => setWeightUnit('kg')}
                        className={cn(
                            "px-8 py-2 rounded-full font-bold transition-all",
                            weightUnit === 'kg' ? "bg-system-orange text-white" : "text-mindful-brown-60"
                        )}
                    >
                        kg
                    </button>
                    <button
                        onClick={() => setWeightUnit('lbs')}
                        className={cn(
                            "px-8 py-2 rounded-full font-bold transition-all",
                            weightUnit === 'lbs' ? "bg-system-orange text-white" : "text-mindful-brown-60"
                        )}
                    >
                        lbs
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center">
                {/* Big Display */}
                <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-8xl font-extrabold text-mindful-brown-80 tracking-tighter">
                        {weight}
                    </span>
                    <span className="text-3xl font-bold text-mindful-brown-60">
                        {weightUnit}
                    </span>
                </div>

                {/* Slider / Ruler Simulation */}
                <div className="w-full relative py-8">
                    {/* Center Marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-serenity-green-50 rounded-full z-10" />

                    <input
                        type="range"
                        min={30}
                        max={200}
                        step={1}
                        value={weight || 60}
                        onChange={handleWeightChange}
                        className="w-full h-2 bg-mindful-brown-20 rounded-lg appearance-none cursor-pointer accent-serenity-green-50"
                    />
                    <div className="flex justify-between text-mindful-brown-20 text-sm mt-2 font-bold px-2">
                        <span>30</span>
                        <span>200</span>
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
