import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setSubmitted(true);
            toast.success("Enlace de recuperación enviado. Revisa tu email.");
        } catch (error: any) {
            toast.error(error.message || "Error al solicitar la recuperación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden flex items-center justify-center px-4 py-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[440px]"
            >
                <div className="mb-8 flex justify-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg leading-tight tracking-tighter text-foreground uppercase">T2W</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary leading-none">CV Builder</span>
                        </div>
                    </Link>
                </div>

                <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100">
                    <div className="space-y-2 mb-10">
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Recuperar contraseña</h1>
                        <p className="text-muted-foreground font-medium text-sm">
                            {submitted
                                ? "Te hemos enviado un enlace para restablecer tu contraseña."
                                : "Introduce tu email para recibir un enlace de recuperación."}
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleResetRequest} className="space-y-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-sm font-bold text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@email.com"
                                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                ) : (
                                    "Enviar enlace"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm font-medium text-muted-foreground mb-6">
                                Si no recibes el correo en unos minutos, revisa tu carpeta de spam o intenta de nuevo.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl font-bold"
                                onClick={() => setSubmitted(false)}
                            >
                                Intentar con otro email
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            ¿Recordaste tu contraseña?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-primary hover:underline"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>

                <Link
                    to="/"
                    className="mt-8 mx-auto text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver a la página principal
                </Link>
            </motion.div>
        </div>
    );
}
