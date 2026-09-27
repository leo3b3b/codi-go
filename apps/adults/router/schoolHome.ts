import { redirect } from "react-router";
import { getClassesForCurrentUser, getSchoolsForCurrentUser } from "@/services";

export async function schoolHomeLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const schoolId = params.schoolId;

	const schools = await getSchoolsForCurrentUser();
	const school = schools.find((school) => school.schoolId === schoolId);

	if (!school) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const classes = await getClassesForCurrentUser(schoolId);

	if (school.role !== "admin" && classes.length === 1) {
		throw redirect(`/escola/${schoolId}/turma/${classes[0].id}`);
	}

	return {
		school,
		classes,
	};
}
