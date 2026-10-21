import type { Route } from "+pages/Schools";
import { UI } from "@codi-go/ui";
import { NavLink } from "react-router";
import { getSchoolsForCurrentUser } from "@/services";

export async function clientLoader() {
	return await getSchoolsForCurrentUser();
}

export default function SchoolsPage({
	loaderData: schools,
}: Route.ComponentProps) {
	return (
		<UI.Container>
			<title>Minhas Escolas | CodiGO!</title>
			{schools.length === 0 ? (
				<UI.Center>
					<UI.Paper p="xl" maw={672}>
						<UI.Stack>
							<UI.Text size="xl" ta="center">
								Você não participa de nenhuma escola!
							</UI.Text>
							<UI.Divider />
							<UI.Text size="lg" ta="center">
								Aguarde um convite de um administrador ou entre em contato com a
								equipe para ativar o CodiGO! para a sua escola.
							</UI.Text>
						</UI.Stack>
					</UI.Paper>
				</UI.Center>
			) : (
				<UI.Stack>
					<UI.Title order={1}>Suas Escolas</UI.Title>
					<UI.Grid>
						{schools.map((school) => (
							<UI.Grid.Col
								key={school.school_id}
								span={{ base: 12, md: 6, lg: 4 }}
							>
								<SchoolCard school={school} />
							</UI.Grid.Col>
						))}
					</UI.Grid>
				</UI.Stack>
			)}
		</UI.Container>
	);
}

type School = Route.ComponentProps["loaderData"][number];

export function SchoolCard({ school }: { school: School }) {
	const { school_id, legal_name, trade_name, role } = school;

	return (
		<NavLink to={`/escola/${school_id}`}>
			<UI.Paper component="article" h="100%" p="md">
				<UI.Stack gap="0" h="100%">
					<UI.Title order={2}>{trade_name}</UI.Title>
					<UI.Text c="dimmed" mt="4px" mb="md">
						{legal_name}
					</UI.Text>

					<UI.Badge variant="light" color="violet" mt="auto">
						{role === "admin" ? "Administrador" : "Professor"}
					</UI.Badge>
				</UI.Stack>
			</UI.Paper>
		</NavLink>
	);
}
