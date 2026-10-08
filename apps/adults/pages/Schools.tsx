import * as UI from "@codi-go/ui";
import { useLoaderData } from "react-router";
import { SchoolCard } from "@/components/SchoolCard";
import { getSchoolsForCurrentUser } from "@/services";

export async function clientLoader() {
	return await getSchoolsForCurrentUser();
}

export default function SchoolsPage() {
	const schools = useLoaderData<typeof clientLoader>();

	return (
		<UI.Container size="lg">
			{schools.length === 0 ? (
				<UI.Center>
					<UI.Paper p="xl" maw={672}>
						<UI.Stack gap="md">
							<UI.Title order={1} ta="center" size="h2">
								Você não participa de nenhuma escola!
							</UI.Title>

							<UI.Divider />

							<UI.Text size="lg" ta="center">
								Aguarde um convite de um administrador ou entre em contato com a
								equipe para ativar o CodiGO! para a sua escola.
							</UI.Text>
						</UI.Stack>
					</UI.Paper>
				</UI.Center>
			) : (
				<UI.Grid>
					{schools.map((school) => (
						<UI.Grid.Col
							key={school.school_id}
							span={{ base: 12, md: 6, lg: 4 }}
						>
							<SchoolCard
								schoolId={school.school_id}
								legalName={school.legal_name}
								tradeName={school.trade_name}
								userRole={school.role}
							/>
						</UI.Grid.Col>
					))}
				</UI.Grid>
			)}
		</UI.Container>
	);
}
