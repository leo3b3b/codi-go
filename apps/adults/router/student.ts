import { getStudentById, getStudentProgress } from "@/services";
import { parseMazeProgress } from "@/games/maze/progress";

export async function studentLoader({
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

	const [student, progress] = await Promise.all([
		getStudentById(params.studentId),
		getStudentProgress(params.studentId),
	]);

	if (student.school_id !== params.schoolId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	return {
		student,
		progress,
		mazeProgress: progress
			.map(parseMazeProgress)
			.filter((record) => record !== null),
	};
}
