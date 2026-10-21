import type { Route } from "+pages/SchoolHome";
import { Icon, UI } from "@codi-go/ui";
import { NavLink, redirect } from "react-router";
import { getClassesForCurrentUser, getSchoolById } from "@/services";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const { schoolId } = params;
	if (!schoolId) throw new Response("Escola não encontrada", { status: 404 });

	const school = await getSchoolById(schoolId);
	if (!school) throw new Response("Escola não encontrada", { status: 404 });

	const classes = await getClassesForCurrentUser(schoolId);

	if (school.role !== "admin" && classes.length === 1)
		throw redirect(`/escola/${schoolId}/turma/${classes[0].id}`);

	return { classes, school };
}

export function meta({ loaderData }: Route.MetaArgs) {
	return [{ title: `${loaderData?.school.trade_name || "Escola"} | CodiGO!` }];
}

export default function SchoolHomePage({
	loaderData: { school, classes },
}: Route.ComponentProps) {
	const isAdmin = school.role === "admin";

	return (
		<UI.Container>
			<UI.Stack>
				<UI.Title order={1}>{school.trade_name}</UI.Title>
				<UI.SimpleGrid
					cols={{ base: 1, md: isAdmin ? 2 : 1 }}
					spacing="md"
					maw={isAdmin ? undefined : 672}
					mx={isAdmin ? undefined : "auto"}
					w="100%"
				>
					<ClassesSection classes={classes} />
					{isAdmin && <AdminSection />}
				</UI.SimpleGrid>
			</UI.Stack>
		</UI.Container>
	);
}

type ClassesSectionProps = {
	classes: Route.ComponentProps["loaderData"]["classes"];
};

function ClassesSection({ classes }: ClassesSectionProps) {
	return (
		<UI.Paper>
			<UI.Stack>
				<UI.Title order={2}>Suas Turmas</UI.Title>
				{classes.length !== 0 ? (
					<UI.Text size="lg" ta="center" c="dimmed">
						Você não tem turmas!
					</UI.Text>
				) : (
					<UI.Stack gap="sm">
						{classes.map(({ id, name }) => (
							<NavLink to={`turma/${id}`} key={id}>
								<UI.Paper bg="var(--app-surface)" p="md">
									<UI.Text c="violet" fw={600}>
										{name}
									</UI.Text>
								</UI.Paper>
							</NavLink>
						))}
					</UI.Stack>
				)}
			</UI.Stack>
		</UI.Paper>
	);
}

function AdminSection() {
	return (
		<UI.Paper>
			<UI.Stack>
				<UI.Title order={2}>Administração</UI.Title>
				<UI.Stack gap="sm">
					{adminActions.map(({ title, description, icon: ActionIcon, to }) => (
						<NavLink to={to} key={title}>
							<UI.Paper bg="var(--app-surface)" p="md">
								<UI.Group gap="md" wrap="nowrap">
									<ActionIcon size={28} />

									<div>
										<UI.Text fw={500}>{title}</UI.Text>
										<UI.Text size="sm" c="dimmed">
											{description}
										</UI.Text>
									</div>
								</UI.Group>
							</UI.Paper>
						</NavLink>
					))}
				</UI.Stack>
			</UI.Stack>
		</UI.Paper>
	);
}

const adminActions = [
	{
		title: "Turmas",
		description: "Gerencie as turmas desta escola.",
		icon: Icon.School,
		to: "admin/turmas",
	},
	{
		title: "Membros",
		description: "Gerencie professores e demais membros.",
		icon: Icon.Users,
		to: "admin/membros",
	},
];
