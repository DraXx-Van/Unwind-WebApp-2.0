
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Wind, ShieldAlert, Heart, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PanicButton() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const panicOptions = [
        {
            title: "I can't breathe",
            desc: "Start a guided box breathing session",
            icon: <Wind className="w-6 h-6" />,
            color: "#9BB068",
            action: () => router.push('/library/box-breathing')
        },
        {
            title: "I'm having a panic attack",
            desc: "Immediate 5-4-3-2-1 grounding",
            icon: <Zap className="w-6 h-6" />,
            color: "#FE814B",
            action: () => router.push('/library/grounding-54321')
        },
        {
            title: "I need to talk to someone",
            desc: "Emergency help contacts",
            icon: <ShieldAlert className="w-6 h-6" />,
            color: "#FF4B4B",
            action: () => {
                alert("Emergency Contacts: \nNational Suicide Prevention: 988\nCrisis Text Line: Text HOME to 741741");
            }
        },
        {
            title: "I'm feeling very low",
            desc: "Start a grounding visualization",
            icon: <Heart className="w-6 h-6" />,
            color: "#A18FFF",
            action: () => router.push('/library/safe-space')
        }
    ];

    return (
        <>
            {/* The Floating Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-[#FF4B4B] rounded-full flex items-center justify-center shadow-2xl z-[100] border-4 border-white active:bg-red-600 transition-colors"
            >
                <AlertCircle className="text-white w-7 h-7" />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-[#FF4B4B] rounded-full -z-10 opacity-30" 
                />
            </motion.button>

            {/* Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-[#4B3425]/80 backdrop-blur-md"
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4B4B]/5 rounded-full -mr-16 -mt-16" />
                            
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-[#4B3425] text-2xl font-black uppercase tracking-tight">Panic Mode</h2>
                                    <p className="text-[#4B3425]/40 font-bold text-sm">We are here with you. Choose what you need.</p>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full bg-[#F7F4F2] flex items-center justify-center active:scale-90 transition-all"
                                >
                                    <X className="w-5 h-5 text-[#4B3425]" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {panicOptions.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => {
                                            option.action();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F7F4F2] hover:bg-white hover:shadow-lg hover:ring-2 transition-all group text-left"
                                        style={{ '--tw-ring-color': option.color } as any}
                                    >
                                        <div 
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                                            style={{ backgroundColor: option.color }}
                                        >
                                            {option.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-[#4B3425] font-black uppercase tracking-tight text-sm">{option.title}</h3>
                                            <p className="text-[#4B3425]/40 text-[10px] font-bold uppercase tracking-wider">{option.desc}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] font-black text-[#4B3425]/20 uppercase tracking-[0.2em]">Breathe deeply. This will pass.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
