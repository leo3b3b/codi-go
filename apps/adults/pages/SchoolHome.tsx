import * as M from "@mantine/core";
import * as Icon from "lucide-react";
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
		<M.Stack w="100%">
			<M.Title order={1}>{school.trade_name}</M.Title>

			<M.Divider />

			<M.SimpleGrid
				cols={{ base: 1, md: isAdmin ? 2 : 1 }}
				spacing="lg"
				maw={isAdmin ? undefined : 672}
				mx={isAdmin ? undefined : "auto"}
				w="100%"
			>
				<M.Paper>
					<M.Stack>
						<M.Title order={2} ta="center">
							Suas Turmas
						</M.Title>

						<M.Divider />

						{classes.length === 0 ? (
							<M.Text size="lg" ta="center">
								Você não tem turmas!
							</M.Text>
						) : (
							<M.Stack gap="sm">
								{classes.map(({ id, name }) => (
									<NavLink to={`turma/${id}`} key={id}>
										<M.Paper
											bg="gray.1"
											p="md"
										>
											<M.Text
												c="violet"
												fw={600}
											>
												{name}
											</M.Text>
										</M.Paper>
									</NavLink>
								))}
							</M.Stack>
						)}
					</M.Stack>
				</M.Paper>

				{isAdmin && (
					<M.Paper>
						<M.Stack>
							<M.Title order={2} ta="center">
								Administração
							</M.Title>

							<M.Divider />

							<M.Stack gap="sm">
								{adminActions.map(
									({ title, description, icon: ActionIcon, to }) => (
										<NavLink to={to} key={title}>
											<M.Paper bg="gray.1">
												<M.Group gap="md" wrap="nowrap">
													<ActionIcon size={28} />

													<div>
														<M.Text fw={500}>{title}</M.Text>

														<M.Text size="sm" c="dimmed">
															{description}
														</M.Text>
													</div>
												</M.Group>
											</M.Paper>
										</NavLink>
									),
								)}
							</M.Stack>
						</M.Stack>
					</M.Paper>
				)}
			</M.SimpleGrid>
		</M.Stack>
	);
}