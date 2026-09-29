import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

export async function getMembershipsForCurrentUser(status: "active" | "pending") {
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

// export async function getMembershipsBySchool(schoolId: string) {
//     const { data, user } = await supabase
// }