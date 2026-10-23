import { UI } from "@codi-go/ui";
import { commandIcons, commands } from "../constants";
import type { Command } from "../types";

type CommandPickerProps = {
	disabled: boolean;
	onSelect: (command: Command) => void;
};

export const CommandPicker = ({ disabled, onSelect }: CommandPickerProps) => (
	<div>
		<UI.Title order={2}>Comandos</UI.Title>

		<UI.Group
			justify="center"
			gap="sm"
			wrap="nowrap"
			mt="xs"
			p="xs"
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
						disabled={disabled}
						aria-label={`Adicionar comando ${command}`}
						onClick={() => onSelect(command)}
					>
						<CommandIcon size={24} color="white" />
					</UI.ActionIcon>
				);
			})}
		</UI.Group>
	</div>
);
