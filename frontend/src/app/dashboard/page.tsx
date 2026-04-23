"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronRight, Play, BookOpen, Sparkles, Star, Activity, Smile, MoreVertical } from 'lucide-react';
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
import { useAuthStore } from '@/store/authStore';
import { authFetch } from '@/lib/api';
import { isToday } from '@/lib/dateUtils';

interface AssessmentData {
    mood: number | null;
    sleepQuality: number | null;
    stressLevel: number | null;
}

function computeScore(
    liveMood: string | null,
    liveStress: number | null,
    liveSleepQ: number | null,
    assessmentSleepQuality: number | null,
    mindfulDone: boolean,
    journalDone: boolean
): number | null {
    if (!liveMood || liveStress == null) return null;

    const moodVal  = MOOD_TO_NUM[liveMood.toUpperCase()] ?? 3;
    const stressVal = liveStress;
    const sleepVal = liveSleepQ != null
        ? Math.max(1, Math.round(liveSleepQ / 20))
        : (assessmentSleepQuality ?? 3);

    const moodPts   = moodVal  * 20;
    const sleepPts  = sleepVal * 20;
    const stressPts = (6 - stressVal) * 20;

    let totalScore = (moodPts + sleepPts + stressPts) / 3;
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

    const [liveMoodStr, setLiveMoodStr] = useState<string | null>(null);
    const [liveStress, setLiveStress] = useState<number | null>(null);
    const [liveSleepQuality, setLiveSleepQuality] = useState<number | null>(null);

    useEffect(() => {
        if (!token) router.push('/login');
    }, [token, router]);

    const fetchDashboardData = useCallback(async () => {
        if (!token || !user?.id) return;

        authFetch('/assessment/latest')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setAssessment(d); })
            .catch(() => {});

        authFetch('/journal')
            .then(r => r.ok ? r.json() : [])
            .then((data: any[]) => {
                setJournalCount(data.length);
                const hasToday = data.some(j => isToday(j.createdAt));
                setJournaledToday(hasToday);
            })
            .catch(() => {});

        const localDate = new Date().toLocaleDateString('en-CA');
        authFetch(`/mood/today?date=${localDate}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.mood) setLiveMoodStr(d.mood); })
            .catch(() => {});

        authFetch('/stress/latest')
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d?.value != null && isToday(d.createdAt)) {
                    setLiveStress(d.value);
                }
            })
            .catch(() => {});

        authFetch('/sleep/latest')
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d?.quality != null && isToday(d.createdAt)) {
                    setLiveSleepQuality(d.quality); 
                }
            })
            .catch(() => {});

        authFetch('/mindful/history')
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

    useEffect(() => {
        const now = new Date();
        setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
        fetchDashboardData();
    }, [fetchDashboardData]);

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

    const checkinCount = (liveMoodStr ? 1 : 0) + (liveStress != null ? 1 : 0);
    const checkinComplete = checkinCount === 2;

    const userName = user?.name || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (!token) return null;

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Brown Header - Reduced Padding */}
            <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-10 pb-10 mb-8 text-white shadow-lg relative z-10 overflow-hidden">
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none select-none" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{currentDate || 'Loading...'}</span>
                    <button className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center relative">
                        <Bell className="w-5 h-5 text-white" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FE814B] rounded-full border-2 border-[#4F3422]"></span>
                    </button>
                </div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-[24px] border-2 border-white/20 bg-[#E8DDD9] flex items-center justify-center shadow-lg">
                        <span className="text-[#4F3422] font-black text-2xl">{userInitials}</span>
                    </div>
                    <div>
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Your Daily Dashboard</p>
                        <h1 className="text-3xl font-black tracking-tight leading-none">Hi, {userName.split(' ')[0]}!</h1>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-black uppercase tracking-widest opacity-60">
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#FF9500] fill-[#FF9500]" /> Pro</span>
                            <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3 text-[#FF9500]" />
                                {mentalScore != null ? `${mentalScore}%` : '--'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <DailyCheckCard />

                {/* Daily Stats (Carousel style) */}
                <section className="px-6">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h2 className="text-[#4B3425] font-black text-xl tracking-tight leading-none">Daily Stats</h2>
                        <div className="flex gap-1.5">
                             <div className="w-6 h-1 bg-[#4B3425] rounded-full" />
                             <div className="w-1 h-1 bg-[#4B3425]/10 rounded-full" />
                        </div>
                    </div>
                    <div className="overflow-x-auto flex gap-4 pb-4 hide-scrollbar -mx-6 px-6">
                        <MentalScoreCard score={mentalScore} label={mentalLabel} />
                        <MoodLevelCard />
                        <HealthJournalCard count={journalCount} done={journaledToday} />
                    </div>
                </section>

                {/* Daily Progress (Grid Layout) */}
                <section className="px-6">
                    <div className="flex justify-between items-center mb-5 px-2">
                        <div>
                            <h2 className="text-[#4B3425] font-black text-xl tracking-tight leading-none">Daily Progress</h2>
                            <p className="text-[#4B3425]/40 text-[10px] font-bold mt-1.5 uppercase tracking-widest">Track your wellness goals</p>
                        </div>
                        <Link href="/dashboard/insights" className="w-10 h-10 rounded-2xl bg-[#4B3425]/5 flex items-center justify-center text-[#4B3425] hover:bg-[#4B3425]/10 transition-colors">
                           <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <MindfulHoursCard totalMinutes={mindfulTotalToday} done={mindfulToday} />
                        <StressLevelCard level={liveStress} />
                        <div className="col-span-2">
                            <SleepQualityCard quality={assessment?.sleepQuality ?? null} liveQuality={liveSleepQuality} />
                        </div>
                        <MindfulJournalCard count={journalCount} />
                        <MoodTrackerCard />
                    </div>
                </section>

                {/* Discover Section - Library Access */}
                <section className="px-6">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h2 className="text-[#4B3425] font-black text-xl tracking-tight leading-none">Discover</h2>
                        <p className="text-[#4B3425]/40 text-[10px] font-bold uppercase tracking-widest">Master your mindfulness</p>
                    </div>
                    <Link href="/library" className="block w-full">
                        <div className="bg-[#4B3425] rounded-[32px] p-6 shadow-xl relative overflow-hidden group">
                            {/* Decorative Elements */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9BB068] to-transparent opacity-50" />
                            
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
                                        <BookOpen className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-lg leading-tight mb-0.5">Wellness Library</h4>
                                        <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Explore 50+ guided sessions</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#9BB068] flex items-center justify-center text-white shadow-lg shadow-[#9BB068]/20 group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* Action / Next Steps Section */}
                {mindfulHistory.length > 0 && (
                    <section className="px-6">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h2 className="text-[#4B3425] font-black text-xl tracking-tight leading-none">Next Steps</h2>
                            <p className="text-[#4B3425]/40 text-[10px] font-bold uppercase tracking-widest">Continue Your Journey</p>
                        </div>
                        <div className="bg-[#FDFBF9] p-5 rounded-[32px] shadow-sm border border-[#4B3425]/5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#9BB068]/10 flex items-center justify-center shadow-sm">
                                    <Play className="w-6 h-6 text-[#9BB068] fill-[#9BB068]" />
                                </div>
                                <div>
                                    <p className="text-[#9BB068] text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Resume Activity</p>
                                    <h4 className="text-[#4B3425] font-black text-base leading-tight">{mindfulHistory[0].activity}</h4>
                                    <p className="text-[#4B3425]/40 text-[10px] font-bold mt-0.5 uppercase tracking-widest">{mindfulHistory[0].category} · {Math.floor(mindfulHistory[0].plannedDuration || mindfulHistory[0].duration)}M</p>
                                </div>
                            </div>
                            <Link 
                                href={`/mindful/add?activityName=${encodeURIComponent(mindfulHistory[0].activity)}&duration=${Math.floor(mindfulHistory[0].plannedDuration || mindfulHistory[0].duration || 10)}`}
                                className="bg-[#4B3425] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 group-hover:bg-[#3A281D] transition-all"
                            >
                                Start
                            </Link>
                        </div>
                    </section>
                )}
            </div>

            <TabBar />
        </div>
    );
}

import { ArrowRight } from 'lucide-react';
