import * as UI from "@codi-go/ui";
import { NavLink } from "react-router";

type SchoolCardProps = {
	schoolId: string;
	legalName: string;
	tradeName: string;
	userRole: "admin" | "teacher";
};

export function SchoolCard({
	schoolId,
	legalName,
	tradeName,
	userRole,
}: SchoolCardProps) {
	return (
		<NavLink to={`/escola/${schoolId}`}>
			<UI.Paper component="article" h="100%">
				<UI.Group justify="space-between" mb="md">
					<UI.Title order={2} size="h3">
						{tradeName}
					</UI.Title>

					<UI.Badge variant="light" color="violet">
						{userRole === "admin" ? "Administrador" : "Professor"}
					</UI.Badge>
				</UI.Group>

				<UI.Divider />

				<UI.Text c="dimmed">{legalName}</UI.Text>
			</UI.Paper>
		</NavLink>
	);
}
