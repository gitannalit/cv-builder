import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";

export default function Cookies() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="flex items-center gap-4 text-primary mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Cookie className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Política de Cookies</h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-muted-foreground font-medium">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">1. ¿Qué son las Cookies?</h2>
                            <p>
                                Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestro sitio web. Nos ayudan a que el sitio funcione correctamente y a mejorar su experiencia de usuario.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">2. Tipos de Cookies que Utilizamos</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-foreground">Cookies Necesarias</h3>
                                    <p>Esenciales para el funcionamiento del sitio, como el inicio de sesión y la gestión de suscripciones.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Cookies Analíticas</h3>
                                    <p>Nos permiten entender cómo los visitantes interactúan con el sitio, ayudándonos a mejorar el servicio.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Cookies de Terceros</h3>
                                    <p>Servicios externos como Stripe o Supabase pueden utilizar cookies para gestionar pagos y autenticación de forma segura.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">3. Control de Cookies</h2>
                            <p>
                                Usted puede controlar y/o eliminar las cookies en cualquier momento a través de la configuración de su navegador. Sin embargo, desactivar ciertas cookies puede afectar la funcionalidad del sitio.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">4. Consentimiento</h2>
                            <p>
                                Al utilizar nuestro sitio web, usted acepta el uso de cookies conforme a lo descrito en esta política, a menos que las haya desactivado en su navegador.
                            </p>
                        </section>

                        <p className="text-sm pt-8 border-t">
                            Última actualización: Febrero 2026
                        </p>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
