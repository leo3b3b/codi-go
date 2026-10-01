import { getClassesBySchool, getSchoolById } from "@/services";

export async function classesAdminLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const school = await getSchoolById(params.schoolId);
	const classes = await getClassesBySchool(params.schoolId);

	return {
		school,
		classes,
	};
}
