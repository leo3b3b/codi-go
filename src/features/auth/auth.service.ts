import { supabase } from "@/lib/supabaseClient";

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        error.message = `signUp error: ${error.message}`;
        throw error;
    }

    return data;
}

export async function signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        error.message = `signInWithPassword error: ${error.message}`;
        throw error;
    }

    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        error.message = `signOut error: ${error.message}`;
        throw error;
    }
}