import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Download, FileText } from "lucide-react";

const plans = [
  {
    name: "Descarga con Marca de Agua",
    price: "Gratis",
    priceId: null,
    description: "Perfecto para revisar tu CV",
    features: [
      "Análisis ATS completo",
      "Recomendaciones de mejora",
      "Plan de acción personalizado",
      "Descarga PDF con marca de agua",
    ],
    highlighted: false,
    buttonText: "Descargar gratis",
  },
  {
    name: "CV Profesional",
    price: "4.99",
    priceId: "price_1Srn3hBLITwbOyWLRsCQokck",
    description: "Sin marca de agua",
    features: [
      "Todo lo del plan gratuito",
      "PDF sin marca de agua",
      "Versión formal y creativa",
      "Formato profesional ATS",
      "Descarga inmediata",
    ],
    highlighted: true,
    buttonText: "Descargar por 4.99€",
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Paga solo por descarga
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sin suscripciones. Analiza gratis, paga solo si quieres descargar sin marca de agua.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.highlighted
                  ? "bg-card shadow-strong border-2 border-primary"
                  : "bg-card shadow-soft border border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Recomendado
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 mx-auto">
                  {plan.highlighted ? <Download className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === "Gratis" ? (
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-xl text-muted-foreground">€</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "hero" : "outline"}
                size="lg"
                className="w-full"
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
