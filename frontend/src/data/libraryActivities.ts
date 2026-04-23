export type ActivityType = 'mindful' | 'journal' | 'real';
export type ActivityCategory = 'stress' | 'anxiety' | 'focus' | 'sleep' | 'mood' | 'overthinking';

export interface Activity {
    id: string;
    title: string;
    description: string;
    category: ActivityCategory;
    type: ActivityType;
    duration?: number; // in minutes
    iconName: string;
    imageUrl?: string; // NEW: Local asset path
    videoUrl?: string; // NEW: YouTube Video ID
    prompt?: string; // for journal types
    why: string;     // Why this helps
    steps: string[]; // How to do it
}

export const LIBRARY_ACTIVITIES: Activity[] = [
    // Stress Relief
    {
        id: 'box-breathing',
        title: 'Box Breathing',
        description: 'Calm your nervous system instantly.',
        category: 'stress',
        type: 'mindful',
        duration: 5,
        iconName: 'Wind',
        imageUrl: '/images/activities/box-breathing.png',
        videoUrl: 'tEmt1Znux58',
        why: 'Box breathing is a powerful technique used by Navy SEALs to stay calm and focused under pressure. It regulates your autonomic nervous system by forcing your breath into a slow, rhythmic pattern.',
        steps: [
            'Inhale slowly through your nose for 4 seconds.',
            'Hold your breath for 4 seconds.',
            'Exhale slowly through your mouth for 4 seconds.',
            'Hold your lungs empty for 4 seconds before the next breath.'
        ]
    },
    {
        id: 'worry-dump',
        title: 'Worry Dump',
        description: 'Get everything out of your head.',
        category: 'stress',
        type: 'journal',
        iconName: 'PenLine',
        why: 'Externalizing your worries through writing reduces the "mental load" on your brain. Once it is on paper, your mind feels less pressure to keep replaying the same anxious thoughts.',
        steps: [
            'Find a quiet spot where you won’t be interrupted.',
            'Set a timer for 5 minutes.',
            'Write down every single thing bothering you, no matter how small.',
            'Don’t worry about grammar or spelling—just get it out.'
        ],
        prompt: 'Write down every single thing that is stressing you out right now, no matter how small.'
    },
    {
        id: 'cold-water',
        title: 'Cold Water Splash',
        description: 'Shock your system into a calmer state.',
        category: 'stress',
        type: 'real',
        iconName: 'Droplets',
        why: 'Splashing cold water on your face triggers the "Mammalian Dive Reflex," which naturally slows down your heart rate and activates the parasympathetic nervous system.',
        steps: [
            'Go to a sink and turn on the cold water.',
            'Splash cold water on your face and eyes for 15-30 seconds.',
            'Take a few deep breaths while your face is wet.',
            'Gently pat your skin dry and notice the sensation.'
        ]
    },

    // Anxiety
    {
        id: 'grounding-54321',
        title: '5-4-3-2-1 Grounding',
        description: 'Reconnect with your surroundings.',
        category: 'anxiety',
        type: 'mindful',
        duration: 3,
        iconName: 'Globe',
        imageUrl: '/images/activities/grounding.png',
        videoUrl: '30VMIEmA114',
        why: 'Grounding techniques use your five senses to pull you out of an anxious spiral and back into the present moment. It interrupts the brain’s focus on internal anxiety.',
        steps: [
            'Acknowledge 5 things you can see around you.',
            'Acknowledge 4 things you can touch.',
            'Acknowledge 3 things you can hear.',
            'Acknowledge 2 things you can smell.',
            'Acknowledge 1 thing you can taste.'
        ]
    },
    {
        id: 'anxiety-timeline',
        title: 'Anxiety Timeline',
        description: 'Map out your feeling to understand it.',
        category: 'anxiety',
        type: 'journal',
        iconName: 'Activity',
        why: 'Tracking the source and peak of your anxiety helps you identify patterns and triggers, making the feeling feel more manageable and less like a random attack.',
        steps: [
            'Recall when you first started feeling anxious today.',
            'Think about what events happened just before that feeling.',
            'Describe the physical sensations you felt (tight chest, etc.).',
            'Note what eventually helped the feeling subside.'
        ],
        prompt: 'When did this anxiety start? What was the trigger? How does it feel in your body?'
    },
    {
        id: 'safe-space',
        title: 'Safe Space Visualization',
        description: 'Imagine a place where you feel secure.',
        category: 'anxiety',
        type: 'mindful',
        duration: 10,
        iconName: 'Home',
        why: 'The brain often cannot distinguish between a real environment and a vivid visualization. Creating a safe space in your mind provides a mental sanctuary you can visit anytime.',
        steps: [
            'Close your eyes and take 3 deep breaths.',
            'Imagine a place where you feel completely safe and calm.',
            'Focus on the colors, the sounds, and the temperature of this place.',
            'Stay in this mental space until you feel your muscles relax.'
        ]
    },

    // Focus
    {
        id: 'pomodoro-sprint',
        title: 'Deep Work Sprint',
        description: 'Zero distractions for 25 minutes.',
        category: 'focus',
        type: 'mindful',
        duration: 25,
        iconName: 'Target',
        imageUrl: '/images/activities/pomodoro.png',
        why: 'The Pomodoro technique creates a sense of urgency while also promising a break. This helps overcome procrastination and maintains high cognitive performance.',
        steps: [
            'Choose a single task to focus on.',
            'Set your timer for 25 minutes.',
            'Work with zero interruptions until the timer rings.',
            'Take a 5-minute break away from your screen.'
        ]
    },
    {
        id: 'priorities-log',
        title: 'Clear the Deck',
        description: 'List your top 3 priorities.',
        category: 'focus',
        type: 'journal',
        iconName: 'ClipboardList',
        why: 'Overwhelm usually comes from having too many choices. By limiting yourself to three priorities, you give your brain a clear, achievable roadmap for the day.',
        steps: [
            'Look at your entire to-do list.',
            'Select the three items that will have the biggest impact.',
            'Write them down clearly.',
            'Commit to ignoring everything else until these three are done.'
        ],
        prompt: 'What are the 3 most important things you need to finish today? Why are they important?'
    },

    // Sleep
    {
        id: 'breathing-478',
        title: '4-7-8 Breathing',
        description: 'The natural tranquilizer for the nervous system.',
        category: 'sleep',
        type: 'mindful',
        duration: 4,
        iconName: 'Moon',
        imageUrl: '/images/activities/breathing-478.png',
        videoUrl: '176Z_6891uk',
        why: 'This rhythmic breathing pattern helps balance the autonomic nervous system, which may be over-stimulated during times of stress. It is widely considered the gold standard for falling asleep.',
        steps: [
            'Exhale completely through your mouth, making a whoosh sound.',
            'Close your mouth and inhale quietly through your nose to a count of 4.',
            'Hold your breath for a count of 7.',
            'Exhale completely through your mouth to a count of 8.'
        ]
    },
    {
        id: 'sleep-gratitude',
        title: 'Sleep Gratitude',
        description: 'End the day on a positive note.',
        category: 'sleep',
        type: 'journal',
        iconName: 'Sparkles',
        why: 'Reflecting on positive events before bed lowers cortisol levels and prevents the "doom-scrolling" or "worry-looping" that keeps many people awake.',
        steps: [
            'Get into bed and get comfortable.',
            'Think back through your entire day from start to finish.',
            'Identify three small moments that made you smile or feel grateful.',
            'Write them down to seal the positive memory.'
        ],
        prompt: 'Write down 3 things that went well today before you sleep.'
    },

    // Mood Boost
    {
        id: 'victory-log',
        title: 'Victory Log',
        description: 'Remember your wins.',
        category: 'mood',
        type: 'journal',
        iconName: 'Trophy',
        why: 'When we are in a low mood, we tend to ignore our successes. A Victory Log acts as a physical reminder of your competence and resilience.',
        steps: [
            'Think about something you did today that took effort.',
            'It could be as small as "made my bed" or "answered an email."',
            'Write it down in your log.',
            'Allow yourself to feel a brief moment of pride.'
        ],
        prompt: 'What is one thing you accomplished today that you are proud of?'
    },
    {
        id: 'sunlight-boost',
        title: 'Sunlight Exposure',
        description: 'Get 5-10 mins of natural light.',
        category: 'mood',
        type: 'real',
        iconName: 'Sun',
        imageUrl: '/images/activities/sunlight.png',
        why: 'Sunlight triggers the release of serotonin in your brain, which is associated with boosting mood and helping a person feel calm and focused.',
        steps: [
            'Step outside or stand by an open window.',
            'Try to get direct light on your face and eyes (safely).',
            'Stay for at least 5 minutes.',
            'Notice the warmth and brightness around you.'
        ]
    },

    // Overthinking
    {
        id: 'what-if-flip',
        title: 'The "What If" Flip',
        description: 'Turn negative what-ifs into positive ones.',
        category: 'overthinking',
        type: 'journal',
        iconName: 'Repeat',
        why: 'Overthinking is often just "rehearsing tragedy." By deliberately imagining a positive outcome, you retrain your brain to see possibilities instead of just threats.',
        steps: [
            'Identify a "what if" thought that is causing worry.',
            'Write it down exactly as it appears in your head.',
            'Now, write a version where everything goes surprisingly well.',
            'Focus on the positive version for 2 minutes.'
        ],
        prompt: 'List 3 negative "what if" thoughts you are having. Now, flip each one into a positive "what if".'
    },
    {
        id: 'leaves-stream',
        title: 'Leaves on a Stream',
        description: 'Let your thoughts drift away.',
        category: 'overthinking',
        type: 'mindful',
        duration: 8,
        iconName: 'Wind',
        imageUrl: '/images/activities/leaves-stream.png',
        why: 'This is an Acceptance and Commitment Therapy (ACT) technique. It helps you see your thoughts as separate from yourself, reducing their power over you.',
        steps: [
            'Visualize a gently flowing stream with leaves floating on top.',
            'Whenever a thought enters your mind, imagine placing it on a leaf.',
            'Watch the leaf drift down the stream and out of sight.',
            'Repeat this for every single thought, good or bad.'
        ]
    }
];
