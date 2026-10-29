import { supabase } from "@codi-go/supabase";

const DEFAULT_GAMES = [
	{ key: "maze", name: "Labirinto" },
	{ key: "box", name: "Caixa" },
	{ key: "kit", name: "Conjunto" },
	{ key: "hunt", name: "Caça ao Tesouro" },
] as const;

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

	type GameProgress = {
		key: string;
		name: string;
		records: ProgressRecord[];
	};

	const games = new Map<string, GameProgress>();

	// Garante a presença de todas as abas conhecidas, mesmo sem tentativas.
	for (const game of DEFAULT_GAMES) {
		games.set(game.key, {
			key: game.key,
			name: game.name,
			records: [],
		});
	}

	// Usa os nomes e acrescenta os jogos encontrados no catálogo do banco.
	for (const game of gameCatalog) {
		const existingGame = games.get(game.key);

		if (existingGame) {
			existingGame.name = game.name;
			continue;
		}

		games.set(game.key, {
			key: game.key,
			name: game.name,
			records: [],
		});
	}

	// Distribui cada tentativa pela chave do jogo da sua fase.
	for (const record of records) {
		const key = record.level.game_key;
		const name = record.level.game?.name ?? key;

		if (!games.has(key)) {
			games.set(key, {
				key,
				name,
				records: [],
			});
		}

		games.get(key)?.records.push(record);
	}

	return Array.from(games.values()).sort((a, b) =>
		a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
	);
}
