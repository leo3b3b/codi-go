import { UI } from "@codi-go/ui";
import { commandIcons } from "../constants";
import type { Command } from "../types";

type CommandSequenceProps = {
	sequence: Command[];
	activeCommandIndex: number | null;
};

export const CommandSequence = ({
	sequence,
	activeCommandIndex,
}: CommandSequenceProps) => (
	<div>
		<UI.Title order={2}>Sua sequência</UI.Title>

		<UI.Group
			gap="xs"
			p="xs"
			wrap="wrap"
			justify="flex-start"
			align="center"
			w="100%"
			mih={60}
			mt="xs"
			style={{
				border: "1px solid var(--app-border)",
				borderRadius: "var(--mantine-radius-md)",
			}}
		>
			{sequence.length === 0 ? (
				<UI.Text c="dimmed" ta="center" w="100%" size="sm">
					Escolha os comandos acima
				</UI.Text>
			) : (
				sequence.map((command, index) => {
					const CommandIcon = commandIcons[command];
					const isActive = index === activeCommandIndex;

					return (
						<UI.Center
							key={`${index}-${command}`}
							w={40}
							h={40}
							bg={isActive ? "violet" : "var(--app-surface)"}
							style={{
								flex: "0 0 40px",
								border: isActive
									? "2px solid var(--mantine-color-violet-7)"
									: "1px solid var(--app-border)",
								borderRadius: "var(--mantine-radius-sm)",
								boxShadow: isActive
									? "0 0 0 3px var(--mantine-color-violet-2)"
									: undefined,
								transition:
									"background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
							}}
							aria-label={
								isActive
									? `Comando ${index + 1}: ${command}, em execução`
									: `Comando ${index + 1}: ${command}`
							}
						>
							<CommandIcon
								size={22}
								color={
									isActive
										? "white"
										: "var(--mantine-color-violet-6)"
								}
							/>
						</UI.Center>
					);
				})
			)}
		</UI.Group>
	</div>
);