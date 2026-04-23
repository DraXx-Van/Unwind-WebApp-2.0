"use client";

import { MentorTabBar } from '@/components/mentor/MentorTabBar';
import { Calendar } from 'lucide-react';

export default function MentorAppointmentsPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 bg-[#F7F4F2] rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-[#4B3425]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#4B3425] mb-2">Appointments</h1>
            <p className="text-[#A69B93] max-w-xs">
                This feature is coming soon. You'll be able to schedule and manage sessions with your students.
            </p>
            <MentorTabBar />
        </div>
    );
}
