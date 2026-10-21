import { Icon, UI } from "@codi-go/ui";
import type { adminGetMembershipsBySchool } from "@/services";
import type { useMembershipActions } from "./utils";

type Member = Awaited<ReturnType<typeof adminGetMembershipsBySchool>>[number];
type MembershipActions = ReturnType<typeof useMembershipActions>;

interface MemberCardProps {
	member: Member;
	onUpdateRole: MembershipActions["handleUpdateRole"];
	onDeleteMembership: MembershipActions["handleDeleteMembership"];
}

export function MemberCard({
	member,
	onUpdateRole,
	onDeleteMembership,
}: MemberCardProps) {
	const isActive = member.status === "active";
	const isAdmin = member.role === "admin";

	const roleBadge = {
		variant: "light",
		color: isAdmin ? "violet" : "blue",
	};

	const statusBadge = {
		variant: "light",
		color: isActive ? "green" : "red",
		leftSection: isActive ? (
			<Icon.CircleCheck size={14} />
		) : (
			<Icon.Clock3 size={14} />
		),
	};

	const roleButton = {
		variant: "default",
		w: { base: "100%", sm: "50%" },
		leftSection: isAdmin ? (
			<Icon.ArrowDown size={18} />
		) : (
			<Icon.ArrowUp size={18} />
		),
		onClick: () =>
			onUpdateRole({
				profile_id: member.profile_id,
				username: member.username,
				current_role: member.role,
			}),
	};

	const statusButton = {
		color: "red",
		w: { base: "100%", sm: "50%" },
		leftSection: isActive ? <Icon.UserMinus size={18} /> : <Icon.X size={18} />,
		onClick: () =>
			onDeleteMembership({
				profile_id: member.profile_id,
				username: member.username,
				action: isActive ? "remove" : "cancel",
			}),
	};

	return (
		<UI.Paper>
			<UI.Flex gap="sm" direction={{ base: "column", md: "row" }}>
				<UI.Box w={{ base: "100%", md: "30%" }}>
					<UI.Text fw={800} size="lg">
						{member.name}
					</UI.Text>
					<UI.Text c="dimmed" mt={4}>
						@{member.username}
					</UI.Text>
				</UI.Box>
				<UI.Flex
					gap="sm"
					direction="row"
					w={{ base: "100%", md: "30%" }}
					align="center"
					justify="flex-start"
				>
					<UI.Badge {...roleBadge}>
						{isAdmin ? "Administrador" : "Professor"}
					</UI.Badge>
					<UI.Badge {...statusBadge}>
						{isActive ? "Ativo" : "Pendente"}
					</UI.Badge>
				</UI.Flex>
				<UI.Flex
					gap="sm"
					direction={{ base: "column", sm: "row" }}
					w={{ base: "100%", md: "40%" }}
					align="center"
					justify="flex-end"
				>
					{isActive && (
						<UI.Button type="button" {...roleButton}>
							{isAdmin ? "Rebaixar" : "Promover"}
						</UI.Button>
					)}

					<UI.Button type="button" {...statusButton}>
						{isActive ? "Remover" : "Cancelar"}
					</UI.Button>
				</UI.Flex>
			</UI.Flex>
		</UI.Paper>
	);
}
