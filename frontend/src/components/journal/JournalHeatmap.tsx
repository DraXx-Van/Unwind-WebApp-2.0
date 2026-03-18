
import { Journal } from '@/store/journalStore';
import { format, eachDayOfInterval, subDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import Link from 'next/link';

interface JournalHeatmapProps {
    journals: Journal[];
}

export function JournalHeatmap({ journals }: JournalHeatmapProps) {
    // Generate last 28 days for the view (4 weeks), aligned to start on Monday
    const today = new Date();
    // Go back 3 weeks + current week to show a full 4-week grid
    const startDate = startOfWeek(subDays(today, 21), { weekStartsOn: 1 }); // Start 3 weeks back on Monday
    const endDate = endOfWeek(today, { weekStartsOn: 1 }); // End this Sunday

    // Ensure we have exactly 28 days (4 rows) or just fill until end of this week
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getEmotionScore = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'overjoyed': return 3;
            case 'happy': return 2;
            case 'calm': return 1;
            case 'neutral': return 0;
            case 'sad': return -2;
            case 'angry': return -2;
            case 'depressed': return -3;
            default: return 0;
        }
    };

    const getScoreColor = (score: number) => {
        if (score > 0) return 'bg-[#9BB068]'; // Positive (Green)
        if (score < 0) return 'bg-[#FE814B]'; // Negative (Orange)
        return 'bg-[#926247]'; // Neutral (Brown)
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#4F3422] font-bold text-lg">Journal Statistics</h3>
                <Link href="/journal/history" className="text-[#9BB068] text-sm font-bold">See All</Link>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-3 mb-2 text-center">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span key={i} className="text-[#926247]/50 text-xs font-bold">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3 mb-6">
                {days.map((day: Date, i: number) => {
                    // Find all journals for this day
                    const dayJournals = journals.filter(j => isSameDay(new Date(j.createdAt), day));

                    let color = 'bg-[#F7F4F2]';

                    if (dayJournals.length > 0) {
                        // Calculate average score
                        const totalScore = dayJournals.reduce((sum, j) => sum + getEmotionScore(j.emotion), 0);
                        const avgScore = totalScore / dayJournals.length;

                        // Determine color based on average score
                        // We can use a threshold or just simple +/-
                        if (avgScore > 0.5) color = 'bg-[#9BB068]'; // Positive
                        else if (avgScore < -0.5) color = 'bg-[#FE814B]'; // Negative
                        else color = 'bg-[#926247]'; // Neutral (approx 0)
                    }

                    return (
                        <Link
                            href={`/journal/history?date=${format(day, 'yyyy-MM-dd')}`}
                            key={i}
                            className={`w-10 h-10 rounded-full ${color} flex items-center justify-center transition-all hover:scale-105 active:scale-95`}
                        >
                        </Link>
                    );
                })}
            </div>

            {/* Legend - Updated Colors */}

            {/* Legend */}
            <div className="flex justify-between items-center bg-[#F7F4F2] rounded-full px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FE814B]"></div>
                    <span className="text-[#926247] text-xs font-medium">Negative</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#926247]"></div>
                    <span className="text-[#926247] text-xs font-medium">Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#9BB068]"></div>
                    <span className="text-[#926247] text-xs font-medium">Positive</span>
                </div>
            </div>
        </div>
    );
}
