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

	const games = new Map<
		string,
		{
			key: string;
			name: string;
			records: typeof data;
		}
	>();

	for (const record of data) {
		const key = record.level.game_key;
		const name = record.level.game?.name ?? key;

		if (!games.has(key)) games.set(key, { key, name, records: [] });

		games.get(key)?.records.push(record);
	}

	return Array.from(games.values());
}
