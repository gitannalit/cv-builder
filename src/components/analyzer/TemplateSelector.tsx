import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, Lock, Eye, Sparkles, Check } from "lucide-react";
import { CVVersion } from "@/types/cv";
import { TemplateType, templateInfo } from "./templates";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { toast } from "sonner";

interface TemplateSelectorProps {
  version: CVVersion;
  onDownload: (template: TemplateType, isPremium: boolean) => void;
}

export function TemplateSelector({ version, onDownload }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

  const handleDownload = (isPremium: boolean) => {
    onDownload(selectedTemplate, isPremium);
    setIsOpen(false);
  };

  const renderTemplatePreview = (template: TemplateType, scale: number = 0.15) => {
    const props = { version, hasWatermark: false };
    const TemplateComponent = {
      modern: ModernTemplate,
      classic: ClassicTemplate,
      minimal: MinimalTemplate,
      creative: CreativeTemplate,
    }[template];

    return (
      <div 
        className="origin-top-left overflow-hidden rounded-lg shadow-sm border border-border"
        style={{ transform: `scale(${scale})`, width: '210mm', height: '297mm' }}
      >
        <TemplateComponent {...props} />
      </div>
    );
  };

  return (
    <>
      <Button 
        variant="hero" 
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Download className="w-5 h-5" />
        Elegir plantilla y descargar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Elige tu plantilla de CV
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Template Selection */}
            <div>
              <h3 className="font-semibold mb-4">Selecciona un diseño</h3>
              <RadioGroup 
                value={selectedTemplate} 
                onValueChange={(value) => setSelectedTemplate(value as TemplateType)}
                className="grid grid-cols-2 gap-3"
              >
                {(Object.keys(templateInfo) as TemplateType[]).map((key) => (
                  <div key={key} className="relative">
                    <RadioGroupItem value={key} id={key} className="peer sr-only" />
                    <Label
                      htmlFor={key}
                      className="flex flex-col cursor-pointer rounded-xl border-2 border-border p-3 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                    >
                      {/* Mini preview */}
                      <div className="relative h-32 mb-2 bg-gray-50 rounded-lg overflow-hidden flex items-start justify-center">
                        {renderTemplatePreview(key, 0.1)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewTemplate(key);
                          }}
                          className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                          <Eye className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                          {selectedTemplate === key && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="font-medium text-sm">{templateInfo[key].name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">
                        {templateInfo[key].description}
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Download Options */}
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Gratis</span>
                    <span className="text-sm text-muted-foreground">Con marca de agua</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleDownload(false)}
                  >
                    <Download className="w-4 h-4" />
                    Descargar gratis
                  </Button>
                </div>

                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 relative">
                  <div className="absolute -top-2 right-3">
                    <span className="gradient-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-primary">4.99€</span>
                    <span className="text-sm text-muted-foreground">Sin marca de agua</span>
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => handleDownload(true)}
                  >
                    <Lock className="w-4 h-4" />
                    Descargar por 4.99€
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="hidden lg:block">
              <h3 className="font-semibold mb-4">Vista previa</h3>
              <div className="bg-gray-100 rounded-xl p-4 overflow-hidden">
                <div className="relative w-full" style={{ height: '500px' }}>
                  <div 
                    className="origin-top-left"
                    style={{ 
                      transform: 'scale(0.45)', 
                      transformOrigin: 'top left',
                    }}
                  >
                    {selectedTemplate === 'modern' && <ModernTemplate version={version} hasWatermark={false} />}
                    {selectedTemplate === 'classic' && <ClassicTemplate version={version} hasWatermark={false} />}
                    {selectedTemplate === 'minimal' && <MinimalTemplate version={version} hasWatermark={false} />}
                    {selectedTemplate === 'creative' && <CreativeTemplate version={version} hasWatermark={false} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Preview Modal */}
      <Dialog open={previewTemplate !== null} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Vista previa: {previewTemplate && templateInfo[previewTemplate].name}
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 rounded-xl p-4 overflow-auto">
            <div className="origin-top-left" style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }}>
              {previewTemplate === 'modern' && <ModernTemplate version={version} hasWatermark={false} />}
              {previewTemplate === 'classic' && <ClassicTemplate version={version} hasWatermark={false} />}
              {previewTemplate === 'minimal' && <MinimalTemplate version={version} hasWatermark={false} />}
              {previewTemplate === 'creative' && <CreativeTemplate version={version} hasWatermark={false} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
