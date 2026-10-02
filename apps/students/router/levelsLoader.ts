import { listGames, listLevels } from "@/services";

export async function levelsLoader() {
	const [games, levels] = await Promise.all([listGames(), listLevels()]);

	return games.map((game) => ({
		...game,
		levels: levels.filter((level) => level.game_key === game.key),
	}));
}
