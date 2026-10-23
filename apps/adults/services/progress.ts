import { supabase } from "@codi-go/supabase";

export async function getStudentProgress(studentId: string) {
	const [gamesResult, progressResult] = await Promise.all([
		supabase.from("games").select("key, name"),
		supabase
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
					game:games(name)
				)
			`)
			.eq("student_id", studentId)
			.order("register_time", { ascending: true }),
	]);

	if (gamesResult.error) throw gamesResult.error;
	if (progressResult.error) throw progressResult.error;

	const gameCatalog = gamesResult.data;
	const records = progressResult.data;

	type ProgressRecord = (typeof records)[number];

	const games = new Map<
		string,
		{
			key: string;
			name: string;
			records: ProgressRecord[];
		}
	>();

	for (const game of gameCatalog)
		games.set(game.key, {
			key: game.key,
			name: game.name,
			records: [],
		});

	for (const record of records) {
		const key = record.level.game_key;
		const name = record.level.game?.name ?? key;

		if (!games.has(key))
			games.set(key, {
				key,
				name,
				records: [],
			});

		games.get(key)?.records.push(record);
	}

	return Array.from(games.values()).sort((a, b) =>
		a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
	);
}
