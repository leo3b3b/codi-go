import { supabase } from "@codi-go/supabase";

interface ProfileProps {
	name: string | null;
	username: string | null;
}

export async function updateProfileForCurrentUser(props: ProfileProps) {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		userError.message = `updateProfileForCurrentUser error: ${userError.message}`;
		throw userError;
	}

	if (!user) {
		throw new Error(
			"updateProfileForCurrentUser error: usuário não autenticado",
		);
	}

	const { data, error } = await supabase
		.from("profiles")
		.update(props)
		.eq("id", user.id)
		.select();

	if (error) {
		error.message = `updateProfileForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
}
