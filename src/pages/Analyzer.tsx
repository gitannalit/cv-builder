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
import { Upload, Sparkles, BarChart3, FileText, Loader2, Target, Layers, Download, CheckCircle2, ArrowRight, AlertTriangle, Info, TrendingUp, Printer, Check, Zap, Briefcase, GraduationCap, Mail, BookOpen, Plus, RotateCcw } from "lucide-react";
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
import { Link } from "react-router-dom";
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
  const [acceptedLegal, setAcceptedLegal] = useState(false);

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
    <div className="min-h-screen bg-white font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden flex flex-col">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"
        />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>
      <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50 no-print h-20 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group transition-all">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">T2W</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary leading-none">CV Builder</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {step === "form" && "Paso 1: Sube tu CV"}
                {step === "analyzing" && "Analizando..."}
                {step === "results" && "Paso 2: Resultados"}
                {step === "questions" && "Paso 3: Personaliza"}
                {step === "generating" && "Generando..."}
                {step === "versions" && "Paso 4: Elige versión"}
                {step === "final" && "Paso 5: Tu CV"}
                {step === "visual" && "Previsualización"}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">


          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 space-y-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-4 border-primary/10 border-t-primary shadow-glow"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-black text-foreground tracking-tight">Escanenado tu potencial...</h2>
                  <p className="text-muted-foreground font-medium text-lg">Nuestra IA está desglosando tu experiencia para los filtros ATS.</p>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-3 h-3 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (!analysisResult || step === "form") ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 }}
                className="max-w-4xl mx-auto space-y-10"
              >
                <div className="text-center space-y-4 mb-4">
                  <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground">
                    Analiza tu CV <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">con Inteligencia Artificial</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    Optimiza tu perfil para superar los filtros ATS y destacar ante los reclutadores en segundos.
                  </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-8">
                    {/* Card 2: Tu CV actual */}
                    <Card className="border-gray-100 shadow-strong rounded-[2.5rem] overflow-hidden glass">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-black flex items-center gap-3">
                          <FileText className="w-6 h-6 text-primary" />
                          Tu CV actual
                        </CardTitle>
                        <CardDescription className="text-base font-medium">Sube tu CV en PDF o pega el texto directamente</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div
                          className={`group relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer bg-white/50
                            ${isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50 hover:bg-white"}
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
                            <div className="flex flex-col items-center gap-4">
                              <Loader2 className="w-16 h-16 text-primary animate-spin" />
                              <p className="font-bold text-lg">Procesando archivo...</p>
                            </div>
                          ) : uploadedFileName ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                              </div>
                              <p className="font-bold text-lg">{uploadedFileName}</p>
                              <p className="text-sm font-bold text-primary group-hover:underline">Haz clic para cambiar el archivo</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                                <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors" />
                              </div>
                              <div className="space-y-2">
                                <p className="font-black text-2xl tracking-tight">Eleva tu candidatura</p>
                                <p className="text-muted-foreground font-medium">Arrastra tu archivo aquí o selecciona uno</p>
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-gray-100 rounded-full px-4 py-1.5 inline-block">PDF, TXT (MÁX. 5MB)</p>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-6 text-muted-foreground font-black tracking-widest">O PEGA EL TEXTO</span>
                          </div>
                        </div>

                        <Textarea
                          placeholder="Pega aquí el contenido de tu CV para un análisis rápido..."
                          className="min-h-[250px] resize-none border-gray-100 rounded-2xl focus:ring-primary/20 transition-all font-medium text-base p-6 bg-white/50"
                          value={cvText}
                          onChange={(e) => setCVText(e.target.value)}
                        />

                        <div className="text-center p-4 bg-primary/5 rounded-2xl flex items-center justify-center gap-3">
                          <Zap className="w-5 h-5 text-primary" />
                          <p className="text-sm font-bold text-primary">
                            Escaneo Inteligente con IA para máxima precisión
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    {/* Card 1: Tus datos */}
                    <Card className="border-gray-100 shadow-strong rounded-[2.5rem] overflow-hidden glass">
                      <CardHeader>
                        <CardTitle className="text-xl font-black">Información Personal</CardTitle>
                        <CardDescription className="font-medium">
                          {user ? "Datos vinculados a tu perfil" : "Necesarios para tu reporte"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nombre completo</Label>
                            <Input
                              id="name"
                              placeholder="Ej: Juan Garcia"
                              className="h-14 rounded-xl border-gray-100 font-bold px-5 bg-white/50"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              disabled={!!user && !!name}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email de contacto</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="juan@ejemplo.com"
                              className="h-14 rounded-xl border-gray-100 font-bold px-5 bg-white/50"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={!!user}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: Información adicional */}
                    <Card className="border-gray-100 shadow-strong rounded-[2.5rem] overflow-hidden glass">
                      <CardHeader>
                        <CardTitle className="text-xl font-black">Tu Meta</CardTitle>
                        <CardDescription className="font-medium">Para afinar el análisis</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="targetJob" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Puesto objetivo</Label>
                            <Input
                              id="targetJob"
                              placeholder="Ej: Senior Web Dev"
                              className="h-14 rounded-xl border-gray-100 font-bold px-5 bg-white/50"
                              value={targetJob}
                              onChange={(e) => setTargetJob(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Experiencia</Label>
                            <Select value={experienceYears} onValueChange={setExperienceYears}>
                              <SelectTrigger
                                id="experience"
                                className="h-14 rounded-xl border-gray-100 font-bold px-5 bg-white/50 focus:ring-0"
                              >
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-gray-100 font-bold">
                                <SelectItem value="0-1">0-1 años</SelectItem>
                                <SelectItem value="1-3">1-3 años</SelectItem>
                                <SelectItem value="3-5">3-5 años</SelectItem>
                                <SelectItem value="5-10">5-10 años</SelectItem>
                                <SelectItem value="10+">+10 años</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center h-5">
                        <input
                          id="acceptedLegal"
                          name="acceptedLegal"
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          checked={acceptedLegal}
                          onChange={(e) => setAcceptedLegal(e.target.checked)}
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="acceptedLegal" className="font-medium text-gray-700 cursor-pointer">
                          Acepto los <Link to="/terminos" className="text-primary hover:underline" target="_blank">Términos de Servicio</Link> y la <Link to="/privacidad" className="text-primary hover:underline" target="_blank">Política de Privacidad</Link>.
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">Requerido para procesar tus datos de forma segura.</p>
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      size="xl"
                      className="w-full gap-4 h-24 text-xl font-black rounded-3xl shadow-accent hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                      onClick={handleAnalyze}
                      disabled={!cvText.trim() || isAnalyzing || isExtractingPDF || !name || !email || !acceptedLegal}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-7 h-7 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          Analizar mi CV
                          <ArrowRight className="w-7 h-7" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : isCustomizing ? (
              <motion.div
                key="customize"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-10"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-black text-foreground tracking-tight">Personaliza tu Nueva Versión</h1>
                  <p className="text-lg text-muted-foreground font-medium">
                    Ajusta los últimos detalles para que el generador cree el CV perfecto para ti.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="rounded-[2.5rem] border-gray-100 shadow-strong glass overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-black">Puesto Objetivo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Ej: Senior Product Manager"
                        value={targetJob}
                        onChange={(e) => setTargetJob(e.target.value)}
                        className="h-16 rounded-2xl border-gray-100 font-bold px-6 bg-white/50 text-lg"
                      />
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2.5rem] border-gray-100 shadow-strong glass overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-black">Resumen Profesional</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <label className="flex items-start gap-4 cursor-pointer p-4 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-all">
                        <input
                          type="checkbox"
                          checked={generateSummary}
                          onChange={(e) => setGenerateSummary(e.target.checked)}
                          className="mt-1 w-6 h-6 rounded-lg border-primary/20 text-primary focus:ring-primary shadow-sm"
                        />
                        <div>
                          <span className="font-bold text-gray-900">Generar con IA</span>
                          <p className="text-xs text-muted-foreground font-medium mt-1">
                            Crearemos un perfil profesional impactante basado en tus logros.
                          </p>
                        </div>
                      </label>
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-[2.5rem] border-gray-100 shadow-strong glass overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-black">Logros a Destacar</CardTitle>
                    <CardDescription className="font-medium">
                      Introduce un máximo de 3 hitos que quieras que resalten especialmente.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Ej: Lideré la migración a AWS reduciendo costes un 40%..."
                      value={keyAchievements}
                      onChange={(e) => setKeyAchievements(e.target.value)}
                      className="min-h-[150px] resize-none border-gray-100 rounded-2xl p-6 font-medium text-lg bg-white/50"
                    />
                  </CardContent>
                </Card>

                {analysisResult && analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                  <Card className="rounded-[2.5rem] border-gray-100 shadow-strong glass overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-black">Potencia tus Aptitudes</CardTitle>
                      <CardDescription className="font-medium">
                        Selecciona las que poseas para integrarlas de forma natural en el diseño.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
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
                            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 border ${selectedKeywords.includes(keyword)
                              ? "bg-primary text-white border-primary shadow-accent scale-105"
                              : "bg-white text-gray-600 border-gray-100 hover:border-primary/30 hover:bg-gray-50"
                              }`}
                          >
                            {selectedKeywords.includes(keyword) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5 text-gray-300" />}
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-6">
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full h-24 gap-4 bg-[#00D1A0] hover:bg-[#00B88D] text-white rounded-[2rem] text-2xl font-black shadow-accent hover:scale-[1.02] transition-all"
                    onClick={handleGenerateVersions}
                    disabled={!targetJob.trim()}
                  >
                    Generar Mis Nuevos CVs
                    <ArrowRight className="w-8 h-8" />
                  </Button>

                  <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => setIsCustomizing(false)} className="text-muted-foreground font-bold hover:text-primary">
                      ← Volver al reporte
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : isGeneratingVersions ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 space-y-10"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: 360
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity },
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                    className="w-40 h-40 rounded-full border-4 border-primary/20 border-t-primary shadow-glow shadow-primary/20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black text-foreground tracking-tight">Esculpiendo tu Nuevo Perfil</h2>
                  <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                    Nuestra IA está diseñando 2 versiones de alto impacto optimizadas para resultados inmediatos.
                  </p>
                </div>
              </motion.div>
            ) : cvVersions && !selectedVersion ? (
              <motion.div
                key="choose-design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12 max-w-6xl mx-auto"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-5xl font-black text-foreground tracking-tight">Elige tu Identidad Visual</h1>
                  <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                    Hemos creado dos estrategias visuales diferentes. Selecciona la que mejor resuene con tu industria.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Versión Ejecutiva */}
                  <div className="group space-y-6">
                    <div
                      className={`relative bg-white rounded-[3rem] p-10 border-4 transition-all cursor-pointer shadow-strong hover:shadow-glow/20 ${selectedVersion === 'formal' ? 'border-[#00D1A0] scale-[1.02]' : 'border-transparent'
                        }`}
                      onClick={() => setSelectedVersion('formal')}
                    >
                      <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                          <Briefcase className="w-7 h-7 text-gray-400 group-hover:text-primary" />
                        </div>
                        <h3 className="text-2xl font-black">Línea Ejecutiva</h3>
                        <p className="text-muted-foreground font-medium mt-1">Estructura sobria para entornos corporativos</p>
                      </div>

                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50/50 group-hover:bg-white transition-colors">
                        <div className="absolute inset-0 scale-[0.38] origin-top-left w-[265%] h-[265%] pointer-events-none blur-[1px] opacity-80 group-hover:opacity-100 transition-opacity">
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
                      className={`w-full h-20 rounded-2xl text-xl font-black transition-all shadow-soft ${selectedVersion === 'formal'
                        ? 'bg-[#00D1A0] hover:bg-[#00B88D] text-white shadow-accent'
                        : 'bg-white border-none text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setSelectedVersion('formal')}
                    >
                      Seleccionar Ejecutiva
                    </Button>
                  </div>

                  {/* Versión Moderna */}
                  <div className="group space-y-6">
                    <div
                      className={`relative bg-white rounded-[3rem] p-10 border-4 transition-all cursor-pointer shadow-strong hover:shadow-glow/20 ${selectedVersion === 'creative' ? 'border-[#00D1A0] scale-[1.02]' : 'border-transparent'
                        }`}
                      onClick={() => setSelectedVersion('creative')}
                    >
                      <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                          <Sparkles className="w-7 h-7 text-gray-400 group-hover:text-primary" />
                        </div>
                        <h3 className="text-2xl font-black">Influencia Moderna</h3>
                        <p className="text-muted-foreground font-medium mt-1">Dinámico e ideal para startups y tecnología</p>
                      </div>

                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50/50 group-hover:bg-white transition-colors">
                        <div className="absolute inset-0 scale-[0.38] origin-top-left w-[265%] h-[265%] pointer-events-none blur-[1px] opacity-80 group-hover:opacity-100 transition-opacity">
                          {(cvVersions || mockVersions) && (
                            <CVVersionsCard
                              versions={cvVersions || mockVersions!}
                              selectedOnly="creative"
                              userData={{ name, email, targetJob }}
                            />
                          )}
                        </div>

                      </div>
                    </div>
                    <Button
                      className={`w-full h-20 rounded-2xl text-xl font-black transition-all shadow-soft ${selectedVersion === 'creative'
                        ? 'bg-[#00D1A0] hover:bg-[#00B88D] text-white shadow-accent'
                        : 'bg-white border-none text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setSelectedVersion('creative')}
                    >
                      Seleccionar Moderna
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button variant="ghost" onClick={() => setIsCustomizing(true)} className="text-muted-foreground font-bold hover:text-primary">
                    ← Refinar personalización
                  </Button>
                </div>
              </motion.div>
            ) : cvVersions && selectedVersion ? (
              isCheckingPayment ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <Sparkles className="w-6 h-6 text-primary absolute top-0 right-0 animate-pulse" />
                  </div>
                  <p className="text-xl font-bold text-muted-foreground animate-pulse">Verificando acceso exclusivo...</p>
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
                  userData={{ name, email, targetJob }}
                />
              ) : (
                <motion.div
                  key="final-cv"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-5xl mx-auto space-y-12"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 shadow-strong no-print">
                    <div className="space-y-1 text-center md:text-left">
                      <h2 className="text-3xl font-black text-foreground">Tu CV Maestro</h2>
                      <p className="text-muted-foreground font-medium">Optimizado, pulido y listo para el mercado.</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="xl"
                        onClick={() => window.print()}
                        className="h-16 px-8 rounded-2xl font-bold border-gray-200 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"
                      >
                        <Printer className="w-5 h-5" />
                        Imprimir
                      </Button>
                      <Button
                        variant="hero"
                        size="xl"
                        onClick={handleDownload}
                        className="h-16 px-10 rounded-2xl font-black bg-[#00D1A0] hover:bg-[#00B88D] text-white shadow-accent flex items-center gap-3"
                      >
                        <Download className="w-6 h-6" />
                        Descargar PDF
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] shadow-strong border border-gray-100 p-4 md:p-12 min-h-[1000px]">
                    <CVVersionsCard
                      versions={cvVersions}
                      selectedOnly={selectedVersion}
                      userData={{ name, email, targetJob }}
                    />
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 pb-20 no-print">
                    <Button
                      variant="outline"
                      onClick={handleSendEmail}
                      className="h-16 px-8 rounded-2xl font-bold border-gray-200 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Enviar por Email
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        // Reset all state to restart
                        setAnalysisResult(null);
                        setCVVersions(null);
                        setSelectedVersion(null);
                        setCVText("");
                        // Scroll to top or just let the render handle it
                      }}
                      className="text-muted-foreground font-bold hover:text-primary gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Comenzar Nuevo Análisis
                    </Button>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Análisis de Impacto Final</h1>
                  <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                    Hemos procesado tu trayectoria con nuestros algoritmos ATS. Aquí tienes el diagnóstico completo de tu competitividad.
                  </p>
                </div>

                {/* Main Score - Premium Visualization */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-[3rem] blur-2xl group-hover:opacity-100 transition-opacity opacity-70 -z-10" />
                  <Card className="rounded-[3rem] overflow-hidden border-gray-100 shadow-strong glass">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 md:p-16 text-white relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 text-center md:text-left">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-primary">
                            <Target className="w-4 h-4" />
                            Puntuación Global ATS
                          </div>
                          <div className="space-y-2">
                            <p className="text-8xl font-black tracking-tighter text-white">
                              {analysisResult.atsScore}
                              <span className="text-3xl text-white/40 ml-2">/100</span>
                            </p>
                            <p className="text-xl font-bold text-gray-300">
                              {analysisResult.atsScore >= 80 ? "Tu perfil está en el Top 5% de candidatos" :
                                analysisResult.atsScore >= 60 ? "Potencial alto con ajustes específicos" :
                                  "Mejoras críticas necesarias para destacar"}
                            </p>
                          </div>
                        </div>

                        <div className="relative w-48 h-48 md:w-64 md:h-64">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="50%" cy="50%" r="45%"
                              fill="none"
                              stroke="rgba(255,255,255,0.05)"
                              strokeWidth="15"
                            />
                            <motion.circle
                              initial={{ strokeDashoffset: 565 }}
                              animate={{ strokeDashoffset: 565 - (565 * (analysisResult.atsScore || 0) / 100) }}
                              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                              cx="50%" cy="50%" r="45%"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="15"
                              strokeDasharray="565"
                              strokeLinecap="round"
                              className="text-primary shadow-glow"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-primary opacity-50" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 pt-10 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-12">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rango Salarial Estimado</p>
                          <p className="text-2xl font-black text-white">
                            {analysisResult.salaryRange ? (
                              `${analysisResult.salaryRange.min.toLocaleString()}€ - ${analysisResult.salaryRange.max.toLocaleString()}€`
                            ) : (
                              "Mercado Variable"
                            )}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Versiones Generadas</p>
                          <p className="text-2xl font-black text-white">2 <span className="text-sm font-medium text-gray-500">Diseños</span></p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-10 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {[
                          { label: "Formato", score: (analysisResult as any).formatScore || (analysisResult as any).format_score || 0, icon: FileText },
                          { label: "Keywords", score: (analysisResult as any).keywordsScore || (analysisResult as any).keywords_score || 0, icon: Target },
                          { label: "Experiencia", score: (analysisResult as any).experienceScore || (analysisResult as any).experience_score || 0, icon: Briefcase },
                          { label: "Habilidades", score: (analysisResult as any).skillsScore || (analysisResult as any).skills_score || 0, icon: Zap },
                          { label: "Logros", score: (analysisResult as any).achievementsScore || (analysisResult as any).achievements_score || 0, icon: TrendingUp },
                        ].map((item) => (
                          <div key={item.label} className="space-y-4">
                            <div className="flex items-center justify-between">
                              <item.icon className="w-4 h-4 text-muted-foreground" />
                              <span className={`text-sm font-black ${getScoreColor(item.score)}`}>{item.score}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1, delay: 1 }}
                                className={`h-full rounded-full ${getScoreBgColor(item.score)}`}
                              />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Problems */}
                  {analysisResult && Array.isArray(analysisResult.problems) && analysisResult.problems.length > 0 && (
                    <Card className="rounded-[2rem] border-gray-100 shadow-soft glass overflow-hidden">
                      <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6 px-8">
                        <CardTitle className="flex items-center gap-3 text-xl font-black">
                          <AlertTriangle className="w-6 h-6 text-yellow-500" />
                          Mejoras Críticas ({analysisResult.problems.length})
                        </CardTitle>
                        <CardDescription className="font-medium">
                          Puntos de fricción que impiden tu paso a la entrevista.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          {analysisResult.problems.map((problem: any, i) => (
                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-50 shadow-sm hover:border-primary/20 transition-all">
                              <div className="flex-shrink-0 mt-1">
                                {getSeverityIcon(problem.severity || 'info')}
                              </div>
                              <div className="space-y-2">
                                <p className="font-bold text-gray-900 leading-tight">{problem.message || problem.problem || problem.issue || problem.descripcion}</p>
                                <p className="text-sm text-muted-foreground font-medium bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                                  {problem.suggestion || problem.solution || problem.solucion || problem.recomendacion}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Missing Keywords */}
                  <div className="space-y-10">
                    {analysisResult.missingKeywords.length > 0 && (
                      <Card className="rounded-[2rem] border-gray-100 shadow-soft glass overflow-hidden">
                        <CardHeader className="px-8 pt-8">
                          <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <Target className="w-6 h-6 text-primary" />
                            Keywords Ausentes
                          </CardTitle>
                          <CardDescription className="font-medium">
                            Añádelas para ser indexado por los reclutadores.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="flex flex-wrap gap-2">
                            {(analysisResult.missingKeywords || []).map((keyword, i) => (
                              <span
                                key={i}
                                className="px-5 py-2.5 bg-white border border-gray-100 text-foreground rounded-2xl text-sm font-bold shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Plan Summary */}
                    {actionPlan && (
                      <Card className="rounded-[2rem] border-gray-100 bg-gray-900 text-white shadow-strong overflow-hidden relative">
                        <CardHeader className="px-8 pt-8">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                          <CardTitle className="flex items-center gap-3 text-xl font-black text-white relative z-10">
                            <Zap className="w-6 h-6 text-primary" />
                            Plan de Optimización
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 relative z-10 space-y-6">
                          <div className="space-y-4">
                            {(actionPlan.immediate || []).slice(0, 3).map((item: any, i) => (
                              <div key={i} className="flex items-center gap-4 text-sm font-bold bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {item.action || item.title || item.accion}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">IA Generando pasos finales...</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Final Action CTA */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-10">
                  <Button
                    size="xl"
                    className="w-full md:w-[400px] h-24 gap-4 bg-[#00D1A0] hover:bg-[#00B88D] text-white rounded-3xl text-2xl font-black shadow-accent hover:scale-[1.02] transition-all"
                    onClick={handleContinueToQuestions}
                  >
                    <Sparkles className="w-8 h-8" />
                    Generar Nuevo CV
                    <ArrowRight className="w-8 h-8" />
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full md:w-auto px-10 h-24 gap-3 bg-white border-none shadow-strong rounded-3xl text-lg font-black hover:bg-gray-50 transition-all"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-6 h-6 text-muted-foreground font-medium" />
                    Reporte PDF
                  </Button>
                </div>

                <div className="flex justify-center pb-12">
                  <Button variant="ghost" onClick={handleNewAnalysis} className="text-muted-foreground font-bold hover:text-primary tracking-tight">
                    ← Analizar otro documento
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
