import type { MiddlewareFunction } from "react-router";
import { getSchoolsForCurrentUser } from "@/services";

export const requireAdmin: MiddlewareFunction = async ({ params }, next) => {
	const { schoolId } = params;

	if (!schoolId) throw new Response("Escola não encontrada", { status: 404 });

	const schools = await getSchoolsForCurrentUser();
	const school = schools.find(({ school_id }) => school_id === schoolId);

	if (school?.role !== "admin")
		throw new Response("Acesso não autorizado", { status: 403 });

	await next();
};
