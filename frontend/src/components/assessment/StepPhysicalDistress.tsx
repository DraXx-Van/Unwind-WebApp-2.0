"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '../ui/button';
import { Circle, CheckCircle } from 'lucide-react';
import { cn } from '../ui/button';

export function StepPhysicalDistress() {
    const { physicalDistress, setPhysicalDistress, nextStep } = useAssessmentStore();

    const handleContinue = () => {
        if (physicalDistress !== null) {
            nextStep();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-3xl font-extrabold text-mindful-brown-80 mb-8 text-center leading-tight">
                Are you experiencing any physical distress?
            </h2>

            <div className="flex-1 space-y-4">
                {/* Yes Option */}
                <button
                    onClick={() => setPhysicalDistress(true)}
                    className={cn(
                        "w-full text-left p-6 rounded-[32px] transition-all duration-200 border-2",
                        physicalDistress === true
                            ? "bg-serenity-green-50 border-serenity-green-50 text-white shadow-lg"
                            : "bg-white border-transparent text-mindful-brown-80 hover:bg-mindful-brown-10"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            physicalDistress === true ? "border-white" : "border-mindful-brown-20"
                        )}>
                            {physicalDistress === true && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Yes, one or multiple</h3>
                    <p className={cn("text-sm", physicalDistress === true ? "text-white/90" : "text-mindful-brown-60")}>
                        I'm experiencing physical pain in different places over my body.
                    </p>
                </button>

                {/* No Option */}
                <button
                    onClick={() => setPhysicalDistress(false)}
                    className={cn(
                        "w-full text-left p-6 rounded-[32px] transition-all duration-200 border-2",
                        physicalDistress === false
                            ? "bg-serenity-green-50 border-serenity-green-50 text-white shadow-lg"
                            : "bg-white border-transparent text-mindful-brown-80 hover:bg-mindful-brown-10"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            physicalDistress === false ? "border-white" : "border-mindful-brown-20"
                        )}>
                            {physicalDistress === false && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">No Physical Pain At All</h3>
                    <p className={cn("text-sm", physicalDistress === false ? "text-white/90" : "text-mindful-brown-60")}>
                        I'm not experiencing any physical pain in my body at all :)
                    </p>
                </button>
            </div>

            <div className="mt-8 pt-4">
                <Button
                    className="w-full rounded-[100px] text-xl font-extrabold tracking-tight h-16"
                    onClick={handleContinue}
                    disabled={physicalDistress === null}
                >
                    Continue &rarr;
                </Button>
            </div>
        </div>
    );
}
