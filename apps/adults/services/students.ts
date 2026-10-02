import { generateImageCode, supabase } from "@codi-go/supabase";

export { generateImageCode };

export async function getStudentsByClassId(class_id: string) {
	const { data, error } = await supabase
		.from("students")
		.select("id, name, access_code")
		.eq("class_id", class_id)
		.order("name");

	if (error) {
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
		throw error;
	}
}

export async function updateStudent({
	student_id,
	name,
	access_code,
}: {
	student_id: string;
	name: string;
	access_code: string;
}) {
	const { error } = await supabase
		.from("students")
		.update({ name, access_code })
		.eq("id", student_id);

	if (error) {
		throw error;
	}
}

export async function transferStudent({
	student_id,
	class_id,
}: {
	student_id: string;
	class_id: string;
}) {
	const { data: student, error: studentError } = await supabase
		.from("students")
		.select("school_id")
		.eq("id", student_id)
		.single();

	if (studentError) {
		throw studentError;
	}

	const { data: targetClass, error: classError } = await supabase
		.from("classes")
		.select("school_id")
		.eq("id", class_id)
		.single();

	if (classError) {
		throw classError;
	}

	if (student.school_id !== targetClass.school_id) {
		throw new Error("Não é possível transferir o aluno para outra escola.");
	}

	const { error } = await supabase
		.from("students")
		.update({ class_id })
		.eq("id", student_id);

	if (error) {
		throw error;
	}
}

export async function deleteStudent(student_id: string) {
	const { error } = await supabase
		.from("students")
		.delete()
		.eq("id", student_id);

	if (error) {
		throw error;
	}
}
