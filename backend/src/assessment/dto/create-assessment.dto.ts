
export class CreateAssessmentDto {
    goal?: string;
    gender?: string;
    age?: number;
    weight?: number;
    weightUnit?: string;
    mood?: number;
    hasSoughtProfessionalHelp?: boolean;
    physicalDistress?: boolean;
    sleepQuality?: number;
    medications?: string[];
    symptoms?: string[];
    stressLevel?: number;
}
