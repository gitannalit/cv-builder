import { useState } from "react";
import { CVData, WorkExperience } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Building, Briefcase } from "lucide-react";

interface ExperienceFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

export function ExperienceForm({ cvData, setCVData }: ExperienceFormProps) {
  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    setCVData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setCVData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Experiencia Laboral</h2>
        <p className="text-muted-foreground">Añade tus trabajos anteriores, empezando por el más reciente</p>
      </div>

      {cvData.workExperience.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-xl border-2 border-dashed border-border">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Sin experiencia añadida</h3>
          <p className="text-muted-foreground mb-4">Añade tu primera experiencia laboral</p>
          <Button variant="hero" onClick={addExperience}>
            <Plus className="w-4 h-4" />
            Añadir experiencia
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.workExperience.map((exp, index) => (
            <div
              key={exp.id}
              className="p-6 bg-secondary/30 rounded-xl border border-border space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" />
                  Experiencia {index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Puesto</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    placeholder="Tu cargo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha inicio</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha fin</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) =>
                        updateExperience(exp.id, "current", checked as boolean)
                      }
                    />
                    <label htmlFor={`current-${exp.id}`} className="text-sm text-muted-foreground">
                      Trabajo actual
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  placeholder="Describe tus responsabilidades y logros..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addExperience} className="w-full">
            <Plus className="w-4 h-4" />
            Añadir otra experiencia
          </Button>
        </div>
      )}
    </div>
  );
}
