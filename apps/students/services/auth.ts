import { type ImageCode, supabase } from "@codi-go/supabase";
import { isClassPlaying } from "./classes";

const STUDENT_SESSION_KEY = "student_session";

type StudentSession = {
	student_id: string;
	class_id: string;
	name: string;
};

export async function signInStudent({
	id,
	name,
	access_code,
}: {
	id: string;
	name: string;
	access_code: ImageCode;
}): Promise<StudentSession> {
	const { data, error } = await supabase
		.from("students")
		.select("id, name, class_id")
		.eq("id", id)
		.eq("name", name)
		.eq("access_code", access_code)
		.maybeSingle();

	if (error) {
		error.message = `signInStudent error: ${error.message}`;
		throw error;
	}

	if (!data) {
		throw new Error("Estudante não existe ou informações estão incorretas!");
	}

	const status = await isClassPlaying(data.class_id);

	if (status === false) {
		throw new Error("A turma não está em atividade.");
	}

	const json = {
		student_id: data.id,
		class_id: data.class_id,
		name: data.name,
	};

	sessionStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(json));

	return json;
}

export function getStudentSession(): StudentSession | null {
	const session = sessionStorage.getItem(STUDENT_SESSION_KEY);

	if (!session) {
		return null;
	}

	try {
		return JSON.parse(session) as StudentSession;
	} catch {
		sessionStorage.removeItem(STUDENT_SESSION_KEY);
		return null;
	}
}

export function signOutStudent() {
	sessionStorage.removeItem(STUDENT_SESSION_KEY);
}
