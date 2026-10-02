import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Header, HydrateFallback } from "@/components";
import { AccessCodePage, ClassHome, LevelsPage, MazeGame } from "@/pages";
import {
	classLoader,
	levelsLoader,
	mazeLoader,
	requireSession,
} from "@/router";

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
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6"
			>
				<Outlet />
			</main>
			<div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
				<span id="confettiDiv" className="relative block" />
			</div>
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
						index: true,
						Component: AccessCodePage,
					},
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
						loader: levelsLoader,
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
				style: {
					background: "var(--color-surface)",
					color: "var(--color-fg)",
					padding: "8px",
				},
			}}
		/>
		<RouterProvider router={router} />
	</StrictMode>,
);
