import { CVData, Education } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface EducationFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

export function EducationForm({ cvData, setCVData }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    };
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Educación</h2>
        <p className="text-muted-foreground">Añade tu formación académica</p>
      </div>

      {cvData.education.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-xl border-2 border-dashed border-border">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Sin formación añadida</h3>
          <p className="text-muted-foreground mb-4">Añade tu formación académica</p>
          <Button variant="hero" onClick={addEducation}>
            <Plus className="w-4 h-4" />
            Añadir formación
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.education.map((edu, index) => (
            <div
              key={edu.id}
              className="p-6 bg-secondary/30 rounded-xl border border-border space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Formación {index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institución</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    placeholder="Universidad / Centro de estudios"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    placeholder="Grado, Máster, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Campo de estudio</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    placeholder="Administración de Empresas"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Inicio</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fin</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addEducation} className="w-full">
            <Plus className="w-4 h-4" />
            Añadir otra formación
          </Button>
        </div>
      )}
    </div>
  );
}
