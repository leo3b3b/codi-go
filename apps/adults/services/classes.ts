import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

export async function getClassesForCurrentUser(schoolId: string) {
	const user = await getUser();

	const { data, error } = await supabase
		.from("classes")
		.select("id, name")
		.eq("school_id", schoolId)
		.eq("teacher_id", user.id);

	if (error) {
		error.message = `getClassesForCurrentUser error: ${error.message}`;
		throw error;
	}

	return data;
}
