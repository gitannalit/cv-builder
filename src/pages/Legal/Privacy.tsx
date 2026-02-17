import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function Privacy() {
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
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Política de Privacidad</h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-muted-foreground font-medium">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">1. Recopilación de Información</h2>
                            <p>
                                Recopilamos información personal necesaria para la prestación de nuestros servicios, incluyendo nombre, correo electrónico y contenido de los currículums subidos para su análisis.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">2. Uso de los Datos</h2>
                            <p>
                                Sus datos se utilizan exclusivamente para:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Realizar el análisis y optimización de su CV.</li>
                                <li>Gestionar su cuenta y suscripción.</li>
                                <li>Enviar comunicaciones relacionadas con el servicio.</li>
                                <li>Mejorar nuestros algoritmos de IA de forma anónima.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">3. Protección de Datos</h2>
                            <p>
                                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración. Utilizamos encriptación SSL y proveedores de pago seguros (Stripe).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">4. Derechos del Usuario</h2>
                            <p>
                                Usted tiene derecho a acceder, rectificar o eliminar sus datos personales. Puede ejercer estos derechos enviando una solicitud a nuestro equipo de soporte.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">5. Conservación de Datos</h2>
                            <p>
                                Conservaremos sus datos personales solo durante el tiempo necesario para cumplir con los fines para los que fueron recopilados o para cumplir con obligaciones legales.
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
