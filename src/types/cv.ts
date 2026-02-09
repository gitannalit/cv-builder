export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface AnalysisResult {
  atsScore: number;
  formatScore: number;
  keywordsScore: number;
  experienceScore: number;
  skillsScore: number;
  achievementsScore: number;
  problems: Problem[];
  missingKeywords: string[];
  recommendations: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface Problem {
  message: string;
  suggestion: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
}

export interface ActionPlan {
  immediate: ActionItem[];
  shortTerm: ActionItem[];
  longTerm: ActionItem[];
  trainingRecommendations: TrainingRecommendation[];
  linkedInTips: string[];
  interviewPrep: string[];
}

export interface ActionItem {
  action: string;
  howTo: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TrainingRecommendation {
  course: string;
  provider: string;
  reason: string;
}

export interface CVVersion {
  type: 'formal' | 'creative';
  title: string;
  description: string;
  content: {
    summary: string;
    experience: {
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
      achievements?: string[];
    }[];
    education: {
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
    }[];
    skills: string[];
    languages?: { language: string; level: string }[];
  };
  personalDetails?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
}
