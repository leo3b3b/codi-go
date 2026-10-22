import type { Route } from "+pages/MazeGame";
import { Icon, notifications, UI } from "@codi-go/ui";
import { useState } from "react";
import { useReward } from "react-rewards";
import { useNavigate } from "react-router";
import {
	C,
	commandIcons,
	commands,
	engine,
	parseMazeLevel,
	type T,
	wait,
} from "@/MazeGame";
import {
	getLevel,
	getStudentSession,
	isClassPlaying,
	registerMazeProgress,
} from "@/services";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const levelId = Number(params.levelId);
	const session = getStudentSession();

	if (!session)
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });

	const status = await isClassPlaying(session.class_id);

	if (status !== true)
		throw new Response("A turma não está em atividade.", { status: 403 });

	const levelData = await getLevel(levelId);
	return parseMazeLevel(levelData);
}

export function meta({ loaderData: level }: Route.MetaArgs) {
	return [{ title: `${level.name} | CodiGO!` }];
}

export default function MazeGame({ loaderData: level }: Route.ComponentProps) {
	const navigate = useNavigate();
	const { reward } = useReward("confettiDiv", "confetti", {
		position: "fixed",
		elementCount: 240,
		angle: 90,
		spread: 120,
	});

	const [state, setState] = useState<T.MazeState>({
		level,
		playerPosition: level.start,
		commands: [],
		status: "editing",
		direction: "down",
	});

	const isRunning = state.status === "running";

	async function registerResult(
		result: "success" | "failure",
		level_id: number,
		number_of_commands: number,
	) {
		await registerMazeProgress({
			result,
			level_id,
			number_of_commands,
		});
	}

	function addCommand(command: T.Command) {
		if (isRunning) return;

		setState((current) => ({
			...current,
			commands: [...current.commands, command],
			status: "editing",
		}));
	}

	function clearCommands() {
		if (isRunning) return;

		setState((current) => ({
			...current,
			playerPosition: current.level.start,
			commands: [],
			status: "editing",
		}));
	}

	async function play() {
		if (isRunning || state.commands.length === 0) return;

		const commandsToExecute = [...state.commands];
		const currentLevel = state.level;

		setState((current) => ({
			...current,
			playerPosition: current.level.start,
			status: "running",
		}));

		let position = currentLevel.start;

		for (const command of commandsToExecute) {
			setState((current) => ({
				...current,
				direction: command,
			}));

			await wait(400);

			const nextPosition = engine.executeCommand(
				currentLevel,
				position,
				command,
			);

			if (!nextPosition) {
				setState((current) => ({
					...current,
					status: "failure",
				}));

				await registerResult(
					"failure",
					currentLevel.id,
					commandsToExecute.length,
				);

				notifications.show({
					message: "Ops! Tente outra sequência.",
					color: "red",
					position: "top-center",
					autoClose: 3000,
					withCloseButton: false,
					icon: <Icon.X />,
				});

				return;
			}

			position = nextPosition;

			setState((current) => ({
				...current,
				playerPosition: position,
			}));

			await wait(300);

			if (engine.isGoalReached(currentLevel, position)) {
				setState((current) => ({
					...current,
					status: "success",
				}));

				await registerResult(
					"success",
					currentLevel.id,
					commandsToExecute.length,
				);

				notifications.show({
					message: "Muito bem! O Codi chegou ao objetivo.",
					color: "green",
					position: "top-center",
					autoClose: 3000,
					withCloseButton: false,
					icon: <Icon.Check />,
				});
				reward();

				return;
			}
		}

		setState((current) => ({
			...current,
			status: "failure",
		}));

		await registerResult("failure", currentLevel.id, commandsToExecute.length);
		notifications.show({
			message: "Ops! Tente outra sequência.",
			color: "red",
			position: "top-center",
			autoClose: 3000,
			withCloseButton: false,
			icon: <Icon.X />,
		});
	}

	return (
		<UI.Stack w="100%" gap="md">
			<UI.Paper>
				<UI.Group gap="md" wrap="nowrap">
					<UI.Button
						type="button"
						variant="default"
						w="auto"
						leftSection={<Icon.ArrowLeft size={18} />}
						onClick={() => navigate("../fases")}
					>
						Voltar para fases
					</UI.Button>

					<UI.Title order={1}>{level.name}</UI.Title>
				</UI.Group>
			</UI.Paper>

			<UI.Grid align="stretch">
				<UI.Grid.Col span={{ base: 12, lg: 6 }}>
					<UI.Center h="100%" mih={400}>
						<C.MazeRenderer
							level={state.level}
							playerPosition={state.playerPosition}
							direction={state.direction}
							moving={state.status === "running"}
						/>
					</UI.Center>
				</UI.Grid.Col>

				<UI.Grid.Col span={{ base: 12, lg: 6 }}>
					<UI.Paper h="100%">
						<UI.Stack gap="lg">
							<div>
								<UI.Title order={2}>Objetivo</UI.Title>

								<UI.Text c="dimmed" mt="xs">
									Ajude o <b>Codi</b> a chegar até a <b>porta</b>. Escolha os
									comandos na ordem em que ele deve se mover.
								</UI.Text>
							</div>

							<UI.Stack gap="sm">
								<UI.Title order={2}>Comandos</UI.Title>

								<UI.Group
									justify="center"
									gap="sm"
									p="sm"
									bg="var(--app-surface)"
									style={{
										border: "1px solid var(--app-border)",
										borderRadius: "var(--mantine-radius-md)",
									}}
								>
									{commands.map((command) => {
										const CommandIcon = commandIcons[command];

										return (
											<UI.ActionIcon
												key={command}
												type="button"
												size="xl"
												variant="filled"
												color="violet"
												disabled={isRunning}
												aria-label={`Adicionar comando ${command}`}
												onClick={() => addCommand(command)}
											>
												<CommandIcon size={24} color="white" />
											</UI.ActionIcon>
										);
									})}
								</UI.Group>
							</UI.Stack>

							<UI.Stack gap="sm">
								<UI.Title order={2}>Sua sequência</UI.Title>

								<UI.Text c="dimmed">
									Os comandos serão executados nessa ordem:
								</UI.Text>

								<UI.Group
									gap="sm"
									p="sm"
									wrap="wrap"
									mih={80}
									style={{
										border: "1px solid var(--app-border)",
										borderRadius: "var(--mantine-radius-md)",
									}}
								>
									{state.commands.length === 0 ? (
										<UI.Text c="dimmed" ta="center" w="100%">
											Escolha os comandos acima
										</UI.Text>
									) : (
										state.commands.map((command, index) => {
											const CommandIcon = commandIcons[command];

											return (
												<UI.Center
													key={`${index}-${command}`}
													w={48}
													h={48}
													bg="var(--app-surface)"
													style={{
														border: "1px solid var(--app-border)",
														borderRadius: "var(--mantine-radius-sm)",
													}}
												>
													<CommandIcon
														size={24}
														color="var(--mantine-color-violet-6)"
													/>
												</UI.Center>
											);
										})
									)}
								</UI.Group>
							</UI.Stack>

							<UI.Group gap="sm">
								<UI.Button
									type="button"
									flex={1}
									disabled={isRunning || state.commands.length === 0}
									onClick={play}
								>
									{isRunning ? "Andando…" : "Começar"}
								</UI.Button>

								<UI.Button
									type="button"
									flex={1}
									variant="default"
									disabled={isRunning || state.commands.length === 0}
									onClick={clearCommands}
								>
									Limpar
								</UI.Button>
							</UI.Group>
						</UI.Stack>
					</UI.Paper>
				</UI.Grid.Col>
			</UI.Grid>
		</UI.Stack>
	);
}
