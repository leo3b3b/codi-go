import { supabase } from "@codi-go/supabase";

export async function getStudentProgress(studentId: string) {
	const { data, error } = await supabase
		.from("progress")
		.select(`
			id,
			level_id,
			result,
			metadata,
			register_time,
			level:levels(
				id,
				name,
				game_key,
				config,
                game:games(
                    name
                )
			)
		`)
		.eq("student_id", studentId)
		.order("register_time", { ascending: true });

	if (error) throw error;
	return data;
}
