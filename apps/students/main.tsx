import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Header, HydrateFallback } from "@/components";
import { ClassHome, LevelsPage, MazeGame } from "@/pages";
import { classLoader, mazeLoader, requireSession } from "@/router";

import "@codi-go/ui/css";
import "virtual:uno.css";

function AppLayout() {
	return (
		<div className="fixed inset-0 h-dvh w-full overflow-y-auto ui-gradient text-fg">
			<main
				key={location.pathname}
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:(px-8 py-8)"
			>
				<Outlet />
			</main>
		</div>
	);
}

function ProtectedLayout() {
	return (
		<div className="fixed inset-0 h-dvh w-full overflow-y-auto ui-gradient text-fg">
			<Header />
			<main
				key={location.pathname}
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:(px-8 py-8)"
			>
				<Outlet />
			</main>
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		Component: Outlet,
		HydrateFallback: HydrateFallback,
		children: [
			{
				Component: AppLayout,
				children: [
					{
						path: ":accessCode",
						Component: ClassHome,
						loader: classLoader,
					},
				],
			},
			{
				path: ":accessCode",
				Component: ProtectedLayout,
				middleware: [requireSession],
				children: [
					{
						path: "fases",
						Component: LevelsPage,
					},
					{
						path: "labirinto/:levelId",
						Component: MazeGame,
						loader: mazeLoader,
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Toaster
			position="top-center"
			toastOptions={{
				duration: 3000,
			}}
		/>
		<RouterProvider router={router} />
	</StrictMode>,
);
