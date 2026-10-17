import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	route("/", "pages/Landing.tsx"),
	layout("layouts/Auth.tsx", [
		route("login", "pages/auth/SignIn.tsx"),
		route("criar-conta", "pages/auth/SignUp.tsx"),
		route("confirmar-email", "pages/auth/CheckEmail.tsx"),
		route("onboarding", "pages/auth/Onboarding.tsx"),
		route("recuperar-senha", "pages/auth/RecoverPassword.tsx"),
		route("redefinir-senha", "pages/auth/ResetPassword.tsx"),
	]),
	layout("layouts/School.tsx", [
		route("meu-perfil", "pages/Profile.tsx"),
		route("escolas", "pages/Schools.tsx"),
		...prefix("escola/:schoolId", [
			index("pages/SchoolHome.tsx"),
			route("turma/:classId", "pages/Class.tsx"),
			route("aluno/:studentId", "pages/Student.tsx"),
			...prefix("admin", [
				route("turma/:classId", "pages/ClassAdmin.tsx"),
				route("turmas", "pages/ClassesAdmin.tsx"),
				route("membros", "pages/MemberAdmin.tsx"),
				route("aluno/:studentId", "pages/StudentAdmin.tsx"),
			]),
		]),
	]),
] satisfies RouteConfig;
