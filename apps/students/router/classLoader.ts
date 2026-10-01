import type { LoaderFunctionArgs } from "react-router";
import { getClassByAccessCode, getStudentsByClassId } from "@/services";

export async function classLoader({ params }: LoaderFunctionArgs) {
	if (!params.accessCode) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const classData = await getClassByAccessCode(params.accessCode);

	if (!classData) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const students = await getStudentsByClassId(classData.id);

	return { classData, students };
}
