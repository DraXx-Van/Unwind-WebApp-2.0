import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AssessmentState {
    // Navigation
    currentStep: number;
    totalSteps: number;

    // Data
    goal: string | null;
    gender: 'Male' | 'Female' | 'Other' | null;
    age: number | null;
    weight: number | null;
    weightUnit: 'kg' | 'lbs';
    mood: number | null; // 1-5 or similar scale
    hasSoughtProfessionalHelp: boolean | null;
    physicalDistress: boolean | null; // true if yes, false if no
    sleepQuality: number | null; // 1-5
    medications: string[]; // List of medication names
    symptoms: string[];
    stressLevel: number | null;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    setGoal: (goal: string) => void;
    setGender: (gender: 'Male' | 'Female' | 'Other') => void;
    setAge: (age: number) => void;
    setWeight: (weight: number) => void;
    setWeightUnit: (unit: 'kg' | 'lbs') => void;
    setMood: (mood: number) => void;
    setProfessionalHelp: (hasSought: boolean) => void;
    setPhysicalDistress: (hasDistress: boolean) => void;
    setSleepQuality: (quality: number) => void;
    setMedications: (medications: string[]) => void;
    setSymptoms: (symptoms: string[]) => void;
    setStressLevel: (level: number) => void;

    resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            currentStep: 0,
            totalSteps: 12, // Adjust based on actual step count

            goal: null,
            gender: null,
            age: 18, // Default starting value
            weight: 60, // Default
            weightUnit: 'kg',
            mood: null,
            hasSoughtProfessionalHelp: null,
            physicalDistress: null,
            sleepQuality: null,
            medications: [],
            symptoms: [],
            stressLevel: null,

            setStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

            setGoal: (goal) => set({ goal }),
            setGender: (gender) => set({ gender }),
            setAge: (age) => set({ age }),
            setWeight: (weight) => set({ weight }),
            setWeightUnit: (weightUnit) => set({ weightUnit }),
            setMood: (mood) => set({ mood }),
            setProfessionalHelp: (hasSoughtProfessionalHelp) => set({ hasSoughtProfessionalHelp }),
            setPhysicalDistress: (physicalDistress) => set({ physicalDistress }),
            setSleepQuality: (sleepQuality) => set({ sleepQuality }),
            setMedications: (medications) => set({ medications }),
            setSymptoms: (symptoms) => set({ symptoms }),
            setStressLevel: (stressLevel) => set({ stressLevel }),

            resetAssessment: () => set({
                currentStep: 0,
                goal: null,
                gender: null,
                age: 18,
                weight: 60,
                mood: null,
                hasSoughtProfessionalHelp: null,
                physicalDistress: null,
                sleepQuality: null,
                medications: [],
                symptoms: [],
                stressLevel: null,
            }),
        }),
        {
            name: 'assessment-storage', // name of the item in the storage (must be unique)
        },
    ),
);
