import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

interface ProfileProps {
	name: string | null;
	username: string | null;
}

export async function updateProfileForCurrentUser(props: ProfileProps) {
	const user = await getUser();

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
