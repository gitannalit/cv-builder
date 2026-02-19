import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setError(null);
            const { error: supabaseError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                },
            });

            if (supabaseError) throw supabaseError;

            navigate("/dashboard");
        } catch (error: any) {
            let message = error.message || "Error al registrarse";
            if (message.includes("User already registered")) {
                message = "Cuenta ya registrada";
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden flex items-center justify-center px-4 py-12">
            {/* Minimal Background Decorative Element */}
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
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Crear cuenta</h1>
                        <p className="text-muted-foreground font-medium text-sm">Empieza a optimizar tu carrera profesional.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2.5">
                            <Label htmlFor="fullName" className="text-sm font-bold text-foreground">Nombre completo</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Ej: Juan Pérez"
                                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-sm font-bold text-foreground">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ejemplo@email.com"
                                className={`h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium ${error ? "border-red-500 ring-1 ring-red-500 bg-red-50/30" : ""}`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError(null);
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="password" className="text-sm font-bold text-foreground">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                className={`h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium ${error ? "border-red-500 ring-1 ring-red-500 bg-red-50/30" : ""}`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                            >
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-bold text-white leading-none">!</span>
                                </div>
                                <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
                            </motion.div>
                        )}

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                ) : (
                                    "Registrarme gratis"
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            ¿Ya tienes cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-primary hover:underline"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-[11px] text-center text-muted-foreground font-medium leading-relaxed">
                        Al registrarte, aceptas nuestros <br />
                        <Link to="/terminos" className="text-primary hover:underline">Términos</Link> y <Link to="/privacidad" className="text-primary hover:underline">Privacidad</Link>
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
