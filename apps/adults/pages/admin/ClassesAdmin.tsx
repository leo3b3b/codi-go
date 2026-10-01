import { Link, useLoaderData } from "react-router";
import { CreateClassForm } from "@/forms";
import type { classesAdminLoader } from "@/router";

export function ClassesAdminPage() {
	const { school, classes } = useLoaderData<typeof classesAdminLoader>();

	return (
		<div className="flex-(~ col) gap-4">
			<title>CodiGO! | Gerenciar Turmas</title>

			<CreateClassForm school={school} />

			<section className="ui-card">
				<header>
					<h1 className="text-(2xl heading) font-bold mb-4">
						Gerenciar Turmas
					</h1>
				</header>

				{classes.length === 0 ? (
					<p className="text-(lg center) py-6">
						Esta escola ainda não possui turmas.
					</p>
				) : (
					<div className="flex-(~ col) gap-2">
						{classes.map(({ id, name }) => (
							<Link key={id} to={`/escola/${school.id}/admin/turma/${id}`}>
								<article
									className="
										bg-surface-subtle
										border-(~ border)
										rounded-lg
										px-8 py-4
										transition-(colors 500)
										hover:(bg-primary-soft/70 border-primary)
										group
									"
								>
									<h2
										className="
											text-(xl primary)
											font-semibold
											group-hover:text-on-primary
											transition-(colors 500)
										"
									>
										{name}
									</h2>
								</article>
							</Link>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
