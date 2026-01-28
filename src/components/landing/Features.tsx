import { motion } from "framer-motion";
import { 
  FileText, 
  BarChart3, 
  Wand2, 
  Target, 
  Download, 
  Layers 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Editor Intuitivo",
    description: "Crea tu CV paso a paso con un editor visual fácil de usar. Sin complicaciones técnicas.",
  },
  {
    icon: BarChart3,
    title: "Análisis ATS",
    description: "Obtén una puntuación detallada de compatibilidad con sistemas de seguimiento de candidatos.",
  },
  {
    icon: Wand2,
    title: "Optimización IA",
    description: "Nuestra IA reescribe tu resumen profesional para hacerlo más atractivo y efectivo.",
  },
  {
    icon: Target,
    title: "Plan de Acción",
    description: "Recibe un plan personalizado con acciones concretas para mejorar tu empleabilidad.",
  },
  {
    icon: Layers,
    title: "Múltiples Versiones",
    description: "Genera versiones formales y creativas de tu CV adaptadas a diferentes industrias.",
  },
  {
    icon: Download,
    title: "Descarga PDF",
    description: "Exporta tu CV en formato PDF profesional listo para enviar a cualquier empresa.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramientas profesionales impulsadas por IA para crear el CV perfecto
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-background shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
