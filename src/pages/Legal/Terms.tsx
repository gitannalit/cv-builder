import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Terms() {
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
                            <Shield className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Términos y Condiciones</h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-muted-foreground font-medium">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar T2W CV Builder, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">2. Descripción del Servicio</h2>
                            <p>
                                T2W CV Builder proporciona herramientas basadas en inteligencia artificial para el análisis y optimización de currículums vitae. El servicio incluye análisis estructural, sugerencia de palabras clave y generación de versiones optimizadas para sistemas ATS.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">3. Propiedad Intelectual</h2>
                            <p>
                                Todo el contenido, diseño, logotipos y tecnología asociados con T2W CV Builder son propiedad exclusiva de Training to Work. El usuario conserva la propiedad de los datos personales proporcionados en sus currículums.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">4. Uso Aceptable</h2>
                            <p>
                                El usuario se compromete a proporcionar información veraz y a no utilizar el servicio para fines ilícitos o fraudulentos. Queda prohibida la reproducción o explotación comercial de la plataforma sin autorización previa.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">5. Limitación de Responsabilidad</h2>
                            <p>
                                T2W CV Builder no garantiza la obtención de empleo ni resultados específicos tras el uso del servicio. La optimización es una herramienta de apoyo y la decisión final recae siempre en el reclutador o empresa externa.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">6. Modificaciones</h2>
                            <p>
                                Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio tras dichas modificaciones constituye la aceptación de los nuevos términos.
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
