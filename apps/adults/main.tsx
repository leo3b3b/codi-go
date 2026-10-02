// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
// import { HydrateFallback } from "@/components";
// import { AuthLayout, SchoolLayout } from "@/layouts";
// import {
// 	CheckEmailPage,
// 	ClassAdminPage,
// 	ClassesAdminPage,
// 	ClassPage,
// 	MemberAdminPage,
// 	OnboardingPage,
// 	ProfilePage,
// 	SchoolHomePage,
// 	SchoolsPage,
// 	SignInPage,
// 	SignUpPage,
// 	StudentAdminPage,
// 	StudentPage,
// } from "@/pages";
// import {
// 	classAdminLoader,
// 	classesAdminLoader,
// 	classLoader,
// 	memberAdminLoader,
// 	profileLoader,
// 	redirectRoot,
// 	requireAuth,
// 	schoolHomeLoader,
// 	schoolLayoutLoader,
// 	schoolsLoader,
// 	studentAdminLoader,
// 	studentLoader,
// } from "@/router";

// import "@codi-go/ui/css";
// import "virtual:uno.css";

// const router = createBrowserRouter([
// 	{
// 		path: "/",
// 		Component: Outlet,
// 		middleware: [requireAuth],
// 		HydrateFallback: HydrateFallback,
// 		children: [
// 			{
// 				index: true,
// 				Component: Outlet,
// 				middleware: [redirectRoot],
// 			},
// 			{
// 				Component: SchoolLayout,
// 				loader: schoolLayoutLoader,
// 				shouldRevalidate: () => true,
// 				children: [
// 					{
// 						path: "meu-perfil",
// 						Component: ProfilePage,
// 						loader: profileLoader,
// 					},
// 					{
// 						path: "escolas",
// 						Component: SchoolsPage,
// 						loader: schoolsLoader,
// 					},
// 					{
// 						path: "escola/:schoolId",
// 						children: [
// 							{
// 								index: true,
// 								Component: SchoolHomePage,
// 								loader: schoolHomeLoader,
// 							},
// 							{
// 								path: "turma/:classId",
// 								Component: ClassPage,
// 								loader: classLoader,
// 							},
// 							{
// 								path: "aluno/:studentId",
// 								Component: StudentPage,
// 								loader: studentLoader,
// 							},
// 							{
// 								path: "admin",
// 								Component: Outlet,
// 								children: [
// 									{
// 										path: "turmas",
// 										Component: ClassesAdminPage,
// 										loader: classesAdminLoader,
// 									},
// 									{
// 										path: "turma/:classId",
// 										Component: ClassAdminPage,
// 										loader: classAdminLoader,
// 									},
// 									{
// 										path: "aluno/:studentId",
// 										Component: StudentAdminPage,
// 										loader: studentAdminLoader,
// 									},
// 									{
// 										path: "membros",
// 										Component: MemberAdminPage,
// 										loader: memberAdminLoader,
// 									},
// 								],
// 							},
// 						],
// 					},
// 				],
// 			},
// 		],
// 	},
// 	{
// 		Component: AuthLayout,
// 		children: [
// 			{
// 				path: "login",
// 				Component: SignInPage,
// 			},
// 			{
// 				path: "criar-conta",
// 				Component: SignUpPage,
// 			},
// 			{
// 				path: "confirmar-email",
// 				Component: CheckEmailPage,
// 			},
// 			{
// 				path: "onboarding",
// 				Component: OnboardingPage,
// 				middleware: [requireAuth],
// 			},
// 		],
// 	},
// ]);

// createRoot(document.getElementById("root") as HTMLElement).render(
// 	<StrictMode>
// 		<RouterProvider router={router} />
// 	</StrictMode>,
// );
