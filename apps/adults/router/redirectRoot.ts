import { redirect } from "react-router";

export async function redirectRoot() {
	throw redirect("/escolas");
}
