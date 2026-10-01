import { generateImageCode, supabase } from "@codi-go/supabase";

export { generateImageCode };

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

export async function createStudent({
	class_id,
	school_id,
	name,
}: {
	class_id: string;
	school_id: string;
	name: string;
}) {
	const { error } = await supabase.from("students").insert({
		class_id,
		school_id,
		name,
		access_code: generateImageCode(),
	});

	if (error) {
		error.message = `createStudent error: ${error.message}`;
		throw error;
	}
}

export async function deleteStudent(student_id: string) {
	const { error } = await supabase
		.from("students")
		.delete()
		.eq("id", student_id);

	if (error) {
		error.message = `deleteStudent error: ${error.message}`;
		throw error;
	}
}
