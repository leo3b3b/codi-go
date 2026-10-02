import { useLoaderData } from "react-router";
import { HorizontalSeparator } from "@/components";
import { SchoolCard } from "@/components/SchoolCard";
import { getSchoolsForCurrentUser } from "@/services";

export async function clientLoader() {
	return await getSchoolsForCurrentUser();
}

export default function SchoolsPage() {
	const schools = useLoaderData<typeof clientLoader>();

	return (
		<>
			{schools.length === 0 ? (
				<div className="ui-card max-w-2xl mx-auto">
					<h1 className="text-(2xl heading center) font-bold">
						Você não participa de nenhuma escola!
					</h1>
					<HorizontalSeparator />
					<p className="text-(lg center)">
						Aguarde um convite de um administrador ou entre em contato com a
						equipe para ativar o CodiGO! para a sua escola.
					</p>
				</div>
			) : (
				<div className="grid-(~ cols-1) md:grid-cols-2 lg:grid-cols-3">
					{schools.map((school) => (
						<SchoolCard
							key={school.school_id}
							schoolId={school.school_id}
							legalName={school.legal_name}
							tradeName={school.trade_name}
							userRole={school.role}
						/>
					))}
				</div>
			)}
		</>
	);
}
