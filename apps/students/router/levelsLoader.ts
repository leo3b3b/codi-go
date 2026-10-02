import type { LoaderFunctionArgs } from "react-router";
import {
	getStudentSession,
	isClassPlaying,
	listGames,
	listLevels,
} from "@/services";

export async function levelsLoader({ params }: LoaderFunctionArgs) {
	if (!params.accessCode) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const session = getStudentSession();

	if (!session || session.class_id === "") {
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });
	}

	const status = await isClassPlaying(session.class_id);

	if (status !== true) {
		throw new Response("A turma não está em atividade.", { status: 403 });
	}

	const [games, levels] = await Promise.all([listGames(), listLevels()]);

	return games.map((game) => ({
		...game,
		levels: levels.filter((level) => level.game_key === game.key),
	}));
}
