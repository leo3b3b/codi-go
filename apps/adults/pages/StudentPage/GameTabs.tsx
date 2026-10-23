import { UI } from "@codi-go/ui";
import { GamePanel } from "./GamePanel";
import type { MazeProgressRecord, StudentGame } from "./types";

type GameTabsProps = {
	games: StudentGame[];
	mazeProgress: MazeProgressRecord[];
};

export function GameTabs({ games, mazeProgress }: GameTabsProps) {
	const firstGame = games[0];

	if (!firstGame) {
		return (
			<UI.Paper p="lg">
				<UI.Text c="dimmed" ta="center">
					Este aluno ainda não possui tentativas registradas.
				</UI.Text>
			</UI.Paper>
		);
	}

	return (
		<UI.Tabs defaultValue={firstGame.key}>
			<UI.Tabs.List>
				{games.map((game) => (
					<UI.Tabs.Tab key={game.key} value={game.key}>
						{game.name}
					</UI.Tabs.Tab>
				))}
			</UI.Tabs.List>

			{games.map((game) => (
				<UI.Tabs.Panel key={game.key} value={game.key} pt="md">
					<GamePanel
						game={game}
						mazeProgress={game.key === "maze" ? mazeProgress : []}
					/>
				</UI.Tabs.Panel>
			))}
		</UI.Tabs>
	);
}
