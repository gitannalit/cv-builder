import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl font-display tracking-tight">T2W CV Builder</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-gray-400">
            <a href="https://training2work.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Training to Work
            </a>
            <a href="https://cursos.training2work.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Cursos
            </a>
            <Link to="/terminos" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Training to Work.
          </div>
        </div>
      </div>
    </footer>
  );
}
