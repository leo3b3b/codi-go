import { NavLink, useLoaderData } from "react-router";
import type { schoolHomeLoader } from "@/router";

const adminActions = [
	{
		title: "Turmas",
		description: "Gerencie as turmas desta escola.",
		icon: "i-lucide-school",
		to: "admin/turmas",
	},
	{
		title: "Membros",
		description: "Gerencie professores e demais membros.",
		icon: "i-lucide-users",
		to: "admin/membros",
	},
];

export function SchoolHomePage() {
	const classes = useLoaderData<typeof schoolHomeLoader>();

	return (
		<div className="flex-(~ col) gap-4 md:(grid grid-cols-2 gap-8 items-stretch)">
			<section className="ui-card w-full h-full flex flex-col">
				<h2 className="text-(2xl heading center) font-bold">Suas Turmas</h2>
				<div className="w-full h-px bg-border my-4" />
				<div className="flex-(~ col) gap-2">
					{classes.map(({ id, name }) => (
						<NavLink to={`turma/${id}`} key={id}>
							<article
								className="
                                    bg-surface-subtle border-(~ border) rounded-lg px-8 py-4
                                    transition-(colors 500) hover:(bg-primary-soft/70 border-primary) group"
							>
								<h3 className="text-(xl primary) font-semibold group-hover:text-on-primary transition-(colors 500)">
									{name}
								</h3>
							</article>
						</NavLink>
					))}
				</div>
			</section>

			<section className="ui-card w-full h-full flex flex-col">
				<h2 className="text-(2xl heading center) font-bold">Administração</h2>
				<div className="w-full h-px bg-border my-4" />
				<div className="flex-(~ col) gap-2">
					{adminActions.map(({ title, description, icon, to }) => (
						<NavLink to={to} key={title}>
							<article
								className="
                                    bg-surface-subtle border-(~ border) rounded-lg flex-(~ row) items-center gap-4 px-4 py-4
                                    transition-(colors 500) hover:(bg-primary-soft/70 border-primary) group"
							>
								<div
									className={`${icon} text-(2xl primary center) h-10 w-10 group-hover:text-on-primary transition-(colors 500)`}
								/>
								<div className="h-full w-px bg-border" />
								<div>
									<h3 className="text-xl group-hover:text-on-primary transition-(colors 500)">
										{title}
									</h3>
									<p className="text-(sm muted) group-hover:text-on-primary/70 transition-(colors 500)">
										{description}
									</p>
								</div>
							</article>
						</NavLink>
					))}
				</div>
			</section>
		</div>
	);
}
