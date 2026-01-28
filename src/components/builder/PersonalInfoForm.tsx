import { CVData } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface PersonalInfoFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

export function PersonalInfoForm({ cvData, setCVData }: PersonalInfoFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Información Personal</h2>
        <p className="text-muted-foreground">Completa tus datos de contacto básicos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Nombre completo
          </Label>
          <Input
            id="fullName"
            value={cvData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
            placeholder="Juan García López"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Teléfono
          </Label>
          <Input
            id="phone"
            value={cvData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            placeholder="+34 600 000 000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ubicación
          </Label>
          <Input
            id="location"
            value={cvData.personalInfo.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            placeholder="Madrid, España"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedIn" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn (opcional)
          </Label>
          <Input
            id="linkedIn"
            value={cvData.personalInfo.linkedIn}
            onChange={(e) => updatePersonalInfo("linkedIn", e.target.value)}
            placeholder="linkedin.com/in/juangarcia"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Portfolio (opcional)
          </Label>
          <Input
            id="portfolio"
            value={cvData.personalInfo.portfolio}
            onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
            placeholder="www.miportfolio.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Resumen profesional</Label>
        <Textarea
          id="summary"
          value={cvData.professionalSummary}
          onChange={(e) =>
            setCVData((prev) => ({ ...prev, professionalSummary: e.target.value }))
          }
          placeholder="Describe brevemente tu perfil profesional, experiencia y objetivos..."
          className="min-h-[120px] resize-none"
        />
        <p className="text-sm text-muted-foreground">
          💡 Tip: Nuestra IA puede optimizar este resumen para ti más adelante
        </p>
      </div>
    </div>
  );
}
