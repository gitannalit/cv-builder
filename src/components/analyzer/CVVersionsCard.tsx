import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CVVersion } from "@/types/cv";
import { Layers, Briefcase, Sparkles, GraduationCap, Wrench, ZoomIn } from "lucide-react";
import { CVTemplateModern } from "./templates/CVTemplateModern";
import { CVTemplateExecutive } from "./templates/CVTemplateExecutive";
import { getPrioritySkills } from "@/lib/cvUtils";

const ResponsivePreview = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5); // Start small to avoid flash
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const cvWidthPx = 794; // 210mm @ 96dpi approx
        const cvHeightPx = 1123; // 297mm @ 96dpi approx

        // Calculate fit scale
        // Subtract a bit of padding margin to be safe
        const newScale = Math.min((parentWidth - 32) / cvWidthPx, 1);
        setScale(newScale);
        setHeight(cvHeightPx * newScale);
      }
    };

    // Initial delay to let layout settle
    const timer = setTimeout(updateScale, 100);
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden flex justify-center transition-all duration-300"
      style={{ height: height ? `${height}px` : '600px' }}
    >
      {!height && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Cargando vista previa...
        </div>
      )}
      <div
        className="origin-top shadow-lg transition-transform duration-300 ease-out mt-4"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};

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
    selectedKeywords?: string[];
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
      name: version.personalDetails?.name || userData?.name || "Tu Nombre",
      email: version.personalDetails?.email || "",
      phone: version.personalDetails?.phone,
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
      skills: getPrioritySkills(userData?.selectedKeywords || [], content.skills || (content as any).habilidades || [], 5),
      languages: (content as any).languages || (content as any).idiomas || []
    };

    const TemplateComponent = isCreative ? CVTemplateModern : CVTemplateExecutive;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            {isCreative ? <Sparkles className="w-4 h-4 text-purple-500" /> : <Briefcase className="w-4 h-4 text-blue-500" />}
            {version?.title || (isCreative ? "Versión Creativa" : "Versión Ejecutiva")}
          </h4>
        </div>
        <ResponsivePreview>
          <TemplateComponent data={cvData} />
        </ResponsivePreview>
      </div>
    );
  };

  if (selectedOnly) {
    return (
      <div className="max-w-4xl mx-auto">
        {selectedOnly === 'formal'
          ? renderVersion(versions.formal, false)
          : renderVersion(versions.creative, true)}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-medium p-4 md:p-8 border border-border">
      <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
          <Layers className="w-5 h-5 text-accent-foreground" />
        </div>
        Versiones Optimizadas del CV
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderVersion(versions.formal, false)}
        {renderVersion(versions.creative, true)}
      </div>
    </div>
  );
}
