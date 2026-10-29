import { useState } from "react";
import { useReward } from "react-rewards";
import type { Feedback } from "@/Games";
import { registerMazeProgress } from "@/services";
import { executeCommand, isGoalReached } from "./engine";
import { wait } from "./functions";
import type { Command, MazeLevel, MazeState } from "./types";

const messages: Record<MazeState["status"], string> = {
	editing:
		"Me ajude a chegar até a porta. Escolha os comandos na ordem em que eu tenho que me mover.",
	running: "Estou seguindo os comandos. Vamos ver se consigo chegar à porta!",
	success: "Consegui chegar à porta! Muito bem!",
	failure: "Não consegui chegar à porta. Ajuste a sequência e tente de novo.",
};

const feedbacks: Record<MazeState["status"], Feedback> = {
	editing: "idle",
	running: "partial",
	success: "correct",
	failure: "incorrect",
};

export function useMazeGame(level: MazeLevel) {
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
		activeCommandIndex: null,
	});

	const isRunning = state.status === "running";

	const registerResult = (
		result: "success" | "failure",
		levelId: number,
		numberOfCommands: number,
	) =>
		registerMazeProgress({
			result,
			level_id: levelId,
			number_of_commands: numberOfCommands,
		});

	const addCommand = (command: Command) => {
		if (isRunning) return;

		setState((current) => ({
			...current,
			commands: [...current.commands, command],
			status: "editing",
			activeCommandIndex: null,
		}));
	};

	const clearCommands = () => {
		if (isRunning) return;

		setState((current) => ({
			...current,
			playerPosition: current.level.start,
			commands: [],
			status: "editing",
			activeCommandIndex: null,
		}));
	};

	const play = async () => {
		if (isRunning || state.commands.length === 0) return;

		const commandsToExecute = [...state.commands];
		const currentLevel = state.level;

		setState((current) => ({
			...current,
			playerPosition: current.level.start,
			status: "running",
			activeCommandIndex: null,
		}));

		let position = currentLevel.start;

		for (const [index, command] of commandsToExecute.entries()) {
			setState((current) => ({
				...current,
				direction: command,
				activeCommandIndex: index,
			}));

			await wait(400);

			const nextPosition = executeCommand(currentLevel, position, command);

			if (!nextPosition) {
				setState((current) => ({
					...current,
					status: "failure",
					activeCommandIndex: null,
				}));

				await registerResult(
					"failure",
					currentLevel.id,
					commandsToExecute.length,
				);

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
					activeCommandIndex: null,
				}));

				await registerResult(
					"success",
					currentLevel.id,
					commandsToExecute.length,
				);

				reward();
				return;
			}
		}

		setState((current) => ({
			...current,
			status: "failure",
			activeCommandIndex: null,
		}));

		await registerResult("failure", currentLevel.id, commandsToExecute.length);
	};

	return {
		state,
		isRunning,
		message: messages[state.status],
		feedback: feedbacks[state.status],
		addCommand,
		clearCommands,
		play,
	};
}
