"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, X, CheckCircle2, Video } from 'lucide-react';

interface ConfirmSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (meetLink: string) => void;
}

export function ConfirmSlotModal({ isOpen, onClose, onConfirm }: ConfirmSlotModalProps) {
    const [meetLink, setMeetLink] = useState('');

    const handleConfirm = () => {
        if (meetLink) {
            onConfirm(meetLink);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#4B3425]/40 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        <div className="bg-[#9BB068] p-8 text-white relative">
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 shadow-lg">
                                <Video className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl font-black tracking-tight leading-none mb-2">Confirm Slot</h2>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Send meeting link to your student</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[#4B3425]/40 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Google Meet Link</label>
                                <div className="relative">
                                    <input 
                                        type="url" 
                                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                        value={meetLink}
                                        onChange={(e) => setMeetLink(e.target.value)}
                                        className="w-full h-14 bg-[#F7F4F2] rounded-2xl px-6 pr-12 text-[#4B3425] font-bold text-sm outline-none focus:ring-2 ring-[#9BB068]/20 transition-all"
                                    />
                                    <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B3425]/20" />
                                </div>
                            </div>

                            <button 
                                onClick={handleConfirm}
                                disabled={!meetLink}
                                className="w-full h-16 bg-[#9BB068] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#9BB068]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                Confirm & Send <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
