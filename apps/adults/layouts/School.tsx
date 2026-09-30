import { Outlet, useLocation } from "react-router";
import { SchoolHeader } from "@/components";

export function SchoolLayout() {
	const location = useLocation();

	return (
		<div className="fixed inset-0 h-dvh w-full overflow-y-auto ui-gradient text-fg">
			<SchoolHeader />

			<main
				key={location.pathname}
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:(px-8 py-8)"
			>
				<Outlet />
			</main>
		</div>
	);
}
