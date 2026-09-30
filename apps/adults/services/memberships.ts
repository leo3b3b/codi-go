import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

async function getMembershipsForCurrentUser(status: "active" | "pending") {
	const user = await getUser();

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
		schoolId: schools.id,
		legalName: schools.legal_name,
		tradeName: schools.trade_name,
		cnpj: schools.cnpj,
		role,
	}));
}

export async function getInvitesForCurrentUser() {
	const memberships = await getMembershipsForCurrentUser("pending");

	return memberships.map(({ role, schools }) => ({
		schoolId: schools.id,
		legalName: schools.legal_name,
		tradeName: schools.trade_name,
		cnpj: schools.cnpj,
		role,
	}));
}

export async function adminGetMembershipsBySchool(schoolId: string) {
	const { data, error } = await supabase
		.from("school_memberships")
		.select(`
            school_id,
            profile_id,
            role,
            status,
            profiles!schools_profiles_profile_id_fkey (
                name,
                username
            )
        `)
		.eq("school_id", schoolId)
		.order("profiles(name)")
		.order("profiles(username)");

	if (error) {
		error.message = `adminGetMembershipsBySchool error: ${error.message}`;
		throw error;
	}

	return data.map(({ profiles, ...membership }) => ({
		...profiles,
		...membership,
	}));
}

type DeleteMembershipProps = {
	profile_id: string;
	school_id: string;
};

export async function deleteMembership({
	profile_id,
	school_id,
}: DeleteMembershipProps) {
	const { error } = await supabase
		.from("school_memberships")
		.delete()
		.eq("profile_id", profile_id)
		.eq("school_id", school_id);

	if (error) {
		if (error.code === "PT409" && error.message === "LAST_ADMIN") {
			throw new Error(
				"Não é possível remover o único administrador ativo de uma escola!",
			);
		}

		error.message = `deleteMembership error: ${error.message}`;
		throw error;
	}
}

type UpdateMembershipRoleProps = {
	profile_id: string;
	school_id: string;
	role: "admin" | "teacher";
};

export async function updateMembershipRole({
	profile_id,
	school_id,
	role,
}: UpdateMembershipRoleProps) {
	const { error } = await supabase
		.from("school_memberships")
		.update({ role })
		.eq("profile_id", profile_id)
		.eq("school_id", school_id);

	if (error) {
		if (error.code === "PT409" && error.message === "LAST_ADMIN") {
			throw new Error(
				"Não é possível rebaixar o único administrador ativo de uma escola!",
			);
		}

		error.message = `updateMembershipRole error: ${error.message}`;
		throw error;
	}
}
