import { Icon, UI } from "@codi-go/ui";
import { NavLink, redirect, useLoaderData } from "react-router";
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

export default function SchoolHomePage() {
	const { school, classes } = useLoaderData<typeof clientLoader>();
	const isAdmin = school.role === "admin";

	return (
		<UI.Stack w="100%">
			<UI.Title order={1}>{school.trade_name}</UI.Title>

			<UI.Divider />

			<UI.SimpleGrid
				cols={{ base: 1, md: isAdmin ? 2 : 1 }}
				spacing="lg"
				maw={isAdmin ? undefined : 672}
				mx={isAdmin ? undefined : "auto"}
				w="100%"
			>
				<UI.Paper>
					<UI.Stack>
						<UI.Title order={2} ta="center">
							Suas Turmas
						</UI.Title>

						<UI.Divider />

						{classes.length === 0 ? (
							<UI.Text size="lg" ta="center">
								Você não tem turmas!
							</UI.Text>
						) : (
							<UI.Stack gap="sm">
								{classes.map(({ id, name }) => (
									<NavLink to={`turma/${id}`} key={id}>
										<UI.Paper bg="gray.1" p="md">
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

				{isAdmin && (
					<UI.Paper>
						<UI.Stack>
							<UI.Title order={2} ta="center">
								Administração
							</UI.Title>

							<UI.Divider />

							<UI.Stack gap="sm">
								{adminActions.map(
									({ title, description, icon: ActionIcon, to }) => (
										<NavLink to={to} key={title}>
											<UI.Paper bg="gray.1">
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
									),
								)}
							</UI.Stack>
						</UI.Stack>
					</UI.Paper>
				)}
			</UI.SimpleGrid>
		</UI.Stack>
	);
}
