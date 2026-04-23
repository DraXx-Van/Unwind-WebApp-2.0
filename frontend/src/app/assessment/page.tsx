"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { useAuthStore } from '@/store/authStore';
import { authFetch } from '@/lib/api';
import { AssessmentLayout } from '../../components/assessment/AssessmentLayout';
import { StepGoal } from '../../components/assessment/StepGoal';
import { StepGender } from '../../components/assessment/StepGender';
import { StepAge } from '../../components/assessment/StepAge';
import { StepWeight } from '../../components/assessment/StepWeight';
import { StepMood } from '../../components/assessment/StepMood';
import { StepProfessionalHelp } from '../../components/assessment/StepProfessionalHelp';
import { StepPhysicalDistress } from '../../components/assessment/StepPhysicalDistress';
import { StepSleep } from '../../components/assessment/StepSleep';
import { StepMedication } from '../../components/assessment/StepMedication';
import { StepSymptoms } from '../../components/assessment/StepSymptoms';
import { StepStress } from '../../components/assessment/StepStress';
import { StepComplete } from '../../components/assessment/StepComplete';

export default function AssessmentPage() {
    const router = useRouter();
    const { token } = useAuthStore();
    const { currentStep } = useAssessmentStore();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!token) {
            router.replace('/login');
            return;
        }
        // Check if this user already completed assessment once
        authFetch('/assessment/latest')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.id) {
                    // Already done — send to dashboard, never show again
                    router.replace('/dashboard');
                } else {
                    setChecking(false);
                }
            })
            .catch(() => setChecking(false));
    }, [token, router]);

    if (checking) {
        return (
            <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#4F3422]/20 border-t-[#4F3422] rounded-full animate-spin" />
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <StepGoal />;
            case 1: return <StepGender />;
            case 2: return <StepAge />;
            case 3: return <StepWeight />;
            case 4: return <StepMood />;
            case 5: return <StepProfessionalHelp />;
            case 6: return <StepPhysicalDistress />;
            case 7: return <StepSleep />;
            case 8: return <StepMedication />;
            case 9: return <StepSymptoms />;
            case 10: return <StepStress />;
            case 11: return <StepComplete />;
            default: return <StepComplete />;
        }
    };

    return (
        <AssessmentLayout>
            {renderStep()}
        </AssessmentLayout>
    );
}
