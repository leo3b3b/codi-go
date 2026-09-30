import {
	getInvitesForCurrentUser,
	getProfileForCurrentUser,
	getSchoolsForCurrentUser,
} from "@/services";

export async function profileLoader() {
	const profile = await getProfileForCurrentUser();
	const schools = await getSchoolsForCurrentUser();
	const invites = await getInvitesForCurrentUser();
	return { profile, schools, invites };
}
