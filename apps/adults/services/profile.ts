import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

interface ProfileProps {
	name: string | null;
	username: string | null;
}

export async function updateProfileForCurrentUser(props: ProfileProps) {
	const dataToUpdate: { name?: string; username?: string } = {};

	if (props.name !== null) {
		dataToUpdate.name = props.name;
	}

	if (props.username !== null) {
		dataToUpdate.username = props.username;
	}

	if (Object.keys(dataToUpdate).length === 0) {
		const data = await getProfileForCurrentUser();
		return data;
	}

	const user = await getUser();

	const { data, error } = await supabase
		.from("profiles")
		.update(dataToUpdate)
		.eq("id", user.id)
		.select()
		.single();

	if (error) {
		error.message = `updateProfileForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
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
