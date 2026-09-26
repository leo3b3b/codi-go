import { supabase } from "@codi-go/supabase";

export async function getUserContext() {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		userError.message = `getUserContext error: ${userError.message}`;
		throw userError;
	}

	if (!user) {
		throw new Error("getUserContext error: usuário não autenticado");
	}

	return user;
}
