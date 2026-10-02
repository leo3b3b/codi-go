import { Outlet, useLoaderData, useLocation } from "react-router";
import { SchoolHeader } from "@/components";
import { getClassesForCurrentUser, getSchoolsForCurrentUser } from "@/services";

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

export function SchoolLayout() {
	const data = useLoaderData<typeof clientLoader>();
	const location = useLocation();

	return (
		<div className="fixed inset-0 h-dvh w-full overflow-y-auto ui-gradient text-fg">
			<SchoolHeader schools={data.schools} classes={data.classes} />

			<main
				key={location.pathname}
				className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:(px-8 py-8)"
			>
				<Outlet />
			</main>
		</div>
	);
}

export default SchoolLayout;
