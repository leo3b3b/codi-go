import type { RouteConfig } from "@react-router/dev/routes";
import { layout, route } from "@react-router/dev/routes";

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
		route("escola/:schoolId", "pages/SchoolHome.tsx"),
	]),
] satisfies RouteConfig;
