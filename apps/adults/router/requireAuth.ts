import { supabase } from "@codi-go/supabase";
import { type MiddlewareFunction, redirect } from "react-router";
import { getProfileForCurrentUser } from "@/services";

export const requireAuth: MiddlewareFunction = async ({ request }, next) => {
	const { data: claimsData, error: claimsError } =
		await supabase.auth.getClaims();

	if (claimsError || !claimsData?.claims) {
		throw redirect("/login");
	}

	const data = await getProfileForCurrentUser();

	if (!data.name || !data.username) {
		const pathname = new URL(request.url).pathname;

		if (pathname !== "/onboarding") {
			throw redirect("/onboarding");
		}
	}

	return next();
};
