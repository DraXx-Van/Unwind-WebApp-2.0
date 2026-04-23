"use client";

import { Home, MessageCircle, BarChart2, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TabBar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mindful-brown-10 px-6 py-4 flex justify-between items-center pb-8 rounded-t-32px shadow-[0px_-16px_32px_rgba(75,52,37,0.05)] z-50">
            {/* Home Tab */}
            <Link href="/dashboard" className="flex flex-col items-center gap-1 w-12">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/dashboard') ? "bg-mindful-brown-10" : "bg-transparent"
                )}>
                    <Home
                        className={cn(
                            "w-6 h-6",
                            isActive('/dashboard') ? "text-mindful-brown-80" : "text-mindful-brown-30"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>

            {/* Chat Tab */}
            <Link href="/dashboard/chat" className="flex flex-col items-center gap-1 w-12">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/dashboard/chat') ? "bg-mindful-brown-10" : "bg-transparent"
                )}>
                    <MessageCircle
                        className={cn(
                            "w-6 h-6",
                            isActive('/dashboard/chat') ? "text-mindful-brown-80" : "text-mindful-brown-30"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>

            {/* Add Button (Floating Center) */}
            <div className="relative -top-8">
                <Link href={pathname === '/dashboard/chat' ? '/dashboard/chat/new' : (pathname === '/journal' ? '/journal/new' : '/journal')}>
                    <button className="w-16 h-16 bg-serenity-green-50 rounded-full flex items-center justify-center shadow-[0px_16px_32px_rgba(155,176,104,0.5)] transition-transform active:scale-95">
                        <Plus className="text-white w-8 h-8" strokeWidth={3} />
                    </button>
                </Link>
            </div>

            {/* Insights Tab */}
            <Link href="/dashboard/insights" className="flex flex-col items-center gap-1 w-12">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/dashboard/insights') ? "bg-mindful-brown-10" : "bg-transparent"
                )}>
                    <BarChart2
                        className={cn(
                            "w-6 h-6",
                            isActive('/dashboard/insights') ? "text-mindful-brown-80" : "text-mindful-brown-30"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>

            {/* Profile Tab */}
            <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 w-12">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                    isActive('/dashboard/profile') ? "bg-mindful-brown-10" : "bg-transparent"
                )}>
                    <User
                        className={cn(
                            "w-6 h-6",
                            isActive('/dashboard/profile') ? "text-mindful-brown-80" : "text-mindful-brown-30"
                        )}
                        strokeWidth={2.5}
                    />
                </div>
            </Link>
        </div>
    );
}
