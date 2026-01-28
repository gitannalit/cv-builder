import { motion } from "framer-motion";
import { Problem } from "@/types/cv";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface ProblemsCardProps {
  problems: Problem[];
}

export function ProblemsCard({ problems }: ProblemsCardProps) {
  const getIcon = (severity: Problem["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-score-critical" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-score-average" />;
      case "info":
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getBgColor = (severity: Problem["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-score-critical/10 border-score-critical/20";
      case "warning":
        return "bg-score-average/10 border-score-average/20";
      case "info":
        return "bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-medium p-8 border border-border">
      <h3 className="text-xl font-display font-bold mb-6">Problemas detectados</h3>
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${getBgColor(problem.severity)}`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon(problem.severity)}</div>
              <div>
                <h4 className="font-semibold mb-1">{problem.title}</h4>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
