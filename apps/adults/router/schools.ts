import { getSchoolsForCurrentUser } from "@/services";

export async function schoolsLoader() {
	return await getSchoolsForCurrentUser();
}
