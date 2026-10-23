import { UI } from "@codi-go/ui";
import { CodiMessage, type Feedback } from "@/Games";
import type { Command } from "../types";
import { CommandPicker } from "./CommandPicker";
import { CommandSequence } from "./CommandSequence";

type MazeControlsProps = {
	message: string;
	feedback: Feedback;
	sequence: Command[];
	isRunning: boolean;
	onAddCommand: (command: Command) => void;
	onPlay: () => void;
	onClear: () => void;
};

export const MazeControls = ({
	message,
	feedback,
	sequence,
	isRunning,
	onAddCommand,
	onPlay,
	onClear,
}: MazeControlsProps) => (
	<UI.Paper
		w="100%"
		h={{ base: "auto", lg: "100%" }}
		p={{ base: "sm", lg: "xs" }}
	>
		<UI.Stack
			gap="xs"
			h={{ base: "auto", lg: "100%" }}
			style={{ minHeight: 0 }}
		>
			<CodiMessage message={message} status={feedback} textSize="md" />

			<CommandPicker disabled={isRunning} onSelect={onAddCommand} />

			<CommandSequence sequence={sequence} />

			<UI.Group gap="sm">
				<UI.Button
					type="button"
					flex={1}
					disabled={isRunning || sequence.length === 0}
					onClick={onPlay}
				>
					{isRunning ? "Andando…" : "Começar"}
				</UI.Button>

				<UI.Button
					type="button"
					flex={1}
					variant="default"
					disabled={isRunning || sequence.length === 0}
					onClick={onClear}
				>
					Limpar
				</UI.Button>
			</UI.Group>
		</UI.Stack>
	</UI.Paper>
);
