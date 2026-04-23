"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TabBar } from '@/components/dashboard/TabBar';
import { MentalScoreCard } from '@/components/dashboard/MentalScoreCard';
import { MoodLevelCard } from '@/components/dashboard/MoodLevelCard';
import { HealthJournalCard } from '@/components/dashboard/HealthJournalCard';
import { SleepQualityCard } from '@/components/dashboard/SleepQualityCard';
import { MindfulJournalCard } from '@/components/dashboard/MindfulJournalCard';
import { MindfulHoursCard } from '@/components/dashboard/MindfulHoursCard';
import { StressLevelCard } from '@/components/dashboard/StressLevelCard';
import { MoodTrackerCard } from '@/components/dashboard/MoodTrackerCard';
import { DailyCheckCard } from '@/components/dashboard/DailyCheckCard';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authFetch } from '@/lib/api';
import { isToday } from '@/lib/dateUtils';

interface AssessmentData {
    mood: number | null;
    sleepQuality: number | null;
    stressLevel: number | null;
}

// ─── Mental Score ────────────────────────────────────────────────────────────
// Requires TODAY's mood AND stress to be logged — no fallbacks.
// Returns null if either is missing so the UI shows '--' instead of a lie.
// Sleep fallback is allowed (it's overnight — hard to track daily).
function computeScore(
    liveMood: string | null,
    liveStress: number | null,
    liveSleepQ: number | null,
    assessmentSleepQuality: number | null,
    mindfulDone: boolean,
    journalDone: boolean
): number | null {
    // Mood and stress MUST be logged today — no assessment fallback
    if (!liveMood || liveStress == null) return null;

    const moodVal  = MOOD_TO_NUM[liveMood.toUpperCase()] ?? 3;
    const stressVal = liveStress;
    // Sleep: live tracked quality (0-100 → 1-5) OR assessment baseline (sleep doesn't change hourly)
    const sleepVal = liveSleepQ != null
        ? Math.max(1, Math.round(liveSleepQ / 20))
        : (assessmentSleepQuality ?? 3);

    const moodPts   = moodVal  * 20;
    const sleepPts  = sleepVal * 20;
    const stressPts = (6 - stressVal) * 20;

    let totalScore = (moodPts + sleepPts + stressPts) / 3;

    // Bonus for active participation
    if (mindfulDone) totalScore += 5;
    if (journalDone) totalScore += 5;

    return Math.min(100, Math.round(totalScore));
}

const MOOD_TO_NUM: Record<string, number> = {
    OVERWHELMED: 1,
    LOW: 2,
    NEUTRAL: 3,
    CALM: 4,
    HAPPY: 4,
    // UI labels (display names) mapped defensively
    OVERJOYED: 5,
    GOOD: 4,
    SAD: 2,
    ANXIOUS: 2,
};

export default function DashboardPage() {
    const router = useRouter();
    const { user, token } = useAuthStore();

    const [assessment, setAssessment] = useState<AssessmentData | null>(null);
    const [journalCount, setJournalCount] = useState(0);
    const [journaledToday, setJournaledToday] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [mindfulHistory, setMindfulHistory] = useState<any[]>([]);
    const [mindfulTotalToday, setMindfulTotalToday] = useState(0);
    const [mindfulToday, setMindfulToday] = useState(false);

    // Live daily signals (override assessment baseline when present)
    const [liveMoodStr, setLiveMoodStr] = useState<string | null>(null);
    const [liveStress, setLiveStress] = useState<number | null>(null);
    const [liveSleepQuality, setLiveSleepQuality] = useState<number | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!token) router.push('/login');
    }, [token, router]);

    // ── Fetch all dashboard data ─────────────────────────────────────────────
    // Called on every mount so data is always fresh after navigating back
    const fetchDashboardData = useCallback(async () => {
        if (!token || !user?.id) return;

        const today = new Date().toDateString();

        // 1. Assessment (baseline for score)
        authFetch('/assessment/latest')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setAssessment(d); })
            .catch(() => {});

        // 2. Journal count & Today's check
        authFetch('/journal')
            .then(r => r.ok ? r.json() : [])
            .then((data: any[]) => {
                setJournalCount(data.length);
                const hasToday = data.some(j => isToday(j.createdAt));
                setJournaledToday(hasToday);
            })
            .catch(() => {});

        // 3. Today's mood (live signal)
        authFetch('/mood/today')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.mood) setLiveMoodStr(d.mood); })
            .catch(() => {});

        // 4. Latest stress — only use if logged today (live signal)
        authFetch(`/stress/latest?userId=${user.id}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d?.value != null && isToday(d.createdAt)) {
                    setLiveStress(d.value);
                }
            })
            .catch(() => {});

        // 5. Latest sleep quality (today only)
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/sleep/latest?userId=${user.id}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d?.quality != null && isToday(d.createdAt)) {
                    setLiveSleepQuality(d.quality); 
                }
            })
            .catch(() => {});

        // 6. Mindful history
        authFetch(`/mindful/history?userId=${user.id}`)
            .then(r => r.ok ? r.json() : [])
            .then((data: any[]) => {
                setMindfulHistory(data.slice(0, 3));
                const todaySessions = data.filter(s => isToday(s.createdAt));
                const total = todaySessions.reduce((acc, s) => acc + (s.duration ?? 0), 0);
                setMindfulTotalToday(total);
                setMindfulToday(todaySessions.length > 0);
            })
            .catch(() => {});

    }, [token, user?.id]);

    // Re-fetch every time the component mounts (user navigates back)
    useEffect(() => {
        const now = new Date();
        setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
        fetchDashboardData();
    }, [fetchDashboardData]);

    // ── Mental Score ─────────────────────────────────────────────────────────
    // null = incomplete daily check-in; UI shows '--' instead of wrong number
    const mentalScore = computeScore(
        liveMoodStr,
        liveStress,
        liveSleepQuality,
        assessment?.sleepQuality ?? null,
        mindfulToday,
        journaledToday
    );

    const mentalLabel = mentalScore != null
        ? mentalScore >= 70 ? 'Healthy'
        : mentalScore >= 40 ? 'Moderate'
        : 'Needs Care'
        : null;

    // How many of the 2 required signals are logged today
    const checkinCount = (liveMoodStr ? 1 : 0) + (liveStress != null ? 1 : 0);
    const checkinComplete = checkinCount === 2;

    const userName = user?.name || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (!token) return null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32">
            {/* Brown Header */}
            <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-6 pb-8 mb-6 text-white shadow-lg relative z-10 overflow-hidden">
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-b-[40px] z-0 pointer-events-none select-none" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <span className="text-sm font-medium opacity-80">{currentDate || 'Loading...'}</span>
                    <button className="w-10 h-10 rounded-full bg-[#654630] flex items-center justify-center relative">
                        <Bell className="w-5 h-5 text-white" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF9500] rounded-full border border-[#4F3422]"></span>
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-[#E8DDD9] flex items-center justify-center">
                        <span className="text-[#4F3422] font-bold text-xl">{userInitials}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Hi, {userName.split(' ')[0]}!</h1>
                        <div className="flex items-center gap-3 mt-1 text-sm font-medium opacity-90">
                            <span className="flex items-center gap-1"><span className="text-[#FF9500]">★</span> Pro</span>
                            <span className="flex items-center gap-1">
                                <span className="text-[#FF9500]">✿</span>
                                {mentalScore != null ? `${mentalScore}%` : '--'}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-[#FF9500]">☺</span>
                                {mentalLabel ?? (checkinComplete ? '...' : 'Log today')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <DailyCheckCard />

                {/* Mental Health Metrics */}
                <div className="flex flex-col gap-3">
                    <div className="px-6 flex justify-between items-center">
                        <h2 className="text-[#4F3422] font-bold text-lg">Mental Health Metrics</h2>
                        <button className="text-[#926247]"><span className="text-xl">⋮</span></button>
                    </div>
                    <div className="overflow-x-auto flex gap-4 px-6 pb-4 items-center hide-scrollbar">
                        <MentalScoreCard score={mentalScore} label={mentalLabel} />
                        <MoodLevelCard />
                        <HealthJournalCard count={journalCount} done={journaledToday} />
                    </div>
                </div>

                {/* Mindful Tracker */}
                <div className="px-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-[#4F3422] font-bold text-lg">Mindful Tracker</h2>
                        <button className="text-[#926247]"><span className="text-xl">⋮</span></button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <MindfulHoursCard totalMinutes={mindfulTotalToday} done={mindfulToday} />
                        <SleepQualityCard quality={assessment?.sleepQuality ?? null} liveQuality={liveSleepQuality} />
                        <MindfulJournalCard count={journalCount} />
                        <StressLevelCard level={liveStress} />
                        <MoodTrackerCard />

                        {/* Recent Exercises */}
                        {mindfulHistory.length > 0 && (
                            <div className="flex flex-col gap-2 mt-2">
                                <p className="text-[#4F3422]/60 text-xs font-bold uppercase tracking-wider ml-1">Recent Exercises · Tap to Redo</p>
                                {mindfulHistory.map((session, i) => (
                                    <Link
                                        key={session.id || i}
                                        href={`/mindful/timer?activity=${encodeURIComponent(session.activity)}&category=${encodeURIComponent(session.category)}&min=${Math.floor(session.plannedDuration || 10)}&sec=0`}
                                        className="bg-white border border-[#EAE6E1] rounded-2xl p-3 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#F6EBE5] flex items-center justify-center text-[#A6785D]">
                                                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-1"></div>
                                            </div>
                                            <div>
                                                <p className="text-[#4F3422] font-bold text-sm leading-tight">{session.activity}</p>
                                                <p className="text-[#4F3422]/50 text-[10px] font-bold uppercase tracking-tight">{session.category} · {Math.floor(session.plannedDuration || session.duration)}m</p>
                                            </div>
                                        </div>
                                        <div className="text-[#926247] font-bold text-[10px] uppercase border border-[#926247]/20 px-2 py-1 rounded-lg">Redo</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TabBar />
        </div>
    );
}
