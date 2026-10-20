import type { Route } from "+pages/ClassesAdmin";
import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { requireAdmin } from "@/middlewares";
import { createClass, getClassesBySchool, getSchoolById } from "@/services";

export const clientMiddleware = [requireAdmin];

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
		<UI.Container>
			<UI.Stack>
				<UI.Title order={1}>Gerenciar turmas em {school.trade_name}</UI.Title>

				<CreateClassForm school_id={school.id} />

				<UI.Paper>
					<UI.Stack>
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
		</UI.Container>
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
					<UI.Flex
						direction={{ base: "column", sm: "row" }}
						align="stretch"
						gap="sm"
					>
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
							w={{ base: "100%", sm: 160 }}
							loading={isSubmitting}
							disabled={!classForm.getValues().name}
						>
							{isSubmitting ? "Criando..." : "Criar Turma"}
						</UI.Button>
					</UI.Flex>

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
	const [hoveredId, setHoveredId] = useState<string | null>(null);

	return (
		<UI.Stack gap="sm">
			{classes.map(({ id, name }) => {
				const isHovered = hoveredId === id;

				return (
					<UI.Anchor
						key={id}
						href={`/escola/${school.id}/admin/turma/${id}`}
						underline="never"
						onMouseEnter={() => setHoveredId(id)}
						onMouseLeave={() => setHoveredId(null)}
						onFocus={() => setHoveredId(id)}
						onBlur={() => setHoveredId(null)}
					>
						<UI.Paper
							component="article"
							bg="var(--app-surface)"
							p="md"
							withBorder
							style={{
								borderColor: isHovered
									? "var(--mantine-color-violet-5)"
									: "transparent",
							}}
						>
							<UI.Title order={2} c="violet">
								{name}
							</UI.Title>
						</UI.Paper>
					</UI.Anchor>
				);
			})}
		</UI.Stack>
	);
}
