import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { parseMazeProgress } from "@/games/maze/progress";
import { getStudentById, getStudentProgress } from "@/services";

export async function clientLoader({
	params,
}: {
	params: {
		schoolId?: string;
		studentId?: string;
	};
}) {
	if (!params.schoolId || !params.studentId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	const [student, progress] = await Promise.all([
		getStudentById(params.studentId),
		getStudentProgress(params.studentId),
	]);

	if (student.school_id !== params.schoolId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	return {
		student,
		progress,
		mazeProgress: progress
			.map(parseMazeProgress)
			.filter((record) => record !== null),
	};
}

export default function StudentPage() {
	const { student, progress, mazeProgress } =
		useLoaderData<typeof clientLoader>();

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

	const mazeChartData = mazeProgress.map((record) => ({
		name: record.levelName,
		difference: record.commandDifference,
	}));

	return (
		<M.Stack w="100%" gap="xl">
			<title>CodiGO! | Aluno</title>

			<M.Paper>
				<M.Group justify="space-between" gap="md" wrap="nowrap">
					<div>
						<M.Title order={1}>{student.name}</M.Title>
						<M.Text size="sm" c="dimmed">
							Acompanhamento do aluno
						</M.Text>
					</div>

					<M.Button
						type="button"
						variant="default"
						w="auto"
						leftSection={<Icon.ArrowLeft size={18} />}
						onClick={() =>
							navigate(
								`/escola/${student.school_id}/turma/${student.class_id}`,
							)
						}
					>
						Voltar
					</M.Button>
				</M.Group>
			</M.Paper>

			<M.SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
				<MetricCard label="Taxa de sucesso" value={`${successRate}%`} />

				<MetricCard
					label="Níveis concluídos"
					value={String(completedLevels)}
				/>

				<MetricCard
					label="Registros"
					value={String(progress.length)}
				/>

				<MetricCard
					label="Última atividade"
					value={
						lastActivity
							? new Date(lastActivity).toLocaleDateString("pt-BR")
							: "—"
					}
				/>
			</M.SimpleGrid>

			<M.Paper>
				<M.Stack gap="md">
					<div>
						<M.Title order={2}>Jogo do Labirinto</M.Title>

						<M.Divider />

						<M.Text size="sm" c="dimmed" mt="md">
							Diferença entre os comandos utilizados e a meta do nível{" "}
							<b>(quanto menor, melhor)</b>.
						</M.Text>
					</div>

					{mazeChartData.length > 0 ? (
						<M.Box h={320}>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={mazeChartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip
										formatter={(value) => [
											`${value} comandos`,
											"Diferença",
										]}
									/>
									<Bar dataKey="difference" />
								</BarChart>
							</ResponsiveContainer>
						</M.Box>
					) : (
						<M.Text size="sm" c="dimmed">
							Ainda não há dados suficientes para o labirinto.
						</M.Text>
					)}
				</M.Stack>
			</M.Paper>

			<M.Paper>
				<M.Stack gap="md">
					<M.Title order={2}>Registros</M.Title>

					<M.Grid
						visibleFrom="md"
						px="md"
						py="sm"
						style={{
							borderBottom:
								"1px solid var(--mantine-color-gray-3)",
						}}
					>
						<M.Grid.Col span={3}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Nível
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={3}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Jogo
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={3}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Resultado
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={3}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Data
							</M.Text>
						</M.Grid.Col>
					</M.Grid>

					<M.Stack gap={0}>
						{[...progress].reverse().map((record) => (
							<M.Grid
								key={record.id}
								align="center"
								px="md"
								py="sm"
								style={{
									borderBottom:
										"1px solid var(--mantine-color-gray-3)",
								}}
							>
								<M.Grid.Col span={{ base: 12, md: 3 }}>
									<M.Text fw={600}>
										{record.level.name}
									</M.Text>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 12, md: 3 }}>
									<M.Text c="dimmed">
										{record.level.game.name}
									</M.Text>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 6, md: 3 }}>
									<M.Text>
										{record.result === "success"
											? "Sucesso"
											: "Falha"}
									</M.Text>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 6, md: 3 }}>
									<M.Text c="dimmed">
										{new Date(
											record.register_time,
										).toLocaleString("pt-BR")}
									</M.Text>
								</M.Grid.Col>
							</M.Grid>
						))}
					</M.Stack>
				</M.Stack>
			</M.Paper>
		</M.Stack>
	);
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<M.Paper component="article">
			<M.Text size="sm" c="dimmed">
				{label}
			</M.Text>

			<M.Text size="xl" fw={700} mt="xs">
				{value}
			</M.Text>
		</M.Paper>
	);
}
