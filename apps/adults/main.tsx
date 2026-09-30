import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { AuthLayout, SchoolLayout } from "@/layouts";
import {
	CheckEmailPage,
	ClassAdminPage,
	MemberAdminPage,
	OnboardingPage,
	ProfilePage,
	SchoolHomePage,
	SchoolsPage,
	SignInPage,
	SignUpPage,
	StudentAdminPage,
} from "@/pages";
import {
	profileLoader,
	requireAuth,
	schoolHomeLoader,
	schoolLayoutLoader,
	schoolsLoader,
} from "@/router";

import "@codi-go/ui/css";
import "virtual:uno.css";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Outlet,
		middleware: [requireAuth],
		children: [
			{
				Component: SchoolLayout,
				loader: schoolLayoutLoader,
				shouldRevalidate: () => true,
				children: [
					{
						path: "meu-perfil",
						Component: ProfilePage,
						loader: profileLoader,
					},
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
										Component: ClassAdminPage,
									},
									{
										path: "turma/:classId/alunos",
										Component: StudentAdminPage,
									},
									{
										path: "membros",
										Component: MemberAdminPage,
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
				path: "confirmar-email",
				Component: CheckEmailPage,
			},
			{
				path: "onboarding",
				Component: OnboardingPage,
				middleware: [requireAuth],
			},
		],
	},
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
