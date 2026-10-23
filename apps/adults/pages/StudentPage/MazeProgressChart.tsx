import { Charts, UI } from "@codi-go/ui";
import type { MazeProgressRecord } from "./types";

type MazeProgressChartProps = {
	records: MazeProgressRecord[];
};

interface MazeChartPoint {
	attempt: number;
	levelName: string;
	result: "success" | "failure";
	difference: number | null;
	success: number | null;
	failure: number | null;
}

function MazeProgressTooltip({
	payload,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: compatibilidade com o payload do gráfico
	payload: readonly Record<string, any>[] | undefined;
}) {
	if (!payload) return null;

	const filteredPayload = Charts.getFilteredChartTooltipPayload(payload);
	const point = filteredPayload[0]?.payload as MazeChartPoint | undefined;

	if (!point) return null;

	return (
		<UI.Paper p="sm" withBorder shadow="md">
			<UI.Text fw={600}>
				Tentativa {point.attempt} — {point.levelName}
			</UI.Text>

			<UI.Text c={point.result === "success" ? "green.6" : "red.6"}>
				{point.result === "success" ? "Sucesso" : "Falha"}:{" "}
				{point.difference === null
					? "diferença indisponível"
					: `${point.difference} comandos`}
			</UI.Text>
		</UI.Paper>
	);
}

export function MazeProgressChart({ records }: MazeProgressChartProps) {
	if (records.length === 0) {
		return (
			<UI.Text c="dimmed">Nenhum registro de progresso disponível.</UI.Text>
		);
	}

	const chartData: MazeChartPoint[] = records.map((record, index) => ({
		attempt: index + 1,
		levelName: record.levelName,
		result: record.result,
		difference: record.commandDifference,
		success: record.result === "success" ? record.commandDifference : null,
		failure: record.result === "failure" ? record.commandDifference : null,
	}));

	const chartLimit = Math.max(
		1,
		...records.map((record) => Math.abs(record.commandDifference ?? 0)),
	);

	return (
		<Charts.LineChart
			h={320}
			data={chartData}
			dataKey="attempt"
			series={[
				{
					name: "success",
					label: "Sucesso",
					color: "green.6",
				},
				{
					name: "failure",
					label: "Falha",
					color: "red.6",
				},
			]}
			withLegend
			curveType="linear"
			connectNulls={false}
			dotProps={{ r: 5, strokeWidth: 2 }}
			activeDotProps={{ r: 7 }}
			yAxisProps={{ domain: [-chartLimit, chartLimit] }}
			referenceLines={[{ y: 0, color: "var(--app-surface)" }]}
			valueFormatter={(value) => `${value} comandos`}
			tooltipProps={{
				content: ({ payload }) => <MazeProgressTooltip payload={payload} />,
			}}
		/>
	);
}
