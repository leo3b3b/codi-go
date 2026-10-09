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
		return;
	}

	const user = await getUser();

	const { error } = await supabase
		.from("profiles")
		.update(dataToUpdate)
		.eq("id", user.id);

	if (error) throw error;
}

export async function getProfileForCurrentUser() {
	const user = await getUser();

	const { data, error } = await supabase
		.from("profiles")
		.select("id, name, username")
		.eq("id", user.id)
		.single();

	if (error) throw error;
	return data;
}

export async function getUserIdByUsername(username: string) {
	const { data, error } = await supabase
		.from("profiles")
		.select("id")
		.eq("username", username)
		.single();

	if (error) throw error;
	return data.id;
}
