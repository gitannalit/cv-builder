import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Upload, LogIn, LayoutDashboard, LogOut, Menu, X, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    setIsMenuOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { title: "Cómo funciona", href: "/#como-funciona" },
    { title: "Training2Work", href: "https://training2work.com", external: true },
    { title: "Cursos", href: "https://cursos.training2work.com", external: true },
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2.5 group transition-all z-50">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-foreground">T2W</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary leading-none">CV Builder</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.title}
              </a>
            ) : (
              <a
                key={link.title}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.title}
              </a>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop User Actions - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="font-semibold text-sm h-10 px-4 rounded-xl">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive transition-colors h-10 w-10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-sm h-10 px-4 rounded-xl">
                  <LogIn className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              </Link>
            )}

            <Link to="/analyzer">
              <Button size="sm" variant="hero" className="font-bold text-sm h-10 px-6 shadow-accent hover:scale-105 transition-all rounded-xl">
                <Upload className="w-4 h-4 mr-2 shrink-0" />
                <span className="whitespace-nowrap">Analizar Gratis</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden z-[60] h-10 w-10 text-foreground relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-[100dvh] w-[280px] bg-white shadow-2xl z-[55] lg:hidden flex flex-col"
            >
              <div className="flex flex-col h-full p-6 pt-12">
                <div className="space-y-4 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">Menú</p>
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <a
                        key={link.title}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="flex items-center px-4 py-3 text-sm font-bold text-foreground hover:bg-gray-50 hover:text-primary transition-all rounded-xl"
                      >
                        {link.title}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="mt-auto space-y-4 pb-16 pb-[env(safe-area-inset-bottom)]">
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-2 pt-1">
                    {user ? (
                      <>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex-1">
                          <Button variant="ghost" className="w-full h-12 px-3 font-bold rounded-xl gap-2 border border-gray-100 bg-gray-50/50 text-[11px]">
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            Panel
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="h-12 w-12 flex items-center justify-center rounded-xl text-destructive hover:bg-destructive/5 border border-destructive/10"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
                        <Button variant="ghost" className="w-full h-12 px-3 font-bold rounded-xl gap-2 border border-gray-100 bg-gray-50/50 text-[11px]">
                          <LogIn className="w-4 h-4 text-primary" />
                          Acceder
                        </Button>
                      </Link>
                    )}

                    <Link to="/analyzer" onClick={() => setIsMenuOpen(false)} className="flex-[1.5]">
                      <Button variant="hero" className="w-full h-12 rounded-xl font-black shadow-accent gap-2 text-[11px]">
                        <Sparkles className="w-4 h-4" />
                        Analizar CV
                      </Button>
                    </Link>
                  </div>
                  <p className="text-center text-[9px] font-medium text-muted-foreground">
                    Training2Work © 2026
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
