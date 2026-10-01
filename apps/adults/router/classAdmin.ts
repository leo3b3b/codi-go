import { getClassById } from "@/services";

export async function classAdminLoader({
	params,
}: {
	params: { classId?: string };
}) {
	if (!params.classId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	return await getClassById(params.classId);
}
