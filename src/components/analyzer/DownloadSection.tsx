import { motion } from "framer-motion";
import { Download, Sparkles, FileText } from "lucide-react";
import { AnalysisResult, CVVersion } from "@/types/cv";
import { TemplateSelector } from "./TemplateSelector";
import { TemplateType } from "./templates";
import { generateTemplateHTML } from "@/lib/templatePdfGenerator";
import { generatePdfOnServer } from "@/lib/serverPdf";
import { downloadPDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";

interface DownloadSectionProps {
  cvText: string;
  analysisResult: AnalysisResult;
  cvVersions: { formal: CVVersion; creative: CVVersion } | null;
}

export function DownloadSection({ cvText, analysisResult, cvVersions }: DownloadSectionProps) {
  const handleDownload = async (version: CVVersion, template: TemplateType, isPremium: boolean) => {
    if (isPremium) {
      // TODO: Integrate Stripe payment
      toast.info("Próximamente: Pago con Stripe para descargar sin marca de agua");
      return;
    }

    try {
      toast.loading('Generando PDF en servidor...');
      const html = generateTemplateHTML(version, template, true);
      const blob = await generatePdfOnServer(html);
      downloadPDF(blob, `${version.title || 'cv'}.pdf`);
      toast.dismiss();
      toast.success('Descarga iniciada');
    } catch (err) {
      console.error('Error generando PDF:', err);
      toast.error('Error al generar el PDF');
    }
  };

  // If no versions generated yet, show a message to generate them first
  if (!cvVersions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-medium p-8 border border-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Download className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Descargar tu CV</h3>
            <p className="text-muted-foreground text-sm">Genera las versiones de tu CV para poder descargarlo</p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Haz clic en "Generar versiones" arriba para crear tu CV optimizado con IA y poder descargarlo con plantillas profesionales.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-medium p-8 border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display">Descarga tu CV profesional</h3>
          <p className="text-muted-foreground text-sm">Elige una plantilla y descarga tu currículum optimizado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formal/Executive Version */}
        <div className="p-6 rounded-xl border border-border bg-background">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{cvVersions.formal.title}</h4>
              <p className="text-xs text-muted-foreground">{cvVersions.formal.description}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {cvVersions.formal.content.summary.substring(0, 120)}...
          </p>
          <TemplateSelector 
            version={cvVersions.formal}
            onDownload={(template, isPremium) => handleDownload(cvVersions.formal, template, isPremium)}
          />
        </div>

        {/* Creative Version */}
        <div className="p-6 rounded-xl border-2 border-primary bg-primary/5 relative">
          <div className="absolute -top-2 right-3">
            <span className="gradient-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
              Recomendado
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{cvVersions.creative.title}</h4>
              <p className="text-xs text-muted-foreground">{cvVersions.creative.description}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {cvVersions.creative.content.summary.substring(0, 120)}...
          </p>
          <TemplateSelector 
            version={cvVersions.creative}
            onDownload={(template, isPremium) => handleDownload(cvVersions.creative, template, isPremium)}
          />
        </div>
      </div>
    </motion.div>
  );
}
