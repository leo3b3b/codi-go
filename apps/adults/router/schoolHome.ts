import { getClassesForCurrentContext } from "@/services";

export async function schoolHomeLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	return getClassesForCurrentContext(params.schoolId);
}
