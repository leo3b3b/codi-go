import * as UI from "@codi-go/ui";
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
		<UI.Stack w="100%" gap="md">
			<title>CodiGO! | Gerenciar Turmas</title>

			<CreateClassForm school={school} />

			<UI.Paper>
				<UI.Stack gap="md">
					<UI.Title order={2}>Gerenciar Turmas</UI.Title>

					{classes.length === 0 ? (
						<UI.Center py="xl">
							<UI.Text size="lg" ta="center">
								Esta escola ainda não possui turmas.
							</UI.Text>
						</UI.Center>
					) : (
						<UI.Stack gap="sm">
							{classes.map(({ id, name }) => (
								<UI.Anchor
									key={id}
									component={Link}
									to={`/escola/${school.id}/admin/turma/${id}`}
									underline="never"
								>
									<UI.Paper
										component="article"
										bg="gray.1"
										p="md"
									>
										<UI.Title order={2} c="violet">
											{name}
										</UI.Title>
									</UI.Paper>
								</UI.Anchor>
							))}
						</UI.Stack>
					)}
				</UI.Stack>
			</UI.Paper>
		</UI.Stack>
	);
}
