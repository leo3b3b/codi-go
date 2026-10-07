import * as M from "@mantine/core";
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
			<M.Paper component="article" h="100%">
				<M.Group justify="space-between" mb="md">
					<M.Title order={2} size="h3">
						{tradeName}
					</M.Title>

					<M.Badge variant="light" color="violet">
						{userRole === "admin" ? "Administrador" : "Professor"}
					</M.Badge>
				</M.Group>

				<M.Divider />

				<M.Text c="dimmed">{legalName}</M.Text>
			</M.Paper>
		</NavLink>
	);
}
