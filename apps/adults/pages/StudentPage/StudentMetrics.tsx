import { UI } from "@codi-go/ui";
import { MetricCard } from "./MetricCard";
import type { StudentProgressRecord } from "./types";

type StudentMetricsProps = {
	records: StudentProgressRecord[];
};

export function StudentMetrics({ records }: StudentMetricsProps) {
	const successCount = records.filter(
		(record) => record.result === "success",
	).length;

	const successRate =
		records.length > 0 ? Math.round((successCount / records.length) * 100) : 0;

	const completedLevels = new Set(
		records
			.filter((record) => record.result === "success")
			.map((record) => record.level_id),
	).size;

	const lastActivity =
		records.length > 0 ? records[records.length - 1].register_time : null;

	return (
		<UI.SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
			<MetricCard label="Taxa de sucesso" value={`${successRate}%`} />
			<MetricCard label="Níveis concluídos" value={String(completedLevels)} />
			<MetricCard label="Registros" value={String(records.length)} />
			<MetricCard
				label="Última atividade"
				value={
					lastActivity
						? new Date(lastActivity).toLocaleDateString("pt-BR")
						: "—"
				}
			/>
		</UI.SimpleGrid>
	);
}
