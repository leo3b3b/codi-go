import { useState } from "react";
import { MazeRenderer } from "@/components";
import { executeCommand, isGoalReached } from "@/engine";
import type { Command, MazeLevel, MazeState } from "@/types";

const level: MazeLevel = {
	id: "level-1",
	tiles: [
		["wall", "wall", "wall", "wall", "wall"],
		["wall", "floor", "floor", "floor", "wall"],
		["wall", "floor", "wall", "floor", "wall"],
		["wall", "floor", "floor", "floor", "wall"],
		["wall", "wall", "wall", "wall", "wall"],
	],
	start: {
		x: 1,
		y: 1,
	},
	goal: {
		x: 3,
		y: 3,
	},
};

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

export function MazeGame() {
	const [state, setState] = useState<MazeState>({
		level,
		playerPosition: level.start,
		commands: [],
		status: "editing",
	});

	const isRunning = state.status === "running";

	function addCommand(command: Command) {
		if (isRunning) {
			return;
		}

		if (
			state.level.maxCommands !== undefined &&
			state.commands.length >= state.level.maxCommands
		) {
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
			await wait(400);

			const nextPosition = executeCommand(currentLevel, position, command);

			if (!nextPosition) {
				setState((current) => ({
					...current,
					status: "failure",
				}));

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

				return;
			}
		}

		setState((current) => ({
			...current,
			status: "failure",
		}));
	}

	return (
		<div className="flex flex-col gap-6">
			<MazeRenderer level={state.level} playerPosition={state.playerPosition} />

			<div className="flex flex-col gap-4 px-4">
				<div className="flex items-center gap-4">
					{commands.map((command) => (
						<button
							key={command}
							type="button"
							disabled={isRunning}
							className="ui-button-primary h-14 w-14 px-2 py-2 disabled:opacity-50"
							onClick={() => addCommand(command)}
						>
							<span
								className={`${commandIcons[command]} color-white h-10 w-10`}
							/>
						</button>
					))}
				</div>

				<div className="flex min-h-16 items-center gap-2 rounded-lg border p-3">
					{state.commands.length === 0 ? (
						<span className="text-(center muted) w-full">Comandos</span>
					) : (
						state.commands.map((command, index) => (
							<div
								key={`${index}-${command}`}
								className="flex h-12 w-12 items-center justify-center rounded-md border"
							>
								<span className={`${commandIcons[command]} h-8 w-8`} />
							</div>
						))
					)}
				</div>

				<div className="flex items-center gap-4">
					<button
						type="button"
						disabled={isRunning || state.commands.length === 0}
						className="ui-button-primary px-6 py-3 disabled:opacity-50"
						onClick={play}
					>
						Começar
					</button>

					<button
						type="button"
						disabled={isRunning || state.commands.length === 0}
						className="ui-button-secondary px-6 py-3 disabled:opacity-50"
						onClick={clearCommands}
					>
						Limpar
					</button>
				</div>

				{state.status === "success" && (
					<div className="rounded-lg p-4">
						Muito bem! O Codi chegou ao objetivo!
					</div>
				)}

				{state.status === "failure" && (
					<div className="rounded-lg p-4">Ops! O Codi bateu em uma parede.</div>
				)}
			</div>
		</div>
	);
}
