import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { useRevalidator } from "react-router";
import { deleteMembership } from "@/services";
import { acceptInvite } from "@/services/memberships";

type InviteCardProps = {
	profile_id: string;
	school_id: string;
	legal_name: string;
	trade_name: string;
	user_role: "admin" | "teacher";
	invite_status: "active" | "pending";
};

export function InviteCard({
	profile_id,
	school_id,
	legal_name,
	trade_name,
	user_role,
	invite_status,
}: InviteCardProps) {
	const { revalidate } = useRevalidator();

	return (
		<UI.Paper component="article" p={{ base: "sm", md: "md" }} bg="gray.1">
			<UI.Group justify="space-between" align="center" mb="xs">
				<UI.Title order={3} size="h4">
					{trade_name}
				</UI.Title>

				<UI.Badge variant="light" color="violet">
					{user_role === "admin" ? "Administrador" : "Professor"}
				</UI.Badge>
			</UI.Group>

			<UI.Text size="sm" c="dimmed" mb="md">
				{legal_name}
			</UI.Text>

			{invite_status === "active" ? (
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
