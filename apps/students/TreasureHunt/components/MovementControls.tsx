import { Icon, UI } from "@codi-go/ui";
import type { ReactNode } from "react";
import type { GridDirection } from "@/Games";

type MovementControlsProps = {
	disabled: boolean;
	onMove: (direction: GridDirection) => void;
};

const DirectionButton = ({
	direction,
	label,
	disabled,
	children,
	onMove,
}: {
	direction: GridDirection;
	label: string;
	disabled: boolean;
	children: ReactNode;
	onMove: (direction: GridDirection) => void;
}) => (
	<UI.ActionIcon
		type="button"
		size="xl"
		variant="filled"
		color="violet"
		disabled={disabled}
		aria-label={label}
		onClick={() => onMove(direction)}
	>
		{children}
	</UI.ActionIcon>
);

export const MovementControls = ({
	disabled,
	onMove,
}: MovementControlsProps) => (
	<UI.Stack align="center" gap="xs">
		<DirectionButton
			direction="up"
			label="Mover para cima"
			disabled={disabled}
			onMove={onMove}
		>
			<Icon.ArrowUp size={24} color="white" />
		</DirectionButton>

		<UI.Group gap="xs">
			<DirectionButton
				direction="left"
				label="Mover para a esquerda"
				disabled={disabled}
				onMove={onMove}
			>
				<Icon.ArrowLeft size={24} color="white" />
			</DirectionButton>
			<DirectionButton
				direction="down"
				label="Mover para baixo"
				disabled={disabled}
				onMove={onMove}
			>
				<Icon.ArrowDown size={24} color="white" />
			</DirectionButton>
			<DirectionButton
				direction="right"
				label="Mover para a direita"
				disabled={disabled}
				onMove={onMove}
			>
				<Icon.ArrowRight size={24} color="white" />
			</DirectionButton>
		</UI.Group>
	</UI.Stack>
);
