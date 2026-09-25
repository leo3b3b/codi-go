import { useLoaderData } from "react-router";
import { SchoolCard } from "@/components/SchoolCard";
import type { schoolsLoader } from "@/router";

export function SchoolsPage() {
	const schools = useLoaderData<typeof schoolsLoader>();

	return (
		<div className="grid-(~ cols-1) md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
	);
}
