import * as M from "@mantine/core";
import { useLoaderData } from "react-router";
import { SchoolCard } from "@/components/SchoolCard";
import { getSchoolsForCurrentUser } from "@/services";

export async function clientLoader() {
	return await getSchoolsForCurrentUser();
}

export default function SchoolsPage() {
	const schools = useLoaderData<typeof clientLoader>();

	return (
		<M.Container size="lg">
			{schools.length === 0 ? (
				<M.Center>
					<M.Paper p="xl" maw={672}>
						<M.Stack gap="md">
							<M.Title order={1} ta="center" size="h2">
								Você não participa de nenhuma escola!
							</M.Title>

							<M.Divider />

							<M.Text size="lg" ta="center">
								Aguarde um convite de um administrador ou entre em contato com a
								equipe para ativar o CodiGO! para a sua escola.
							</M.Text>
						</M.Stack>
					</M.Paper>
				</M.Center>
			) : (
				<M.Grid>
					{schools.map((school) => (
						<M.Grid.Col
							key={school.school_id}
							span={{ base: 12, md: 6, lg: 4 }}
						>
							<SchoolCard
								schoolId={school.school_id}
								legalName={school.legal_name}
								tradeName={school.trade_name}
								userRole={school.role}
							/>
						</M.Grid.Col>
					))}
				</M.Grid>
			)}
		</M.Container>
	);
}
