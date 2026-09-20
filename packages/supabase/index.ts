import { createClient } from "@supabase/supabase-js";
import { redirect } from "react-router";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export const requireAuth = async (_, next) => {
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
        throw redirect("/login");
    }

    return next();
};