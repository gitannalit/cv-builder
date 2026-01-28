import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-soft">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl font-display tracking-tight">T2W CV Builder</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Cómo funciona
          </a>
          <a href="https://training2work.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Training to Work
          </a>
        </nav>
        <Link to="/analyzer">
          <Button size="sm" variant="hero" className="gap-2">
            <Upload className="w-4 h-4" />
            Analizar CV gratis
          </Button>
        </Link>
      </div>
    </header>
  );
}
