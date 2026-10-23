import { UI } from "@codi-go/ui";
import { commandIcons } from "../constants";
import type { Command } from "../types";

type CommandSequenceProps = {
	sequence: Command[];
};

export const CommandSequence = ({ sequence }: CommandSequenceProps) => (
	<div>
		<UI.Title order={2}>Sua sequência</UI.Title>

		<UI.Group
			gap="xs"
			p="xs"
			wrap="nowrap"
			w="100%"
			mih={60}
			mt="xs"
			style={{
				border: "1px solid var(--app-border)",
				borderRadius: "var(--mantine-radius-md)",
				overflowX: "auto",
				overflowY: "hidden",
			}}
		>
			{sequence.length === 0 ? (
				<UI.Text c="dimmed" ta="center" w="100%" size="sm">
					Escolha os comandos acima
				</UI.Text>
			) : (
				sequence.map((command, index) => {
					const CommandIcon = commandIcons[command];

					return (
						<UI.Center
							key={`${index}-${command}`}
							w={40}
							h={40}
							bg="var(--app-surface)"
							style={{
								flex: "0 0 40px",
								border: "1px solid var(--app-border)",
								borderRadius: "var(--mantine-radius-sm)",
							}}
						>
							<CommandIcon size={22} color="var(--mantine-color-violet-6)" />
						</UI.Center>
					);
				})
			)}
		</UI.Group>
	</div>
);
