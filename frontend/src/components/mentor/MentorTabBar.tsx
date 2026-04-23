"use client";

import { Home, MessageCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MentorTabBar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DDD9] px-6 py-4 flex justify-around items-center pb-8 rounded-t-[32px] shadow-[0px_-16px_32px_rgba(75,52,37,0.05)] z-50">
            {/* Dashboard Tab */}
            <Link href="/mentor/dashboard" className="flex flex-col items-center gap-1 w-16">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/mentor/dashboard') && pathname === '/mentor/dashboard' ? "bg-[#F7F4F2]" : "bg-transparent"
                )}>
                    <Home
                        className={cn(
                            "w-6 h-6",
                            isActive('/mentor/dashboard') && pathname === '/mentor/dashboard' ? "text-[#4B3425]" : "text-[#A69B93]"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>

            {/* Chat Tab */}
            <Link href="/mentor/chat" className="flex flex-col items-center gap-1 w-16">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/mentor/chat') ? "bg-[#F7F4F2]" : "bg-transparent"
                )}>
                    <MessageCircle
                        className={cn(
                            "w-6 h-6",
                            isActive('/mentor/chat') ? "text-[#4B3425]" : "text-[#A69B93]"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>

            {/* Appointments Tab */}
            <Link href="/mentor/appointments" className="flex flex-col items-center gap-1 w-16">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/mentor/appointments') ? "bg-[#F7F4F2]" : "bg-transparent"
                )}>
                    <Calendar
                        className={cn(
                            "w-6 h-6",
                            isActive('/mentor/appointments') ? "text-[#4B3425]" : "text-[#A69B93]"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>
        </div>
    );
}
