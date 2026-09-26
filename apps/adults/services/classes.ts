import { supabase } from "@codi-go/supabase";
import { getUserContext } from "./context";

export async function getClassesForCurrentContext(schoolId: string) {
	const user = await getUserContext();

	const { data, error } = await supabase
		.from("classes")
		.select("id, name")
		.eq("school_id", schoolId)
		.eq("teacher_id", user.id);

	if (error) {
		error.message = `getClassesForCurrentContext error: ${error.message}`;
		throw error;
	}

	return data;
}
