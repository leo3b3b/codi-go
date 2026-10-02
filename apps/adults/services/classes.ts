import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

const ACCESS_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ACCESS_CODE_LENGTH = 6;

export function generateClassAccessCode(): string {
	const randomValues = new Uint32Array(ACCESS_CODE_LENGTH);
	crypto.getRandomValues(randomValues);

	return Array.from(
		randomValues,
		(value) => ACCESS_CODE_ALPHABET[value % ACCESS_CODE_ALPHABET.length],
	).join("");
}

export async function getClassesForCurrentUser(school_id: string) {
	const user = await getUser();

	const { data, error } = await supabase
		.from("classes")
		.select("id, name")
		.eq("school_id", school_id)
		.eq("teacher_id", user.id)
		.order("name");

	if (error) {
		throw error;
	}

	return data;
}

export async function getClassesBySchool(school_id: string) {
	const { data, error } = await supabase
		.from("classes")
		.select("id, name, access_code, is_playing, teacher_id")
		.eq("school_id", school_id)
		.order("name");

	if (error) {
		throw error;
	}

	return data;
}

export async function getClassById(classId: string) {
	const { data, error } = await supabase
		.from("classes")
		.select(`
			id,
			name,
			access_code,
			is_playing,
			school_id,
			teacher_id,
			teacher:profiles!classes_teacher_id_fkey(username)
		`)
		.eq("id", classId)
		.single();

	if (error) {
		throw error;
	}

	const { teacher, ...classData } = data;
	return { ...classData, teacher_username: teacher?.username ?? null };
}

export async function setClassPlaying({
	class_id,
	is_playing,
}: {
	class_id: string;
	is_playing: boolean;
}) {
	const { error } = await supabase
		.from("classes")
		.update({ is_playing })
		.eq("id", class_id);

	if (error) {
		throw error;
	}
}

export async function updateClass({
	class_id,
	name,
	teacher_id,
	access_code,
}: {
	class_id: string;
	name: string | null;
	teacher_id: string | null;
	access_code: string | null;
}) {
	const dataToUpdate: {
		name?: string;
		teacher_id?: string;
		access_code?: string;
	} = {};

	if (name !== null) dataToUpdate.name = name;
	if (teacher_id !== null) dataToUpdate.teacher_id = teacher_id;
	if (access_code !== null) dataToUpdate.access_code = access_code;

	if (Object.keys(dataToUpdate).length === 0) {
		return;
	}

	const { data: currentClass, error: currentClassError } = await supabase
		.from("classes")
		.select("is_playing")
		.eq("id", class_id)
		.single();

	if (currentClassError) {
		throw currentClassError;
	}

	if (currentClass.is_playing) {
		throw new Error(
			"Não é possível editar uma turma enquanto ela está em atividade.",
		);
	}

	const { error } = await supabase
		.from("classes")
		.update(dataToUpdate)
		.eq("id", class_id);

	if (error) {
		throw error;
	}
}

export async function createClass({
	name,
	school_id,
}: {
	name: string;
	school_id: string;
}) {
	const { error } = await supabase.from("classes").insert({
		name,
		school_id,
		access_code: generateClassAccessCode(),
	});

	if (error) {
		throw error;
	}
}

export async function deleteClass(class_id: string) {
	const { error } = await supabase.from("classes").delete().eq("id", class_id);

	if (error) {
		throw error;
	}
}
