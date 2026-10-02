import { getClassById, getStudentsByClassId } from "@/services";

export async function classLoader({
	params,
}: {
	params: { schoolId?: string; classId?: string };
}) {
	if (!params.schoolId || !params.classId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const [classData, students] = await Promise.all([
		getClassById(params.classId),
		getStudentsByClassId(params.classId),
	]);

	if (classData.school_id !== params.schoolId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	return { classData, students };
}
