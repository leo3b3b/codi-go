import { supabase } from "@codi-go/supabase";
import { getUser } from "@/services";

const ACCESS_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ACCESS_CODE_LENGTH = 6;

function generateClassAccessCode(): string {
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
		.eq("teacher_id", user.id);

	if (error) {
		error.message = `getClassesForCurrentUser error: ${error.message}`;
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
		error.message = `getClassesBySchool error: ${error.message}`;
		throw error;
	}

	return data;
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
		error.message = `createClass error: ${error.message}`;
		throw error;
	}
}
