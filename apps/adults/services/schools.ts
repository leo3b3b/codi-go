import { supabase } from "@codi-go/supabase";

async function getMembershipsForCurrentUser(status: "active" | "pending") {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		userError.message = `getMembershipsForCurrentUser error: ${userError.message}`;
		throw userError;
	}

	if (!user) {
		throw new Error(
			"getMembershipsForCurrentUser error: usuário não autenticado",
		);
	}

	const { data, error } = await supabase
		.from("school_memberships")
		.select(`
			role,
			status,
			schools!schools_profiles_school_id_fkey (
				id,
				legal_name,
				trade_name,
				cnpj
			)
		`)
		.eq("profile_id", user.id)
		.eq("status", status)
		.eq("schools.is_active", true);

	if (error) {
		error.message = `getMembershipsForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
}

export async function getSchoolsForCurrentUser() {
	const memberships = await getMembershipsForCurrentUser("active");

	return memberships.map(({ role, schools }) => ({
		school_id: schools.id,
		legal_name: schools.legal_name,
		trade_name: schools.trade_name,
		cnpj: schools.cnpj,
		role,
	}));
}

export async function getInvitesForCurrentUser() {
	const memberships = await getMembershipsForCurrentUser("pending");

	return memberships.map(({ role, schools }) => ({
		school_id: schools.id,
		legal_name: schools.legal_name,
		trade_name: schools.trade_name,
		cnpj: schools.cnpj,
		role,
	}));
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
