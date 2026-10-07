import * as M from "@mantine/core";
import { Link, useLoaderData } from "react-router";
import { CreateClassForm } from "@/forms";
import { getClassesBySchool, getSchoolById } from "@/services";

export async function clientLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const school = await getSchoolById(params.schoolId);
	const classes = await getClassesBySchool(params.schoolId);

	return {
		school,
		classes,
	};
}

export default function ClassesAdminPage() {
	const { school, classes } = useLoaderData<typeof clientLoader>();

	return (
		<M.Stack w="100%" gap="md">
			<title>CodiGO! | Gerenciar Turmas</title>

			<CreateClassForm school={school} />

			<M.Paper>
				<M.Stack gap="md">
					<M.Title order={2}>Gerenciar Turmas</M.Title>

					{classes.length === 0 ? (
						<M.Center py="xl">
							<M.Text size="lg" ta="center">
								Esta escola ainda não possui turmas.
							</M.Text>
						</M.Center>
					) : (
						<M.Stack gap="sm">
							{classes.map(({ id, name }) => (
								<M.Anchor
									key={id}
									component={Link}
									to={`/escola/${school.id}/admin/turma/${id}`}
									underline="never"
								>
									<M.Paper
										component="article"
										bg="gray.1"
										p="md"
									>
										<M.Title order={2} c="violet">
											{name}
										</M.Title>
									</M.Paper>
								</M.Anchor>
							))}
						</M.Stack>
					)}
				</M.Stack>
			</M.Paper>
		</M.Stack>
	);
}
