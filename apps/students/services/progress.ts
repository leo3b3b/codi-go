import { supabase } from "@codi-go/supabase";
import { getStudentSession, isClassPlaying } from "@/services";

export type ProgressResult = "success" | "failure";

export async function registerMazeProgress({
	level_id,
	result,
	number_of_commands,
}: {
	level_id: number;
	result: ProgressResult;
	number_of_commands: number;
}) {
	const session = getStudentSession();

	if (!session) {
		throw new Error("Sessão de aluno não encontrada!.");
	}

	const status = await isClassPlaying(session.class_id);

	if (status !== true) {
		throw new Error("A turma não está em atividade.");
	}

	const { error } = await supabase.from("progress").insert({
		student_id: session.student_id,
		level_id,
		result,
		metadata: {
			number_of_commands,
		},
	});

	if (error) {
		throw error;
	}
}
