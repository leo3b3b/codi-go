import { getSchoolsForCurrentUser } from "@/services";

export async function schoolsLoader() {
	return getSchoolsForCurrentUser();
}
