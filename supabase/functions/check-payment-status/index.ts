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

        // 2. Check for active Premium plan (valid for 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const latestPremium = payments.find(p => p.plan_type === "premium");
        if (latestPremium) {
            const paymentDate = new Date(latestPremium.created_at);
            if (paymentDate >= thirtyDaysAgo) {
                if (action === "record_download") {
                    await supabase.from("downloads").insert({ email });
                }
                return new Response(JSON.stringify({
                    hasAccess: true,
                    planType: "premium",
                    expiresAt: new Date(paymentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }
        }

        // 3. Check for available Basic plan (2 downloads per payment, infinite time)
        const latestBasic = payments.find(p => p.plan_type === "basic");
        if (latestBasic) {
            // Count downloads since this specific payment was made
            const { count, error: downloadError } = await supabase
                .from("downloads")
                .select("*", { count: "exact", head: true })
                .eq("email", email)
                .gte("download_at", latestBasic.created_at);

            if (downloadError) throw downloadError;

            const downloadCount = count || 0;

            if (action === "record_download") {
                if (downloadCount >= 2) {
                    return new Response(JSON.stringify({ hasAccess: false, reason: "limit_reached", count: downloadCount }), {
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }
                await supabase.from("downloads").insert({ email });
                return new Response(JSON.stringify({ hasAccess: true, planType: "basic", count: downloadCount + 1 }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify({
                hasAccess: downloadCount < 2,
                reason: downloadCount >= 2 ? "limit_reached" : null,
                planType: "basic",
                count: downloadCount
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // If we reach here, it means they might have an expired premium or consumed basics
        return new Response(JSON.stringify({ hasAccess: false, reason: "plan_expired_or_consumed" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
