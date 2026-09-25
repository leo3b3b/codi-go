import { supabase } from "@codi-go/supabase";

export async function getSchoolsForCurrentUser() {
	const { data, error } = await supabase
		.from("schools")
		.select("id, legal_name, trade_name, cnpj")
		.eq("is_active", true);

	if (error) {
		error.message = `getSchoolsForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
}

export async function getInvitesForCurrentUser() {
	const { data, error } = await supabase
		.from("schools")
		.select("id, legal_name, trade_name, cnpj")
		.eq("is_active", false);

	if (error) {
		error.message = `getInvitesForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
}

export async function getSchoolById(id: string) {
	const { data, error } = await supabase
		.from("schools")
		.select("legal_name, trade_name, cnpj")
		.eq("id", id)
		.single();

	if (error) {
		error.message = `getSchoolById error: ${error.message}`;
		throw error;
	}

	return data;
}

// export async function getSchoolBySlug() {

// }
