import React, { useState } from "react";
import { CVData, AnalysisResult } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CVPreviewProps {
  cvData: CVData;
}

export function CVPreview({ cvData }: CVPreviewProps) {
  const { personalInfo, professionalSummary, workExperience, education, skills, languages, certifications } = cvData;

  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const hasContent = personalInfo.fullName || professionalSummary || workExperience.length > 0 || education.length > 0;

  async function handleDownload() {
    setResult(null);
    setGenerating(true);
    try {
      const { generateAnalysisHTML, downloadPDF } = await import("@/lib/pdfGenerator");
      const { generatePdfOnServer } = await import("@/lib/serverPdf");
      const placeholder: AnalysisResult = {
        atsScore: 0,
        formatScore: 0,
        keywordsScore: 0,
        experienceScore: 0,
        skillsScore: 0,
        achievementsScore: 0,
        problems: [],
        missingKeywords: [],
        recommendations: [],
        salaryRange: { min: 0, max: 0, currency: "" },
      };
      const html = generateAnalysisHTML(JSON.stringify(cvData, null, 2), placeholder, false);
      const pdfBlob = await generatePdfOnServer(html);
      downloadPDF(pdfBlob, `${personalInfo.fullName || "cv"}.pdf`);
      setResult("Descarga iniciada");
    } catch (e: any) {
      setResult("Error al generar el PDF: " + (e?.message || e));
    } finally {
      setGenerating(false);
    }
  }

  async function handleSendEmail() {
    if (!personalInfo.email) {
      setResult("Introduce un correo en Información Personal.");
      return;
    }
    setResult(null);
    setSending(true);
    try {
      const { generateAnalysisHTML } = await import("@/lib/pdfGenerator");
      const { generateAndUploadPdf } = await import("@/lib/serverPdf");
      const { sendCVEmail } = await import("@/lib/resendClient");
      const placeholder: AnalysisResult = {
        atsScore: 0,
        formatScore: 0,
        keywordsScore: 0,
        experienceScore: 0,
        skillsScore: 0,
        achievementsScore: 0,
        problems: [],
        missingKeywords: [],
        recommendations: [],
        salaryRange: { min: 0, max: 0, currency: "" },
      };
      const html = generateAnalysisHTML(JSON.stringify(cvData, null, 2), placeholder, false);
      const uploadRes = await generateAndUploadPdf(html, `${personalInfo.fullName || 'cv'}.pdf`);
      // uploadRes: { success: true, url, path }
      await sendCVEmail(personalInfo.email, undefined, uploadRes.url);
      setResult("¡CV enviado exitosamente!");
    } catch (e: any) {
      setResult("Error al enviar el CV: " + (e?.message || e));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-medium border border-border overflow-hidden">
      <div className="bg-primary/5 px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-lg">Vista previa del CV</h3>
      </div>
      
      <div className="p-6">
        <div className="bg-white shadow-soft rounded-lg p-8 min-h-[600px] text-sm" style={{ aspectRatio: "210/297" }}>
          {!hasContent ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-center">
                Tu CV aparecerá aquí mientras<br />completas el formulario
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              {personalInfo.fullName && (
                <div className="border-b border-border pb-4">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {personalInfo.fullName}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {personalInfo.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {personalInfo.email}
                      </span>
                    )}
                    {personalInfo.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {personalInfo.phone}
                      </span>
                    )}
                    {personalInfo.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {personalInfo.location}
                      </span>
                    )}
                    {personalInfo.linkedIn && (
                      <span className="flex items-center gap-1">
                        <Linkedin className="w-3 h-3" /> {personalInfo.linkedIn}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {professionalSummary && (
                <div>
                  <h2 className="text-xs font-bold uppercase text-primary mb-2">Resumen Profesional</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">{professionalSummary}</p>
                </div>
              )}

              {/* Experience */}
              {workExperience.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase text-primary mb-2">Experiencia Laboral</h2>
                  <div className="space-y-3">
                    {workExperience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-xs">{exp.position}</h3>
                            <p className="text-xs text-muted-foreground">{exp.company}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate)}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase text-primary mb-2">Formación</h2>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-xs">{edu.degree} en {edu.field}</h3>
                          <p className="text-xs text-muted-foreground">{edu.institution}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase text-primary mb-2">Habilidades</h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-secondary text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages & Certifications */}
              <div className="flex gap-8">
                {languages.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase text-primary mb-2">Idiomas</h2>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {languages.map((lang) => (
                        <li key={lang}>{lang}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {certifications.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase text-primary mb-2">Certificaciones</h2>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {certifications.map((cert) => (
                        <li key={cert}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
          <Button variant="outline" onClick={handleDownload} disabled={generating}>
            <Download className="w-4 h-4" />
            {generating ? "Generando..." : "Descargar PDF"}
          </Button>

          <Button variant="secondary" onClick={handleSendEmail} disabled={sending || !personalInfo.email}>
            <Mail className="w-4 h-4" />
            {sending ? "Enviando..." : "Enviar por correo"}
          </Button>
        </div>

        {result && <p className="mt-2 text-sm text-muted-foreground">{result}</p>}
      </div>
    </div>
  );
}
