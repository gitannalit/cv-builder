import { useState } from "react";
import { CVData } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Zap, Languages, Award } from "lucide-react";

interface SkillsFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

export function SkillsForm({ cvData, setCVData }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCVData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !cvData.languages.includes(newLanguage.trim())) {
      setCVData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !cvData.certifications.includes(newCertification.trim())) {
      setCVData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Habilidades y Certificaciones</h2>
        <p className="text-muted-foreground">Destaca tus competencias más relevantes</p>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Habilidades técnicas
        </Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addSkill)}
            placeholder="Ej: Excel avanzado, Python, Gestión de proyectos..."
            className="flex-1"
          />
          <Button variant="hero" onClick={addSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-1"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-lg">
          <Languages className="w-5 h-5 text-primary" />
          Idiomas
        </Label>
        <div className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addLanguage)}
            placeholder="Ej: Español (Nativo), Inglés (B2)..."
            className="flex-1"
          />
          <Button variant="hero" onClick={addLanguage}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cvData.languages.map((language) => (
            <Badge
              key={language}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-1"
            >
              {language}
              <button onClick={() => removeLanguage(language)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5 text-primary" />
          Certificaciones
        </Label>
        <div className="flex gap-2">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addCertification)}
            placeholder="Ej: PMP, Google Analytics, AWS Certified..."
            className="flex-1"
          />
          <Button variant="hero" onClick={addCertification}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cvData.certifications.map((cert) => (
            <Badge
              key={cert}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-1"
            >
              {cert}
              <button onClick={() => removeCertification(cert)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
