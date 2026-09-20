import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

// Pages
import App from "./App.tsx";
import SignInPage from "./pages/auth/SignIn.tsx";
import SignUpPage from "./pages/auth/SignUp.tsx";
import CheckEmailPage from "./pages/auth/CheckEmail.tsx";
import TeacherHome from "./pages/teacher/TeacherHome.tsx";
import TeacherClass from "./pages/teacher/TeacherClass.tsx";
import TeacherConfig from "./pages/teacher/TeacherConfig.tsx";
import TeacherAverages from "./pages/teacher/TeacherAverages.tsx";

// Layouts
import AuthLayout from "./layouts/auth.tsx";

// CSS
import "@codi-go/ui/css";
import "virtual:uno.css";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },

    /*
     * Rotas contextualizadas pela escola.
     *
     * O schoolId representa a escola atual na URL.
     * A presença do schoolId não concede acesso por si só:
     * cada tela deve verificar o vínculo do usuário com a escola.
     */
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
                path: "configuracoes",
                Component: TeacherConfig,
            },
            {
                path: "medias",
                Component: TeacherAverages,
            },
        ],
    },

    /*
     * Rotas de autenticação.
     */
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