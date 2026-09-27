import { useLoaderData } from "react-router";
import { HorizontalSeparator } from "@/components";
import { SchoolCard } from "@/components/SchoolCard";
import type { schoolsLoader } from "@/router";

export function SchoolsPage() {
	const schools = useLoaderData<typeof schoolsLoader>();

	return (
		<>
			{schools.length === 0 ? (
				<div className="ui-card max-w-xl mx-auto">
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
							key={school.schoolId}
							schoolId={school.schoolId}
							legalName={school.legalName}
							tradeName={school.tradeName}
							userRole={school.role}
						/>
					))}
				</div>
			)}
		</>
	);
}
