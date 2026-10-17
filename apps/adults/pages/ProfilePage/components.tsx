import { Icon, UI } from "@codi-go/ui";
import { useRevalidator } from "react-router";
import {
	acceptInvite,
	deleteMembership,
	type getSchoolsForCurrentUser,
} from "@/services";

type School = Awaited<ReturnType<typeof getSchoolsForCurrentUser>>[number];

export function InviteCard({
	school,
	profile_id,
	status,
}: {
	school: School;
	profile_id: string;
	status: "active" | "pending";
}) {
	const { school_id, trade_name, legal_name, role } = school;
	const { revalidate } = useRevalidator();

	return (
		<UI.Paper
			component="article"
			p={{ base: "sm", md: "md" }}
			bg="var(--app-surface)"
		>
			<UI.Group justify="space-between" align="center" mb="xs">
				<UI.Title order={3} size="h4">
					{trade_name}
				</UI.Title>

				<UI.Badge variant="light" color="violet">
					{role === "admin" ? "Administrador" : "Professor"}
				</UI.Badge>
			</UI.Group>

			<UI.Text size="sm" c="dimmed" mb="md">
				{legal_name}
			</UI.Text>

			{status === "active" ? (
				<UI.Button
					type="button"
					color="red"
					onClick={() => {
						deleteMembership({ profile_id, school_id });
						revalidate();
					}}
					leftSection={<Icon.LogOut size={18} />}
				>
					Sair da escola
				</UI.Button>
			) : (
				<UI.Group>
					<UI.Button
						type="button"
						onClick={() => {
							acceptInvite({ profile_id, school_id });
							revalidate();
						}}
						leftSection={<Icon.Check size={18} />}
					>
						Aceitar
					</UI.Button>

					<UI.Button
						type="button"
						color="red"
						onClick={() => {
							deleteMembership({ profile_id, school_id });
							revalidate();
						}}
						leftSection={<Icon.X size={18} />}
					>
						Recusar
					</UI.Button>
				</UI.Group>
			)}
		</UI.Paper>
	);
}
