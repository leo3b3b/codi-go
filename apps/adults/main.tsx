import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet } from "react-router";
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
		Component: Outlet,
		middleware: [requireAuth],
		children: [
			{
				path: "meu-perfil",
				Component: ProfilePage,
			},
			{
				path: "escolas",
				Component: Outlet,
			},
			{
				path: "escola/:schoolId",
				Component: Outlet,
				children: [
					{
						index: true,
						Component: TeacherHome,
					},
					{
						path: "turma/:classId",
						Component: TeacherClass,
					},
					{
						path: "aluno/:studentId",
						Component: TeacherAverages,
					},
					{
						path: "admin",
						Component: Outlet,
						children: [
							{
								path: "turmas",
								Component: Outlet,
							},
							{
								path: "turma/:classId/alunos",
								Component: Outlet,
							},
							{
								path: "membros",
								Component: Outlet,
							},
						],
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
