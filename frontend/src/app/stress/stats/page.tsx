'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStressStore } from '@/store/stressStore';
import Matter from 'matter-js';

const STRESS_CATEGORIES = [
  { id: 'calm', label: 'Calm', color: '#9BB068', levels: [1] },
  { id: 'normal', label: 'Normal', color: '#A69B93', levels: [0, 2] },
  { id: 'elevated', label: 'Elevated', color: '#FACC15', levels: [3] },
  { id: 'stressed', label: 'Stressed', color: '#F99B2A', levels: [4] },
  { id: 'extreme', label: 'Extreme', color: '#A78DF5', levels: [5] },
];

export default function StressStats() {
  const router = useRouter();
  const { history, fetchHistory, isLoading } = useStressStore();
  
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly'>('Monthly');
  const engineRef = useRef<Matter.Engine | null>(null);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Store DOM references to the ball elements to update them directly at 60fps for silky smooth un-bound physics
  const ballDomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    fetchHistory('user-1');
  }, [fetchHistory]);

  const statsData = useMemo(() => {
      let baseHistory = history;
      
      // Inject Preview Mock Volumes if no data exists or explicit preview mode toggled
      if (isPreview || history.length === 0) {
          if (timeframe === 'Weekly') {
              baseHistory = [
                ...Array(24).fill({ value: 1 }),
                ...Array(8).fill({ value: 2 }),
                ...Array(6).fill({ value: 3 }),
                ...Array(14).fill({ value: 4 }),
                ...Array(2).fill({ value: 5 })
              ];
          } else {
              baseHistory = [
                ...Array(97).fill({ value: 1 }),
                ...Array(33).fill({ value: 2 }),
                ...Array(25).fill({ value: 3 }),
                ...Array(58).fill({ value: 4 }),
                ...Array(8).fill({ value: 5 })
              ];
          }
      }

      // Timeframe filtering using strict timestamps dynamically checking your actual history items
      const filtered = (isPreview || history.length === 0) 
          ? baseHistory
          : baseHistory.filter(entry => {
               if (!entry.createdAt) return true;
               const entryDate = new Date(entry.createdAt);
               const cutoff = new Date();
               // Weekly = 7 days ago. Monthly = 30 days ago.
               cutoff.setDate(cutoff.getDate() - (timeframe === 'Weekly' ? 7 : 30));
               return entryDate >= cutoff;
          });

      const counts: Record<string, number> = {
          calm: 0, normal: 0, elevated: 0, stressed: 0, extreme: 0
      };

      filtered.forEach(entry => {
          if (entry.value === 1) counts.calm++;
          else if (entry.value === 0 || entry.value === 2) counts.normal++;
          else if (entry.value === 3) counts.elevated++;
          else if (entry.value === 4) counts.stressed++;
          else if (entry.value === 5) counts.extreme++;
      });

      return STRESS_CATEGORIES.map(cat => ({
          ...cat,
          count: counts[cat.id],
          // Calculate an organic physical radius bounded to look great on mobile screens
          // A base of 30 + scaled by amount ensures 0 isn't invisible but 100 isn't overflowing the physics sandbox
          radius: counts[cat.id] === 0 ? 0 : Math.max(35, Math.min(100, 30 + Math.sqrt(counts[cat.id]) * 7))
      })).filter(cat => cat.count > 0);
  }, [history, timeframe, isPreview]);

  // Physics Initialization Loop Engine
  useEffect(() => {
    if (!containerRef.current || statsData.length === 0) return;

    // Reset previous engine completely
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
    }

    const { clientWidth: width, clientHeight: height } = containerRef.current;
    
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1.2; // slightly heavier gravity feels more grounded and snappy
    engineRef.current = engine;

    // Static Boundaries (Invisible but physically rigid)
    const wallOptions = { isStatic: true, render: { visible: false }, friction: 0.1 };
    const ground = Matter.Bodies.rectangle(width / 2, height + 50, width * 2, 100, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions);
    
    // Create the dynamic bouncing physical rigid bodies
    const bodies = statsData.map((data, index) => {
       // Stagger their drops vertically and slightly randomly horizontally
       const startX = (width / 2) + (Math.random() * 40 - 20); 
       const startY = -150 - (index * 130); 
       
       return Matter.Bodies.circle(startX, startY, data.radius, {
           restitution: 0.6, // Bounciness
           friction: 0.5,
           density: 0.04, // Mass multiplier
           label: data.id,
           render: { visible: false } // We render completely using React DOM over top of it for crisper typography
       });
    });

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ...bodies]);

    let frameId: number;
    const runner = () => {
        Matter.Engine.update(engine, 1000 / 60);
        
        // Sync React DOM references precisely to the physics rigid bodies
        bodies.forEach((body, idx) => {
            const dom = ballDomRefs.current[body.label];
            if (dom) {
                // Correct for the radius explicitly via top/left offsets applied internally to the DOM
                dom.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
            }
        });
        
        frameId = requestAnimationFrame(runner);
    };
    runner();

    return () => {
       cancelAnimationFrame(frameId);
       Matter.World.clear(engine.world, false);
       Matter.Engine.clear(engine);
    };
  }, [statsData]);

  return (
    <div className="min-h-screen bg-[#FDFBFACD] flex flex-col font-sans relative overflow-hidden">
      {/* Top Nav Header */}
      <div className="w-full flex items-center pt-[50px] px-6 relative z-30">
        <button onClick={() => router.back()} className="w-[36px] h-[36px] rounded-full border border-[#4B3425]/20 flex items-center justify-center hover:bg-[#4B3425]/5 transition-colors absolute left-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 18L8 12L14 6" stroke="#4B3425" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button className="w-[36px] h-[36px] rounded-full border border-[#4B3425]/20 flex items-center justify-center hover:bg-[#4B3425]/5 transition-colors absolute right-6">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#4B3425" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15A1.65 1.65 0 0 0 21 13.35V10.65A1.65 1.65 0 0 0 19.4 9H18C17.7 8 17.3 7 16.7 6.2L17.7 5.2A1.65 1.65 0 0 0 17.7 2.85L15.8 0.95A1.65 1.65 0 0 0 13.45 0.95L12.45 1.95C11.65 1.65 10.65 1.65 9.85 1.95L8.85 0.95A1.65 1.65 0 0 0 6.5 0.95L4.6 2.85A1.65 1.65 0 0 0 4.6 5.2L5.6 6.2C5 7 4.6 8 4.3 9H2.9A1.65 1.65 0 0 0 1.25 10.65V13.35A1.65 1.65 0 0 0 2.9 15H4.3C4.6 16 5 17 5.6 17.8L4.6 18.8A1.65 1.65 0 0 0 4.6 21.15L6.5 23.05A1.65 1.65 0 0 0 8.85 23.05L9.85 22.05C10.65 22.35 11.65 22.35 12.45 22.05L13.45 23.05A1.65 1.65 0 0 0 15.8 23.05L17.7 21.15A1.65 1.65 0 0 0 17.7 18.8L16.7 17.8C17.3 17 17.7 16 18 15H19.4Z" stroke="#4B3425" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </button>
      </div>

      <div className="w-full flex flex-col items-center mt-[30px] z-30">
         <h1 className="text-[28px] font-extrabold text-[#4B3425] tracking-tight">Stress Level Stats</h1>
         
         {/* Configurable Filters Row */}
         <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-[300px] mt-4">
            {STRESS_CATEGORIES.map(cat => (
               <div key={cat.id} className="flex items-center gap-1.5">
                  <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-[12px] font-bold text-[#A69B93] tracking-wide">{cat.label}</span>
               </div>
            ))}
         </div>

         {/* Controls Segment (Moved to top to prevent ball overlap) */}
         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-6 mt-6 mb-2 z-30">
             <button 
                onClick={() => setTimeframe(t => t === 'Monthly' ? 'Weekly' : 'Monthly')}
                className="bg-[#4B3425] text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold tracking-wide shadow-sm hover:bg-[#3d2a1d] transition-colors"
             >
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 {timeframe}
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
             </button>
             
             <button 
                onClick={() => setIsPreview(!isPreview)}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-bold tracking-wide text-[13px] shadow-sm transition-colors border ${isPreview ? 'bg-[#9BB068] text-white border-transparent' : 'bg-white text-[#4B3425] border-[#EAECE4]'}`}
             >
                 {isPreview ? 'Viewing Hardcoded Preview' : 'Preview Target Volume'}
             </button>
         </div>
      </div>

      {/* Full Physics Collision Container */}
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden z-10 mt-[10px]">
          
          {/* Faded background aesthetic shapes corresponding to the design context */}
          <div className="absolute w-[80px] h-[80px] rounded-full bg-[#4B3425] opacity-[0.03] top-10 right-10"></div>
          <div className="absolute w-[180px] h-[180px] rounded-full bg-[#4B3425] opacity-[0.03] bottom-20 -left-10"></div>
          <div className="absolute w-[50px] h-[50px] rounded-full bg-[#4B3425] opacity-[0.03] bottom-40 right-4"></div>

          {/* Absolute physics bodies */}
          {statsData.map(data => (
              <div 
                 key={data.id}
                 ref={(el) => { ballDomRefs.current[data.id] = el }}
                 className="absolute top-0 left-0 rounded-full flex items-center justify-center text-white font-extrabold shadow-sm will-change-transform"
                 style={{ 
                    width: data.radius * 2, 
                    height: data.radius * 2, 
                    backgroundColor: data.color,
                    marginLeft: -Math.abs(data.radius), // Center correctly
                    marginTop: -Math.abs(data.radius),
                    fontSize: Math.max(16, data.radius / 1.5) + 'px',
                    lineHeight: '1'
                 }}
              >
                  {data.count}
              </div>
          ))}
      </div>

    </div>
  );
}
