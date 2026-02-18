import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a session (the user should be logged in via the link)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                toast.error("Sesión expirada o inválida. Solicita un nuevo enlace.");
                navigate("/forgot-password");
            }
        });
    }, [navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast.success("Contraseña actualizada correctamente.");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar la contraseña");
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
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Nueva contraseña</h1>
                        <p className="text-muted-foreground font-medium text-sm">Introduce tu nueva contraseña a continuación.</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2.5">
                            <Label htmlFor="password" className="text-sm font-bold text-foreground">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
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
                                "Actualizar contraseña"
                            )}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
