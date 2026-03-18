"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Smile } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mindful-brown-10 p-6">
      <div className="flex flex-col items-center text-center space-y-8 max-w-md">

        {/* Logo / Icon Placeholder */}
        <div className="w-32 h-32 bg-serenity-green-50 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-700">
          <Smile size={64} className="text-white" />
        </div>

        <h1 className="text-4xl font-extrabold text-mindful-brown-80 tracking-tight">
          Unwind Mobile
        </h1>

        <p className="text-xl text-mindful-brown-60 font-medium">
          Your personal space for mental well-being and clarity.
        </p>

        <div className="w-full pt-8">
          <Button
            className="w-full h-16 text-xl rounded-full shadow-xl"
            onClick={() => router.push('/assessment')}
          >
            Start Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
