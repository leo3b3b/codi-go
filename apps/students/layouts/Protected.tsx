import { Outlet, useLocation } from "react-router";
import { Header } from "@/components";
import { requireSession } from "@/middlewares";

export const clientMiddleware = [requireSession];

export default function ProtectedLayout() {
	const location = useLocation();

	return (
		<div className="fixed inset-0 h-dvh w-full overflow-y-auto ui-gradient text-fg">
			<Header />

			<main
				key={location.pathname}
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6"
			>
				<Outlet />
			</main>

			<div className="pointer-events-none fixed bottom-0 left-1/2 z-50 -translate-x-1/2">
				<span id="confettiDiv" className="relative block" />
			</div>
		</div>
	);
}
