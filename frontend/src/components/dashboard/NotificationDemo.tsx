
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles, X, Check } from 'lucide-react';

export function NotificationDemo() {
    const [show, setShow] = useState(false);
    const [demoNotification, setDemoNotification] = useState<{ title: string, body: string } | null>(null);

    const triggerDemo = async () => {
        const notifications = [
            { title: "Time for Mindfulness", body: "You've been active for 4 hours. A 2-minute breather will boost your focus." },
            { title: "Sleep Nudge", body: "Your ideal bedtime is in 30 mins. Wind down now for a better tomorrow." },
            { title: "Mood Check-in", body: "You haven't logged your mood today. How are you feeling right now?" },
            { title: "Hydration Goal", body: "Drinking a glass of water now could help with that slight fatigue." }
        ];
        const random = notifications[Math.floor(Math.random() * notifications.length)];
        setDemoNotification(random);
        setShow(true);

        // Request permission and show system notification
        if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                // Try to use service worker for a better Android experience
                if ("serviceWorker" in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    registration.showNotification(random.title, {
                        body: random.body,
                        icon: '/icon-192x192.png',
                        badge: '/icon-192x192.png',
                        vibrate: [200, 100, 200],
                    });
                } else {
                    new Notification(random.title, { body: random.body });
                }
            }
        }

        setTimeout(() => setShow(false), 5000);
    };

    return (
        <>
            <button 
                onClick={triggerDemo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95"
            >
                <Bell className="w-4 h-4 text-[#9BB068]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Test Smart Nudges</span>
            </button>

            <AnimatePresence>
                {show && demoNotification && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.9 }}
                        className="fixed top-6 left-6 right-6 z-[300] bg-[#4B3425] text-white rounded-[2rem] p-5 shadow-2xl border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#9BB068] flex items-center justify-center shrink-0 shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-sm uppercase tracking-tight mb-1">{demoNotification.title}</h4>
                                <p className="text-white/60 text-xs font-bold leading-tight">{demoNotification.body}</p>
                            </div>
                            <button 
                                onClick={() => setShow(false)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                            >
                                <X className="w-4 h-4 text-white/40" />
                            </button>
                        </div>
                        <div className="mt-4 flex gap-2">
                             <button className="flex-1 py-2 rounded-xl bg-[#9BB068] text-white text-[10px] font-black uppercase tracking-widest">Open Now</button>
                             <button onClick={() => setShow(false)} className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">Dismiss</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
