import { useLoaderData, useRevalidator } from "react-router";
import { Icon } from "@/components";
import type { memberAdminLoader } from "@/router";
import { deleteMembership } from "@/services/memberships";

type HandleDeleteMembershipProps = {
	profile_id: string;
	school_id: string;
	username: string;
	action: "remover" | "cancelar";
};

export function MemberAdminPage() {
	const { school, memberships } = useLoaderData<typeof memberAdminLoader>();
	const { revalidate } = useRevalidator();

	async function handleDeleteMembership({
		profile_id,
		school_id,
		username,
		action,
	}: HandleDeleteMembershipProps) {
		const confirmed = window.confirm(
			action === "remover"
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
								py-4 items-center
								border-b-(~ border) last:border-b-0
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
								<button type="button" className="ui-button-(~ secondary) w-1/2">
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
											action: status === "active" ? "remover" : "cancelar",
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
