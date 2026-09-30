import { adminGetMembershipsBySchool } from "@/services";

export async function memberAdminLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	return adminGetMembershipsBySchool(params.schoolId);
}
