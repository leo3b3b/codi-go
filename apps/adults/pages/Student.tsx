import type { Route } from "+pages/Student";
import { UI } from "@codi-go/ui";
import { useNavigate } from "react-router";
import { type MazeProgressRecord, parseMazeProgress } from "@/games/maze";
import { getStudentById, getStudentProgress } from "@/services";
import * as Self from "./StudentPage";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const { schoolId, studentId } = params;

	if (!schoolId || !studentId)
		throw new Response("Aluno não encontrado", { status: 404 });

	const [student, games] = await Promise.all([
		getStudentById(studentId),
		getStudentProgress(studentId),
	]);

	if (student.school_id !== schoolId)
		throw new Response("Aluno não encontrado", { status: 404 });

	const maze = games.find((game) => game.key === "maze");

	const mazeProgress = (maze?.records ?? [])
		.map(parseMazeProgress)
		.filter((record): record is MazeProgressRecord => record !== null);

	return { student, games, mazeProgress };
}

export function meta({ loaderData }: Route.MetaArgs) {
	return [{ title: `${loaderData?.student.name ?? "Aluno"} | CodiGO!` }];
}

export default function StudentPage({
	loaderData: { student, games, mazeProgress },
}: Route.ComponentProps) {
	const navigate = useNavigate();
	const progress = games
		.flatMap((game) => game.records)
		.sort(
			(a, b) =>
				new Date(a.register_time).getTime() -
				new Date(b.register_time).getTime(),
		);

	return (
		<UI.Container>
			<UI.Stack>
				<Self.StudentHeader
					student={student}
					onBack={() =>
						navigate(`/escola/${student.school_id}/turma/${student.class_id}`)
					}
				/>

				<Self.StudentMetrics records={progress} />

				<Self.GameTabs games={games} mazeProgress={mazeProgress} />
			</UI.Stack>
		</UI.Container>
	);
}
