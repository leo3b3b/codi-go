import { supabase } from "@codi-go/supabase";

export async function getClassByAccessCode(access_code: string) {
	const { data, error } = await supabase
		.from("classes")
		.select()
		.eq("access_code", access_code)
		.single();

	if (error) {
		error.message = `getClassByAccessCode error: ${error.message}`;
		throw error;
	}

	return data;
}

export async function isClassPlaying(class_id: string) {
	const { data, error } = await supabase
		.from("classes")
		.select("id, is_playing")
		.eq("id", class_id)
		.eq("is_playing", true)
		.maybeSingle();

	if (error) throw error;

	if (!data) {
		throw new Response("A turma não está em atividade.", { status: 403 });
	}

	return data.is_playing;
}
