import { motion } from "framer-motion";
import { CVVersion } from "@/types/cv";
import { CheckCircle2, Download, Sparkles, ShieldCheck, CreditCard, Lock, ArrowRight, Zap, Target, FileText } from "lucide-react";
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
        <div className="relative min-h-screen pb-40">
            {/* Header / Intro */}
            <div className="text-center mb-12 space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-3 mb-2"
                >
                    <div className="w-12 h-12 rounded-2xl bg-[#00D1A0]/10 flex items-center justify-center shadow-lg shadow-[#00D1A0]/5">
                        <CheckCircle2 className="w-7 h-7 text-[#00D1A0]" />
                    </div>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">¡Tu CV Maestro Estética Lista!</h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                    Hemos optimizado cada sección de tu {type === 'formal' ? 'Línea Ejecutiva' : 'Influencia Moderna'} para garantizar el máximo impacto.
                </p>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start px-4">

                {/* CV Preview Section (Left/Main) */}
                <div className="lg:col-span-12 xl:col-span-8 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent rounded-[3.5rem] blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative rounded-[3rem] overflow-hidden border border-gray-100 shadow-strong bg-white/50 backdrop-blur-sm">
                        {/* Blurred CV Content */}
                        <div className="relative filter blur-[4px] opacity-40 select-none pointer-events-none transform scale-[0.99] origin-top transition-all duration-700">
                            <CVVersionsCard
                                versions={{ formal: version, creative: version }}
                                selectedOnly={type}
                                userData={userData}
                            />
                            {/* Inner Shadow/Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/80 z-10" />
                        </div>

                        {/* Watermark/Overlay Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8"
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-strong border border-gray-100">
                                    <Lock className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-black uppercase tracking-wider text-gray-900">Vista Previa Protegida</span>
                                </div>
                            </motion.div>

                            <h3 className="text-6xl md:text-8xl font-black text-gray-200/40 uppercase tracking-[0.2em] rotate-[-12deg] mb-12">
                                CONFIDENCIAL
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Unlock Sidebar (Right) - We'll make it sticky on larger screens */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8 sticky top-32">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] shadow-strong border border-gray-100 p-8 md:p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Oferta de Lanzamiento</span>
                                </div>
                                <h2 className="text-3xl font-black leading-tight text-gray-900">Consigue tu CV <span className="text-[#00D1A0]">Impactante</span></h2>
                                <p className="text-muted-foreground font-medium">Desbloquea el acceso completo y recíbelo instantáneamente en tu email.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Pack Básico */}
                                <div className="relative group">
                                    <Button
                                        onClick={onUnlockBasic}
                                        disabled={isProcessing}
                                        variant="hero"
                                        className="w-full h-24 bg-white hover:bg-gray-50 text-gray-900 hover:text-gray-900 border-2 border-gray-100 hover:border-[#00D1A0]/30 rounded-3xl shadow-soft hover:shadow-strong transition-all flex items-center justify-between px-8"
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[#00D1A0]">PACK BÁSICO</p>
                                            <p className="text-lg font-bold">2 Descargas</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black">4,99€</p>
                                        </div>
                                    </Button>
                                </div>

                                {/* Pack Premium */}
                                <div className="relative group">
                                    <div className="absolute -top-3 right-8 bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full z-20 shadow-xl tracking-widest uppercase">
                                        RECOMENDADO
                                    </div>
                                    <Button
                                        onClick={onUnlockPremium}
                                        disabled={isProcessing}
                                        className="w-full h-28 bg-[#00D1A0] hover:bg-[#00B88D] text-white rounded-3xl shadow-accent hover:scale-[1.02] transition-all flex items-center justify-between px-8"
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white/80">PACK PROFESIONAL</p>
                                            <p className="text-xl font-black">Ilimitado + Regalos</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-3xl font-black">17,99€</p>
                                            <p className="text-[10px] font-bold line-through opacity-60">24,99€</p>
                                        </div>
                                    </Button>
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Trust Signals */}
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 leading-tight">Garantía de Satisfacción</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 leading-tight">Pago Seguro SSL</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-[#00D1A0]/5 rounded-2xl border border-[#00D1A0]/10">
                                    <Zap className="w-5 h-5 text-[#00D1A0] fill-[#00D1A0]" />
                                    <p className="text-xs font-bold text-gray-700">
                                        Únete a las más de <span className="text-[#00D1A0]">15.000 personas</span> que ya han impulsado su carrera.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex justify-center">
                        <button
                            onClick={onEdit}
                            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Probablemente prefieras el otro diseño
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile / Sticky Bottom Bar - Redesigned */}
            <div className="xl:hidden fixed bottom-12 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
                <div className="bg-gray-900/90 backdrop-blur-2xl rounded-[2.5rem] p-4 shadow-strong flex items-center gap-4 border border-white/10">
                    <div className="flex-1 space-y-1 pl-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Desde</p>
                        <p className="text-2xl font-black text-white">4,99€</p>
                    </div>
                    <Button
                        onClick={onUnlockPremium}
                        disabled={isProcessing}
                        className="flex-[2] bg-[#00D1A0] hover:bg-[#00B88D] text-white h-16 rounded-[1.75rem] font-black text-lg shadow-accent"
                    >
                        {isProcessing ? "..." : "Desbloquear Todo"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

