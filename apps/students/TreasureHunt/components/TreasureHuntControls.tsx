import { UI } from "@codi-go/ui";
import { CodiMessage } from "@/Games";
import type { GridDirection } from "@/Games";
import type { TreasureHuntLevel, TreasureHuntState } from "../types";
import { MovementControls } from "./MovementControls";

type TreasureHuntControlsProps = {
	level: TreasureHuntLevel;
	state: TreasureHuntState;
	isMoving: boolean;
	isRegistering: boolean;
	onMove: (direction: GridDirection) => void;
	onRestart: () => void;
};

export const TreasureHuntControls = ({
	level,
	state,
	isMoving,
	isRegistering,
	onMove,
	onRestart,
}: TreasureHuntControlsProps) => (
	<UI.Paper w="100%" h={{ base: "auto", lg: "100%" }} p="md">
		<UI.Stack gap="md" h="100%" justify="space-between">
			<CodiMessage
				message={level.instructions}
				status={state.feedback}
				textSize="md"
			/>

			<UI.Stack gap="xs">
				<UI.Text>{state.feedbackMessage}</UI.Text>
				<UI.Group justify="space-between" gap="xs">
					<UI.Text size="sm" c="dimmed">
						Objetos encontrados: {state.nextPlaceIndex}/{level.places.length}
					</UI.Text>
					<UI.Text size="sm" c="dimmed">
						Movimentos: {state.moves}
					</UI.Text>
				</UI.Group>
			</UI.Stack>

			<MovementControls
				disabled={
					state.status !== "playing" || isMoving || isRegistering
				}
				onMove={onMove}
			/>

			{state.status !== "playing" && (
				<UI.Button
					type="button"
					fullWidth
					disabled={isMoving || isRegistering}
					onClick={onRestart}
				>
					{state.status === "success" ? "Jogar novamente" : "Recomeçar"}
				</UI.Button>
			)}
		</UI.Stack>
	</UI.Paper>
);
