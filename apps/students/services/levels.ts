import { supabase, type Tables } from "@codi-go/supabase";

export type LevelSummary = Pick<Tables<"levels">, "id" | "name" | "game_key">;
export type GameSummary = Tables<"games">;

export async function listGames(): Promise<GameSummary[]> {
	const { data, error } = await supabase
		.from("games")
		.select("key, name")
		.order("name");

	if (error) throw error;
	return data;
}

export async function listLevels(): Promise<LevelSummary[]> {
	const { data, error } = await supabase
		.from("levels")
		.select("id, name, game_key")
		.order("game_key")
		.order("id");

	if (error) throw error;
	return data;
}
