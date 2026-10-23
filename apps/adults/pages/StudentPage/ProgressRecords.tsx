import { UI } from "@codi-go/ui";
import { useState } from "react";
import type { StudentProgressRecord } from "./types";

const PAGE_SIZE = 10;

const resultStyles = {
	success: { label: "Sucesso", color: "green.7" },
	partial: { label: "Parcial", color: "yellow.7" },
	failure: { label: "Falha", color: "red.7" },
} as const;

type ProgressRecordsProps = {
	records: StudentProgressRecord[];
};

function getPartialSummary(metadata: StudentProgressRecord["metadata"]) {
	if (
		typeof metadata !== "object" ||
		metadata === null ||
		Array.isArray(metadata)
	)
		return null;

	const correctCount = metadata.correct_count;
	const itemCount = metadata.item_count;

	return typeof correctCount === "number" && typeof itemCount === "number"
		? `${correctCount} de ${itemCount} itens corretos`
		: null;
}

export function ProgressRecords({ records }: ProgressRecordsProps) {
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(records.length / PAGE_SIZE);
	const currentPage = Math.max(1, Math.min(page, totalPages || 1));

	const pageRecords = [...records]
		.reverse()
		.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<UI.Paper p="lg">
			<UI.Stack gap="md">
				<UI.Group justify="space-between" align="center" gap="sm">
					<UI.Title order={3}>Histórico de tentativas</UI.Title>

					<UI.Text size="sm" c="dimmed">
						{records.length} {records.length === 1 ? "tentativa" : "tentativas"}
					</UI.Text>
				</UI.Group>

				{records.length === 0 ? (
					<UI.Text size="sm" c="dimmed">
						Nenhuma tentativa registrada para este jogo.
					</UI.Text>
				) : (
					<>
						<UI.Stack gap={0}>
							{pageRecords.map((record) => {
								const resultStyle = resultStyles[record.result];
								const partialSummary =
									record.result === "partial"
										? getPartialSummary(record.metadata)
										: null;

								return (
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

											{partialSummary && (
												<UI.Text size="sm" c="dimmed">
													{partialSummary}
												</UI.Text>
											)}
										</div>

										<UI.Text c={resultStyle.color} fw={500}>
											{resultStyle.label}
										</UI.Text>
									</UI.Group>
								);
							})}
						</UI.Stack>

						{totalPages > 1 && (
							<UI.Stack gap="xs" align="center">
								<UI.Pagination
									total={totalPages}
									value={currentPage}
									onChange={setPage}
									siblings={1}
									boundaries={1}
								/>

								<UI.Text size="xs" c="dimmed">
									Página {currentPage} de {totalPages}
								</UI.Text>
							</UI.Stack>
						)}
					</>
				)}
			</UI.Stack>
		</UI.Paper>
	);
}
