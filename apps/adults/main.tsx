import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import {
	AuthLayout,
	CheckEmailPage,
	requireAuth,
	SignInPage,
	SignUpPage,
} from "@/features/auth";
import {
	TeacherAverages,
	TeacherClass,
	TeacherConfig,
	TeacherHome,
} from "@/features/teacher";

import "@codi-go/ui/css";
import "virtual:uno.css";

const router = createBrowserRouter([
	{
		path: "/:schoolId",
		middleware: [requireAuth],
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
				path: "configuracoes",
				Component: TeacherConfig,
			},
			{
				path: "medias",
				Component: TeacherAverages,
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
