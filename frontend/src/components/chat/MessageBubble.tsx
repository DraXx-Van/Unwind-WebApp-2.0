"use client";

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    text: string;
    sender: 'user' | 'bot' | 'mentor';
    emotion?: string;
    dataUpdated?: boolean;
}

export function MessageBubble({ text, sender, emotion, dataUpdated }: MessageBubbleProps) {
    const isUser = sender === 'user';

    if (emotion) {
        return (
            <div className="w-full flex justify-center my-4 px-6">
                <div 
                    className={cn(
                        "w-full py-2 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm",
                        emotion.toLowerCase() === 'anger' || emotion.toLowerCase() === 'sad' 
                            ? "bg-[#FE814B]" 
                            : "bg-[#9BB068]"
                    )}
                >
                    <span className="text-white text-xs font-bold">
                        {emotion.toLowerCase() === 'anger' ? '😔' : '😊'} Emotion: {text}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "w-full flex mb-6 px-4",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "flex items-start gap-3 max-w-[85%]",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={cn(
                    "w-10 h-10 rounded-full shrink-0 flex items-center justify-center",
                    isUser ? "bg-[#6D4B36]" : "bg-[#F7F4F2]"
                )}>
                    {isUser ? (
                        <User className="w-5 h-5 text-[#BDA193]" />
                    ) : (
                        <div className="grid grid-cols-2 gap-0.5 p-1.5">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-1.5 h-1.5 bg-[#BDA193] rounded-full" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bubble */}
                <div className={cn(
                    "p-4 rounded-2xl relative shadow-sm",
                    isUser 
                        ? "bg-[#4B3425] text-white rounded-tr-none" 
                        : "bg-[#E8DDD9] text-[#4B3425]/70 rounded-tl-none"
                )}>
                    <p className="text-sm font-bold leading-tight Urbanist">{text}</p>
                    
                    {/* Bubble Tail */}
                    <div className={cn(
                        "absolute top-0 w-3 h-3",
                        isUser 
                            ? "right-[-6px] bg-[#4B3425] [clip-path:polygon(0_0,0%_100%,100%_0)]" 
                            : "left-[-6px] bg-[#E8DDD9] [clip-path:polygon(0_0,100%_0,100%_100%)]"
                    )} />
                </div>
            </div>
        </div>
    );
}
