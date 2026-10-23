import { UI } from "@codi-go/ui";
import { GameGuidanceCards } from "./GameGuidanceCards";
import { MazeProgressChart } from "./MazeProgressChart";
import { MetricCard } from "./MetricCard";
import { ProgressRecords } from "./ProgressRecords";
import type { MazeProgressRecord, StudentGame } from "./types";

type GamePanelProps = {
	game: StudentGame;
	mazeProgress: MazeProgressRecord[];
};

export function GamePanel({ game, mazeProgress }: GamePanelProps) {
	const successCount = game.records.filter(
		(record) => record.result === "success",
	).length;

	const successRate =
		game.records.length > 0
			? Math.round((successCount / game.records.length) * 100)
			: 0;

	const completedLevels = new Set(
		game.records
			.filter((record) => record.result === "success")
			.map((record) => record.level_id),
	).size;

	return (
		<UI.Stack gap="md">
			<GameGuidanceCards gameKey={game.key} gameName={game.name} />

			<UI.SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
				<MetricCard label="Taxa de sucesso" value={`${successRate}%`} />
				<MetricCard label="Níveis concluídos" value={String(completedLevels)} />
				<MetricCard
					label="Tentativas registradas"
					value={String(game.records.length)}
				/>
			</UI.SimpleGrid>

			{game.key === "maze" && (
				<UI.Paper p="lg">
					<UI.Stack gap="md">
						<UI.Title order={3}>Eficiência na resolução do labirinto</UI.Title>

						<UI.Text size="sm" c="dimmed">
							Diferença entre os comandos utilizados e a meta do nível. Quanto
							menor a diferença, melhor.
						</UI.Text>

						{mazeProgress.length > 0 ? (
							<MazeProgressChart records={mazeProgress} />
						) : (
							<UI.Text size="sm" c="dimmed">
								Ainda não há dados suficientes para o gráfico.
							</UI.Text>
						)}
					</UI.Stack>
				</UI.Paper>
			)}

			<ProgressRecords records={game.records} />
		</UI.Stack>
	);
}
