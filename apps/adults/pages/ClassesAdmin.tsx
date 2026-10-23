import type { Route } from "+pages/ClassesAdmin";
import { UI } from "@codi-go/ui";
import { useState } from "react";
import { requireAdmin } from "@/middlewares";
import { getClassesBySchool, getSchoolById } from "@/services";
import * as Self from "./ClassesAdminPage";

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

				<Self.CreateClassForm school_id={school.id} />
				<Self.ImportClassesStudentsCsv school_id={school.id} />

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
						style={{ outline: "none" }}
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
