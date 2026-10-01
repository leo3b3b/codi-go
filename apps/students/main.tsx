import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { ClassHome, MazeGame } from "@/pages";
import { classLoader, mazeLoader } from "@/router";

import "@codi-go/ui/css";
import "virtual:uno.css";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Outlet,
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
