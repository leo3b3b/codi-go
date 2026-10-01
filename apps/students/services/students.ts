import { supabase } from "@codi-go/supabase";

export async function getStudentsByClassId(class_id: string) {
	const { data, error } = await supabase
		.from("students")
		.select("id, name, access_code")
		.eq("class_id", class_id)
		.order("name");

	if (error) {
		error.message = `getStudentsByClassId error: ${error.message}`;
		throw error;
	}

	return data;
}

export async function getStudentById(student_id: string) {
	const { data, error } = await supabase
		.from("students")
		.select("id, name, access_code, class_id, school_id")
		.eq("id", student_id)
		.single();

	if (error) {
		error.message = `getStudentById error: ${error.message}`;
		throw error;
	}

	return data;
}
