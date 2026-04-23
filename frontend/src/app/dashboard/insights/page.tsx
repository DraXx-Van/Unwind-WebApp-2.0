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
} from 'lucide-react';

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

// ─── Library data (Lucide icons only) ────────────────────────────────────────
const LIBRARY = [
  { title: 'How sleep shapes your mood', tag: 'SLEEP', Icon: Moon, color: '#7C6AFF', bg: '#EEF0FF' },
  { title: 'Managing stress at work', tag: 'STRESS', Icon: Zap, color: '#FE814B', bg: '#FFF3ED' },
  { title: 'Mindfulness for beginners', tag: 'MINDFUL', Icon: Wind, color: '#9BB068', bg: '#F0F7E8' },
  { title: 'The power of journaling', tag: 'JOURNAL', Icon: PenLine, color: '#926247', bg: '#F5F0EC' },
];

// ─── Circular score ring ──────────────────────────────────────────────────────
function ScoreRing({ score, label }: { score: number | null; label: string | null }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = score != null ? circ * (score / 100) : 0;

  const ringColor =
    score == null   ? 'rgba(255,255,255,0.2)' :
    score >= 75     ? '#9BB068' :
    score >= 55     ? '#FFCE5C' :
    score >= 35     ? '#FE814B' : '#E05252';

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={ringColor} strokeWidth="9"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="z-10 text-center">
        {score != null ? (
          <>
            <p className="text-white font-black text-3xl leading-none">{score}</p>
            <p className="text-white/70 text-[11px] font-semibold mt-0.5">{label}</p>
          </>
        ) : (
          <p className="text-white/50 font-black text-2xl leading-none">--</p>
        )}
      </div>
    </div>
  );
}

// ─── Reusable header (matches dashboard exactly) ──────────────────────────────
function PageHeader({ dateStr }: { dateStr: string }) {
  return (
    <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-6 pb-8 mb-6 text-white shadow-lg relative z-10 overflow-hidden">
      <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none select-none" />
      <div className="flex justify-between items-center mb-5 relative z-10">
        <span className="text-sm font-medium opacity-80">{dateStr}</span>
        <button className="w-10 h-10 rounded-full bg-[#654630] flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF9500] rounded-full border border-[#4F3422]" />
        </button>
      </div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-11 h-11 rounded-full bg-[#654630] flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-[22px] font-black leading-tight">Today's Insights</h1>
          <p className="text-white/50 text-[12px] font-medium">Your mental wellness snapshot</p>
        </div>
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

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', {
      weekday: 'short', day: 'numeric', month: 'short',
    }));
    // Use authFetch so the JWT token is sent
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

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pb-32">
        <div className="bg-[#4F3422] rounded-b-[40px] px-6 pt-6 pb-8 mb-6">
          <div className="h-5 w-28 bg-white/10 rounded-full animate-pulse mb-5" />
          <div className="h-8 w-44 bg-white/10 rounded-full animate-pulse" />
        </div>
        <div className="px-6 flex flex-col gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-[24px] animate-pulse" />)}
        </div>
        <TabBar />
      </div>
    );
  }

  // ── Always render full layout ──────────────────────────────────────────────
  const completedCount = (data?.tasks ?? []).filter(t => completedTasks.has(t.id)).length;
  const totalTasks = (data?.tasks ?? []).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-36">
      <PageHeader dateStr={dateStr} />

      <div className="flex flex-col gap-5 px-6">

        {/* ── Score Card (matches FreudScoreCard style) ── */}
        <div className="bg-white rounded-[28px] shadow-sm overflow-hidden">
          <div className="flex items-stretch">
            {/* Left: score ring on brown bg */}
            <div className="bg-gradient-to-br from-[#4F3422] to-[#7A5236] p-5 flex items-center justify-center rounded-[28px]">
              <ScoreRing score={data?.score ?? null} label={data?.label ?? null} />
            </div>
            {/* Right: detail */}
            <div className="flex-1 px-5 py-4 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart2 className="w-3.5 h-3.5 text-[#926247]" />
                <span className="text-[#926247] text-[10px] font-black uppercase tracking-widest">Your Score</span>
              </div>
              {data?.score != null ? (
                <>
                  <p className="text-[#4F3422] font-black text-[32px] leading-none">{data.score}</p>
                  <p className="text-[#4F3422] font-bold text-[15px]">{data.label}</p>
                  <p className="text-[#4F3422]/40 text-[11px] mb-3">Based on your recent activity</p>
                  <div className={`inline-flex items-center gap-1 self-start rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    data.delta >= 0 ? 'bg-[#F0F7E8] text-[#3B5C1A]' : 'bg-[#FFF3ED] text-[#A4431B]'
                  }`}>
                    {data.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {data.delta >= 0 ? '+' : ''}{data.delta} from yesterday
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[#4F3422] font-black text-[32px] leading-none">--</p>
                  <p className="text-[#4F3422] font-bold text-[14px] mt-1">Score not ready yet</p>
                  <p className="text-[#4F3422]/50 text-[11px] mt-1 leading-snug">
                    Log your <Link href="/mood/log" className="text-[#9BB068] font-bold">mood</Link> and <Link href="/stress" className="text-[#FE814B] font-bold">stress</Link> to unlock your daily score.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Insights ── */}
        <div>
          <h2 className="text-[#4F3422] font-black text-[19px] mb-3">Today's Insights</h2>
          {(!data?.insights || data.insights.length === 0) ? (
            <div className="bg-white rounded-[20px] shadow-sm px-5 py-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#F5F0EC] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#926247]" />
              </div>
              <div className="flex-1">
                <p className="text-[#4F3422] font-bold text-[14px]">Log data for insights</p>
                <p className="text-[#4F3422]/50 text-[12px] mt-0.5">Log your mood, stress and sleep to get personalised insights</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {data.insights.map((insight, i) => {
                const route = insight.actionLink ?? null;
                const isCTA = insight.isLogPrompt === true;
                const cardClass = isCTA
                  ? 'border border-dashed border-[#D0C5BC] bg-white rounded-[20px] px-5 py-4 flex items-center gap-4 active:scale-[0.98] transition-all'
                  : 'bg-white shadow-sm rounded-[20px] px-5 py-4 flex items-center gap-4 active:scale-[0.98] transition-all';
                const inner = (
                  <>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${insightBg(insight.icon)}`}>
                      {insightIcon(insight.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#4F3422] font-bold text-[14px] leading-snug">{insight.title}</p>
                      <p className="text-[#4F3422]/50 text-[12px] leading-snug mt-0.5">{insight.subtitle}</p>
                    </div>
                    {isCTA
                      ? <span className="text-[10px] font-black text-[#926247] bg-[#F5F0EC] px-2 py-1 rounded-full flex-shrink-0">+ Log</span>
                      : <ChevronRight className="w-4 h-4 text-[#C5B8B0] flex-shrink-0" />}
                  </>
                );
                return route
                  ? <Link key={i} href={route} className={cardClass}>{inner}</Link>
                  : <div key={i} className={cardClass}>{inner}</div>;
              })}
            </div>
          )}
        </div>

        {/* ── Tasks ── */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[#4F3422] font-black text-[19px]">Today's Tasks</h2>
            {(data?.tasks?.length ?? 0) > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[#926247] text-[12px] font-bold">{completedCount}/{totalTasks} done</span>
                <Link href="/activities" className="text-[#926247] text-[12px] font-bold flex items-center gap-0.5 hover:opacity-70">
                  Browse <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {(!data?.tasks || data.tasks.length === 0) ? (
            <div className="bg-white rounded-[20px] shadow-sm px-5 py-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#F5F0EC] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#926247]" />
              </div>
              <div className="flex-1">
                <p className="text-[#4F3422] font-bold text-[14px]">Log data to get your tasks</p>
                <p className="text-[#4F3422]/50 text-[12px] mt-0.5">Your personalised daily tasks will appear once you log today's data</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thin progress bar */}
              <div className="h-1 bg-[#F0EBE6] rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-[#9BB068] rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }}
                />
              </div>

            <div className="flex flex-col gap-2.5">
              {data.tasks.map((task) => {
                const done = completedTasks.has(task.id);
                const { icon, bg } = taskIcon(task.type);
                const isNavigable = task.type !== 'real' && !!task.actionLink && !done;

                const cardContent = (
                  <>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-white/25' : bg
                    }`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-[15px] leading-snug ${done ? 'text-white' : 'text-[#4F3422]'}`}>
                        {task.title}
                      </p>
                      <p className={`text-[12px] leading-snug mt-0.5 ${done ? 'text-white/65' : 'text-[#4F3422]/50'}`}>
                        {task.description}
                      </p>
                    </div>
                    {/* Checkbox — always on the right */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTask(task.id); }}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        done ? 'border-white/40 bg-white/20' : 'border-[#E8DDD9] bg-transparent'
                      }`}>
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-white" />
                        : <Circle className="w-4 h-4 text-[#E8DDD9]" />}
                    </button>
                  </>
                );

                return isNavigable ? (
                  <Link key={task.id} href={task.actionLink!}
                    className={`rounded-[20px] shadow-sm px-5 py-4 flex items-center gap-4 transition-all duration-300 active:scale-[0.98] ${
                      done ? 'bg-[#9BB068]' : 'bg-white'
                    }`}>
                    {cardContent}
                  </Link>
                ) : (
                  <div key={task.id}
                    className={`rounded-[20px] shadow-sm px-5 py-4 flex items-center gap-4 transition-all duration-300 ${
                      done ? 'bg-[#9BB068]' : 'bg-white'
                    }`}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>

        {/* ── Library ── */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#4F3422] font-black text-[17px]">Library</h2>
            <button className="text-[#926247] text-[12px] font-bold flex items-center gap-0.5">
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LIBRARY.map((item, i) => (
              <div key={i} className="bg-white rounded-[20px] shadow-sm p-4 flex flex-col gap-3 cursor-pointer active:scale-95 transition-all">
                {/* Icon pill */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.bg }}>
                  <item.Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest"
                    style={{ color: item.color }}>{item.tag}</span>
                  <p className="text-[#4F3422] font-bold text-[12px] leading-snug mt-0.5">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <TabBar />
    </div>
  );
}
