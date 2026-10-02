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
