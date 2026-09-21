import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";

import {
	AuthLayout,
	CheckEmailPage,
	requireAuth,
	SignInPage,
	SignUpPage,
} from "@/features/auth";
import { TeacherAverages, TeacherClass, TeacherHome } from "@/features/teacher";
import { ProfilePage } from "./features/profile";

import "@codi-go/ui/css";
import "virtual:uno.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Outlet />,
		middleware: [requireAuth],
		children: [
			{
				path: "meu-perfil",
				Component: ProfilePage,
			},
			{
				path: "/:schoolId",
				children: [
					{
						index: true,
						element: <Navigate to="dashboard" replace />,
					},
					{
						path: "dashboard",
						Component: TeacherHome,
					},
					{
						path: "turmas",
						Component: TeacherHome,
					},
					{
						path: "turmas/:classId",
						Component: TeacherClass,
					},
					{
						path: "medias",
						Component: TeacherAverages,
					},
				],
			},
		],
	},
	{
		Component: AuthLayout,
		children: [
			{
				path: "login",
				Component: SignInPage,
			},
			{
				path: "criar-conta",
				Component: SignUpPage,
			},
			{
				path: "verificar-email",
				Component: CheckEmailPage,
			},
		],
	},
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
