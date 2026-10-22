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

	async function handleAccept() {
		await acceptInvite({ profile_id, school_id });
		await revalidate();
	}

	async function handleDelete() {
		await deleteMembership({ profile_id, school_id });
		await revalidate();
	}

	return (
		<UI.Paper>
			<UI.Group justify="space-between" align="center">
				<UI.Title order={3}>{trade_name}</UI.Title>

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
					w={{ base: "100%", md: "50%" }}
					color="red"
					onClick={handleDelete}
					leftSection={<Icon.LogOut size={18} />}
				>
					Sair da escola
				</UI.Button>
			) : (
				<UI.Flex direction={{ base: "column", md: "row" }}>
					<UI.Button
						type="button"
						w="100%"
						onClick={handleAccept}
						leftSection={<Icon.Check size={18} />}
					>
						Aceitar
					</UI.Button>

					<UI.Button
						type="button"
						w="100%"
						color="red"
						onClick={handleDelete}
						leftSection={<Icon.X size={18} />}
					>
						Recusar
					</UI.Button>
				</UI.Flex>
			)}
		</UI.Paper>
	);
}
