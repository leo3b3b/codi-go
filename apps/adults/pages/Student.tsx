import type { Route } from "+pages/Student";
import { Charts, Icon, UI } from "@codi-go/ui";
import { useNavigate } from "react-router";
import { parseMazeProgress } from "@/games/maze/progress";
import { getStudentById, getStudentProgress } from "@/services";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const { schoolId, studentId } = params;

	if (!schoolId || !studentId)
		throw new Response("Aluno não encontrado", { status: 404 });

	const [student, progress] = await Promise.all([
		getStudentById(studentId),
		getStudentProgress(studentId),
	]);

	if (student.school_id !== schoolId)
		throw new Response("Aluno não encontrado", { status: 404 });

	return {
		student,
		progress,
		mazeProgress: progress
			.map(parseMazeProgress)
			.filter((record) => record !== null),
	};
}

export function meta({ loaderData: { student } }: Route.MetaArgs) {
	return [{ title: `${student.name} | CodiGO!` }];
}

export default function StudentPage({
	loaderData: { student, progress, mazeProgress },
}: Route.ComponentProps) {
	const navigate = useNavigate();

	const successCount = progress.filter(
		(record) => record.result === "success",
	).length;

	const successRate =
		progress.length > 0
			? Math.round((successCount / progress.length) * 100)
			: 0;

	const completedLevels = new Set(
		progress
			.filter((record) => record.result === "success")
			.map((record) => record.level_id),
	).size;

	const lastActivity =
		progress.length > 0 ? progress[progress.length - 1].register_time : null;

	return (
		<UI.Stack w="100%" gap="xl">
			<UI.Paper>
				<UI.Group justify="space-between" gap="md" wrap="nowrap">
					<div>
						<UI.Title order={1}>{student.name}</UI.Title>
						<UI.Text size="sm" c="dimmed">
							Acompanhamento do aluno
						</UI.Text>
					</div>

					<UI.Button
						type="button"
						variant="default"
						w="auto"
						leftSection={<Icon.ArrowLeft size={18} />}
						onClick={() =>
							navigate(`/escola/${student.school_id}/turma/${student.class_id}`)
						}
					>
						Voltar
					</UI.Button>
				</UI.Group>
			</UI.Paper>

			<UI.SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
				<MetricCard label="Taxa de sucesso" value={`${successRate}%`} />

				<MetricCard label="Níveis concluídos" value={String(completedLevels)} />

				<MetricCard label="Registros" value={String(progress.length)} />

				<MetricCard
					label="Última atividade"
					value={
						lastActivity
							? new Date(lastActivity).toLocaleDateString("pt-BR")
							: "—"
					}
				/>
			</UI.SimpleGrid>

			<UI.Paper>
				<UI.Stack gap="md">
					<div>
						<UI.Title order={2}>Jogo do Labirinto</UI.Title>

						<UI.Divider />

						<UI.Text size="sm" c="dimmed" mt="md">
							Diferença entre os comandos utilizados e a meta do nível{" "}
							<b>(quanto menor, melhor)</b>.
						</UI.Text>
					</div>

					{mazeProgress.length > 0 ? (
						<MazeProgressChart records={mazeProgress} />
					) : (
						<UI.Text size="sm" c="dimmed">
							Ainda não há dados suficientes para o labirinto.
						</UI.Text>
					)}
				</UI.Stack>
			</UI.Paper>

			<UI.Paper>
				<UI.Stack gap="md">
					<UI.Title order={2}>Registros</UI.Title>

					<UI.Grid
						visibleFrom="md"
						px="md"
						py="sm"
						style={{
							borderBottom: "1px solid var(--app-border)",
						}}
					>
						<UI.Grid.Col span={3}>
							<UI.Text size="sm" c="dimmed" fw={700}>
								Nível
							</UI.Text>
						</UI.Grid.Col>

						<UI.Grid.Col span={3}>
							<UI.Text size="sm" c="dimmed" fw={700}>
								Jogo
							</UI.Text>
						</UI.Grid.Col>

						<UI.Grid.Col span={3}>
							<UI.Text size="sm" c="dimmed" fw={700}>
								Resultado
							</UI.Text>
						</UI.Grid.Col>

						<UI.Grid.Col span={3}>
							<UI.Text size="sm" c="dimmed" fw={700}>
								Data
							</UI.Text>
						</UI.Grid.Col>
					</UI.Grid>

					<UI.Stack gap={0}>
						{[...progress].reverse().map((record) => (
							<UI.Grid
								key={record.id}
								align="center"
								px="md"
								py="sm"
								style={{
									borderBottom: "1px solid var(--app-border)",
								}}
							>
								<UI.Grid.Col span={{ base: 12, md: 3 }}>
									<UI.Text fw={600}>{record.level.name}</UI.Text>
								</UI.Grid.Col>

								<UI.Grid.Col span={{ base: 12, md: 3 }}>
									<UI.Text c="dimmed">{record.level.game.name}</UI.Text>
								</UI.Grid.Col>

								<UI.Grid.Col span={{ base: 6, md: 3 }}>
									<UI.Text>
										{record.result === "success" ? "Sucesso" : "Falha"}
									</UI.Text>
								</UI.Grid.Col>

								<UI.Grid.Col span={{ base: 6, md: 3 }}>
									<UI.Text c="dimmed">
										{new Date(record.register_time).toLocaleString("pt-BR")}
									</UI.Text>
								</UI.Grid.Col>
							</UI.Grid>
						))}
					</UI.Stack>
				</UI.Stack>
			</UI.Paper>
		</UI.Stack>
	);
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<UI.Paper component="article">
			<UI.Text size="sm" c="dimmed">
				{label}
			</UI.Text>

			<UI.Text size="xl" fw={700} mt="xs">
				{value}
			</UI.Text>
		</UI.Paper>
	);
}

interface MazeProgressChartProps {
	records: Awaited<ReturnType<typeof parseMazeProgress>>[];
}

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
	// biome-ignore lint/suspicious/noExplicitAny: its better this way
	payload: readonly Record<string, any>[] | undefined;
}) {
	if (!payload) return null;

	// Remove entradas vazias geradas para compor as séries do gráfico.
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

	const validRecords = records.filter(
		(record): record is NonNullable<typeof record> => record !== null,
	);

	const chartData: MazeChartPoint[] = validRecords.map((record, index) => ({
		attempt: index + 1,
		levelName: record.levelName,
		result: record.result,
		difference: record.commandDifference,
		success: record.result === "success" ? record.commandDifference : null,
		failure: record.result === "failure" ? record.commandDifference : null,
	}));

	const chartLimit = Math.max(
		1,
		...validRecords.map((record) => Math.abs(record.commandDifference ?? 0)),
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
