import { useState } from "react";
import toast from "react-hot-toast";
import { useReward } from "react-rewards";
import {
	type LoaderFunctionArgs,
	useLoaderData,
	useNavigate,
} from "react-router";
import { Icon, MazeRenderer } from "@/components";
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

const commandIcons: Record<Command, string> = {
	up: "i-lucide-arrow-up",
	down: "i-lucide-arrow-down",
	left: "i-lucide-arrow-left",
	right: "i-lucide-arrow-right",
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

		await registerResult("failure", currentLevel.id, commandsToExecute.length);
	}

	return (
		<div className="flex-(~ col) gap-4">
			<title>CodiGO! | Labirinto</title>
			<header className="ui-card w-full flex items-center gap-4 px-3 py-2">
				<button
					type="button"
					className="ui-button-(~ secondary) h-10 w-auto"
					onClick={() => navigate("../fases")}
				>
					<Icon icon="i-lucide-arrow-left" size={4} color="fg" />
					Voltar para fases
				</button>
				<h1 className="text-(2xl heading) font-bold">{level.name}</h1>
			</header>

			<div className="grid-(~ cols-1) lg:grid-cols-2 gap-6">
				<section className="flex size-full justify-center">
					<MazeRenderer
						level={state.level}
						playerPosition={state.playerPosition}
						direction={state.direction}
						moving={state.status === "running"}
					/>
				</section>

				<section className="ui-card flex-(~ col) gap-4">
					<div className="flex-(~ col) gap-1">
						<h2 className="text-(xl heading) font-bold">Objetivo</h2>
						<p className="text-muted">
							Ajude o <b>Codi</b> a chegar até a <b>porta</b>. Escolha os
							comandos na ordem em que ele deve se mover.
						</p>
					</div>

					<div className="flex-(~ col) gap-2">
						<h2 className="text-(xl heading) font-bold">Comandos</h2>

						<div className="flex items-center justify-center gap-2 py-2 bg-surface-subtle border-(~ border) rounded-xl">
							{commands.map((command) => (
								<button
									key={command}
									type="button"
									disabled={isRunning}
									className="ui-button-(~ primary) h-14 w-14 px-2 py-2"
									onClick={() => addCommand(command)}
								>
									<span
										className={`${commandIcons[command]} color-white size-10`}
									/>
								</button>
							))}
						</div>
					</div>

					<div className="flex-(~ col) gap-2">
						<h2 className="text-(xl heading) font-bold">Sua sequência</h2>

						<p className="text-muted">
							Os comandos serão executados nessa ordem:
						</p>

						<div className="flex-(~ wrap) min-h-20 items-center gap-2 rounded-lg border-(~ primary) p-3">
							{state.commands.length === 0 ? (
								<span className="text-(center muted) w-full">
									Escolha os comandos acima
								</span>
							) : (
								state.commands.map((command, index) => (
									<div
										key={`${index}-${command}`}
										className="flex size-12 items-center justify-center rounded-md border-(~ primary) bg-surface-subtle"
									>
										<Icon
											icon={commandIcons[command]}
											size={8}
											className="text-primary"
										/>
									</div>
								))
							)}
						</div>
					</div>

					<div className="flex items-center gap-4">
						<button
							type="button"
							disabled={isRunning || state.commands.length === 0}
							className="ui-button-(~ primary)"
							onClick={play}
						>
							{isRunning ? "Andando…" : "Começar"}
						</button>

						<button
							type="button"
							disabled={isRunning || state.commands.length === 0}
							className="ui-button-(~ secondary)"
							onClick={clearCommands}
						>
							Limpar
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}
