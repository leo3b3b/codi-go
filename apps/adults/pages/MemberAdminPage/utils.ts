import { useNavigate, useRevalidator } from "react-router";
import {
	deleteMembership,
	type getSchoolById,
	updateMembershipRole,
} from "@/services";

type UpdateRoleInput = {
	profile_id: string;
	username: string | null;
	current_role: "admin" | "teacher";
};

type DeleteMembershipInput = {
	profile_id: string;
	username: string | null;
	action: "remove" | "cancel";
};

type UseMembershipActionsOptions = {
	userId: string;
	school: Awaited<ReturnType<typeof getSchoolById>>;
};

export function useMembershipActions({
	userId,
	school,
}: UseMembershipActionsOptions) {
	const navigate = useNavigate();
	const { revalidate } = useRevalidator();

	async function handleUpdateRole({
		profile_id,
		username,
		current_role,
	}: UpdateRoleInput) {
		const message =
			current_role === "teacher"
				? `Tem certeza de que quer promover ${username ?? "este usuário"} a administrador?`
				: `Tem certeza de que quer rebaixar ${username ?? "este usuário"} a professor?`;

		if (!window.confirm(message)) return;

		const role = current_role === "teacher" ? "admin" : "teacher";
		const isSelfDemotion = current_role === "admin" && profile_id === userId;

		await updateMembershipRole({ profile_id, school_id: school.id, role });

		if (isSelfDemotion) {
			navigate("/escolas");
			return;
		}

		revalidate();
	}

	async function handleDeleteMembership({
		profile_id,
		username,
		action,
	}: DeleteMembershipInput) {
		const message =
			action === "remove"
				? `Tem certeza de que quer remover ${username ?? "este usuário"} de ${school.trade_name}?`
				: `Tem certeza de que quer cancelar o convite ${username ? `de ${username}` : "deste usuário"} para ${school.trade_name}?`;

		if (!window.confirm(message)) return;

		await deleteMembership({ profile_id, school_id: school.id });
		revalidate();
	}

	return { handleUpdateRole, handleDeleteMembership };
}
