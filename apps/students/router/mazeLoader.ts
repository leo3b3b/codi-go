import type { LoaderFunctionArgs } from "react-router";
import { getMazeLevel, getStudentSession, isClassPlaying } from "@/services";

export async function mazeLoader({ params }: LoaderFunctionArgs) {
	const levelId = Number(params.levelId);

	const session = getStudentSession();

	if (!session) {
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });
	}

	const status = await isClassPlaying(session.class_id);

	if (status !== true) {
		throw new Response("A turma não está em atividade.", { status: 403 });
	}

	return getMazeLevel(levelId);
}
