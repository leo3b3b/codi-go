import { supabase } from "@codi-go/supabase";
import { getUser, getUserIdByUsername } from "@/services";

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
				trade_name
			)
		`)
		.eq("profile_id", user.id)
		.eq("status", status)
		.eq("schools.is_active", true)
		.order("schools(legal_name)")
		.order("schools(trade_name)");

	if (error) throw error;
	return data;
}

export async function getSchoolsForCurrentUser() {
	const memberships = await getMembershipsForCurrentUser("active");

	return memberships.map(({ role, schools }) => ({
		school_id: schools.id,
		legal_name: schools.legal_name,
		trade_name: schools.trade_name,
		role,
	}));
}

export async function getInvitesForCurrentUser() {
	const memberships = await getMembershipsForCurrentUser("pending");

	return memberships.map(({ role, schools }) => ({
		school_id: schools.id,
		legal_name: schools.legal_name,
		trade_name: schools.trade_name,
		role,
	}));
}

export async function acceptInvite({
	profile_id,
	school_id,
}: {
	profile_id: string;
	school_id: string;
}) {
	const { error } = await supabase
		.from("school_memberships")
		.update({ status: "active" })
		.eq("profile_id", profile_id)
		.eq("school_id", school_id);

	if (error) throw error;
}

export async function inviteUserToSchool({
	username,
	role,
	school_id,
}: {
	username: string;
	role: "admin" | "teacher";
	school_id: string;
}) {
	const profile_id = await getUserIdByUsername(username);

	const { error } = await supabase.from("school_memberships").insert({
		profile_id,
		school_id,
		role,
	});

	if (error) throw error;
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

	if (error) throw error;

	return data.map(({ profiles, ...membership }) => ({
		...profiles,
		...membership,
	}));
}

export async function deleteMembership({
	profile_id,
	school_id,
}: {
	profile_id: string;
	school_id: string;
}) {
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

		throw error;
	}
}

export async function updateMembershipRole({
	profile_id,
	school_id,
	role,
}: {
	profile_id: string;
	school_id: string;
	role: "admin" | "teacher";
}) {
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

		throw error;
	}
}
