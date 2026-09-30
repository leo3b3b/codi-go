import { adminGetMembershipsBySchool, getSchoolById } from "@/services";

export async function memberAdminLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const school = await getSchoolById(params.schoolId);
	const memberships = await adminGetMembershipsBySchool(params.schoolId);

	return { school, memberships };
}
