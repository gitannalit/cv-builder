import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PersonalInfoForm } from "@/components/builder/PersonalInfoForm";
import { ExperienceForm } from "@/components/builder/ExperienceForm";
import { EducationForm } from "@/components/builder/EducationForm";
import { SkillsForm } from "@/components/builder/SkillsForm";
import { CVPreview } from "@/components/builder/CVPreview";
import { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText, Eye } from "lucide-react";

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolio: "",
  },
  professionalSummary: "",
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};

const steps = [
  { id: 1, title: "Información Personal", icon: "👤" },
  { id: 2, title: "Experiencia", icon: "💼" },
  { id: 3, title: "Educación", icon: "🎓" },
  { id: 4, title: "Habilidades", icon: "⚡" },
];

const Builder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  async function handleSendEmail() {
    setSending(true);
    setSendResult(null);
    try {
      // Lazy import para evitar problemas SSR
      const { generatePDFWithWatermark } = await import("@/lib/pdfGenerator");
      const { sendCVEmail } = await import("@/lib/resendClient");
      // Generar PDF (puedes ajustar los parámetros según tu lógica)
      const pdfBlob = await generatePDFWithWatermark(
        JSON.stringify(cvData, null, 2),
        { recommendations: [], problems: [], atsScore: 0, formatScore: 0, keywordsScore: 0, experienceScore: 0, skillsScore: 0, achievementsScore: 0, missingKeywords: [], salaryRange: { min: 0, max: 0, currency: "" } },
        false
      );
      await sendCVEmail(cvData.personalInfo.email, pdfBlob);
      setSendResult("¡CV enviado exitosamente!");
    } catch (e: any) {
      setSendResult("Error al enviar el CV: " + (e?.message || e));
    } finally {
      setSending(false);
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm cvData={cvData} setCVData={setCVData} />;
      case 2:
        return <ExperienceForm cvData={cvData} setCVData={setCVData} />;
      case 3:
        return <EducationForm cvData={cvData} setCVData={setCVData} />;
      case 4:
        return <SkillsForm cvData={cvData} setCVData={setCVData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Crea tu CV profesional
            </h1>
            <p className="text-xl text-muted-foreground">
              Completa los pasos para generar tu currículum optimizado
            </p>
          </motion.div>

          {/* Step indicators */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : currentStep > step.id
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <span>{step.icon}</span>
                    <span className="hidden md:inline font-medium">{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl shadow-medium p-8 border border-border"
            >
              {renderStepContent()}

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(!showPreview)}
                  className="lg:hidden"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Ocultar" : "Vista previa"}
                </Button>

                {currentStep < steps.length ? (
                  <Button variant="hero" onClick={handleNext}>
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 items-end">
                    <Button variant="accent">
                      <FileText className="w-4 h-4" />
                      Generar CV
                    </Button>
                    <Button variant="secondary" onClick={handleSendEmail} disabled={sending || !cvData.personalInfo.email}>
                      {sending ? "Enviando..." : "Enviar CV por email"}
                    </Button>
                    {sendResult && (
                      <span className={`text-sm ${sendResult.startsWith("¡CV enviado") ? "text-green-600" : "text-red-600"}`}>{sendResult}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Preview Section */}
            <div className={`${showPreview ? "block" : "hidden"} lg:block`}>
              <div className="sticky top-24">
                <CVPreview cvData={cvData} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Builder;
