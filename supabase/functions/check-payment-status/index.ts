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

        // Check for active payments in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: payments, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("email", email)
            .eq("status", "completed")
            // Removed 30-day filter to allow Basic plans to last indefinitely until consumed
            .order("created_at", { ascending: false });

        if (paymentError) throw paymentError;

        const activePayment = payments?.[0];

        if (!activePayment) {
            return new Response(JSON.stringify({ hasAccess: false, reason: "no_payment" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // If premium, check 30-day expiration
        if (activePayment.plan_type === "premium") {
            const paymentDate = new Date(activePayment.created_at);
            if (paymentDate < thirtyDaysAgo) {
                return new Response(JSON.stringify({ hasAccess: false, reason: "expired_subscription" }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            if (action === "record_download") {
                await supabase.from("downloads").insert({ email });
            }
            return new Response(JSON.stringify({ hasAccess: true, planType: "premium" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // If basic, check download limit (2 downloads in 30 days)
        const { count, error: downloadError } = await supabase
            .from("downloads")
            .select("*", { count: "exact", head: true })
            .eq("email", email)
            // Fix: Only count downloads linked to this specific payment (made after the payment)
            // usage: We use the most recent payment as the "active" session. Downloads match this session.
            .gte("download_at", activePayment.created_at);

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

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
