import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
import type { classAdminLoader } from "@/router";
import { type ClassOutput, classSchema } from "@/schemas";
import { createClass } from "@/services";

export function ClassAdminPage() {
	const { school, classes } = useLoaderData<typeof classAdminLoader>();
	const { revalidate } = useRevalidator();

	const {
		register,
		handleSubmit,
		setError,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ClassOutput>({
		resolver: valibotResolver(classSchema),
	});

	async function onSubmit({ name }: ClassOutput) {
		try {
			await createClass({
				name,
				school_id: school.id,
			});

			reset();
			await revalidate();
		} catch {
			setError("root", {
				message: "Não foi possível criar a classe.",
			});
		}
	}

	return (
		<div className="flex-(~ col) gap-4">
			<title>CodiGO! | Gerenciar Turmas</title>

			<section className="ui-card">
				<header>
					<h1 className="text-(2xl heading) font-bold">
						Criar Turma em {school.trade_name || school.legal_name}
					</h1>
					<HorizontalSeparator />
				</header>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className="
						flex-(~ col) sm:flex-row items-center
						gap-x-4 gap-y-2 py-3
					"
				>
					<div className="flex-(~ row) relative items-center font-bold w-full">
						<Icon
							icon="i-lucide-school"
							color="muted"
							size={6}
							className="absolute left-3 pointer-events-none"
						/>

						<input
							type="text"
							{...register("name")}
							placeholder="Digite o nome da turma"
							aria-invalid={Boolean(errors.name)}
							className="ui-field w-full h-14 pl-10"
						/>
					</div>

					<button
						type="submit"
						disabled={isSubmitting || !watch("name")}
						className="ui-button-(~ primary) h-14 mt-4 sm:(mt-0 w-40)"
					>
						{isSubmitting ? "Criando..." : "Criar turma"}
					</button>
				</form>

				{errors.name && (
					<p role="alert" className="text-(sm danger) font-medium">
						{errors.name.message}
					</p>
				)}

				{errors.root && (
					<p role="alert" className="ui-alert-danger">
						{errors.root.message}
					</p>
				)}
			</section>

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
