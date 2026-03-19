'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSleepStore } from '@/store/sleepStore';
import Link from 'next/link';
import { ArrowRight, Activity, Heart } from 'lucide-react';

export default function SleepStatsPage() {
  const router = useRouter();
  const { latestEntry, fetchLatest } = useSleepStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchLatest('user-1');
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, [fetchLatest]);

  const duration = latestEntry?.duration ?? 0;

  // ── Phase breakdown (science-based estimates) ───────────────────────────────
  // REM  ~25%   | Core (light) ~55%  | Deep (Post) ~20%
  const remHours = parseFloat((duration * 0.25).toFixed(2));
  const coreHours = parseFloat((duration * 0.55).toFixed(2));
  const deepMins = Math.round(duration * 0.20 * 60); // convert to minutes for Post

  // ── SVG ring geometry  (viewBox 340 × 340, centre 170,170) ──────────────────
  // Outer (dark grey) = total sleep  |  Middle (green) = Core  |  Inner (orange) = REM
  const CX = 170, CY = 170;
  const outerR = 128, midR = 98, innerR = 68;
  const sw = 20; // stroke width

  const circum = (r: number) => 2 * Math.PI * r;
  const offset = (r: number, pct: number) => circum(r) * (1 - pct);

  // Fill percentages relative to a max of 12 h
  const maxH = 12;
  const outerPct = Math.min(duration / maxH, 1);
  const midPct = Math.min(coreHours / maxH, 1);
  const innerPct = Math.min(remHours / maxH, 1);

  // Dot position helper (angle measured from top, going clockwise)
  const dotXY = (r: number, pct: number) => {
    // SVG is rotated -90° so angle 0 = right in the original → adjust
    const angleDeg = pct * 360 - 90; // -90 accounts for SVG -rotate-90
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: CX + r * Math.cos(rad),
      y: CY + r * Math.sin(rad),
    };
  };

  const outerDot = dotXY(outerR, outerPct);
  const midDot = dotXY(midR, midPct);
  const innerDot = dotXY(innerR, innerPct);

  return (
    <div
      className="min-h-screen flex flex-col items-center font-sans"
      style={{ background: '#fdfbf9' }}
    >
      {/* ── Header ── */}
      <div className="mt-16 mb-6 flex flex-col items-center">
        <p className="text-[#4B3425]/70 font-semibold text-lg mb-1">You Slept for</p>
        <div className="flex items-baseline text-[#4B3425]">
          <span className="text-[80px] font-extrabold leading-none tracking-tighter">
            {duration > 0 ? duration.toFixed(2) : '--'}
          </span>
          <span className="text-[40px] font-semibold ml-1">h</span>
        </div>
      </div>

      {/* ── Concentric Rings ── */}
      <div className="relative w-[340px] h-[340px] flex-shrink-0">
        <svg
          width="340"
          height="340"
          viewBox="0 0 340 340"
          className="-rotate-90"
        >
          {/* ── Track circles (background) ── */}
          <circle cx={CX} cy={CY} r={outerR} fill="none" stroke="#DDDAD5" strokeWidth={sw} />
          <circle cx={CX} cy={CY} r={midR} fill="none" stroke="#DDDAD5" strokeWidth={sw} />
          <circle cx={CX} cy={CY} r={innerR} fill="none" stroke="#DDDAD5" strokeWidth={sw} />

          {/* ── Progress: Outer (dark grey = total sleep) ── */}
          <circle
            cx={CX} cy={CY} r={outerR}
            fill="none"
            stroke="#7E7771"
            strokeWidth={sw}
            strokeDasharray={circum(outerR)}
            strokeDashoffset={mounted ? offset(outerR, outerPct) : circum(outerR)}
            strokeLinecap="round"
            className="transition-all duration-[1200ms] ease-out"
          />

          {/* ── Progress: Middle (green = Core) ── */}
          <circle
            cx={CX} cy={CY} r={midR}
            fill="none"
            stroke="#9BB068"
            strokeWidth={sw}
            strokeDasharray={circum(midR)}
            strokeDashoffset={mounted ? offset(midR, midPct) : circum(midR)}
            strokeLinecap="round"
            className="transition-all duration-[1200ms] ease-out delay-150"
          />

          {/* ── Progress: Inner (orange = REM) ── */}
          <circle
            cx={CX} cy={CY} r={innerR}
            fill="none"
            stroke="#FE814B"
            strokeWidth={sw}
            strokeDasharray={circum(innerR)}
            strokeDashoffset={mounted ? offset(innerR, innerPct) : circum(innerR)}
            strokeLinecap="round"
            className="transition-all duration-[1200ms] ease-out delay-300"
          />
        </svg>

        {/* ── End-cap icon dots (absolute, rotated back) ── */}
        {mounted && duration > 0 && (
          <>
            {/* Outer dot (grey ring) */}
            <div
              className="absolute w-7 h-7 bg-white rounded-full shadow flex items-center justify-center"
              style={{ left: outerDot.x - 14, top: outerDot.y - 14 }}
            >
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#7E7771]" />
            </div>

            {/* Middle dot (green ring) */}
            <div
              className="absolute w-7 h-7 bg-[#9BB068] rounded-full shadow flex items-center justify-center"
              style={{ left: midDot.x - 14, top: midDot.y - 14 }}
            >
              <Activity className="w-4 h-4 text-white" />
            </div>

            {/* Inner dot (orange ring) */}
            <div
              className="absolute w-7 h-7 bg-[#FE814B] rounded-full shadow flex items-center justify-center"
              style={{ left: innerDot.x - 14, top: innerDot.y - 14 }}
            >
              <Heart className="w-4 h-4 text-white" />
            </div>
          </>
        )}
      </div>

      {/* ── Stats Breakdown ── */}
      <div className="flex justify-center gap-10 mt-8 px-8 w-full">
        {/* REM */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#4B3425]/50 text-xs font-bold uppercase tracking-widest">REM</span>
          <span className="text-[#4B3425] font-extrabold text-[22px] leading-none">{remHours}h</span>
          <div className="w-14 h-14 bg-[#9BB068] rounded-full flex items-center justify-center shadow-md mt-1">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Core */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#4B3425]/50 text-xs font-bold uppercase tracking-widest">Core</span>
          <span className="text-[#4B3425] font-extrabold text-[22px] leading-none">{coreHours}h</span>
          <div className="w-14 h-14 bg-[#FE814B] rounded-full flex items-center justify-center shadow-md mt-1">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Post (Deep) */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#4B3425]/50 text-xs font-bold uppercase tracking-widest">Post</span>
          <span className="text-[#4B3425] font-extrabold text-[22px] leading-none">{deepMins}min</span>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mt-1 border-2 border-[#DDDAD5]">
            <div className="w-4 h-4 rounded-full border-2 border-[#7E7771]" />
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-auto w-full px-6 pb-10 pt-10">
        <Link
          href="/sleep"
          className="w-full bg-[#3B2B1E] text-white py-4 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all gap-3"
        >
          <span className="font-bold text-lg">Got It, Thanks!</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
