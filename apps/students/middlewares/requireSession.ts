import { type MiddlewareFunction, redirect } from "react-router";
import { getClassByAccessCode, getStudentSession } from "@/services";

export const requireSession: MiddlewareFunction = async ({ params }) => {
	const session = getStudentSession();

	if (!session || !params.accessCode) {
		throw redirect(`/${params.accessCode ?? ""}`);
	}

	const classData = await getClassByAccessCode(params.accessCode);

	if (!classData || classData.id !== session.class_id) {
		throw redirect(`/${params.accessCode}`);
	}
};
