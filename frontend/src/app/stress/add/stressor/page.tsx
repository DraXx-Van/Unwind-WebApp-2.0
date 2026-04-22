'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStressStore } from '@/store/stressStore';

const VALID_STRESSORS = ['None', 'Work', 'Life', 'Friendship', 'Kids', 'Finance', 'Loneliness', 'Other'];

// AI Impact Mapping Logic for specific selected stressors
const IMPACT_MAPPING: Record<string, string> = {
  'None': 'Zero',
  'Work': 'High',
  'Life': 'Moderate',
  'Friendship': 'Low',
  'Kids': 'Moderate',
  'Finance': 'High',
  'Loneliness': 'Very High',
  'Other': 'Moderate'
};

function StressorSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addEntry, isLoading } = useStressStore();

  const [selectedStressor, setSelectedStressor] = useState('Loneliness');
  // Extracted Level from previous Screen
  const level = parseInt(searchParams.get('level') || '3', 10);

  // Position bubbles relative to center mathematically
  // Spread widely across 360 degrees to heavily fill all empty negative spaces
  // Top: -90, Right: 0, Down: 90, Left: 180
  const BUBBLE_CONFIGS = [
    { label: 'None',      angle: -90,   distance: 130, size: 60 },   // Small
    { label: 'Work',      angle: -38,   distance: 145, size: 95 },   // Extra Large
    { label: 'Life',      angle: 13,    distance: 135, size: 75 },   // Medium
    { label: 'Kids',      angle: 64,    distance: 120, size: 65 },   // Medium Small
    { label: 'Finance',   angle: 116,   distance: 155, size: 90 },   // Large
    { label: 'Other',     angle: 167,   distance: 125, size: 70 },   // Small
    { label: 'Friendship',angle: 218,   distance: 140, size: 85 },   // Medium Large
  ];

  const handleSave = async () => {
    const impact = IMPACT_MAPPING[selectedStressor] || 'Moderate';
    await addEntry('user-1', {
      value: level,
      stressor: selectedStressor,
      impact: impact,
    });
    router.push('/stress');
  };

  const getBubbleStyle = (config: any, isCenter: boolean) => {
     if (isCenter) {
        return {
           transform: 'translate(-50%, -50%) scale(1)',
           left: '50%',
           top: '50%',
           width: '180px',
           height: '180px',
           zIndex: 20
        };
     }
     
     // Math for absolute translation
     const rad = (config.angle * Math.PI) / 180;
     const x = Math.cos(rad) * config.distance;
     const y = Math.sin(rad) * config.distance;

     return {
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
        left: '50%',
        top: '50%',
        width: `${config.size}px`,
        height: `${config.size}px`,
        zIndex: 10
     };
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] flex flex-col font-sans relative overflow-x-hidden">
      {/* Top Nav */}
      <div className="w-full flex items-center pt-[50px] px-6 relative z-20">
        <button onClick={() => router.back()} className="w-[36px] h-[36px] rounded-full border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors absolute left-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 18L8 12L14 6" stroke="#4B3425" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-[8vh] pb-32">
        {/* Title Block */}
        <div className="px-6 mb-[4vh] flex flex-col items-center text-center">
           <h1 className="text-[28px] font-extrabold text-[#4B3425] leading-tight tracking-tight">Select Stressors</h1>
           <p className="text-[14px] text-[#A69B93] mt-2 font-medium leading-relaxed max-w-[280px]">
             Our AI will decide how your stressor will impacts your life in general.
           </p>
        </div>

        {/* Interactive Floating Bubbles Area */}
        <div className="relative w-full flex-1 flex items-center justify-center min-h-[400px]">
            {VALID_STRESSORS.map((stressor) => {
               const isSelected = selectedStressor === stressor;
               const bgColor = isSelected ? 'bg-[#9BB068]' : 'bg-[#EAECE4]';
               const textColor = isSelected ? 'text-white' : 'text-[#C7C2BE]';
               
               let styleConfig;
               if (isSelected) {
                   styleConfig = getBubbleStyle(null, true);
               } else {
                   // Map others to dynamic external slots predictably
                   // We just filter out the selected one to assign slots
                   const others = VALID_STRESSORS.filter(s => s !== selectedStressor);
                   const index = others.indexOf(stressor);
                   styleConfig = getBubbleStyle(BUBBLE_CONFIGS[index], false);
               }

               return (
                  <button
                     key={stressor}
                     onClick={() => setSelectedStressor(stressor)}
                     className={`absolute rounded-full flex items-center justify-center font-extrabold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${bgColor} ${textColor} shadow-sm`}
                     style={styleConfig}
                  >
                     <span className={`${isSelected ? 'text-[22px]' : 'text-[13px]'} transition-all duration-500`}>
                        {stressor}
                     </span>
                  </button>
               );
            })}
        </div>

      </div>

      {/* Sticky Bottom Form Logic */}
      <div className="absolute bottom-8 left-0 px-6 w-full z-20 flex flex-col gap-4">
          <div className="w-full border border-[#FE814B] bg-[#FFF8F5] py-[16px] rounded-[18px] flex items-center px-4 gap-3 shadow-sm">
             <div className="text-[#FE814B]">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17.01L12.01 16.9989" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 2.89C11.66 1.7 12.34 1.7 13 2.89L22.25 18.25C22.95 19.5 22.39 21 21.05 21H2.95C1.61 21 1.05 19.5 1.75 18.25L11 2.89Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
             </div>
             <span className="text-[#4B3425] text-[13px] font-extrabold tracking-wide">
                Life Impact: {IMPACT_MAPPING[selectedStressor]}
             </span>
          </div>

          <button 
             onClick={handleSave}
             disabled={isLoading}
             className="w-full bg-[#4B3425] text-white py-[20px] rounded-[32px] font-extrabold text-[16px] tracking-wide hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_8px_30px_rgba(75,52,37,0.2)] flex items-center justify-center gap-3 disabled:opacity-70"
          >
             {isLoading ? 'Saving...' : 'Continue'}
             {!isLoading && (
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             )}
          </button>
      </div>
    </div>
  );
}

// Fallback for Suspense requirement
export default function AddStressorBubbles() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBFACD] flex items-center justify-center font-bold text-[#4B3425]">Loading...</div>}>
      <StressorSelectionContent />
    </Suspense>
  );
}
