import { UI } from "@codi-go/ui";
import type { StudentProgressRecord } from "./types";

type ProgressRecordsProps = {
	records: StudentProgressRecord[];
};

export function ProgressRecords({ records }: ProgressRecordsProps) {
	return (
		<UI.Paper p="lg">
			<UI.Stack gap="md">
				<UI.Title order={3}>Histórico de tentativas</UI.Title>

				{records.length === 0 ? (
					<UI.Text size="sm" c="dimmed">
						Nenhuma tentativa registrada para este jogo.
					</UI.Text>
				) : (
					<UI.Stack gap={0}>
						{[...records].reverse().map((record) => (
							<UI.Group
								key={record.id}
								justify="space-between"
								gap="md"
								wrap="wrap"
								p="md"
								style={{
									borderBottom: "1px solid var(--app-border)",
								}}
							>
								<div>
									<UI.Text fw={600}>{record.level.name}</UI.Text>
									<UI.Text size="sm" c="dimmed">
										{new Date(record.register_time).toLocaleString("pt-BR")}
									</UI.Text>
								</div>

								<UI.Text c={record.result === "success" ? "green.7" : "red.7"}>
									{record.result === "success" ? "Sucesso" : "Falha"}
								</UI.Text>
							</UI.Group>
						))}
					</UI.Stack>
				)}
			</UI.Stack>
		</UI.Paper>
	);
}
