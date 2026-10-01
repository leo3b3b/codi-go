import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { HydrateFallback } from "@/components";
import { ClassHome, MazeGame } from "@/pages";
import { classLoader, mazeLoader } from "@/router";

import "@codi-go/ui/css";
import "virtual:uno.css";

function Layout() {
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

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		HydrateFallback: HydrateFallback,
		children: [
			{
				path: ":accessCode",
				Component: Outlet,
				loader: classLoader,
				children: [
					{
						index: true,
						Component: ClassHome,
						loader: classLoader,
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
		<RouterProvider router={router} />
	</StrictMode>,
);
