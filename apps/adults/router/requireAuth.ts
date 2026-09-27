import { supabase } from "@codi-go/supabase";
import { type MiddlewareFunction, redirect } from "react-router";

export const requireAuth: MiddlewareFunction = async (_, next) => {
	const { data, error } = await supabase.auth.getClaims();

	if (error || !data?.claims) {
		throw redirect("/login");
	}

	return next();
};
