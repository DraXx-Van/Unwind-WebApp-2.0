'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TabBar } from '@/components/dashboard/TabBar';
import { authFetch } from '@/lib/api';
import {
  Bell, BedDouble, Zap, SmilePlus, BookOpen,
  Wind, Brain, ChevronRight, ArrowRight, CheckCircle2, Circle,
  Sparkles, TrendingUp, TrendingDown, BarChart2,
  Moon, HeartPulse, PenLine, Dumbbell,
  Search, Filter, Activity, Info, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Insight {
  icon: string; title: string; subtitle: string;
  isLogPrompt?: boolean; actionLink?: string;
}
interface Task { id: string; title: string; description: string; type: string; actionLink: string; }
interface InsightsData {
  score: number | null; label: string | null; delta: number;
  scoreIncomplete?: boolean;
  insights: Insight[]; tasks: Task[];
  today: { mood: any; stress: any; sleep: any; };
  weekly: { mood: number | null; stress: number | null; sleep: number | null; };
  state: 'empty' | 'partial' | 'ready';
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function insightIcon(icon: string) {
  if (icon === 'sleep')      return <BedDouble className="w-5 h-5 text-[#7C6AFF]" />;
  if (icon === 'stress')     return <Zap className="w-5 h-5 text-[#FE814B]" />;
  if (icon === 'combo')      return <HeartPulse className="w-5 h-5 text-[#E05252]" />;
  if (icon === 'journal')    return <PenLine className="w-5 h-5 text-[#926247]" />;
  if (icon === 'mindful')    return <Wind className="w-5 h-5 text-[#9BB068]" />;
  if (icon === 'log-mood')   return <SmilePlus className="w-5 h-5 text-[#9BB068]" />;
  if (icon === 'log-stress') return <Zap className="w-5 h-5 text-[#FE814B]" />;
  if (icon === 'log-sleep')  return <BedDouble className="w-5 h-5 text-[#7C6AFF]" />;
  return <SmilePlus className="w-5 h-5 text-[#9BB068]" />;
}

function insightBg(icon: string) {
  if (icon === 'sleep' || icon === 'log-sleep')   return 'bg-[#EEF0FF]';
  if (icon === 'stress' || icon === 'log-stress') return 'bg-[#FFF3ED]';
  if (icon === 'combo')                           return 'bg-[#FFF0F0]';
  if (icon === 'journal')                         return 'bg-[#F5F0EC]';
  if (icon === 'mindful')                         return 'bg-[#F0F7E8]';
  return 'bg-[#F0F7E8]';
}

function taskIcon(type: string): { icon: React.ReactNode; bg: string } {
  if (type === 'mindful') return { icon: <Wind className="w-5 h-5 text-white" />, bg: 'bg-[#7C6AFF]' };
  if (type === 'stress' || type === 'system') return { icon: <Zap className="w-5 h-5 text-white" />, bg: 'bg-[#FE814B]' };
  if (type === 'real') return { icon: <Brain className="w-5 h-5 text-white" />, bg: 'bg-[#9BB068]' };
  return { icon: <BookOpen className="w-5 h-5 text-white" />, bg: 'bg-[#926247]' };
}

// ─── Library data ────────────────────────────────────────────────────────────
const LIBRARY = [
  { title: 'Sleep & Mood', tag: 'SLEEP', Icon: Moon, color: '#7C6AFF', bg: '#EEF0FF' },
  { title: 'Stress Management', tag: 'STRESS', Icon: Zap, color: '#FE814B', bg: '#FFF3ED' },
  { title: 'Mindfulness 101', tag: 'MINDFUL', Icon: Wind, color: '#9BB068', bg: '#F0F7E8' },
  { title: 'Journaling Benefits', tag: 'JOURNAL', Icon: PenLine, color: '#926247', bg: '#F5F0EC' },
];

// ─── Circular score ring ──────────────────────────────────────────────────────
function ScoreRing({ score, label, dark = false }: { score: number | null; label: string | null; dark?: boolean }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = score != null ? circ * (score / 100) : 0;

  const ringColor =
    score == null   ? (dark ? 'rgba(75,52,37,0.1)' : 'rgba(255,255,255,0.2)') :
    score >= 75     ? '#9BB068' :
    score >= 55     ? '#FFCE5C' :
    score >= 35     ? '#FE814B' : '#E05252';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={dark ? "rgba(75,52,37,0.06)" : "rgba(255,255,255,0.1)"} strokeWidth="10" />
        <motion.circle
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="50" cy="50" r={r} fill="none"
          stroke={ringColor} strokeWidth="10"
          strokeDasharray={circ}
          strokeLinecap="round"
        />
      </svg>
      <div className="z-10 text-center">
        {score != null ? (
          <>
            <p className={`font-black text-4xl leading-none tracking-tighter ${dark ? 'text-[#4B3425]' : 'text-white'}`}>{score}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${dark ? 'text-[#4B3425]/40' : 'text-white/60'}`}>PTS</p>
          </>
        ) : (
          <p className="text-[#4B3425]/20 font-black text-2xl leading-none">--</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [dateStr, setDateStr] = useState('');
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const now = new Date();
    setDateStr(now.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long',
    }));

    const first = now.getDate() - now.getDay();
    const last = first + 6;
    const firstDay = new Date(new Date().setDate(first));
    const lastDay = new Date(new Date().setDate(last));
    const range = `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    setWeekRange(range);

    authFetch('/insights/today')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4B3425]/10 border-t-[#4B3425] rounded-full animate-spin" />
          <p className="text-[#4B3425]/40 font-black uppercase tracking-widest text-xs">Analyzing Insights...</p>
        </div>
        <TabBar />
      </div>
    );
  }

  // ── Dynamic Factor Helpers (Weekly Averages) ────────────────────────────────
  // Safe access using optional chaining and nullish coalescing to prevent TypeError
  const getSleepStatus = () => {
    const dur = data?.weekly?.sleep;
    if (dur === undefined || dur === null) return { label: 'No Data', color: 'text-[#4B3425]/40', bg: 'bg-[#4B3425]/5' };
    if (dur >= 7) return { label: 'Healthy', color: 'text-[#7C6AFF]', bg: 'bg-[#EEF0FF]' };
    if (dur >= 6) return { label: 'Okay', color: 'text-[#7C6AFF]', bg: 'bg-[#EEF0FF]' };
    return { label: 'Poor', color: 'text-[#E05252]', bg: 'bg-[#FFF0F0]' };
  };

  const getStressStatus = () => {
    const val = data?.weekly?.stress;
    if (val === undefined || val === null) return { label: 'No Data', color: 'text-[#4B3425]/40', bg: 'bg-[#4B3425]/5' };
    if (val <= 2.2) return { label: 'Low', color: 'text-[#9BB068]', bg: 'bg-[#F0F7E8]' };
    if (val <= 3.5) return { label: 'Normal', color: 'text-[#FE814B]', bg: 'bg-[#FFF3ED]' };
    return { label: 'High', color: 'text-[#E05252]', bg: 'bg-[#FFF0F0]' };
  };

  const getMoodStatus = () => {
    const avgMood = data?.weekly?.mood;
    if (avgMood === undefined || avgMood === null) return { label: 'No Data', color: 'text-[#4B3425]/40', bg: 'bg-[#4B3425]/5' };
    if (avgMood >= 3.8) return { label: 'Positive', color: 'text-[#9BB068]', bg: 'bg-[#F0F7E8]' };
    if (avgMood >= 2.8) return { label: 'Neutral', color: 'text-[#FE814B]', bg: 'bg-[#FFF3ED]' };
    return { label: 'Low', color: 'text-[#E05252]', bg: 'bg-[#FFF0F0]' };
  };

  const sleep = getSleepStatus();
  const stress = getStressStatus();
  const mood = getMoodStatus();

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-32">
      
      {/* Brown Header Section */}
      <div className="bg-[#4B3425] rounded-b-[48px] pt-16 pb-32 px-8 relative overflow-hidden">
        <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none" />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">{dateStr}</p>
              <h1 className="text-white text-3xl font-black tracking-tight leading-none">Weekly Insights</h1>
            </div>
            <button className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white relative mt-1">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FE814B] rounded-full border-2 border-[#4B3425]" />
            </button>
          </div>
          
          {/* Week Selector / Indicator */}
          <div className="mt-6 flex items-center gap-3">
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white font-black text-xs uppercase tracking-widest">{weekRange}</span>
             </div>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Week</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-20 relative z-20 space-y-10">
        
        {/* Wellness Index Card */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[40px] p-7 shadow-[0_30px_70px_rgba(75,52,37,0.15)] border border-white flex flex-col relative overflow-hidden group"
        >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BB068]/5 rounded-full blur-3xl group-hover:bg-[#9BB068]/10 transition-colors pointer-events-none" />
            
            <div className="flex items-center gap-8 relative z-10">
              <ScoreRing score={data?.score ?? null} label={data?.label ?? null} dark={true} />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#4B3425]/5 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#4B3425]" />
                  </div>
                  <span className="text-[#4B3425]/40 text-[10px] font-black uppercase tracking-widest">Wellness Index</span>
                </div>

                {data?.score ? (
                  <>
                    <h2 className="text-[#4B3425] text-3xl font-black mb-2 leading-none">{data.label}</h2>
                    <div className="flex items-center gap-3">
                       <div className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black shadow-sm ${
                         data.delta >= 0 ? 'bg-[#9BB068] text-white' : 'bg-[#FE814B] text-white'
                       }`}>
                         {data.delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                         {data.delta >= 0 ? '+' : ''}{data.delta}% Trend
                       </div>
                    </div>
                  </>
                ) : (
                  <p className="text-[#4B3425]/30 text-xs font-bold leading-relaxed pr-8">Complete daily logs to unlock your personalized score.</p>
                )}
              </div>
            </div>

            {/* Weekly Performance Breakdown */}
            <div className="mt-8 pt-8 border-t border-[#4B3425]/5 grid grid-cols-3 gap-4 relative z-10">
              <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${sleep.bg}`}>
                    <Moon className={`w-6 h-6 ${sleep.color}`} />
                  </div>
                  <p className="text-[#4B3425] font-black text-xs">Sleep</p>
                  <p className={`${sleep.color} text-[9px] font-black uppercase tracking-widest mt-1`}>{sleep.label}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${stress.bg}`}>
                    <Zap className={`w-6 h-6 ${stress.color}`} />
                  </div>
                  <p className="text-[#4B3425] font-black text-xs">Stress</p>
                  <p className={`${stress.color} text-[9px] font-black uppercase tracking-widest mt-1`}>{stress.label}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${mood.bg}`}>
                    <SmilePlus className={`w-6 h-6 ${mood.color}`} />
                  </div>
                  <p className="text-[#4B3425] font-black text-xs">Mood</p>
                  <p className={`${mood.color} text-[9px] font-black uppercase tracking-widest mt-1`}>{mood.label}</p>
              </div>
            </div>
            
            {/* Context Label */}
            <div className="mt-4 flex items-center justify-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-[#4B3425]/20" />
               <p className="text-[#4B3425]/30 text-[9px] font-black uppercase tracking-widest">7-Day Performance Averages</p>
               <div className="w-1 h-1 rounded-full bg-[#4B3425]/20" />
            </div>
        </motion.div>

        {/* Focus Tasks Section */}
        <section>
          <div className="flex justify-between items-end mb-5 px-2">
            <div>
              <h2 className="text-[#4B3425] text-xl font-black tracking-tight">Focus Tasks</h2>
              <p className="text-[#4B3425]/40 text-xs font-bold mt-1">Recommended for your state</p>
            </div>
            <div className="text-right">
              <p className="text-[#4B3425] text-xs font-black mb-1.5">{data?.tasks ? (data.tasks.filter(t => completedTasks.has(t.id)).length) : 0}/{data?.tasks ? data.tasks.length : 0} Done</p>
              <div className="w-20 h-1.5 bg-[#4B3425]/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(data?.tasks && data.tasks.length > 0) ? (data.tasks.filter(t => completedTasks.has(t.id)).length / data.tasks.length) * 100 : 0}%` }}
                  className="h-full bg-[#9BB068]" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {data?.tasks && data.tasks.length > 0 ? (
              data.tasks.map((task) => {
                const done = completedTasks.has(task.id);
                const { icon, bg } = taskIcon(task.type);
                
                return (
                  <motion.div
                    layout
                    key={task.id}
                    className={`group relative overflow-hidden rounded-[28px] p-5 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-white transition-all ${
                      done ? 'bg-[#9BB068] text-white' : 'bg-white text-[#4B3425]'
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        done ? 'bg-white/20' : bg
                      }`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-black text-base leading-tight mb-0.5 ${done ? 'text-white' : 'text-[#4B3425]'}`}>
                          {task.title}
                        </h4>
                        <p className={`text-xs font-bold line-clamp-1 ${done ? 'text-white/70' : 'text-[#4B3425]/40'}`}>
                          {task.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          done ? 'bg-white border-white' : 'bg-transparent border-[#4B3425]/10'
                        }`}
                      >
                        {done ? <CheckCircle2 className="w-6 h-6 text-[#9BB068]" /> : <Circle className="w-6 h-6 text-[#4B3425]/10" />}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white rounded-[28px] p-8 text-center border-2 border-dashed border-[#4B3425]/5">
                <Sparkles className="w-8 h-8 text-[#4B3425]/10 mx-auto mb-3" />
                <p className="text-[#4B3425]/40 text-sm font-black">Log data to unlock tasks</p>
              </div>
            )}
          </div>
        </section>

        {/* Growth Insights */}
        <section>
          <h2 className="text-[#4B3425] text-xl font-black tracking-tight mb-4 px-2">Growth Insights</h2>
          <div className="grid grid-cols-1 gap-4">
            {data?.insights && data.insights.length > 0 ? (
              data.insights.map((insight, i) => {
                const isCTA = insight.isLogPrompt === true;
                return (
                  <Link 
                    key={i} 
                    href={insight.actionLink || '#'} 
                    className={`flex items-center gap-4 p-5 rounded-[28px] shadow-sm transition-all active:scale-[0.98] ${
                      isCTA ? 'bg-[#4B3425] text-white' : 'bg-white border border-[#4B3425]/5'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      isCTA ? 'bg-white/10' : insightBg(insight.icon)
                    }`}>
                      {insightIcon(insight.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-black text-[15px] leading-tight mb-1 ${isCTA ? 'text-white' : 'text-[#4B3425]'}`}>
                        {insight.title}
                      </h4>
                      <p className={`text-xs font-bold leading-snug ${isCTA ? 'text-white/60' : 'text-[#4B3425]/40'}`}>
                        {insight.subtitle}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isCTA ? 'bg-[#9BB068] text-white' : 'bg-[#4B3425]/5 text-[#4B3425]'
                    }`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="bg-white rounded-[28px] p-8 text-center border-2 border-dashed border-[#4B3425]/5">
                <p className="text-[#4B3425]/40 text-sm font-black">No insights available yet</p>
              </div>
            )}
          </div>
        </section>

      </div>

      <TabBar />
    </div>
  );
}
