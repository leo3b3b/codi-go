import { supabase } from "@codi-go/supabase";

export async function signUp(email: string, password: string) {
	const redirectUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${redirectUrl}/login`,
		},
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
