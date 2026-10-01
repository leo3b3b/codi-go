import { supabase } from "@codi-go/supabase";

export async function getStudentsByClassId(class_id: string) {
	const { data, error } = await supabase
		.from("students")
		.select("id, name, access_code")
		.eq("class_id", class_id);

	if (error) {
		error.message = `getStudentsByClassId error: ${error.message}`;
		throw error;
	}

	return data;
}
