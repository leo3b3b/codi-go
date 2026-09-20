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
import App from "./App.tsx";

import TeacherHome from "./pages/teacher/TeacherHome.tsx";
import TeacherClass from "./pages/teacher/TeacherClass.tsx";
import TeacherConfig from "./pages/teacher/TeacherConfig.tsx";
import TeacherAverages from "./pages/teacher/TeacherAverages.tsx";

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

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
