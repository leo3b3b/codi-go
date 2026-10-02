import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
	layout("layouts/App.tsx", [
		index("pages/AccessCode.tsx"),
		route(":accessCode", "pages/ClassHome.tsx"),
	]),

	route(":accessCode", "layouts/Protected.tsx", [
		route("fases", "pages/Levels.tsx"),
		route("labirinto/:levelId", "pages/MazeGame.tsx"),
	]),
] satisfies RouteConfig;
