import type { Route } from "+layouts/School";
import { UI } from "@codi-go/ui";
import { Outlet, useLocation } from "react-router";
import { requireAuth } from "@/middlewares";
import { getClassesForCurrentUser, getSchoolsForCurrentUser } from "@/services";
import { SchoolHeader } from "./SchoolLayout";

export const clientMiddleware = [requireAuth];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const schoolId = new URL(request.url).pathname.match(
		/^\/escola\/([^/]+)/,
	)?.[1];

	if (!schoolId) {
		return {
			schools: [],
			classes: [],
		};
	}

	const [schools, classes] = await Promise.all([
		getSchoolsForCurrentUser(),
		getClassesForCurrentUser(schoolId),
	]);

	return {
		schools,
		classes,
	};
}

export const shouldRevalidate = () => true;

export default function SchoolLayout({
	loaderData: data,
}: Route.ComponentProps) {
	const location = useLocation();

	return (
		<UI.Box className="ui-root">
			<SchoolHeader schools={data.schools} classes={data.classes} />

			<UI.Container
				key={location.pathname}
				component="main"
				size="xl"
				px="md"
				py="lg"
			>
				<Outlet />
			</UI.Container>
		</UI.Box>
	);
}
