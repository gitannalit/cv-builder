import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Download, LogOut, User as UserIcon, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { StripeEmbeddedCheckout } from "@/components/analyzer/StripeEmbeddedCheckout";
import { UpgradeDialog } from "@/components/dashboard/UpgradeDialog";

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [downloads, setDownloads] = useState<any[]>([]);
    const [stats, setStats] = useState({
        planType: "free",
        downloadCount: 0,
        remainingDownloads: 0,
    });
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user!.id)
                .single();

            if (profileError && profileError.code !== "PGRST116") throw profileError;
            setProfile(profileData);

            // 2. Fetch Subscription/Payments (Get latest active plan)
            // Note: In a real app we might have a dedicated subscription table or status
            // Here we assume 'payments' tracks plan purchases.
            const { data: paymentsData, error: paymentsError } = await supabase
                .from("payments")
                .select("*")
                .eq("user_id", user!.id)
                .eq("status", "completed") // Assuming 'completed' is the success status
                .order("created_at", { ascending: false })
                .limit(1);

            if (paymentsError) throw paymentsError;

            const currentPayment = paymentsData?.[0];
            let planType = currentPayment?.plan_type || "free";

            // 3. Fetch Downloads count and history
            const { data: downloadsData, error: downloadsError } = await supabase
                .from("downloads")
                .select("*")
                .eq("user_id", user!.id)
                .order("download_at", { ascending: false });

            if (downloadsError) throw downloadsError;

            setDownloads(downloadsData || []);
            const downloadCount = downloadsData?.length || 0;

            // Calculate remaining
            let remaining = 0;
            if (planType === "basic") remaining = Math.max(0, 2 - downloadCount);
            else if (planType === "premium") remaining = 9999; // Unlimited
            else remaining = 0;

            // Downgrade to free if basic is exhausted
            if (planType === "basic" && remaining === 0) {
                planType = "free";
            }

            setStats({
                planType,
                downloadCount,
                remainingDownloads: remaining,
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Error al cargar datos del usuario");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    const handleUpgrade = async (planType: 'basic' | 'premium') => {
        setIsProcessingPayment(true);
        const cleanUrl = window.location.origin + window.location.pathname;
        try {
            const amount = planType === 'basic' ? 499 : 1799;
            const planName = planType === 'basic' ? 'CV Básico (2 descargas)' : 'CV Premium (Ilimitado)';

            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    email: user?.email,
                    planType,
                    amount,
                    planName,
                    successUrl: cleanUrl,
                    cancelUrl: cleanUrl,
                }
            });

            if (error) throw error;
            if (data.clientSecret) {
                setStripeClientSecret(data.clientSecret);
                setIsUpgradeDialogOpen(false);
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
            toast.error("Error al iniciar el pago");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
                        <p className="text-gray-500">Bienvenido, {profile?.full_name || user?.email}</p>
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Plan Actual</CardTitle>
                            <UserIcon className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">{stats.planType}</div>
                            <p className="text-xs text-gray-500">
                                {stats.planType === 'free' ? 'Sin plan activo' : 'Plan activo'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Descargas Realizadas</CardTitle>
                            <Download className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.downloadCount}</div>
                            <p className="text-xs text-gray-500">Total histórico</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Descargas Restantes</CardTitle>
                            <Download className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.planType === 'premium' ? '∞' : stats.remainingDownloads}
                            </div>
                            <p className="text-xs text-gray-500">
                                {stats.planType === 'premium' ? 'Acceso Ilimitado' : 'Disponibles según tu plan'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                            <CardDescription>Gestiona tu CV y descargas</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => navigate('/analyzer')} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                                Crear/Editar CV
                            </Button>
                            {stats.planType === 'free' && (
                                <Button
                                    onClick={() => setIsUpgradeDialogOpen(true)}
                                    variant="secondary"
                                    className="flex-1"
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Mejorar Plan
                                </Button>
                            )}
                            {stats.planType === 'basic' && (
                                <Button
                                    onClick={() => setIsUpgradeDialogOpen(true)}
                                    variant="secondary"
                                    className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-none hover:from-yellow-600 hover:to-amber-700"
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Pasar a Premium 💎
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Download History */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Historial de Descargas</CardTitle>
                            <CardDescription>Registro de tus documentos generados</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {downloads.length > 0 ? (
                                <div className="space-y-4">
                                    {downloads.map((download) => (
                                        <div key={download.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <Download className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Descarga de CV</p>
                                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(download.download_at).toLocaleDateString()}
                                                        <span className="mx-1">•</span>
                                                        {new Date(download.download_at).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-green-600 text-sm font-medium">
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Completado
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay descargas registradas
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {stripeClientSecret && (
                    <StripeEmbeddedCheckout
                        clientSecret={stripeClientSecret}
                        onClose={() => {
                            setStripeClientSecret(null);
                            fetchUserData(); // Refresh data after potential payment
                        }}
                    />
                )}

                <UpgradeDialog
                    isOpen={isUpgradeDialogOpen}
                    onClose={() => setIsUpgradeDialogOpen(false)}
                    onUpgrade={handleUpgrade}
                    currentPlan={stats.planType}
                />

            </div>
        </div>
    );
}
