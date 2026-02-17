import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload, FileText, Zap, Target, CheckCircle2,
  ArrowRight, Star, Shield, Clock, Sparkles, TrendingUp,
  ChevronDown, Plus, Quote
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      {/* Hero Section - Premium SaaS style */}
      <section className="pt-24 pb-20 md:pt-36 md:pb-32 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"
          />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2.5 bg-white border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold shadow-soft animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Inteligencia Artificial Avanzada
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight text-foreground">
                  Tu CV, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Optimizado.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                  Supera los filtros ATS y destaca ante los reclutadores. Analizamos y reconstruimos tu perfil profesional con tecnología líder.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/analyzer">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto gap-3 text-lg px-12 py-8 shadow-accent hover:scale-105 transition-all duration-300 rounded-2xl">
                    <Upload className="w-6 h-6" />
                    Analizar mi CV
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto gap-3 text-lg px-12 py-8 border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 rounded-2xl">
                    Ver procesos
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-8 pt-6 border-t border-gray-100 italic text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Puntuación real ATS
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Privacidad Garantizada
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              {/* Main Card - Glassmorphism */}
              <div className="relative z-10 glass rounded-[2.5rem] p-10 shadow-strong animate-float">
                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
                  <div className="flex items-center justify-between border-b pb-6">
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Diagnóstico ATS</h3>
                      <p className="text-2xl font-black text-foreground">Análisis Final</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-black text-primary animate-counter">87</span>
                      <span className="text-xl font-bold text-muted-foreground ml-1">/100</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Optimización General</span>
                        <span className="text-primary">87%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full shadow-glow" style={{ width: "87%" }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Formato</p>
                        <p className="font-bold text-green-600 flex items-center gap-1 text-sm">
                          <CheckCircle2 className="w-3 h-3" /> Impecable
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Keywords</p>
                        <p className="font-bold text-yellow-600 text-sm">Optimizar 4</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-14 rounded-xl bg-gray-900 border-none text-white hover:bg-gray-800 font-bold transition-all shadow-lg">
                    Ver Reporte Detallado
                  </Button>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl animate-bounce-slow">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-white p-5 rounded-3xl shadow-accent font-bold text-sm">
                  +15% Entrevistas
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -inset-10 bg-primary/10 rounded-[4rem] blur-[80px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-20 border-y border-gray-100 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="max-w-xs space-y-2">
              <h2 className="text-3xl font-black text-foreground">Resultados <br className="hidden md:block" /> Reales.</h2>
              <p className="text-sm text-muted-foreground font-medium">Ayudamos a profesionales a destacar en el mercado laboral competitivo.</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-12 lg:gap-24">
              <div className="space-y-1">
                <div className="text-4xl font-black text-foreground tracking-tighter">75%</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Tasa de Rechazo ATS</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-foreground tracking-tighter">6s</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Revisión Inicial</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-foreground tracking-tighter">+5k</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Usuarios Activos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Modern Steps */}
      <section id="como-funciona" className="py-24 md:py-32 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
              Diseñado para el <span className="text-primary">Éxito.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Transformamos tu trayectoria en una candidatura ganadora con un proceso optimizado.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -translate-y-1/2" />

            {[
              {
                step: "01",
                icon: Upload,
                title: "Diagnóstico",
                desc: "Sube tu archivo y nuestra IA detectará instantáneamente fallos estructurales y de contenido."
              },
              {
                step: "02",
                icon: Zap,
                title: "Optimización",
                desc: "Reconstruimos tu propuesta de valor, integrando keywords y logros cuantificables."
              },
              {
                step: "03",
                icon: Target,
                title: "Descarga",
                desc: "Obtén versiones profesionales (Ejecutiva o Moderna) listas para superar cualquier ATS."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-medium hover:shadow-strong transition-all duration-500 relative z-10 hover:-translate-y-2">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-accent group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-gray-100 group-hover:text-primary/10 transition-colors duration-500">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - High Contrast Grid */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6 flex flex-col justify-center text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1]">
                Tecnología <br /> de Vanguardia.
              </h2>
              <p className="text-muted-foreground font-medium text-lg">
                No es solo una plantilla. Es ingeniería de carrera aplicada a tu búsqueda de empleo.
              </p>
              <div className="pt-4 flex justify-center lg:justify-start">
                <Link to="/analyzer">
                  <Button variant="outline" className="rounded-full px-8 py-6 font-bold border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary flex items-center gap-2 transition-all">
                    Explorar tecnología <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Algoritmos ATS Reales", desc: "Simulamos el comportamiento de los filtros empresariales más usados." },
                { icon: TrendingUp, title: "Keywords Predictores", desc: "Análisis semántico para identificar qué falta para el puesto deseado." },
                { icon: FileText, title: "Formatos Estándar", desc: "PDFs generados con estructura limpia, garantizando 100% de lectura." },
                { icon: Sparkles, title: "Redacción de Impacto", desc: "La IA mejora cada frase para proyectar autoridad y resultados." }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-soft hover:border-primary/30 transition-all group cursor-default"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Invierte en tu <span className="text-primary italic">Futuro.</span></h2>
            <p className="text-lg text-muted-foreground font-medium">Planes flexibles para cada etapa de tu búsqueda laboral.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border border-gray-100 bg-gray-50/30 flex flex-col hover:border-primary/20 transition-all"
            >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block underline">CV Básico</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-foreground">4.99€</span>
                  <span className="text-muted-foreground font-bold">/cv</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {["2 Descargas de CV", "Sin marca de agua", "Versiones Formal y Creativa", "Optimización ATS Básica"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/analyzer">
                <Button variant="outline" className="w-full h-16 rounded-2xl font-bold text-lg border-2 hover:bg-gray-100 hover:text-gray-900 transition-all">Comenzar ahora</Button>
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border-2 border-primary bg-primary/[0.02] flex flex-col relative shadow-strong"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-accent">Mejor Valor</div>
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block underline">CV Premium</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-foreground">17.99€</span>
                  <span className="text-muted-foreground font-bold">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {["Descargas ILIMITADAS", "Análisis ATS Prioritario", "Soporte Personalizado 24/7", "Actualizaciones de por vida"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-foreground">
                    <Zap className="w-5 h-5 text-primary fill-primary/20" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/analyzer">
                <Button className="w-full h-16 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-white shadow-accent">Acceso Ilimitado</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4">Preguntas Frecuentes</h2>
            <p className="text-muted-foreground font-medium">Todo lo que necesitas saber sobre T2W CV Builder.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "¿Es realmente compatible con sistemas ATS?", a: "Sí, nuestros formatos han sido testeados con los principales ATS (Workday, Taleo, Greenhouse) para asegurar que el parseo de datos sea del 100%." },
              { q: "¿Qué diferencia hay entre la versión Formal y Creativa?", a: "La versión Formal está optimizada para sectores tradicionales como banca o consultoría, mientras que la Creativa destaca en tecnología, startups y diseño." },
              { q: "¿Mis datos están seguros?", a: "Absolutamente. No almacenamos tus datos personales sin tu consentimiento y utilizamos encriptación de grado bancario para procesar cualquier información." }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-muted-foreground text-sm font-medium leading-relaxed border-t border-gray-50 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - High Impact */}
      <section className="py-20 pb-40">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 shadow-strong">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[50%] h-[150%] bg-primary/20 blur-[120px] -rotate-45 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[100%] bg-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 px-8 py-24 md:py-32 text-center space-y-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Empieza hoy la transformación <br className="hidden md:block" /> de tu <span className="text-primary italic">Futuro Profesional.</span>
              </h2>
              <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Toma el control de tu carrera. Únete a los profesionales que ya no dependen de la suerte, sino de la optimización real.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                <Link to="/analyzer">
                  <Button size="xl" variant="hero" className="w-full sm:w-auto h-20 px-14 text-xl font-black rounded-2xl shadow-accent hover:scale-105 transition-all">
                    Optimizar mi CV Gratis
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center items-center gap-6 pt-8 text-gray-500 text-sm font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Sin Registro
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Diagnóstico Real
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
