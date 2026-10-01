import { useLoaderData } from "react-router";
import type { studentAdminLoader } from "@/router";

export function StudentAdminPage() {
	const { student } = useLoaderData<typeof studentAdminLoader>();

	return <section className="ui-card">{student.name}</section>;
}
