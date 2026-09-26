import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AuthLayout, SchoolLayout } from "@/layouts";
import {
	CheckEmailPage,
	ProfilePage,
	SchoolHomePage,
	SchoolsPage,
	SignInPage,
	SignUpPage,
} from "@/pages";
import { schoolHomeLoader, schoolsLoader } from "@/router";
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
				Component: SchoolLayout,
				children: [
					{
						path: "escolas",
						Component: SchoolsPage,
						loader: schoolsLoader,
					},
					{
						path: "escola/:schoolId",
						children: [
							{
								index: true,
								Component: SchoolHomePage,
								loader: schoolHomeLoader,
							},
							{
								path: "turma/:classId",
								Component: Outlet,
							},
							{
								path: "aluno/:studentId",
								Component: Outlet,
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
