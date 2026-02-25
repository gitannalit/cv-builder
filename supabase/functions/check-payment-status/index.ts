import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, action } = await req.json();

        if (!email) {
            throw new Error("Email is required");
        }

        // 1. Get all completed payments for this email, ordered by date
        const { data: payments, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("email", email)
            .eq("status", "completed")
            .order("created_at", { ascending: false });

        if (paymentError) throw paymentError;

        if (!payments || payments.length === 0) {
            return new Response(JSON.stringify({ hasAccess: false, reason: "no_payment" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. We find the latest valid payment (within the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find the most recent payment
        const latestPayment = payments[0];
        const paymentDate = new Date(latestPayment.created_at);

        // Check if the most recent payment is within the 30 days validity period
        if (paymentDate < thirtyDaysAgo) {
            return new Response(JSON.stringify({ hasAccess: false, reason: "plan_expired" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const planType = latestPayment.plan_type === 'premium' ? 'premium' : 'basic';
        const expiresAt = new Date(paymentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const allowedDownloads = planType === 'premium' ? 9999 : 2;

        if (planType === 'premium') {
            if (action === "record_download") {
                await supabase.from("downloads").insert({ email, user_id: latestPayment.user_id });
            }
            return new Response(JSON.stringify({
                hasAccess: true,
                planType: "premium",
                role: "premium",
                paymentDate: latestPayment.created_at,
                allowedDownloads: allowedDownloads,
                expiresAt: expiresAt
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        } else {
            // Count downloads since this specific payment was made
            const { count, error: downloadError } = await supabase
                .from("downloads")
                .select("*", { count: "exact", head: true })
                .eq("email", email)
                .gte("download_at", latestPayment.created_at);

            if (downloadError) throw downloadError;

            const downloadCount = count || 0;

            if (action === "record_download") {
                if (downloadCount >= allowedDownloads) {
                    return new Response(JSON.stringify({
                        hasAccess: false,
                        reason: "limit_reached",
                        count: downloadCount,
                        role: "basic",
                        paymentDate: latestPayment.created_at,
                        allowedDownloads: allowedDownloads
                    }), {
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }
                await supabase.from("downloads").insert({ email, user_id: latestPayment.user_id });
                return new Response(JSON.stringify({
                    hasAccess: true,
                    planType: "basic",
                    role: "basic",
                    paymentDate: latestPayment.created_at,
                    allowedDownloads: allowedDownloads,
                    count: downloadCount + 1,
                    expiresAt: expiresAt
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify({
                hasAccess: downloadCount < allowedDownloads,
                reason: downloadCount >= allowedDownloads ? "limit_reached" : null,
                planType: "basic",
                role: "basic",
                paymentDate: latestPayment.created_at,
                allowedDownloads: allowedDownloads,
                count: downloadCount,
                expiresAt: expiresAt
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
