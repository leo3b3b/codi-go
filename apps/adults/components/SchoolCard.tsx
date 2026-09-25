import { NavLink } from "react-router";

type SchoolCardProps = {
	schoolId: string;
	legalName: string;
	tradeName: string;
	userRole: "admin" | "teacher";
};

export function SchoolCard({
	schoolId,
	legalName,
	tradeName,
	userRole,
}: SchoolCardProps) {
	return (
		<NavLink to={`/escola/${schoolId}`}>
			<article className="ui-card">
				<header className="w-full flex items-center justify-between mb-4">
					<h2 className="text-(xl heading) font-semibold">{tradeName}</h2>
					<span className="bg-primary-soft text-(xs primary) uppercase font-semibold px-2 py-2 rounded-md">
						{userRole}
					</span>
				</header>
				<div className="w-full h-px bg-border my-4" />
				<p className="text-(sm muted)">{legalName}</p>
			</article>
		</NavLink>
	);
}
