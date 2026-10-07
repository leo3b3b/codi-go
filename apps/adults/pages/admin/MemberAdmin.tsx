import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { InviteUserForm } from "@/forms";
import {
	adminGetMembershipsBySchool,
	deleteMembership,
	getSchoolById,
	getUser,
	updateMembershipRole,
} from "@/services";

export async function clientLoader({
	params,
}: {
	params: { schoolId?: string };
}) {
	if (!params.schoolId) {
		throw new Response("Escola não encontrada", { status: 404 });
	}

	const user = await getUser();
	const school = await getSchoolById(params.schoolId);
	const memberships = await adminGetMembershipsBySchool(params.schoolId);

	return { user, school, memberships };
}

type HandleUpdateRoleProps = {
	profile_id: string;
	school_id: string;
	username: string | null;
	current_role: "admin" | "teacher";
};

type HandleDeleteMembershipProps = {
	profile_id: string;
	school_id: string;
	username: string | null;
	action: "remove" | "cancel";
};

export default function MemberAdminPage() {
	const { user, school, memberships } = useLoaderData<typeof clientLoader>();
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
				? `Tem certeza de que quer promover ${username ?? "este usuário"} a administrador?`
				: `Tem certeza de que quer rebaixar ${username ?? "este usuário"} a professor?`,
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
				? `Tem certeza de que quer remover ${username ?? "este usuário"} de ${school.trade_name}?`
				: `Tem certeza de que quer cancelar o convite ${username ? `de ${username}` : "deste usuário"} para ${school.trade_name}?`,
		);
		if (!confirmed) return;
		await deleteMembership({ profile_id, school_id });
		revalidate();
	}

	return (
		<M.Stack w="100%" gap="md">
			<title>CodiGO! | Gerenciar Membros</title>

			<InviteUserForm school={school} />

			<M.Paper>
				<M.Stack gap="md">
					<M.Title order={1}>Gerenciar Membros</M.Title>

					<M.Grid
						visibleFrom="lg"
						w="100%"
						px="md"
						py="sm"
						style={{
							borderBottom: "1px solid var(--mantine-color-gray-3)",
						}}
					>
						<M.Grid.Col span={2}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Nome
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={2}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Nome de Usuário
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={2}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Cargo
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={2}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Vínculo
							</M.Text>
						</M.Grid.Col>

						<M.Grid.Col span={4}>
							<M.Text size="sm" c="dimmed" fw={700}>
								Ações
							</M.Text>
						</M.Grid.Col>
					</M.Grid>

					<M.Stack gap="md">
						{memberships.map((membership) => (
							<M.Grid
								key={`${membership.school_id}-${membership.profile_id}`}
								w="100%"
								align="center"
								px="md"
								py="sm"
								style={{
									borderBottom: "1px solid var(--mantine-color-gray-3)",
								}}
							>
								<M.Grid.Col span={{ base: 6, md: 3, lg: 2 }}>
									<M.Text fw={600}>{membership.name ?? "—"}</M.Text>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 6, md: 3, lg: 2 }}>
									<M.Text c="dimmed">
										{membership.username ? `@${membership.username}` : "—"}
									</M.Text>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 6, md: 2, lg: 2 }}>
									<M.Text>
										{membership.role === "admin" ? "Administrador" : "Professor"}
									</M.Text>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 6, md: 2, lg: 2 }}>
									<M.Badge
										variant="light"
										color={membership.status === "active" ? "violet" : "red"}
										leftSection={
											membership.status === "active" ? (
												<Icon.CircleCheck size={14} />
											) : (
												<Icon.Clock3 size={14} />
											)
										}
									>
										{membership.status === "active" ? "Ativo" : "Pendente"}
									</M.Badge>
								</M.Grid.Col>

								<M.Grid.Col span={{ base: 12, md: 2, lg: 4 }}>
									<M.Group gap="sm" grow>
										{membership.status === "active" ? (
											<M.Button
												type="button"
												variant="default"
												leftSection={
													membership.role === "admin" ? (
														<Icon.ArrowDown size={18} />
													) : (
														<Icon.ArrowUp size={18} />
													)
												}
												onClick={() => {
													const {
														profile_id,
														school_id,
														username,
														name,
														role,
													} = membership;

													handleUpdateRole({
														profile_id,
														school_id,
														username: username
															? `@${username}`
															: name,
														current_role: role,
													});
												}}
											>
												{membership.role === "admin"
													? "Rebaixar"
													: "Promover"}
											</M.Button>
										) : (
											<div />
										)}

										<M.Button
											type="button"
											color="red"
											leftSection={
												membership.status === "active" ? (
													<Icon.UserMinus size={18} />
												) : (
													<Icon.X size={18} />
												)
											}
											onClick={() => {
												const {
													profile_id,
													school_id,
													username,
													name,
													status,
												} = membership;

												handleDeleteMembership({
													profile_id,
													school_id,
													username: username
														? `@${username}`
														: name,
													action:
														status === "active"
															? "remove"
															: "cancel",
												});
											}}
										>
											{membership.status === "active"
												? "Remover"
												: "Cancelar"}
										</M.Button>
									</M.Group>
								</M.Grid.Col>
							</M.Grid>
						))}
					</M.Stack>
				</M.Stack>
			</M.Paper>
		</M.Stack>
	);
}
