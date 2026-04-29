"use client";

import { useState } from 'react';
import { CornerDownLeft, Circle } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onOpenAppointment?: () => void;
}

export function ChatInput({ onSendMessage, onOpenAppointment }: ChatInputProps) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pt-4 pb-8 rounded-t-32px shadow-[0px_-20px_32px_rgba(75,52,37,0.05)] z-50">
            <div className="flex items-center gap-3 max-w-md mx-auto">
                <div className="flex-1 bg-[#F7F4F2] rounded-full h-14 flex items-center px-4 gap-3">
                    <button 
                        onClick={onOpenAppointment}
                        className="p-1 hover:bg-[#4B3425]/5 rounded-full transition-colors active:scale-90"
                    >
                        <Circle className="w-5 h-5 text-[#4B3425] fill-[#4B3425]/10" />
                    </button>
                    <input 
                        type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type to start chatting..."
                        className="flex-1 bg-transparent border-none outline-none text-[#4B3425] font-bold text-sm placeholder:text-[#4B3425]/40"
                    />
                </div>
                
                <button 
                    onClick={handleSend}
                    className="w-14 h-14 bg-[#9BB068] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
                >
                    <CornerDownLeft className="text-white w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
