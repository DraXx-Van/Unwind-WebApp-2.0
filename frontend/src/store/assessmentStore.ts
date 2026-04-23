import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authFetch } from '@/lib/api';

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
    mood: number | null;
    hasSoughtProfessionalHelp: boolean | null;
    physicalDistress: boolean | null;
    sleepQuality: number | null;
    medications: string[];
    symptoms: string[];
    stressLevel: number | null;

    // Submission state
    isSubmitting: boolean;
    submitError: string | null;
    isSubmitted: boolean;

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

    submitAssessment: () => Promise<void>;
    resetAssessment: () => void;
    fetchLatest: () => Promise<void>;
    updateAssessment: (data: Partial<AssessmentState>) => Promise<boolean>;
    id: number | null;
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set, get) => ({
            currentStep: 0,
            totalSteps: 12,

            goal: null,
            gender: null,
            age: 18,
            weight: 60,
            weightUnit: 'kg',
            mood: null,
            hasSoughtProfessionalHelp: null,
            physicalDistress: null,
            sleepQuality: null,
            medications: [],
            symptoms: [],
            stressLevel: null,

            isSubmitting: false,
            submitError: null,
            isSubmitted: false,

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

            submitAssessment: async () => {
                const state = get();
                set({ isSubmitting: true, submitError: null });
                try {
                    const payload = {
                        goal: state.goal,
                        gender: state.gender,
                        age: state.age,
                        weight: state.weight,
                        weightUnit: state.weightUnit,
                        mood: state.mood,
                        hasSoughtProfessionalHelp: state.hasSoughtProfessionalHelp,
                        physicalDistress: state.physicalDistress,
                        sleepQuality: state.sleepQuality,
                        medications: state.medications,
                        symptoms: state.symptoms,
                        stressLevel: state.stressLevel,
                    };

                    const response = await authFetch('/assessment', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) throw new Error('Failed to submit assessment');
                    await response.json();
                    set({ isSubmitting: false, isSubmitted: true });
                } catch (error) {
                    set({ submitError: (error as Error).message, isSubmitting: false });
                }
            },

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
                isSubmitting: false,
                submitError: null,
                isSubmitted: false,
            }),

            id: null,

            fetchLatest: async () => {
                try {
                    const response = await authFetch('/assessment/latest');
                    if (!response.ok) return;
                    const data = await response.json();
                    if (data) {
                        set({
                            id: data.id,
                            goal: data.goal,
                            gender: data.gender,
                            age: data.age,
                            weight: data.weight,
                            weightUnit: data.weightUnit,
                            mood: data.mood,
                            hasSoughtProfessionalHelp: data.hasSoughtProfessionalHelp,
                            physicalDistress: data.physicalDistress,
                            sleepQuality: data.sleepQuality,
                            medications: data.medications,
                            symptoms: data.symptoms,
                            stressLevel: data.stressLevel,
                        });
                    }
                } catch (error) {
                    console.error('Fetch assessment error:', error);
                }
            },

            updateAssessment: async (data) => {
                const state = get();
                if (!state.id) return false;
                try {
                    const response = await authFetch(`/assessment/${state.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(data),
                    });
                    if (!response.ok) throw new Error('Update failed');
                    const updated = await response.json();
                    set(updated);
                    return true;
                } catch (error) {
                    console.error('Update assessment error:', error);
                    return false;
                }
            }
        }),
        {
            name: 'assessment-storage',
        },
    ),
);
