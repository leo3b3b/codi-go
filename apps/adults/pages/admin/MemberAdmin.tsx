import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { Icon } from "@/components";
import type { memberAdminLoader } from "@/router";
import { deleteMembership, updateMembershipRole } from "@/services";

type HandleUpdateRoleProps = {
	profile_id: string;
	school_id: string;
	username: string;
	current_role: "admin" | "teacher";
};

type HandleDeleteMembershipProps = {
	profile_id: string;
	school_id: string;
	username: string;
	action: "remove" | "cancel";
};

export function MemberAdminPage() {
	const { user, school, memberships } =
		useLoaderData<typeof memberAdminLoader>();
	const { revalidate } = useRevalidator();
	const navigate = useNavigate();

	async function handleUpdateRole({
		profile_id,
		school_id,
		username,
		current_role,
	}: HandleUpdateRoleProps) {
		const confirmed = window.confirm(
			current_role === "teacher"
				? `Tem certeza de que quer promover ${username} a administrador?`
				: `Tem certeza de que quer remover o cargo de administrador de ${username}?`,
		);
		if (!confirmed) return;

		const role = current_role === "teacher" ? "admin" : "teacher";
		const isSelfDemotion = current_role === "admin" && profile_id === user.id;

		await updateMembershipRole({ profile_id, school_id, role });

		if (isSelfDemotion) {
			navigate("/");
			return;
		}

		revalidate();
	}

	async function handleDeleteMembership({
		profile_id,
		school_id,
		username,
		action,
	}: HandleDeleteMembershipProps) {
		const confirmed = window.confirm(
			action === "remove"
				? `Tem certeza de que quer remover ${username} de ${school.trade_name}?`
				: `Tem certeza de que quer cancelar o convite de ${username} para ${school.trade_name}?`,
		);
		if (!confirmed) return;
		await deleteMembership({ profile_id, school_id });
		revalidate();
	}

	return (
		<div className="ui-card w-full overflow-x-auto">
			<div className="min-w-4xl">
				<div
					className="
						grid grid-cols-[2fr_1.5fr_1.25fr_1.25fr_2.5fr]
						py-3 border-b-(~ border)
						text-(sm muted) font-bold
					"
				>
					<div>Nome</div>
					<div>Nome de Usuário</div>
					<div>Cargo</div>
					<div>Vínculo</div>
					<div>Ações</div>
				</div>

				<div className="flex-(~ col)">
					{memberships.map((membership) => (
						<div
							key={`${membership.school_id}-${membership.profile_id}`}
							className="
								grid grid-cols-[2fr_1.5fr_1.25fr_1.25fr_2.5fr]
								py-4 items-center border-b-(~ border)
							"
						>
							<div className="font-semibold text-heading">
								{membership.name ?? "—"}
							</div>

							<div className="text-muted">
								{membership.username ? `@${membership.username}` : "—"}
							</div>

							<div>
								{membership.role === "admin" ? "Administrador" : "Professor"}
							</div>

							<div>
								<span
									className={`
										inline-flex items-center gap-2 rounded-full
										px-3 py-1 text-sm font-bold
										${
											membership.status === "active"
												? "bg-primary-soft text-on-primary"
												: "bg-danger-soft text-on-danger"
										}
									`}
								>
									<Icon
										icon={
											membership.status === "active"
												? "i-lucide-circle-check"
												: "i-lucide-clock-3"
										}
										color={
											membership.status === "active"
												? "on-primary"
												: "on-danger"
										}
										size={4}
									/>
									{membership.status === "active" ? "Ativo" : "Pendente"}
								</span>
							</div>

							<div className="flex gap-2">
								{membership.status === "active" ? (
									<button
										type="button"
										className="ui-button-(~ secondary) w-1/2"
										onClick={() => {
											const { profile_id, school_id, username, name, role } =
												membership;

											handleUpdateRole({
												profile_id,
												school_id,
												username: username ? `@${username}` : name,
												current_role: role,
											});
										}}
									>
										<Icon
											icon={
												membership.role === "admin"
													? "i-lucide-arrow-down"
													: "i-lucide-arrow-up"
											}
											color="fg"
											size={5}
										/>
										{membership.role === "admin" ? "Rebaixar" : "Promover"}
									</button>
								) : (
									<div className="w-1/2"></div>
								)}

								<button
									type="button"
									className="ui-button-(~ danger) w-1/2"
									onClick={() => {
										const { profile_id, school_id, username, name, status } =
											membership;

										handleDeleteMembership({
											profile_id,
											school_id,
											username: username ? `@${username}` : name,
											action: status === "active" ? "remove" : "cancel",
										});
									}}
								>
									<Icon
										icon={
											membership.status === "active"
												? "i-lucide-user-minus"
												: "i-lucide-x"
										}
										color="on-danger"
										size={5}
									/>
									{membership.status === "active" ? "Remover" : "Cancelar"}
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
