import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload, FileText, Zap, Target, CheckCircle2,
  ArrowRight, Star, Shield, Clock, Sparkles, TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans">
      <Header />

      {/* Hero Section - Enfocado en conversión */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Potenciado por IA
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] font-display tracking-tight">
                Descubre si tu CV pasará los{" "}
                <span className="text-primary text-gradient">filtros ATS</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                El 75% de los currículums son rechazados automáticamente por sistemas ATS antes de llegar a un humano.
                <strong className="text-foreground font-semibold"> Analiza el tuyo gratis en 2 minutos.</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/analyzer">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto gap-3 text-lg px-10 py-7 shadow-glow hover:scale-105 transition-all duration-300">
                    <Upload className="w-6 h-6" />
                    Analizar mi CV gratis
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto gap-3 text-lg px-10 py-7 hover:bg-primary/5 transition-all duration-300">
                    Ver cómo funciona
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">100% gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Sin registro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Resultados en 2 min</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-2xl -z-10 animate-pulse" />
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] p-8 border border-primary/20 shadow-strong backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Puntuación ATS</span>
                    <span className="text-4xl font-black text-primary">87/100</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary rounded-full shadow-glow" style={{ width: "87%" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase">Formato</div>
                      <div className="font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Excelente
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase">Palabras clave</div>
                      <div className="font-bold text-yellow-600">Mejorable</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase">Experiencia</div>
                      <div className="font-bold text-green-600">Bien</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase">Logros</div>
                      <div className="font-bold text-red-600">Crítico</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white shadow-strong relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-black font-display">75%</div>
              <div className="text-primary-foreground/90 text-sm font-medium uppercase tracking-widest">CVs rechazados por ATS</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black font-display">6 seg</div>
              <div className="text-primary-foreground/90 text-sm font-medium uppercase tracking-widest">Tiempo medio de revisión</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black font-display">+2.500</div>
              <div className="text-primary-foreground/90 text-sm font-medium uppercase tracking-widest">CVs analizados</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black font-display">89%</div>
              <div className="text-primary-foreground/90 text-sm font-medium uppercase tracking-widest">Mejoran su puntuación</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
              Cómo funciona
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              En 3 sencillos pasos, descubre cómo mejorar tu CV y aumentar tus posibilidades de conseguir entrevistas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                icon: Upload,
                title: "Sube tu CV",
                desc: "Solo necesitas tu nombre, email y tu CV en PDF. Sin registro, sin complicaciones."
              },
              {
                step: "2",
                icon: Target,
                title: "Recibe tu diagnóstico",
                desc: "Puntuación ATS, problemas detectados, palabras clave faltantes y recomendaciones personalizadas."
              },
              {
                step: "3",
                icon: Zap,
                title: "Genera tu nuevo CV",
                desc: "Crea un CV optimizado con IA que pase los filtros ATS y destaque ante los reclutadores."
              }
            ].map((item, index) => (
              <Card key={index} className="relative border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                <div className="absolute -top-5 -left-5 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl shadow-strong group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <CardHeader className="pt-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-display">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed pt-2">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/analyzer">
              <Button size="xl" variant="hero" className="gap-3 px-10 py-7 shadow-glow hover:scale-105 transition-all duration-300">
                Empezar análisis gratuito
                <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
              Todo lo que necesitas para conseguir trabajo
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Herramientas profesionales de empleabilidad, ahora accesibles para todos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Análisis ATS Profesional", desc: "Evaluamos tu CV con los mismos criterios que usan los sistemas de las empresas." },
              { icon: Sparkles, title: "Optimización con IA", desc: "Nuestra IA mejora tu resumen profesional y destaca tus logros de forma impactante." },
              { icon: TrendingUp, title: "Palabras Clave", desc: "Identificamos las keywords que faltan en tu CV para el puesto que buscas." },
              { icon: Shield, title: "Formato Profesional", desc: "Diseño limpio y estructurado que los reclutadores y sistemas ATS adoran." },
              { icon: Clock, title: "Resultados Inmediatos", desc: "En menos de 2 minutos tienes tu análisis completo y plan de acción." },
              { icon: Star, title: "Recomendaciones Personalizadas", desc: "Consejos específicos para tu perfil y el puesto que buscas." }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-none bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed pt-2">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 shadow-strong overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            <CardContent className="py-20 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
                ¿Listo para mejorar tu CV?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Únete a miles de profesionales que ya han mejorado su currículum y conseguido más entrevistas.
              </p>
              <Link to="/analyzer">
                <Button size="xl" variant="secondary" className="gap-3 text-lg px-12 py-8 shadow-xl hover:scale-105 transition-all duration-300 bg-white text-primary hover:bg-gray-50 border-none">
                  Analizar mi CV gratis
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
