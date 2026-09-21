import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AuthLayout, SchoolLayout } from "@/layouts";
import {
	CheckEmailPage,
	ClassesPage,
	ProfilePage,
	SignInPage,
	SignUpPage,
	StudentsPage,
	TeacherHome,
} from "@/pages";
import { requireAuth } from "@/services";

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
				Component: SchoolLayout,
				children: [
					{
						index: true,
						Component: TeacherHome,
					},
					{
						path: "turma/:classId",
						Component: ClassesPage,
					},
					{
						path: "aluno/:studentId",
						Component: StudentsPage,
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
