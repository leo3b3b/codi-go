import type { Route } from "+pages/ClassesAdmin";
import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { Link, useRevalidator } from "react-router";
import { createClass, getClassesBySchool, getSchoolById } from "@/services";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!params.schoolId)
		throw new Response("Escola não encontrada", { status: 404 });

	const school = await getSchoolById(params.schoolId);
	const classes = await getClassesBySchool(params.schoolId);

	return { school, classes };
}

export function meta({ loaderData: { school } }: Route.MetaArgs) {
	return [{ title: `Gerenciar turmas em ${school.trade_name} | CodiGO!` }];
}

export default function ClassesAdminPage({
	loaderData: { school, classes },
}: Route.ComponentProps) {
	return (
		<UI.Stack w="100%" gap="md">
			<UI.Title order={1}>Gerenciar turmas em {school.trade_name}</UI.Title>

			<CreateClassForm school_id={school.id} />

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
						<ClassList school={school} classes={classes} />
					)}
				</UI.Stack>
			</UI.Paper>
		</UI.Stack>
	);
}

export function CreateClassForm({ school_id }: { school_id: string }) {
	const { revalidate } = useRevalidator();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rootError, setRootError] = useState<string | null>(null);

	const classForm = form.useForm({
		mode: "uncontrolled",
		initialValues: {
			name: "",
		},
		validate: {
			name: (value) =>
				value.trim().length === 0 ? "O nome da turma é obrigatório." : null,
		},
	});

	async function onSubmit({ name }: typeof classForm.values) {
		setIsSubmitting(true);
		setRootError(null);

		try {
			await createClass({ name: name.trim(), school_id });

			classForm.reset();
			await revalidate();
		} catch {
			setRootError("Não foi possível criar a turma.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={2}>Criar Turma</UI.Title>

				<form onSubmit={classForm.onSubmit(onSubmit)} noValidate>
					<UI.Group align="flex-start" gap="md" wrap="nowrap">
						<UI.TextInput
							key={classForm.key("name")}
							flex={1}
							size="lg"
							leftSection={<Icon.School size={18} />}
							placeholder="Digite o nome da turma"
							{...classForm.getInputProps("name")}
						/>

						<UI.Button
							type="submit"
							size="lg"
							w={160}
							loading={isSubmitting}
							disabled={!classForm.getValues().name}
						>
							{isSubmitting ? "Criando..." : "Criar Turma"}
						</UI.Button>
					</UI.Group>

					{rootError && <UI.Alert mt="md">{rootError}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}

function ClassList({
	school,
	classes,
}: {
	school: Route.ComponentProps["loaderData"]["school"];
	classes: Route.ComponentProps["loaderData"]["classes"];
}) {
	return (
		<UI.Stack gap="sm">
			{classes.map(({ id, name }) => (
				<UI.Anchor
					key={id}
					component={Link}
					to={`/escola/${school.id}/admin/turma/${id}`}
					underline="never"
				>
					<UI.Paper component="article" bg="var(--app-surface)" p="md">
						<UI.Title order={2} c="violet">
							{name}
						</UI.Title>
					</UI.Paper>
				</UI.Anchor>
			))}
		</UI.Stack>
	);
}
