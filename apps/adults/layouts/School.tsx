import { Outlet, useLocation, useParams } from "react-router";
import { SchoolHeader } from "@/components";

export function SchoolLayout() {
	const { schoolId } = useParams();
	const location = useLocation();

	return (
		<div className="min-h-screen bg-bg text-fg">
			<SchoolHeader schoolId={schoolId} />

			<main
				key={location.pathname}
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
			>
				<Outlet />
			</main>
		</div>
	);
}
