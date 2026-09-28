import { getProfileForCurrentUser } from "@/services";

export async function profileLoader() {
	return await getProfileForCurrentUser();
}
