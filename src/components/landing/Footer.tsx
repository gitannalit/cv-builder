import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl text-white" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-2.5 group transition-all">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-accent">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight">T2W</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary leading-none">CV Builder</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm font-medium max-w-xs text-center md:text-left">
              Potenciando la empleabilidad con inteligencia artificial y diseño profesional.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-sm font-bold uppercase tracking-widest text-gray-400">
            <a href="https://training2work.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Training to Work
            </a>
            <a href="https://cursos.training2work.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Cursos
            </a>
            <Link to="/terminos" className="hover:text-primary transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Training to Work. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
