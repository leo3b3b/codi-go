import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useReward } from "react-rewards";
import {
	type LoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from "react-router";
import { MazeRenderer } from "@/components";
import { executeCommand, isGoalReached } from "@/engine";
import {
	getMazeLevel,
	getStudentSession,
	isClassPlaying,
	registerMazeProgress,
} from "@/services";
import type { Command, MazeLevel, MazeState } from "@/types";

export async function clientLoader({ params }: LoaderFunctionArgs) {
	const levelId = Number(params.levelId);

	const session = getStudentSession();

	if (!session) {
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });
	}

	const status = await isClassPlaying(session.class_id);

	if (status !== true) {
		throw new Response("A turma não está em atividade.", { status: 403 });
	}

	return getMazeLevel(levelId);
}

const commandIcons: Record<
	Command,
	React.ComponentType<{ size?: number; color?: string }>
> = {
	up: Icon.ArrowUp,
	down: Icon.ArrowDown,
	left: Icon.ArrowLeft,
	right: Icon.ArrowRight,
};

const commands: Command[] = ["up", "left", "down", "right"];

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function MazeGame() {
	const level = useLoaderData() as MazeLevel;
	const navigate = useNavigate();
	const { reward } = useReward("confettiDiv", "confetti", {
		position: "fixed",
		elementCount: 240,
		angle: 90,
		spread: 120,
	});

	const [state, setState] = useState<MazeState>({
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

	function addCommand(command: Command) {
		if (isRunning) {
			return;
		}

		setState((current) => ({
			...current,
			commands: [...current.commands, command],
			status: "editing",
		}));
	}

	function clearCommands() {
		if (isRunning) {
			return;
		}

		setState((current) => ({
			...current,
			playerPosition: current.level.start,
			commands: [],
			status: "editing",
		}));
	}

	async function play() {
		if (isRunning || state.commands.length === 0) {
			return;
		}

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

			const nextPosition = executeCommand(currentLevel, position, command);

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

				toast.error("Ops! Tente outra sequência.");
				return;
			}

			position = nextPosition;

			setState((current) => ({
				...current,
				playerPosition: position,
			}));

			await wait(300);

			if (isGoalReached(currentLevel, position)) {
				setState((current) => ({
					...current,
					status: "success",
				}));

				await registerResult(
					"success",
					currentLevel.id,
					commandsToExecute.length,
				);

				toast.success("Muito bem! O Codi chegou ao objetivo.");
				reward();

				return;
			}
		}

		setState((current) => ({
			...current,
			status: "failure",
		}));

		await registerResult(
			"failure",
			currentLevel.id,
			commandsToExecute.length,
		);
	}

	return (
		<M.Stack w="100%" gap="md">
			<title>CodiGO! | Labirinto</title>

			<M.Paper>
				<M.Group gap="md" wrap="nowrap">
					<M.Button
						type="button"
						variant="default"
						w="auto"
						leftSection={<Icon.ArrowLeft size={18} />}
						onClick={() => navigate("../fases")}
					>
						Voltar para fases
					</M.Button>

					<M.Title order={1}>{level.name}</M.Title>
				</M.Group>
			</M.Paper>

			<M.Grid align="stretch">
				<M.Grid.Col span={{ base: 12, lg: 6 }}>
					<M.Center h="100%" mih={400}>
						<MazeRenderer
							level={state.level}
							playerPosition={state.playerPosition}
							direction={state.direction}
							moving={state.status === "running"}
						/>
					</M.Center>
				</M.Grid.Col>

				<M.Grid.Col span={{ base: 12, lg: 6 }}>
					<M.Paper h="100%">
						<M.Stack gap="lg">
							<div>
								<M.Title order={2}>Objetivo</M.Title>

								<M.Text c="dimmed" mt="xs">
									Ajude o <b>Codi</b> a chegar até a{" "}
									<b>porta</b>. Escolha os comandos na ordem
									em que ele deve se mover.
								</M.Text>
							</div>

							<M.Stack gap="sm">
								<M.Title order={2}>Comandos</M.Title>

								<M.Group
									justify="center"
									gap="sm"
									p="sm"
									bg="gray.1"
									style={{
										border:
											"1px solid var(--mantine-color-gray-3)",
										borderRadius:
											"var(--mantine-radius-md)",
									}}
								>
									{commands.map((command) => {
										const CommandIcon = commandIcons[command];

										return (
											<M.ActionIcon
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
											</M.ActionIcon>
										);
									})}
								</M.Group>
							</M.Stack>

							<M.Stack gap="sm">
								<M.Title order={2}>Sua sequência</M.Title>

								<M.Text c="dimmed">
									Os comandos serão executados nessa ordem:
								</M.Text>

								<M.Group
									gap="sm"
									p="sm"
									wrap="wrap"
									mih={80}
									style={{
										border:
											"1px solid var(--mantine-color-violet-6)",
										borderRadius:
											"var(--mantine-radius-md)",
									}}
								>
									{state.commands.length === 0 ? (
										<M.Text
											c="dimmed"
											ta="center"
											w="100%"
										>
											Escolha os comandos acima
										</M.Text>
									) : (
										state.commands.map((command, index) => {
											const CommandIcon = commandIcons[command];

											return (
												<M.Center
													key={`${index}-${command}`}
													w={48}
													h={48}
													bg="gray.1"
													style={{
														border:
															"1px solid var(--mantine-color-violet-6)",
														borderRadius:
															"var(--mantine-radius-sm)",
													}}
												>
													<CommandIcon
														size={24}
														color="var(--mantine-color-violet-6)"
													/>
												</M.Center>
											);
										})
									)}
								</M.Group>
							</M.Stack>

							<M.Group gap="sm">
								<M.Button
									type="button"
									flex={1}
									disabled={
										isRunning ||
										state.commands.length === 0
									}
									onClick={play}
								>
									{isRunning ? "Andando…" : "Começar"}
								</M.Button>

								<M.Button
									type="button"
									flex={1}
									variant="default"
									disabled={
										isRunning ||
										state.commands.length === 0
									}
									onClick={clearCommands}
								>
									Limpar
								</M.Button>
							</M.Group>
						</M.Stack>
					</M.Paper>
				</M.Grid.Col>
			</M.Grid>
		</M.Stack>
	);
}