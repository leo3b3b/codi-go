import { UI } from "@codi-go/ui";
import { Outlet, useLoaderData, useLocation } from "react-router";
import { SchoolHeader } from "@/components";
import { requireAuth } from "@/middlewares";
import { getClassesForCurrentUser, getSchoolsForCurrentUser } from "@/services";

export const clientMiddleware = [requireAuth];

export async function clientLoader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const match = url.pathname.match(/^\/escola\/([^/]+)/);

	if (!match) {
		return {
			schools: [],
			classes: [],
		};
	}

	const schoolId = match[1];

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

export type SchoolLayoutLoaderData = Awaited<ReturnType<typeof clientLoader>>;

export default function SchoolLayout() {
	const data = useLoaderData<typeof clientLoader>();
	const location = useLocation();

	return (
		<UI.Box c="gray.9" className="ui-root">
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
