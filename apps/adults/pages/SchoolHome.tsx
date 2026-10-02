import { NavLink, redirect, useLoaderData } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
import { getClassesForCurrentUser, getSchoolsForCurrentUser } from "@/services";

export async function clientLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const schoolId = params.schoolId;

	const schools = await getSchoolsForCurrentUser();
	const school = schools.find((school) => school.school_id === schoolId);

	if (!school) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const classes = await getClassesForCurrentUser(schoolId);

	if (school.role !== "admin" && classes.length === 1) {
		throw redirect(`/escola/${schoolId}/turma/${classes[0].id}`);
	}

	return {
		school,
		classes,
	};
}

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

export default function SchoolHomePage() {
	const { school, classes } = useLoaderData<typeof clientLoader>();
	const isAdmin = school.role === "admin";

	return (
		<div className="w-full h-full">
			<h1 className="text-(xl heading) font-bold">{school.trade_name}</h1>
			<HorizontalSeparator />
			<div
				className={`flex-(~ col) justify-center gap-4 ${isAdmin ? "md:(grid grid-cols-2 gap-8)" : "max-w-2xl mx-auto"}`}
			>
				<section className="ui-card w-full h-full flex flex-col">
					<h2 className="text-(2xl heading center) font-bold">Suas Turmas</h2>
					<HorizontalSeparator />
					{classes.length === 0 ? (
						<p className="text-(lg center)">Você não tem turmas!</p>
					) : (
						<div className="flex-(~ col) gap-2">
							{classes.map(({ id, name }) => (
								<NavLink to={`turma/${id}`} key={id}>
									<article
										className="
											bg-surface-subtle border-(~ border) rounded-lg px-8 py-4
											transition-(colors 500) hover:(bg-primary-soft/70 border-primary) group
										"
									>
										<h3 className="text-(xl primary) font-semibold group-hover:text-on-primary transition-(colors 500)">
											{name}
										</h3>
									</article>
								</NavLink>
							))}
						</div>
					)}
				</section>

				{isAdmin && (
					<section className="ui-card w-full h-full flex flex-col">
						<h2 className="text-(2xl heading center) font-bold">
							Administração
						</h2>
						<HorizontalSeparator />
						<div className="flex-(~ col) gap-2">
							{adminActions.map(({ title, description, icon, to }) => (
								<NavLink to={to} key={title}>
									<article
										className="
											bg-surface-subtle border-(~ border) rounded-lg flex-(~ row) items-center gap-4 px-4 py-4
											transition-(colors 500) hover:(bg-primary-soft/70 border-primary) group"
									>
										<Icon
											icon={icon}
											color="primary"
											size={10}
											className="group-hover:text-on-primary transition-(colors 500)"
										/>
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
				)}
			</div>
		</div>
	);
}
