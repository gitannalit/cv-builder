import { motion } from "framer-motion";
import { CVVersion } from "@/types/cv";
import { Layers, Briefcase, Sparkles, GraduationCap, Wrench } from "lucide-react";
import { CVTemplateModern } from "./templates/CVTemplateModern";
import { CVTemplateExecutive } from "./templates/CVTemplateExecutive";

interface CVVersionsCardProps {
  versions: {
    formal: CVVersion;
    creative: CVVersion;
  };
  selectedOnly?: 'formal' | 'creative' | null;
  userData?: {
    name: string;
    email: string;
    phone?: string;
    targetJob?: string;
  };
}

export function CVVersionsCard({ versions, selectedOnly, userData }: CVVersionsCardProps) {
  const renderVersion = (version: CVVersion, isCreative: boolean = false) => {
    const content = (version?.content as any) || {
      summary: "",
      experience: [],
      education: [],
      skills: []
    };

    const cvData = {
      name: userData?.name || "Tu Nombre",
      email: userData?.email || "tu@email.com",
      phone: userData?.phone,
      targetJob: userData?.targetJob || version?.title || "Profesional",
      professionalSummary: content.summary || "",
      workExperience: (content.experience || []).map((exp: any) => ({
        company: exp.company || exp.empresa || exp.organization || "",
        position: exp.position || exp.puesto || exp.cargo || exp.role || "",
        startDate: exp.startDate || exp.start_date || exp.fecha_inicio || "",
        endDate: exp.endDate || exp.end_date || exp.fecha_fin || "",
        description: exp.description || exp.descripcion || exp.desc || "",
        achievements: exp.achievements || exp.logros || []
      })),
      education: (content.education || []).map((edu: any) => ({
        institution: edu.institution || edu.institucion || edu.school || edu.university || "",
        degree: edu.degree || edu.titulo || edu.degree_name || "",
        field: edu.field || edu.campo || edu.area || "",
        startDate: edu.startDate || edu.start_date || "",
        endDate: edu.endDate || edu.end_date || edu.fecha_fin || ""
      })),
      skills: content.skills || (content as any).habilidades || [],
      languages: (content as any).languages || (content as any).idiomas || []
    };

    if (isCreative) {
      return <CVTemplateModern data={cvData} />;
    }

    return <CVTemplateExecutive data={cvData} />;
  };

  if (selectedOnly) {
    return (
      <div className="max-w-5xl mx-auto">
        {selectedOnly === 'formal'
          ? renderVersion(versions.formal, false)
          : renderVersion(versions.creative, true)}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-medium p-8 border border-border">
      <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
          <Layers className="w-5 h-5 text-accent-foreground" />
        </div>
        Versiones Optimizadas del CV
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderVersion(versions.formal, false)}
        {renderVersion(versions.creative, true)}
      </div>
    </div>
  );
}
