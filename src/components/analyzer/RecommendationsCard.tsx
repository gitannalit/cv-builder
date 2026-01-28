import { motion } from "framer-motion";
import { Lightbulb, Tag, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendationsCardProps {
  recommendations: string[];
  missingKeywords: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export function RecommendationsCard({
  recommendations,
  missingKeywords,
  salaryRange,
}: RecommendationsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: salaryRange.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Salary Range */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-medium p-6 border border-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
            <Coins className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Estimación salarial</h3>
            <p className="text-sm text-muted-foreground">Basado en tu perfil y experiencia</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(salaryRange.min)} - {formatCurrency(salaryRange.max)}
          </span>
          <span className="text-muted-foreground">/ año</span>
        </div>
      </motion.div>

      {/* Missing Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-medium p-6 border border-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Tag className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Palabras clave faltantes</h3>
            <p className="text-sm text-muted-foreground">Añádelas para mejorar tu puntuación ATS</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="px-3 py-1">
              {keyword}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl shadow-medium p-6 border border-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Recomendaciones</h3>
            <p className="text-sm text-muted-foreground">Acciones para mejorar tu CV</p>
          </div>
        </div>
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
