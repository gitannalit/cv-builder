import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Upload, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2.5 group transition-all">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-foreground">T2W</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary leading-none">CV Builder</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <a href="/#como-funciona" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            Cómo funciona
          </a>
          <a href="https://training2work.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            Training2Work
          </a>
          <a href="https://cursos.training2work.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            Cursos
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="font-semibold text-sm h-10 px-4">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive transition-colors h-10 w-10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-sm h-10 px-4">
                <LogIn className="w-4 h-4 mr-2" />
                Acceder
              </Button>
            </Link>
          )}
          <Link to="/analyzer">
            <Button size="sm" variant="hero" className="font-bold text-sm h-10 px-6 shadow-accent hover:scale-105 transition-all">
              <Upload className="w-4 h-4 mr-2" />
              Analizar Gratis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
