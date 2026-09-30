import { supabase } from "@codi-go/supabase";

export async function getSchoolById(id: string) {
	const { data, error } = await supabase
		.from("schools")
		.select("legal_name, trade_name, cnpj")
		.eq("id", id)
		.single();

	if (error) {
		error.message = `getSchoolById error: ${error.message}`;
		throw error;
	}

	return data;
}
