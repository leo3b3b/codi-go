import { supabase } from "@codi-go/supabase";

export async function getSchoolById(id: string) {
	const { data, error } = await supabase
		.from("schools")
		.select("id, legal_name, trade_name, cnpj")
		.eq("id", id)
		.single();

	if (error) {
		throw error;
	}

	return data;
}
