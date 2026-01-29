import { motion } from "framer-motion";
import { CVVersion } from "@/types/cv";
import { CheckCircle2, Download, Sparkles, ShieldCheck, CreditCard, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVVersionsCard } from "./CVVersionsCard";

interface LockedCVPreviewProps {
    version: CVVersion;
    type: 'formal' | 'creative';
    onEdit: () => void;
    onUnlock: () => void;
    onUnlockBasic: () => void;
    onUnlockPremium: () => void;
    isProcessing?: boolean;
    userData?: {
        name: string;
        email: string;
        phone?: string;
        targetJob?: string;
    };
}

export function LockedCVPreview({ version, type, onEdit, onUnlock, onUnlockBasic, onUnlockPremium, isProcessing, userData }: LockedCVPreviewProps) {
    return (
        <div className="relative min-h-screen pb-32">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold">¡Tu CV está listo!</h1>
                </div>
                <p className="text-muted-foreground">
                    Versión {type === 'formal' ? 'Ejecutiva' : 'Moderna'} - Vista previa (contenido blurreado)
                </p>
            </div>

            {/* CV Preview Container */}
            <div className="max-w-4xl mx-auto relative">
                {/* Blurred CV Content */}
                <div className="relative filter blur-[2px] opacity-50 select-none pointer-events-none transform scale-[0.98] origin-top">
                    <CVVersionsCard
                        versions={{ formal: version, creative: version }}
                        selectedOnly={type}
                        userData={userData}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10" />
                </div>

                {/* Watermark */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 z-0 pointer-events-none">
                    <span className="text-6xl md:text-8xl font-black text-gray-200/50 uppercase tracking-widest">
                        Vista Previa
                    </span>
                </div>

                {/* Unlock Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 z-20"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-[#00D1A0]" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-2">Desbloquea tu CV completo</h2>
                    <p className="text-center text-gray-500 text-sm mb-6">
                        CV profesional optimizado para ATS, listo para enviar a reclutadores.
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-8 text-xs font-medium text-green-600 bg-green-50 py-1.5 px-3 rounded-full w-fit mx-auto">
                        <CheckCircle2 className="w-3 h-3" />
                        3.847 personas mejoraron su CV esta semana
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={onUnlockBasic}
                            disabled={isProcessing}
                            className="w-full bg-[#00D1A0] hover:bg-[#00B88D] text-white h-12 text-base font-bold rounded-xl shadow-lg shadow-green-500/20"
                        >
                            {isProcessing ? "Procesando..." : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Básico: 2 descargas (4,99€)
                                </>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                MÁS POPULAR
                            </div>
                            <Button
                                onClick={onUnlockPremium}
                                disabled={isProcessing}
                                variant="outline"
                                className="w-full border-2 border-[#00D1A0] text-[#00D1A0] hover:bg-green-50 h-12 text-base font-bold rounded-xl"
                            >
                                {isProcessing ? "Procesando..." : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Premium: Ilimitado (17,99€)
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-gray-400 mb-4">Pack incluye: CV + Guía ATS + Carta + Checklist</p>
                        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Garantía de devolución 14 días
                            </span>
                            <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> Pago seguro con Stripe
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
                    <div className="flex w-full gap-4 max-w-md">
                        <Button
                            onClick={onUnlockBasic}
                            disabled={isProcessing}
                            className="flex-1 bg-[#00D1A0] hover:bg-[#00B88D] text-white font-bold rounded-xl"
                        >
                            {isProcessing ? "..." : "Básico (4,99€)"}
                        </Button>
                        <Button
                            onClick={onUnlockPremium}
                            disabled={isProcessing}
                            variant="outline"
                            className="flex-1 border-[#00D1A0] text-[#00D1A0] font-bold rounded-xl"
                        >
                            {isProcessing ? "..." : "Premium (17,99€)"}
                        </Button>
                    </div>
                    <button
                        onClick={onEdit}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                        Cambiar versión del CV
                    </button>
                </div>
            </div>
        </div>
    );
}
