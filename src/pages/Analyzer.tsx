import { useState, useRef, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Sparkles, BarChart3, FileText, Loader2, Target, Layers, Download, CheckCircle2, ArrowRight, AlertTriangle, Info, TrendingUp, Printer, Check, Zap, Briefcase, GraduationCap, Mail, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult, ActionPlan, CVVersion, CVData } from "@/types/cv";
import { LockedCVPreview } from "@/components/analyzer/LockedCVPreview";
import { CVVersionsCard } from "@/components/analyzer/CVVersionsCard";
import { StripeEmbeddedCheckout } from "@/components/analyzer/StripeEmbeddedCheckout";
import { extractTextFromPDF } from "@/lib/pdfExtractor";
import { analyzeCVText, generateActionPlan, generateCVVersions, extractCVData } from "@/lib/cvAnalyzer";
import { downloadTemplatePDF } from "@/lib/templatePdfGenerator";
import { downloadATSGuidePDF } from "@/lib/atsGuide";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";


const Analyzer = () => {
  const { user } = useAuth();
  const [cvText, setCVText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isGeneratingVersions, setIsGeneratingVersions] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [cvVersions, setCVVersions] = useState<{ formal: CVVersion; creative: CVVersion } | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtractingPDF, setIsExtractingPDF] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [keyAchievements, setKeyAchievements] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<'formal' | 'creative' | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<CVData> | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [downloadCount, setDownloadCount] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [generateSummary, setGenerateSummary] = useState(true);
  // Available contact options from CV extraction
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [availableEmails, setAvailableEmails] = useState<string[]>([]);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isVerifiedPDF, setIsVerifiedPDF] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      // Fetch profile name
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (data?.full_name) {
          setName(data.full_name);
        }
      };
      fetchProfile();
      if (user.email) checkPaymentStatus(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (email && email.includes('@') && email.includes('.')) {
      checkPaymentStatus(email);
    }
  }, [email]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('cv_analyzer_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.analysisResult) setAnalysisResult(state.analysisResult);
        if (state.actionPlan) setActionPlan(state.actionPlan);
        if (state.cvVersions) setCVVersions(state.cvVersions);
        if (state.extractedData) setExtractedData(state.extractedData);
        if (state.name) setName(state.name);
        if (state.email) setEmail(state.email);
        if (state.targetJob) setTargetJob(state.targetJob);
        if (state.experienceYears) setExperienceYears(state.experienceYears);
        if (state.cvText) setCVText(state.cvText);
        if (state.selectedVersion) setSelectedVersion(state.selectedVersion);
        if (state.isUnlocked) setIsUnlocked(state.isUnlocked);
        if (state.isCustomizing) setIsCustomizing(state.isCustomizing);
        if (state.selectedKeywords) setSelectedKeywords(state.selectedKeywords);
        if (state.generateSummary !== undefined) setGenerateSummary(state.generateSummary);
        if (state.hasActivePlan !== undefined) setHasActivePlan(state.hasActivePlan);
        if (state.currentPlan !== undefined) setCurrentPlan(state.currentPlan);
        if (state.downloadCount !== undefined) setDownloadCount(state.downloadCount);
        if (state.isVerifiedPDF !== undefined) setIsVerifiedPDF(state.isVerifiedPDF);

        // If we have an email, verify status immediately
        if (state.email && state.email.includes('@')) {
          checkPaymentStatus(state.email);
        }
      } catch (e) {
        console.error("Error loading state:", e);
      }
    }
  }, []);

  // Save state to localStorage when important data changes
  useEffect(() => {
    const state = {
      analysisResult,
      actionPlan,
      cvVersions,
      extractedData,
      name,
      email,
      targetJob,
      experienceYears,
      cvText,
      selectedVersion,
      isUnlocked,
      isCustomizing,
      selectedKeywords,
      generateSummary,
      hasActivePlan,
      currentPlan,
      downloadCount,
      isVerifiedPDF
    };
    localStorage.setItem('cv_analyzer_state', JSON.stringify(state));
  }, [analysisResult, actionPlan, cvVersions, extractedData, name, email, targetJob, experienceYears, cvText, selectedVersion, isUnlocked, isCustomizing, selectedKeywords, generateSummary, hasActivePlan, currentPlan, downloadCount, isVerifiedPDF]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      handleVerifyPayment(sessionId);
    }
  }, []);

  const handleVerifyPayment = async (sessionId: string) => {
    setIsProcessingPayment(true);
    toast.loading("Verificando pago...");
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      if (error) throw error;
      if (data.success) {
        toast.dismiss();
        toast.success("¡Pago verificado con éxito!");
        setIsUnlocked(true);
        setHasActivePlan(true);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        toast.dismiss();
        toast.error("El pago no se ha completado.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.dismiss();
      toast.error("Error al verificar el pago");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const step = useMemo(() => {
    if (isAnalyzing) return "analyzing";
    if (isGeneratingVersions) return "generating";
    if (selectedVersion) {
      return isUnlocked ? "final" : "visual";
    }
    if (cvVersions) return "versions";
    if (isCustomizing) return "questions";
    if (analysisResult) return "results";
    return "form";
  }, [isAnalyzing, isGeneratingVersions, selectedVersion, isUnlocked, cvVersions, isCustomizing, analysisResult]);

  const [useSmartScan, setUseSmartScan] = useState(false);

  const handleFileUpload = async (file: File, forceSmartScan: boolean = false) => {
    if (file.type !== "application/pdf" && file.type !== "text/plain") {
      toast.error("Por favor, sube un archivo PDF o TXT");
      return;
    }

    const effectiveSmartScan = file.type === "application/pdf";

    setIsExtractingPDF(true);
    try {
      toast.loading(effectiveSmartScan ? "Analizando tu CV con IA..." : "Extrayendo texto...");
      let text = "";
      if (file.type === "application/pdf") {
        if (effectiveSmartScan) {
          const { extractImageFromPDF, checkForVerifiedMetadata } = await import("@/lib/pdfExtractor");
          const { transcribeCV } = await import("@/lib/cvAnalyzer");

          // Check if it's a verified PDF (generated by us)
          const isVerified = await checkForVerifiedMetadata(file);
          setIsVerifiedPDF(isVerified);
          if (isVerified) {
            toast.success("CV Verificado detectado - Análisis optimizado activo");
          }

          // 1. Convert PDF page 1 to Image Base64
          const imageBase64 = await extractImageFromPDF(file);

          // 2. Send Image to AI to transcribe text
          toast.loading("Analizando imagen con IA...");
          text = await transcribeCV(imageBase64);

          if (!text) {
            throw new Error("No se pudo leer texto de la imagen");
          }
        } else {
          text = await extractTextFromPDF(file);

          // Check if extraction failed (likely an image-based PDF)
          if (!text || text.trim().length < 50) {
            toast.dismiss();
            // Show a prominent suggestion
            toast.custom((t) => (
              <div className="bg-white p-4 rounded-lg shadow-lg border border-red-200 flex flex-col gap-3 max-w-md pointer-events-auto">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Ooops! No pudimos leer tu PDF</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Parece que tu documento no tiene texto seleccionable (es una imagen o escaneo).
                    </p>
                  </div>
                  <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>

                <Button
                  size="sm"
                  className="bg-[#00d1a0] hover:bg-[#00b88d] text-white w-full gap-2 font-semibold"
                  onClick={() => {
                    toast.dismiss(t);
                    setUseSmartScan(true);
                    // Retry automatically with smart scan enabled
                    handleFileUpload(file, true);
                  }}
                >
                  <Zap className="w-4 h-4" />
                  Activar Escaneo Inteligente y Reintentar
                </Button>
              </div>
            ), { duration: Infinity }); // Keep open until user interacts

            setCVText("");
            return;
          }
        }
      } else {
        text = await file.text();
      }
      setCVText(text);
      setUploadedFileName(file.name);
      toast.dismiss();
      toast.success(effectiveSmartScan ? "Análisis inteligente completado" : "Texto extraído correctamente");
    } catch (error) {
      toast.dismiss();
      toast.error("Error al procesar el archivo: " + (error instanceof Error ? error.message : "Error desconocido"));
      console.error(error);
    } finally {
      setIsExtractingPDF(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      toast.error("Por favor, introduce el texto de tu CV");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setActionPlan(null);
    setCVVersions(null);

    try {
      const result = await analyzeCVText(cvText, {
        name,
        email,
        targetJob,
        experienceYears,
        verified: isVerifiedPDF
      });
      console.log("Frontend Analysis Result:", result);
      setAnalysisResult(result);

      // Also generate action plan and extract data automatically
      try {
        const [plan, data] = await Promise.all([
          generateActionPlan(cvText),
          extractCVData(cvText)
        ]);
        setActionPlan(plan);
        setExtractedData(data);

        // Store available options for user selection if multiple exist
        const extData = data as any;
        if (extData.names && extData.names.length > 0) {
          setAvailableNames(extData.names);
        }
        if (extData.emails && extData.emails.length > 0) {
          setAvailableEmails(extData.emails);
        }

        // Set default values from primary extracted data
        if (data.personalInfo?.fullName) setName(data.personalInfo.fullName);
        if (data.personalInfo?.email) setEmail(data.personalInfo.email);
      } catch (extraError) {
        console.error("Extra analysis error:", extraError);
      }

      toast.success("Análisis completado");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Error al analizar el CV");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateActionPlan = async () => {
    if (!cvText.trim()) return;

    setIsGeneratingPlan(true);
    try {
      const plan = await generateActionPlan(cvText);
      setActionPlan(plan);
      toast.success("Plan de acción generado");
    } catch (error) {
      console.error("Action plan error:", error);
      toast.error("Error al generar el plan de acción");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleGenerateVersions = async () => {
    if (!cvText.trim()) return;

    setIsGeneratingVersions(true);
    setIsCustomizing(false);
    try {
      const versions = await generateCVVersions(
        cvText,
        targetJob,
        name,
        email,
        keyAchievements,
        selectedKeywords,
        generateSummary
      );
      setCVVersions(versions);
      toast.success("Versiones generadas");
    } catch (error) {
      console.error("Versions error:", error);
      toast.error("Error al generar las versiones");
    } finally {
      setIsGeneratingVersions(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setActionPlan(null);
    setCVVersions(null);
    setSelectedVersion(null);
    setCVText("");
    setUploadedFileName(null);
    setGenerateSummary(true);
    setIsVerifiedPDF(false);
    // Note: We intentionally don't reset payment-related state here 
    // (isUnlocked, hasActivePlan, currentPlan, downloadCount)
    // so that the user keeps their access for the new analysis.

    // Create a version of the state without the analysis data but keeping payment info
    const stateToSave = {
      email,
      name,
      isUnlocked,
      hasActivePlan,
      currentPlan,
      downloadCount
    };
    localStorage.setItem('cv_analyzer_state', JSON.stringify(stateToSave));
  };

  const handleContinueToQuestions = () => {
    setIsCustomizing(true);
  };

  const checkPaymentStatus = async (userEmail: string) => {
    setIsCheckingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-payment-status', {
        body: { email: userEmail }
      });
      if (error) throw error;
      setHasActivePlan(data.hasAccess);
      setCurrentPlan(data.planType || null);
      setDownloadCount(data.count || 0);
      if (data.hasAccess) setIsUnlocked(true);
      return data;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return { hasAccess: false };
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleUnlockBasic = async () => {
    setIsProcessingPayment(true);
    const cleanUrl = window.location.origin + window.location.pathname;
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          email,
          planType: 'basic',
          amount: 499,
          planName: 'CV Básico (2 descargas)',
          successUrl: cleanUrl,
          cancelUrl: cleanUrl,
        }
      });
      if (error) throw error;
      if (data.clientSecret) {
        setStripeClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Error al iniciar el pago");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUnlockPremium = async () => {
    setIsProcessingPayment(true);
    const cleanUrl = window.location.origin + window.location.pathname;
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          email,
          planType: 'premium',
          amount: 1799,
          planName: 'CV Premium (Ilimitado)',
          successUrl: cleanUrl,
          cancelUrl: cleanUrl,
        }
      });
      if (error) throw error;
      if (data.clientSecret) {
        setStripeClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Error al iniciar el pago");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#10B981]"; // Green
    if (score >= 60) return "text-[#F59E0B]"; // Orange/Gold
    return "text-[#EF4444]"; // Red
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-[#10B981]";
    if (score >= 60) return "bg-[#F59E0B]";
    return "bg-[#EF4444]";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleDownload = async () => {
    if (cvVersions && selectedVersion) {
      try {
        toast.loading("Generando PDF...");

        // Record download in DB
        const { data, error } = await supabase.functions.invoke('check-payment-status', {
          body: { email, action: 'record_download' }
        });

        if (error) throw error;

        if (!data.hasAccess) {
          toast.dismiss();
          setIsUnlocked(false);
          toast.error("Has alcanzado el límite de descargas de tu plan.");
          return;
        }

        const version = cvVersions[selectedVersion];
        const templateType = selectedVersion === 'formal' ? 'executive' : 'creative';
        const userData = { name, email, targetJob };

        // Use real PDF download instead of print dialog
        await downloadTemplatePDF(version, templateType, false, userData);

        toast.dismiss();
        toast.success("PDF descargado correctamente");
        setDownloadCount(data.count);
      } catch (error) {
        console.error("Error downloading PDF:", error);
        toast.dismiss();
        toast.error("Error al generar el PDF. Inténtalo de nuevo.");
      }
    } else {
      window.print();
    }
  };

  const handleSendEmail = async () => {
    if (!cvVersions || !selectedVersion) return;
    if (!email || !email.includes('@')) {
      toast.error('Introduce un email válido arriba para enviar el CV');
      return;
    }

    try {
      toast.loading('Generando PDF...');
      const version = cvVersions[selectedVersion];
      const templateType = selectedVersion === 'formal' ? 'executive' : 'creative';
      const userData = { name, email, targetJob };

      // Generate PDF using the same template as download
      const { generateTemplatePDFBlob } = await import('@/lib/templatePdfGenerator');
      const pdfBlob = await generateTemplatePDFBlob(version, templateType, false, userData);

      toast.loading('Enviando email...');
      const { sendCVEmail } = await import('@/lib/resendClient');
      await sendCVEmail(email, pdfBlob);
      toast.dismiss();
      toast.success('CV enviado por email');
    } catch (err) {
      console.error('Error sending email:', err);
      toast.dismiss();
      toast.error('Error al enviar el email');
    }
  };

  const handleDownloadGuide = async () => {
    if (currentPlan !== 'premium') {
      toast.error("La Guía ATS solo está disponible para usuarios con plan Premium.");
      return;
    }

    try {
      toast.loading("Generando Guía ATS...");
      await downloadATSGuidePDF(name || "Candidato");
      toast.dismiss();
      toast.success("Guía descargada correctamente");
    } catch (error) {
      console.error("Error downloading guide:", error);
      toast.dismiss();
      toast.error("Error al descargar la guía");
    }
  };

  const mockVersions = useMemo(() => {
    if (!extractedData) return null;

    const content = {
      summary: extractedData.professionalSummary || "",
      experience: (extractedData.workExperience || []).map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description
      })),
      education: (extractedData.education || []).map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate
      })),
      skills: extractedData.skills || []
    };

    return {
      formal: { type: 'formal', title: 'Versión Ejecutiva', description: '', content } as CVVersion,
      creative: { type: 'creative', title: 'Versión Moderna', description: '', content } as CVVersion
    };
  }, [extractedData]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">T2W CV Builder</span>
          </a>
          <div className="text-sm text-muted-foreground hidden sm:block">
            {step === "form" && "Paso 1 de 5: Sube tu CV"}
            {step === "analyzing" && "Analizando..."}
            {step === "results" && "Paso 2 de 5: Resultados"}
            {step === "questions" && "Paso 3 de 5: Personaliza"}
            {step === "generating" && "Generando..."}
            {step === "versions" && "Paso 4 de 5: Elige versión"}
            {step === "final" && "Paso 5 de 5: Tu CV"}
            {step === "visual" && "Vista del CV"}
          </div>
        </div>
      </header>
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">


          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  {/* Spinner exterior */}
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  {/* Icono central */}
                  <Sparkles className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-2">Analizando tu CV...</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Nuestra IA está evaluando tu currículum contra los filtros ATS más comunes
                </p>
              </motion.div>
            ) : !analysisResult ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <div className="text-center mb-10">
                  <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                    Analiza tu CV con IA
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Obtén una puntuación ATS detallada y recomendaciones personalizadas para mejorar tu currículum
                  </p>
                </div>

                {/* Card 1: Tus datos */}
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Tus datos</CardTitle>
                    <CardDescription>
                      {user
                        ? "Sesión iniciada. Usaremos tus datos de perfil."
                        : "Solo necesitamos tu nombre y email para enviarte el informe"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          placeholder="Juan Garcia"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!!user && !!name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="juan@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!!user}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Tu CV actual */}
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Tu CV actual</CardTitle>
                    <CardDescription>Sube tu CV en PDF o pega el texto directamente</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                        ${isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}
                        ${isExtractingPDF ? "opacity-50 pointer-events-none" : ""}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => document.getElementById("cv-upload")?.click()}
                    >
                      <input
                        id="cv-upload"
                        type="file"
                        accept=".pdf,.txt"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0]);
                            e.target.value = ''; // Reset to allow re-selecting same file
                          }
                        }}
                        disabled={isExtractingPDF}
                      />
                      {isExtractingPDF ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-12 h-12 text-primary animate-spin" />
                          <p className="font-medium">Procesando archivo...</p>
                        </div>
                      ) : uploadedFileName ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-12 h-12 text-green-500" />
                          <p className="font-medium">{uploadedFileName}</p>
                          <p className="text-sm text-muted-foreground">Haz clic para cambiar el archivo</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="font-medium text-lg">Arrastra tu CV aquí o haz clic para seleccionar</p>
                          <p className="text-sm text-muted-foreground">PDF, TXT (máx. 5MB)</p>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-muted-foreground font-medium">O pega el texto</span>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Pega aquí el contenido de tu CV..."
                      className="min-h-[200px] resize-none border-gray-200"
                      value={cvText}
                      onChange={(e) => setCVText(e.target.value)}
                    />

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        Usamos Escaneo Inteligente con IA para la máxima precisión
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: Información adicional */}
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Información adicional (opcional)</CardTitle>
                    <CardDescription>Nos ayuda a darte mejores recomendaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetJob">¿Qué puesto buscas?</Label>
                        <Input
                          id="targetJob"
                          placeholder="Ej: Desarrollador Full Stack"
                          value={targetJob}
                          onChange={(e) => setTargetJob(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Años de experiencia</Label>
                        <Select value={experienceYears} onValueChange={setExperienceYears}>
                          <SelectTrigger
                            id="experience"
                            className="w-35  focus:ring-0 focus:ring-offset-0 focus:border-input"
                          >
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1" className="focus:bg-[#ffc200] focus:text-black">0-1 años</SelectItem>
                            <SelectItem value="1-3" className="focus:bg-[#ffc200] focus:text-black">1-3 años</SelectItem>
                            <SelectItem value="3-5" className="focus:bg-[#ffc200] focus:text-black">3-5 años</SelectItem>
                            <SelectItem value="5-10" className="focus:bg-[#ffc200] focus:text-black">5-10 años</SelectItem>
                            <SelectItem value="10+" className="focus:bg-[#ffc200] focus:text-black">+10 años</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  variant="hero"
                  className="w-full gap-3 text-base py-6 bg-[#00D1A0] hover:bg-[#00B88D] text-white shadow-none rounded-xl transition-all"
                  onClick={handleAnalyze}
                  disabled={!cvText.trim() || isAnalyzing || isExtractingPDF || !name || !email}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analizando tu CV...
                    </>
                  ) : (
                    <>
                      Analizar mi CV gratis
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </Button>
              </motion.div>
            ) : isCustomizing ? (
              <motion.div
                key="customize"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Personaliza tu CV</h1>
                  <p className="text-muted-foreground">
                    Responde estas preguntas rápidas para generar tu CV optimizado
                  </p>
                </div>

                <Card className="border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">¿Para qué puesto quieres optimizarlo?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Ej: Desarrollador Full Stack"
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      className="py-6"
                    />
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">¿Qué logros quieres destacar?</CardTitle>
                    <CardDescription>
                      Escribe uno por línea. Estos aparecerán destacados en tu CV.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Ej: Aumenté las ventas un 30% en 6 meses&#10;Lideré un equipo de 5 personas&#10;Implementé un nuevo sistema que redujo costes un 20%"
                      value={keyAchievements}
                      onChange={(e) => setKeyAchievements(e.target.value)}
                      className="min-h-[150px] resize-none"
                    />
                  </CardContent>
                </Card>

                {analysisResult && analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                  <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Aptitudes sugeridas</CardTitle>
                      <CardDescription>
                        Selecciona las aptitudes que realmente posees para añadirlas a tu CV. No marques las que no sepas usar.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.map((keyword, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedKeywords(prev =>
                                prev.includes(keyword)
                                  ? prev.filter(k => k !== keyword)
                                  : [...prev, keyword]
                              );
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${selectedKeywords.includes(keyword)
                              ? "bg-primary text-white border-primary shadow-md"
                              : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                              }`}
                          >
                            {selectedKeywords.includes(keyword) && <Check className="w-4 h-4" />}
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Summary generation option */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                  <CardContent className="pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generateSummary}
                        onChange={(e) => setGenerateSummary(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Generar resumen profesional</span>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Si tu CV original no tiene resumen, la IA creará uno basado en tu experiencia.
                          Desmarca si prefieres no incluir resumen.
                        </p>
                      </div>
                    </label>
                  </CardContent>
                </Card>

                <Button
                  variant="hero"
                  size="xl"
                  className="w-full gap-3 bg-[#00D1A0] hover:bg-[#00B88D] text-white rounded-xl py-8 text-lg font-bold"
                  onClick={handleGenerateVersions}
                  disabled={!targetJob.trim()}
                >
                  Generar 2 versiones de mi CV
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="flex justify-center">
                  <Button variant="ghost" onClick={() => setIsCustomizing(false)} className="text-gray-400 hover:text-gray-600">
                    Volver a los resultados
                  </Button>
                </div>
              </motion.div>
            ) : isGeneratingVersions ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-2">Generando tus CVs...</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Estamos creando 2 versiones optimizadas de tu currículum con diseño profesional
                </p>
              </motion.div>
            ) : cvVersions && !selectedVersion ? (
              <motion.div
                key="choose-design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-3">Elige tu diseño</h1>
                  <p className="text-gray-500 text-lg">
                    Hemos generado 2 versiones de tu CV. Haz clic en la que más te guste para verla en detalle.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* Versión Ejecutiva */}
                  <div className="space-y-4">
                    <div
                      className={`relative bg-white rounded-3xl p-8 border-4 transition-all cursor-pointer hover:shadow-xl ${selectedVersion === 'formal' ? 'border-[#00D1A0]' : 'border-transparent shadow-sm'
                        }`}
                      onClick={() => setSelectedVersion('formal')}
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                          <Briefcase className="w-6 h-6" />
                          Versión Ejecutiva
                        </h3>
                        <p className="text-gray-500 mt-1">Ideal para banca, consultoría, empresas tradicionales</p>
                      </div>

                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                        <div className="absolute inset-0 scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none blur-[2px]">
                          {(cvVersions || mockVersions) && (
                            <CVVersionsCard
                              versions={cvVersions || mockVersions!}
                              selectedOnly="formal"
                              userData={{ name, email, targetJob }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      className={`w-full py-8 rounded-xl text-lg font-bold transition-all ${selectedVersion === 'formal'
                        ? 'bg-[#00D1A0] hover:bg-[#00B88D] text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setSelectedVersion('formal')}
                    >
                      Elegir Ejecutiva
                    </Button>
                  </div>

                  {/* Versión Moderna */}
                  <div className="space-y-4">
                    <div
                      className={`relative bg-white rounded-3xl p-8 border-4 transition-all cursor-pointer hover:shadow-xl ${selectedVersion === 'creative' ? 'border-[#00D1A0]' : 'border-transparent shadow-sm'
                        }`}
                      onClick={() => setSelectedVersion('creative')}
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                          <Sparkles className="w-6 h-6" />
                          Versión Moderna
                        </h3>
                        <p className="text-gray-500 mt-1">Ideal para startups, tecnología, marketing, diseño</p>
                      </div>

                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                        <div className="absolute inset-0 scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none blur-[2px]">
                          {(cvVersions || mockVersions) && (
                            <CVVersionsCard
                              versions={cvVersions || mockVersions!}
                              selectedOnly="creative"
                              userData={{ name, email, targetJob }}
                            />
                          )}
                        </div>
                        {selectedVersion === 'creative' && (
                          <div className="absolute top-4 right-4 w-10 h-10 bg-[#00D1A0] rounded-full flex items-center justify-center shadow-lg z-10">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      className={`w-full py-8 rounded-xl text-lg font-bold transition-all ${selectedVersion === 'creative'
                        ? 'bg-[#00D1A0] hover:bg-[#00B88D] text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setSelectedVersion('creative')}
                    >
                      Elegir Moderna
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="ghost" onClick={() => setIsCustomizing(true)} className="text-gray-400 hover:text-gray-600">
                    Cambiar personalización
                  </Button>
                </div>
              </motion.div>
            ) : cvVersions && selectedVersion ? (
              isCheckingPayment ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Verificando acceso...</p>
                </div>
              ) : !isUnlocked ? (
                <LockedCVPreview
                  version={cvVersions[selectedVersion]}
                  type={selectedVersion}
                  onEdit={() => setSelectedVersion(null)}
                  onUnlock={() => { }}
                  onUnlockBasic={handleUnlockBasic}
                  onUnlockPremium={handleUnlockPremium}
                  isProcessing={isProcessingPayment}
                  userData={{
                    name,
                    email,
                    targetJob
                  }}
                />
              ) : (
                <motion.div
                  key="versions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Tu CV optimizado</h1>
                    <p className="text-muted-foreground">
                      Aquí tienes la versión {selectedVersion === 'formal' ? 'Ejecutiva' : 'Moderna'} de tu perfil
                    </p>
                  </div>

                  <CVVersionsCard
                    versions={cvVersions}
                    selectedOnly={selectedVersion}
                    userData={{
                      name,
                      email,
                      targetJob
                    }}
                  />

                  <div className="flex flex-wrap justify-center gap-4 pb-8 no-print">
                    <Button
                      variant="hero"
                      onClick={handleDownload}
                      className="gap-2 bg-[#00D1A0] hover:bg-[#00B88D] text-white"
                    >
                      <Download className="w-5 h-5" />
                      Descargar PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadGuide}
                      className={`gap-2 ${currentPlan === 'premium' ? 'border-primary text-primary hover:bg-primary/10' : 'border-gray-300 text-gray-400 opacity-70'}`}
                    >
                      <BookOpen className="w-5 h-5" />
                      Guía ATS {currentPlan !== 'premium' && <Zap className="w-3 h-3 ml-1 fill-yellow-500 text-yellow-500" />}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSendEmail}
                      className="gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Enviar por email
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedVersion(null)} className="text-gray-600">
                      Cambiar diseño
                    </Button>
                    <Button variant="ghost" onClick={handleNewAnalysis} className="text-gray-400 hover:text-gray-600">
                      Volver al inicio
                    </Button>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Resultados del análisis</h1>
                  <p className="text-muted-foreground">
                    Hemos analizado tu CV en profundidad. Aquí tienes tu puntuación y recomendaciones detalladas.
                  </p>
                </div>

                {/* Main Score */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Puntuación ATS</p>
                        <p className={`text-6xl font-bold ${getScoreColor(analysisResult.atsScore)}`}>
                          {analysisResult.atsScore}<span className="text-2xl">/100</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {analysisResult.atsScore >= 80 ? "¡Excelente! Tu CV está bien optimizado" :
                            analysisResult.atsScore >= 60 ? "Bien, pero hay margen de mejora" :
                              "Necesita mejoras significativas"}
                        </p>
                      </div>
                      <div className="w-32 h-32 relative">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="64" cy="64" r="56"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                          />
                          <circle
                            cx="64" cy="64" r="56"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={`${(analysisResult.atsScore || 0) * 3.52} 352`}
                            className={getScoreColor(analysisResult.atsScore || 0)}
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-primary/10 flex justify-center">
                      <div className="text-center">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Rango Salarial Estimado</p>
                        <p className="text-2xl font-bold text-primary">
                          {analysisResult.salaryRange ? (
                            `${analysisResult.salaryRange.min.toLocaleString()}€ - ${analysisResult.salaryRange.max.toLocaleString()}€`
                          ) : (
                            "No disponible para este perfil"
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Basado en mercado español actual</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: "Formato", score: (analysisResult as any).formatScore || (analysisResult as any).format_score || 0, desc: "Estructura y legibilidad" },
                        { label: "Keywords", score: (analysisResult as any).keywordsScore || (analysisResult as any).keywords_score || 0, desc: "Palabras clave del sector" },
                        { label: "Experiencia", score: (analysisResult as any).experienceScore || (analysisResult as any).experience_score || 0, desc: "Presentación de logros" },
                        { label: "Habilidades", score: (analysisResult as any).skillsScore || (analysisResult as any).skills_score || 0, desc: "Competencias técnicas" },
                        { label: "Logros", score: (analysisResult as any).achievementsScore || (analysisResult as any).achievements_score || 0, desc: "Resultados cuantificables" },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                          <p className={`text-xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                          <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                            <div
                              className={`h-full rounded-full ${getScoreBgColor(item.score)}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Problems */}
                {analysisResult && Array.isArray(analysisResult.problems) && analysisResult.problems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Problemas detectados ({analysisResult.problems.length})
                      </CardTitle>
                      <CardDescription>
                        Estos son los puntos que debes mejorar para aumentar tu puntuación ATS
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.problems.map((problem: any, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            {getSeverityIcon(problem.severity || 'info')}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-200">
                                  {problem.category || 'General'}
                                </span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${(problem.severity || '').toLowerCase() === "critical" ? "bg-red-100 text-red-700" :
                                  (problem.severity || '').toLowerCase() === "warning" ? "bg-yellow-100 text-yellow-700" :
                                    "bg-blue-100 text-blue-700"
                                  }`}>
                                  {(problem.severity || '').toLowerCase() === "critical" ? "Crítico" :
                                    (problem.severity || '').toLowerCase() === "warning" ? "Importante" : "Sugerencia"}
                                </span>
                              </div>
                              <p className="font-medium text-gray-900">{problem.message || problem.problem || problem.issue || problem.descripcion}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                <strong>Solución:</strong> {problem.suggestion || problem.solution || problem.solucion || problem.recomendacion || "No se proporcionó una solución específica."}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Missing Keywords */}
                {analysisResult.missingKeywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Palabras clave que faltan
                      </CardTitle>
                      <CardDescription>
                        Añade estas palabras clave para mejorar tu visibilidad en los filtros ATS
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(analysisResult.missingKeywords || []).map((keyword, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            + {keyword}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Plan */}
                {actionPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Tu plan de acción personalizado
                      </CardTitle>
                      <CardDescription>
                        Sigue estos pasos para maximizar tus posibilidades de conseguir entrevistas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs">1</span>
                              Acciones inmediatas
                            </h4>
                            <ul className="space-y-2 ml-8">
                              {(actionPlan.immediate || []).map((item: any, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium">{item.action || item.title || item.accion}</span>
                                    {(item.howTo || item.how_to || item.description || item.descripcion) && (
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {item.howTo || item.how_to || item.description || item.descripcion}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs">2</span>
                              Esta semana
                            </h4>
                            <ul className="space-y-2 ml-8">
                              {(actionPlan.shortTerm || []).map((item: any, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium">{item.action || item.title || item.accion}</span>
                                    {(item.howTo || item.how_to || item.description || item.descripcion) && (
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {item.howTo || item.how_to || item.description || item.descripcion}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">3</span>
                              Este mes
                            </h4>
                            <ul className="space-y-2 ml-8">
                              {(actionPlan.longTerm || []).map((item: any, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium">{item.action || item.title || item.accion}</span>
                                    {(item.howTo || item.how_to || item.description || item.descripcion) && (
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {item.howTo || item.how_to || item.description || item.descripcion}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {actionPlan.trainingRecommendations.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Formación recomendada
                              </h4>
                              <ul className="space-y-2 ml-8">
                                {(actionPlan.trainingRecommendations || []).map((item: any, i) => {
                                  const course = typeof item === 'string' ? item : (item.course || item.course_name || item.curso);
                                  const provider = typeof item === 'string' ? null : (item.provider || item.provider_name || item.proveedor);
                                  const reason = typeof item === 'string' ? null : (item.reason || item.why || item.motivo);
                                  return (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                      <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="font-medium">{course}</span>
                                        {provider && <span className="text-muted-foreground"> - {provider}</span>}
                                        {reason && <p className="text-xs text-muted-foreground mt-0.5">{reason}</p>}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Botones de acción finales */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="xl"
                    className="flex-1 gap-3 bg-[#00D1A0] hover:bg-[#00B88D] text-white rounded-xl py-7 text-lg font-bold shadow-lg shadow-[#00D1A0]/20"
                    onClick={handleContinueToQuestions}
                  >
                    <Sparkles className="w-5 h-5" />
                    Generar CV optimizado
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="flex-1 gap-3 border-gray-200 text-gray-700 rounded-xl py-7 text-lg font-bold hover:bg-gray-50"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-5 h-5" />
                    Imprimir informe
                  </Button>
                </div>

                <div className="flex justify-center pb-8">
                  <Button variant="ghost" onClick={handleNewAnalysis} className="text-gray-400 hover:text-gray-600">
                    Realizar otro análisis
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main >

      {stripeClientSecret && (
        <StripeEmbeddedCheckout
          clientSecret={stripeClientSecret}
          onClose={() => setStripeClientSecret(null)}
        />
      )}

      <footer className="border-t mt-auto py-8 bg-white no-print">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Training to Work. Todos los derechos reservados.</p>
          <p className="mt-1">
            <a href="https://training2work.com" className="text-primary hover:underline">
              training2work.com
            </a>
          </p>
        </div>
      </footer>
    </div >
  );
};

export default Analyzer;
