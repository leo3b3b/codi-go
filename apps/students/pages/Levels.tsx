import type { Route } from "+pages/Levels";
import { Icon, UI } from "@codi-go/ui";
import { useNavigate } from "react-router";
import {
	getStudentSession,
	isClassPlaying,
	listGames,
	listLevels,
} from "@/services";

type Games = Awaited<ReturnType<typeof clientLoader>>;
type Game = Games[number];
type Level = Game["levels"][number];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!params.accessCode)
		throw new Response("Turma não encontrada", { status: 404 });

	const session = getStudentSession();
	if (!session || session.class_id === "")
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });

	const status = await isClassPlaying(session.class_id);

	if (status !== true)
		throw new Response("A turma não está em atividade.", { status: 403 });

	const [games, levels] = await Promise.all([listGames(), listLevels()]);

	return games.map((game) => ({
		...game,
		levels: levels.filter((level) => level.game_key === game.key),
	}));
}

const LevelsPage = ({ loaderData: games }: Route.ComponentProps) => (
	<UI.Container>
		<title>Fases | CodiGO!</title>
		<UI.Stack gap="xl">
			<LevelsHeader />

			<UI.Stack gap="lg">
				{games.map((game) => (
					<GameSection key={game.key} game={game} />
				))}
			</UI.Stack>
		</UI.Stack>
	</UI.Container>
);
export default LevelsPage;

const LevelsHeader = () => (
	<div>
		<UI.Title order={1}>Fases</UI.Title>
		<UI.Text c="dimmed">Escolha um jogo e avance pelas fases.</UI.Text>
	</div>
);

function GameSection({ game }: { game: Game }) {
	const gameRoutes: Record<string, string> = {
		maze: "labirinto",
	};
	const route = gameRoutes[game.key];

	if (!route)
		throw new Response(`Jogo não encontrado: ${game.key}`, { status: 404 });

	return (
		<UI.Stack gap="md">
			<UI.Group gap="md" align="center">
				<UI.Box
					w={4}
					h={32}
					bg="violet"
					style={{ borderRadius: "var(--mantine-radius-sm)" }}
					aria-hidden
				/>

				<div>
					<UI.Title order={2}>{game.name}</UI.Title>

					<UI.Text size="sm" c="dimmed">
						{game.levels.length} {game.levels.length === 1 ? "fase" : "fases"}
					</UI.Text>
				</div>
			</UI.Group>

			<UI.SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
				{game.levels.map((level, index) => (
					<LevelCard key={level.id} level={level} route={route} index={index} />
				))}
			</UI.SimpleGrid>
		</UI.Stack>
	);
}

function LevelCard({
	level,
	route,
	index,
}: {
	level: Level;
	route: string;
	index: number;
}) {
	const navigate = useNavigate();
	const levelNumber = index + 1;

	return (
		<UI.Paper
			className="codi-level-card"
			component="button"
			type="button"
			w="100%"
			onClick={() => navigate(`../${route}/${level.id}`)}
			style={{
				textAlign: "left",
				cursor: "pointer",
			}}
		>
			<UI.Group gap="md" wrap="nowrap">
				<UI.Center
					w={48}
					h={48}
					bg="violet.1"
					style={{
						borderRadius: "var(--mantine-radius-md)",
						flexShrink: 0,
					}}
				>
					<UI.Text size="xl" c="violet" fw={700}>
						{levelNumber}
					</UI.Text>
				</UI.Center>

				<div style={{ minWidth: 0, flex: 1 }}>
					<UI.Text size="xs" fw={600} c="dimmed" tt="uppercase">
						Fase {levelNumber}
					</UI.Text>

					<UI.Text fw={700} truncate>
						{level.name}
					</UI.Text>
				</div>

				<Icon.ChevronRight
					size={20}
					color="var(--mantine-color-dimmed)"
					style={{ flexShrink: 0 }}
				/>
			</UI.Group>
		</UI.Paper>
	);
}
