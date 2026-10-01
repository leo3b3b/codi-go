import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

export async function updateProfileForCurrentUser({
	name,
	username,
}: {
	name: string | null;
	username: string | null;
}) {
	const dataToUpdate: { name?: string; username?: string } = {};

	if (name !== null) dataToUpdate.name = name;
	if (username !== null) dataToUpdate.username = username;

	if (Object.keys(dataToUpdate).length === 0) {
		const data = await getProfileForCurrentUser();
		return data;
	}

	const user = await getUser();

	const { error } = await supabase
		.from("profiles")
		.update(dataToUpdate)
		.eq("id", user.id);

	if (error) {
		error.message = `updateProfileForCurrentUser error: ${error.message}`;
		throw error;
	}
}

export async function getProfileForCurrentUser() {
	const user = await getUser();

	const { data, error } = await supabase
		.from("profiles")
		.select("id, name, username")
		.eq("id", user.id)
		.single();

	if (error) {
		error.message = `getProfileForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
}

export async function getUserIdByUsername(username: string) {
	const { data, error } = await supabase
		.from("profiles")
		.select("id")
		.eq("username", username)
		.single();

	if (error) {
		error.message = `getUserIdByUsername error: ${error.message}`;
		throw error;
	}

	return data.id;
}
