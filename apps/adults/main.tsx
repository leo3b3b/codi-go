import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App.tsx";

import AuthLayout from "./layouts/auth.tsx";

import CheckEmailPage from "./pages/auth/CheckEmail.tsx";
import SignInPage from "./pages/auth/SignIn.tsx";
import SignUpPage from "./pages/auth/SignUp.tsx";

import TeacherAverages from "./pages/teacher/TeacherAverages.tsx";
import TeacherClass from "./pages/teacher/TeacherClass.tsx";
import TeacherConfig from "./pages/teacher/TeacherConfig.tsx";
import TeacherHome from "./pages/teacher/TeacherHome.tsx";

import "@codi-go/ui/css";
import "virtual:uno.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/app",
    Component: TeacherHome,
  },
  {
    path: "/app/turma/:classId",
    Component: TeacherClass,
  },
  {
    path: "/app/configuracoes",
    Component: TeacherConfig,
  },
  {
    path: "/app/medias",
    Component: TeacherAverages,
  },
  {
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        Component: SignInPage,
      },
      {
        path: "signup",
        Component: SignUpPage,
      },
      {
        path: "check-email",
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