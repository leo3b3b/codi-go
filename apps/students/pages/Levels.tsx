import { Icon, UI } from "@codi-go/ui";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import {
	getStudentSession,
	isClassPlaying,
	listGames,
	listLevels,
} from "@/services";

export async function clientLoader({ params }: LoaderFunctionArgs) {
	if (!params.accessCode) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const session = getStudentSession();

	if (!session || session.class_id === "") {
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });
	}

	const status = await isClassPlaying(session.class_id);

	if (status !== true) {
		throw new Response("A turma não está em atividade.", { status: 403 });
	}

	const [games, levels] = await Promise.all([listGames(), listLevels()]);

	return games.map((game) => ({
		...game,
		levels: levels.filter((level) => level.game_key === game.key),
	}));
}

export default function LevelsPage() {
	const games = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	return (
		<UI.Stack w="100%" gap="xl">
			<title>CodiGO! | Fases</title>

			<div>
				<UI.Title order={1}>Fases</UI.Title>
				<UI.Text c="dimmed" mt="xs">
					Escolha um jogo e avance pelas fases.
				</UI.Text>
			</div>

			<UI.Stack gap="xl">
				{games.map((game) => (
					<UI.Stack key={game.key} gap="md">
						<UI.Group gap="md" align="center">
							<UI.Box
								w={4}
								h={32}
								bg="violet"
								style={{ borderRadius: "var(--mantine-radius-sm)" }}
							/>

							<div>
								<UI.Title order={2}>{game.name}</UI.Title>

								<UI.Text size="sm" c="dimmed">
									{game.levels.length}{" "}
									{game.levels.length === 1 ? "fase" : "fases"}
								</UI.Text>
							</div>
						</UI.Group>

						<UI.SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
							{game.levels.map((level) => (
								<UI.Paper
									key={level.id}
									component="button"
									type="button"
									w="100%"
									onClick={() => navigate(`../labirinto/${level.id}`)}
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
												{level.id}
											</UI.Text>
										</UI.Center>

										<div style={{ minWidth: 0, flex: 1 }}>
											<UI.Text size="xs" fw={600} c="dimmed" tt="uppercase">
												Fase {level.id}
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
							))}
						</UI.SimpleGrid>
					</UI.Stack>
				))}
			</UI.Stack>
		</UI.Stack>
	);
}
