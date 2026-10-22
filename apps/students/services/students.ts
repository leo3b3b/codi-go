import { supabase } from "@codi-go/supabase";

export async function getStudentsByClassId(class_id: string) {
	const { data, error } = await supabase
		.from("students")
		.select("id, name")
		.eq("class_id", class_id)
		.order("name");

	if (error) throw error;
	return data;
}

export async function getStudentById(student_id: string) {
	const { data, error } = await supabase
		.from("students")
		.select("id, name, class_id, school_id")
		.eq("id", student_id)
		.single();

	if (error) throw error;
	return data;
}
