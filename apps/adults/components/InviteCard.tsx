import * as M from "@mantine/core";
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
		<M.Paper component="article" p={{ base: "sm", md: "md" }} bg="gray.1">
			<M.Group justify="space-between" align="center" mb="xs">
				<M.Title order={3} size="h4">
					{trade_name}
				</M.Title>

				<M.Badge variant="light" color="violet">
					{user_role === "admin" ? "Administrador" : "Professor"}
				</M.Badge>
			</M.Group>

			<M.Text size="sm" c="dimmed" mb="md">
				{legal_name}
			</M.Text>

			{invite_status === "active" ? (
				<M.Button
					type="button"
					color="red"
					onClick={() => {
						deleteMembership({ profile_id, school_id });
						revalidate();
					}}
					leftSection={<Icon.LogOut size={18} />}
				>
					Sair da escola
				</M.Button>
			) : (
				<M.Group>
					<M.Button
						type="button"
						onClick={() => {
							acceptInvite({ profile_id, school_id });
							revalidate();
						}}
						leftSection={<Icon.Check size={18} />}
					>
						Aceitar
					</M.Button>

					<M.Button
						type="button"
						color="red"
						onClick={() => {
							deleteMembership({ profile_id, school_id });
							revalidate();
						}}
						leftSection={<Icon.X size={18} />}
					>
						Recusar
					</M.Button>
				</M.Group>
			)}
		</M.Paper>
	);
}
