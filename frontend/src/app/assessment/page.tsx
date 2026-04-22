"use client";

import { useAssessmentStore } from '@/store/assessmentStore';
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
    const { currentStep } = useAssessmentStore();

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
