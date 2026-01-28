import { motion } from "framer-motion";
import { AnalysisResult } from "@/types/cv";

interface ScoreCardProps {
  result: AnalysisResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    if (score >= 30) return "text-score-poor";
    return "text-score-critical";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-score-excellent to-score-good";
    if (score >= 70) return "from-score-good to-score-average";
    if (score >= 50) return "from-score-average to-score-poor";
    return "from-score-poor to-score-critical";
  };

  const scores = [
    { label: "Formato", value: result.formatScore },
    { label: "Palabras clave", value: result.keywordsScore },
    { label: "Experiencia", value: result.experienceScore },
    { label: "Habilidades", value: result.skillsScore },
    { label: "Logros", value: result.achievementsScore },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-medium p-8 border border-border">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold mb-4">Puntuación ATS</h3>
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-secondary"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 440" }}
              animate={{ strokeDasharray: `${(result.atsScore / 100) * 440} 440` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`stop-${getScoreGradient(result.atsScore).split(" ")[0].replace("from-", "")}`} stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className={`text-5xl font-bold ${getScoreColor(result.atsScore)}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {result.atsScore}
            </motion.span>
          </div>
        </div>
        <p className="text-muted-foreground mt-4">
          {result.atsScore >= 80
            ? "¡Excelente! Tu CV está muy bien optimizado"
            : result.atsScore >= 60
            ? "Bien, pero hay margen de mejora"
            : "Necesita mejoras significativas"}
        </p>
      </div>

      <div className="space-y-4">
        {scores.map((score, index) => (
          <motion.div
            key={score.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{score.label}</span>
              <span className={`text-sm font-semibold ${getScoreColor(score.value)}`}>
                {score.value}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${score.value}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
