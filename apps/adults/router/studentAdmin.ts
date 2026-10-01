import { getClassesBySchool } from "@/services";
import { getStudentById } from "@/services/students";

export async function studentAdminLoader({
	params,
}: {
	params: {
		schoolId?: string;
		studentId?: string;
	};
}) {
	if (!params.studentId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	const student = await getStudentById(params.studentId);
	const classes = await getClassesBySchool(params.schoolId);

	return { student, classes };
}
