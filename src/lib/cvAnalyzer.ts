import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult, ActionPlan, CVVersion, CVData } from "@/types/cv";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-cv`;

async function callAnalyzeFunction(cvText: string, action?: string, extraData?: any) {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ cvText, action, ...extraData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al procesar el CV");
  }

  return response.json();
}

export async function analyzeCVText(cvText: string, options?: any): Promise<AnalysisResult> {
  return callAnalyzeFunction(cvText, "analyze", options);
}

export async function extractCVData(cvText: string): Promise<Partial<CVData>> {
  const result = await callAnalyzeFunction(cvText, "extract");

  // Transform the extracted data to match our CVData structure
  return {
    personalInfo: {
      fullName: result.fullName || "",
      email: result.email || "",
      phone: result.phone || "",
      location: result.location || "",
      linkedIn: result.linkedIn || "",
      portfolio: result.portfolio || "",
    },
    professionalSummary: result.professionalSummary || "",
    workExperience: (result.workExperience || []).map((exp: any, index: number) => ({
      id: `exp-${index}`,
      company: exp.company || "",
      position: exp.position || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate === "Presente" ? "" : exp.endDate || "",
      description: exp.description || "",
      current: exp.endDate === "Presente",
    })),
    education: (result.education || []).map((edu: any, index: number) => ({
      id: `edu-${index}`,
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
    })),
    skills: result.skills || [],
    languages: result.languages || [],
    certifications: result.certifications || [],
  };
}

export async function generateActionPlan(cvText: string): Promise<ActionPlan> {
  return callAnalyzeFunction(cvText, "actionPlan");
}

export async function generateCVVersions(
  cvText: string,
  targetJob?: string,
  keyAchievements?: string
): Promise<{ formal: CVVersion; creative: CVVersion }> {
  return callAnalyzeFunction(cvText, "versions", { targetJob, keyAchievements });
}
