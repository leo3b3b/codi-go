import { useState } from "react";
import { useReward } from "react-rewards";
import type { GridDirection } from "@/Games";
import { moveOnGrid, objectImages } from "@/Games";
import { registerProgress } from "@/services";
import { getPlaceIndexAtPosition } from "./engine";
import type { TreasureHuntLevel, TreasureHuntState } from "./types";

const createInitialState = (level: TreasureHuntLevel): TreasureHuntState => ({
	playerPosition: level.start,
	direction: "down",
	nextPlaceIndex: 0,
	status: "playing",
	feedback: "idle",
	feedbackMessage: level.instructions,
	moves: 0,
});

const wait = (ms: number) =>
	new Promise((resolve) => window.setTimeout(resolve, ms));

export function useTreasureHunt(level: TreasureHuntLevel) {
	const { reward } = useReward("confettiDiv", "confetti", {
		position: "fixed",
		elementCount: 240,
		angle: 90,
		spread: 120,
	});
	const [state, setState] = useState(() => createInitialState(level));
	const [isMoving, setIsMoving] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);

	const registerResult = async (
		result: "success" | "failure",
		moves: number,
		placesCompleted: number,
	) => {
		setIsRegistering(true);

		try {
			await registerProgress({
				level_id: level.id,
				result,
				metadata: {
					moves,
					places_completed: placesCompleted,
					places_total: level.places.length,
				},
			});

			if (result === "success") reward();
		} catch {
			setState((current) => ({
				...current,
				feedback: "incorrect",
				feedbackMessage:
					"Não foi possível registrar seu progresso. Tente novamente.",
			}));
		} finally {
			setIsRegistering(false);
		}
	};

	const move = async (direction: GridDirection) => {
		if (state.status !== "playing" || isMoving || isRegistering) return;

		const nextPosition = moveOnGrid(
			level.tiles,
			state.playerPosition,
			direction,
		);

		if (!nextPosition) {
			setState((current) => ({
				...current,
				direction,
				feedback: "incorrect",
				feedbackMessage: "Não consigo passar por ali. Tente outra direção.",
			}));
			return;
		}

		const placeIndex = getPlaceIndexAtPosition(level.places, nextPosition);
		const moves = state.moves + 1;

		if (placeIndex > state.nextPlaceIndex) {
			const reached = level.places[placeIndex];
			const expected = level.places[state.nextPlaceIndex];

			setState((current) => ({
				...current,
				playerPosition: nextPosition,
				direction,
				moves,
				status: "failure",
				feedback: "incorrect",
				feedbackMessage: `Você chegou a ${objectImages[reached.object].label} antes de ${objectImages[expected.object].label}. Tente novamente!`,
			}));

			setIsMoving(true);
			await wait(300);
			setIsMoving(false);
			await registerResult("failure", moves, state.nextPlaceIndex);
			return;
		}

		const reachedExpected = placeIndex === state.nextPlaceIndex;
		const nextPlaceIndex = state.nextPlaceIndex + Number(reachedExpected);
		const completed = nextPlaceIndex === level.places.length;
		const nextTarget = level.places[nextPlaceIndex];
		const nextTargetLabel = nextTarget
			? objectImages[nextTarget.object].label
			: "";

		setState((current) => ({
			...current,
			playerPosition: nextPosition,
			direction,
			moves,
			nextPlaceIndex,
			status: completed ? "success" : "playing",
			feedback: completed ? "correct" : reachedExpected ? "partial" : "idle",
			feedbackMessage: completed
				? "Muito bem! Você encontrou todos os objetos na ordem certa!"
				: reachedExpected
					? `Muito bem! Agora encontre ${nextTargetLabel}.`
					: level.instructions,
		}));

		setIsMoving(true);
		await wait(300);
		setIsMoving(false);

		if (completed) await registerResult("success", moves, nextPlaceIndex);
	};

	const restart = () => {
		if (isMoving || isRegistering) return;
		setState(createInitialState(level));
	};

	return { state, isMoving, isRegistering, move, restart };
}
