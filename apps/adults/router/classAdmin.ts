import { getClassById, getStudentsByClassId } from "@/services";

export async function classAdminLoader({
	params,
}: {
	params: { classId?: string };
}) {
	if (!params.classId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const classData = await getClassById(params.classId);
	const students = await getStudentsByClassId(params.classId);

	return { classData, students };
}
