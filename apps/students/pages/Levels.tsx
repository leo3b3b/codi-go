import { useLoaderData, useNavigate } from "react-router";
import { Icon } from "@/components";
import type { levelsLoader } from "@/router";

export function LevelsPage() {
	const games = useLoaderData<typeof levelsLoader>();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-8">
			<title>CodiGO! | Fases</title>

			<header className="flex flex-col gap-2">
				<h1 className="text-(3xl heading) font-bold">Fases</h1>
				<p className="text-muted">Escolha um jogo e avance pelas fases.</p>
			</header>

			<div className="flex flex-col gap-8">
				{games.map((game) => (
					<section key={game.key} className="flex flex-col gap-4">
						<header className="flex items-center gap-3">
							<div className="h-8 w-1 rounded-full bg-primary" />

							<div>
								<h2 className="text-(2xl heading) font-bold">{game.name}</h2>

								<p className="text-sm text-muted">
									{game.levels.length}{" "}
									{game.levels.length === 1 ? "fase" : "fases"}
								</p>
							</div>
						</header>

						<div className="grid-(~ cols-1) sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{game.levels.map((level) => (
								<button
									key={level.id}
									type="button"
									className="ui-card group flex items-center gap-4 text-left transition hover:border-primary hover:bg-surface-subtle"
									onClick={() => navigate(`../labirinto/${level.id}`)}
								>
									<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-(xl on-primary) font-bold">
										{level.id}
									</div>

									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wide text-muted">
											Fase {level.id}
										</p>

										<h3 className="truncate text-lg font-bold">{level.name}</h3>
									</div>

									<Icon
										icon="i-lucide-chevron-right"
										size={5}
										color="muted"
										className="ml-auto shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary"
									/>
								</button>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
