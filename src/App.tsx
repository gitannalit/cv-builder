import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import Analyzer from "./pages/Analyzer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider sticky top-0 z-[100] shadow-sm">
          Versión 4.59 • Estado Beta
        </div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/analyzer" element={<Analyzer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
