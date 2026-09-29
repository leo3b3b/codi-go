import { supabase } from "@codi-go/supabase";
import { getMembershipsForCurrentUser } from "@/services";

export async function getSchoolsForCurrentUser() {
	const memberships = await getMembershipsForCurrentUser("active");

	return memberships.map(({ role, schools }) => ({
		schoolId: schools.id,
		legalName: schools.legal_name,
		tradeName: schools.trade_name,
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
