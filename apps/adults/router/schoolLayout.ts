import {
	getClassesForCurrentContext,
	getSchoolsForCurrentUser,
} from "@/services";

export async function schoolLayoutLoader({ url }: { url: URL }) {
	const match = url.pathname.match(/^\/escola\/([^/]+)/);

	if (!match) {
		return {
			schools: [],
			classes: [],
		};
	}

	const schoolId = match[1];
	const isClassRoute = /^\/escola\/[^/]+\/turma\/[^/]+(?:\/|$)/.test(
		url.pathname,
	);

	const [schools, classes] = await Promise.all([
		getSchoolsForCurrentUser(),
		isClassRoute ? getClassesForCurrentContext(schoolId) : Promise.resolve([]),
	]);

	return {
		schools,
		classes,
	};
}
