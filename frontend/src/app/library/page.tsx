
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Search, SlidersHorizontal, ArrowRight, Sparkles, X } from 'lucide-react';
import { LIBRARY_ACTIVITIES, ActivityCategory, Activity } from '@/data/libraryActivities';
import { ActivityCard } from '@/components/library/ActivityCard';
import { LibraryCategoryFilter } from '@/components/library/LibraryCategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { TabBar } from '@/components/dashboard/TabBar';

export default function LibraryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState<ActivityCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);

    // Generate dynamic recommendations on mount
    useEffect(() => {
        const shuffled = [...LIBRARY_ACTIVITIES].sort(() => 0.5 - Math.random());
        setRecommendedActivities(shuffled.slice(0, 2));
    }, []);

    // Handle initial category from query params
    useEffect(() => {
        const cat = searchParams.get('category') as ActivityCategory;
        if (cat && LIBRARY_ACTIVITIES.some(a => a.category === cat)) {
            setActiveCategory(cat);
        }
    }, [searchParams]);

    const filteredActivities = useMemo(() => {
        return LIBRARY_ACTIVITIES.filter(activity => {
            const matchesCategory = activeCategory === 'all' || activity.category === activeCategory;
            const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 activity.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32 font-sans">
            {/* Header Section - Premium Brand Pattern */}
            <div className="bg-[#4B3425] rounded-b-[3.5rem] pt-12 pb-14 px-6 shadow-xl relative overflow-hidden z-20">
                {/* Brand Background Pattern */}
                <img 
                    src="/assets/Journal_assets/bg.svg" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0" 
                />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 active:scale-90"
                        >
                            <ChevronLeft className="text-white w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                             <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-[#9BB068]" />
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Toolkit</span>
                            </div>
                             <button 
                                onClick={() => setIsSearching(!isSearching)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all active:scale-90 ${isSearching ? 'bg-[#9BB068] border-[#9BB068]' : 'bg-white/10'}`}
                             >
                                {isSearching ? <X className="text-white w-5 h-5" /> : <Search className="text-white w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="px-2">
                        <AnimatePresence mode="wait">
                            {isSearching ? (
                                <motion.div
                                    key="search-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="mb-4"
                                >
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                        <input 
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search exercises..."
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/30 outline-none focus:bg-white/20 transition-all font-black text-lg"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="header-text"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Your Wellness Toolkit</p>
                                    <h1 className="text-white text-4xl font-black tracking-tight mb-2 leading-none">Activity Library</h1>
                                    <p className="text-white/40 font-bold text-lg leading-tight">Curated paths to inner peace</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Recommended Section (Dynamic) - Hide when searching */}
            {!searchQuery && activeCategory === 'all' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 px-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[#4B3425] text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                            Recommended for you
                            <span className="bg-[#9BB068]/10 text-[#9BB068] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-black">AI Picks</span>
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recommendedActivities.map((activity, idx) => (
                            <motion.div
                                key={`rec-${activity.id}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                            >
                                <ActivityCard activity={activity} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Category Section */}
            <div className="mt-10">
                <div className="px-6 mb-4 flex items-center justify-between">
                    <h2 className="text-[#4B3425] text-xl font-black uppercase tracking-tight">Explore by State</h2>
                    <SlidersHorizontal className="w-5 h-5 text-[#4B3425]/20" />
                </div>
                <LibraryCategoryFilter 
                    activeCategory={activeCategory} 
                    onCategoryChange={setActiveCategory} 
                />
            </div>

            {/* Activity List */}
            <div className="px-6 mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#4B3425] text-xl font-black uppercase tracking-tight">
                        {searchQuery ? 'Search Results' : (activeCategory === 'all' ? 'All Activities' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Relief`)}
                    </h2>
                    <span className="text-[#4B3425]/30 text-[10px] font-black uppercase tracking-widest">{filteredActivities.length} available</span>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredActivities.map((activity) => (
                            <motion.div
                                key={activity.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ActivityCard activity={activity} />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredActivities.length === 0 && (
                        <div className="py-20 text-center opacity-40">
                            <Search className="w-12 h-12 mx-auto mb-4 text-[#4B3425]" />
                            <h3 className="text-[#4B3425] font-black text-lg">No activities found</h3>
                            <p className="text-[#4B3425]/60 font-bold">Try searching for something else</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Bar */}
            <TabBar />
        </div>
    );
}
