import * as M from "@mantine/core";
import * as Icon from "lucide-react";
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
		<M.Stack w="100%" gap="xl">
			<title>CodiGO! | Fases</title>

			<div>
				<M.Title order={1}>Fases</M.Title>
				<M.Text c="dimmed" mt="xs">
					Escolha um jogo e avance pelas fases.
				</M.Text>
			</div>

			<M.Stack gap="xl">
				{games.map((game) => (
					<M.Stack key={game.key} gap="md">
						<M.Group gap="md" align="center">
							<M.Box
								w={4}
								h={32}
								bg="violet"
								style={{ borderRadius: "var(--mantine-radius-sm)" }}
							/>

							<div>
								<M.Title order={2}>{game.name}</M.Title>

								<M.Text size="sm" c="dimmed">
									{game.levels.length}{" "}
									{game.levels.length === 1 ? "fase" : "fases"}
								</M.Text>
							</div>
						</M.Group>

						<M.SimpleGrid
							cols={{ base: 1, sm: 2, lg: 3 }}
							spacing="md"
						>
							{game.levels.map((level) => (
								<M.Paper
									key={level.id}
									component="button"
									type="button"
									w="100%"
									onClick={() =>
										navigate(`../labirinto/${level.id}`)
									}
									style={{
										textAlign: "left",
										cursor: "pointer",
									}}
								>
									<M.Group gap="md" wrap="nowrap">
										<M.Center
											w={48}
											h={48}
											bg="violet.1"
											style={{
												borderRadius:
													"var(--mantine-radius-md)",
												flexShrink: 0,
											}}
										>
											<M.Text size="xl" c="violet" fw={700}>
												{level.id}
											</M.Text>
										</M.Center>

										<div style={{ minWidth: 0, flex: 1 }}>
											<M.Text
												size="xs"
												fw={600}
												c="dimmed"
												tt="uppercase"
											>
												Fase {level.id}
											</M.Text>

											<M.Text fw={700} truncate>
												{level.name}
											</M.Text>
										</div>

										<Icon.ChevronRight
											size={20}
											color="var(--mantine-color-dimmed)"
											style={{ flexShrink: 0 }}
										/>
									</M.Group>
								</M.Paper>
							))}
						</M.SimpleGrid>
					</M.Stack>
				))}
			</M.Stack>
		</M.Stack>
	);
}
