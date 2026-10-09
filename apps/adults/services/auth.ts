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

	if (error) throw error;
	return data;
}

export async function signInWithPassword(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;
	return data;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut({ scope: "local" });

	if (error) throw error;
}

export async function deleteUserAccount() {
	const { error } = await supabase.rpc("delete_user_account");

	if (error) throw error;
}

export async function getUser() {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) throw userError;
	if (!user) throw new Error("usuário não autenticado");
	return user;
}
