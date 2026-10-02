import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	layout("layouts/Auth.tsx", [
		route("login", "pages/auth/SignIn.tsx"),
		route("criar-conta", "pages/auth/SignUp.tsx"),
		route("confirmar-email", "pages/auth/CheckEmail.tsx"),
		route("onboarding", "pages/auth/Onboarding.tsx"),
	]),
	layout("layouts/School.tsx", [
		route("meu-perfil", "pages/Profile.tsx"),
		route("escolas", "pages/Schools.tsx"),
		...prefix("escola/:schoolId", [
			index("pages/SchoolHome.tsx"),
			route("turma/:classId", "pages/Class.tsx"),
			route("aluno/:studentId", "pages/Student.tsx"),
		]),
	]),
] satisfies RouteConfig;
