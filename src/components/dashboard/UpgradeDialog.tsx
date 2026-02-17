import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface UpgradeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (planType: 'basic' | 'premium') => void;
    currentPlan: string;
}

export function UpgradeDialog({ isOpen, onClose, onUpgrade, currentPlan }: UpgradeDialogProps) {
    const isFree = currentPlan === 'free';

    const plans = [
        {
            id: 'basic' as const,
            name: "CV Básico",
            price: "4.99€",
            description: "Ideal para una postulación rápida",
            features: [
                "2 descargas de CV",
                "Sin marca de agua",
                "Versiones Formal y Creativa",
                "Formato optimizado ATS"
            ],
            icon: <Zap className="w-5 h-5 text-blue-500" />,
            tag: "Popular",
            show: isFree
        },
        {
            id: 'premium' as const,
            name: "CV Premium",
            price: "17.99€",
            description: "Acceso total e ilimitado",
            features: [
                "Descargas ILIMITADAS",
                "Análisis ATS prioritario",
                "Soporte personalizado",
                "Actualizaciones de por vida"
            ],
            icon: <Crown className="w-5 h-5 text-amber-500" />,
            tag: "Mejor Valor",
            show: true,
            highlight: true
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white border-2">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-2">Mejora tu Plan</DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Elige la opción que mejor se adapte a tu búsqueda de empleo
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    {plans.filter(p => p.show).map((plan) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ scale: 1.02 }}
                            className={`relative p-6 rounded-xl border-2 flex flex-col ${plan.highlight
                                    ? "border-amber-400 bg-amber-50/30"
                                    : "border-gray-100 bg-white"
                                }`}
                        >
                            {plan.tag && (
                                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold ${plan.highlight ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                                    }`}>
                                    {plan.tag}
                                </span>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                                {plan.icon}
                                <h3 className="text-lg font-bold">{plan.name}</h3>
                            </div>

                            <div className="mb-4">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => onUpgrade(plan.id)}
                                className={`w-full font-bold ${plan.highlight
                                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                                        : "bg-primary hover:bg-primary/90 text-white"
                                    }`}
                            >
                                Elegir {plan.name}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
