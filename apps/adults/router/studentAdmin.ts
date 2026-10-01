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
	if (!params.schoolId || !params.studentId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	const student = await getStudentById(params.studentId);

	if (student.school_id !== params.schoolId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	const classes = await getClassesBySchool(params.schoolId);

	return { student, classes };
}
