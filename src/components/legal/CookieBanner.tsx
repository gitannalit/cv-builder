import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
                >
                    <div className="glass-dark p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <Cookie className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-white font-bold tracking-tight">Privacidad y Cookies</h3>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Utilizamos cookies para optimizar tu experiencia y analizar el tráfico. Al continuar navegando, aceptas nuestra{" "}
                            <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.
                        </p>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleAccept}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                            >
                                Aceptar todo
                            </Button>
                            <Link to="/privacidad" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold rounded-xl"
                                >
                                    Configurar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
