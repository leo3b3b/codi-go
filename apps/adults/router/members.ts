import {
	adminGetMembershipsBySchool,
	getSchoolById,
	getUser,
} from "@/services";

export async function memberAdminLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const user = await getUser();
	const school = await getSchoolById(params.schoolId);
	const memberships = await adminGetMembershipsBySchool(params.schoolId);

	return { user, school, memberships };
}
