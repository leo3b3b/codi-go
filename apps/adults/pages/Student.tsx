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
import { HorizontalSeparator, Icon } from "@/components";
import type { studentLoader } from "@/router";

export function StudentPage() {
	const { student, progress, mazeProgress } =
		useLoaderData<typeof studentLoader>();

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
		<div className="flex-(~ col) gap-6">
			<title>CodiGO! | Aluno</title>

			<header className="ui-card flex items-center justify-between gap-4">
				<div>
					<h1 className="text-(2xl heading) font-bold">{student.name}</h1>

					<p className="text-(sm muted)">Acompanhamento do aluno</p>
				</div>

				<button
					type="button"
					className="ui-button-(~ secondary) w-auto"
					onClick={() =>
						navigate(`/escola/${student.school_id}/turma/${student.class_id}`)
					}
				>
					<Icon icon="i-lucide-arrow-left" size={5} color="fg" />
					Voltar
				</button>
			</header>

			<section className="grid-(~ cols-1) sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
			</section>

			<section className="ui-card">
				<header className="mb-6">
					<h2 className="text-(2xl heading) font-bold">Jogo do Labirinto</h2>
					<HorizontalSeparator />

					<p className="text-(sm muted)">
						Diferença entre os comandos utilizados e a meta do nível{" "}
						<b>(quanto menor, melhor)</b>.
					</p>
				</header>

				{mazeChartData.length > 0 ? (
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={mazeChartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip
									formatter={(value) => [`${value} comandos`, "Diferença"]}
								/>
								<Bar dataKey="difference" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				) : (
					<p className="text-(sm muted)">
						Ainda não há dados suficientes para o labirinto.
					</p>
				)}
			</section>

			<section className="ui-card">
				<header className="mb-4">
					<h2 className="text-(2xl heading) font-bold">Registros</h2>
				</header>

				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="border-b-(~ border) text-(sm muted)">
								<th className="px-3 py-3">Nível</th>
								<th className="px-3 py-3">Jogo</th>
								<th className="px-3 py-3">Resultado</th>
								<th className="px-3 py-3">Data</th>
							</tr>
						</thead>

						<tbody>
							{[...progress].reverse().map((record) => (
								<tr key={record.id} className="border-b-(~ border)">
									<td className="px-3 py-3 font-semibold">
										{record.level.name}
									</td>

									<td className="px-3 py-3 text-muted">
										{record.level.game.name}
									</td>

									<td className="px-3 py-3">
										{record.result === "success" ? "Sucesso" : "Falha"}
									</td>

									<td className="px-3 py-3 text-muted">
										{new Date(record.register_time).toLocaleString("pt-BR")}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<article className="ui-card">
			<p className="text-(sm muted)">{label}</p>
			<p className="mt-1 text-(2xl heading) font-bold">{value}</p>
		</article>
	);
}
