import type { Route } from "+pages/MemberAdmin";
import { Icon, UI } from "@codi-go/ui";
import { requireAdmin } from "@/middlewares";
import {
	adminGetMembershipsBySchool,
	getSchoolById,
	getUser,
} from "@/services";
import * as Self from "./MemberAdminPage";

export const clientMiddleware = [requireAdmin];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!params.schoolId)
		throw new Response("Escola não encontrada", { status: 404 });

	const [user, school, memberships] = await Promise.all([
		getUser(),
		getSchoolById(params.schoolId),
		adminGetMembershipsBySchool(params.schoolId),
	]);

	return { user, school, memberships };
}

export function meta({ loaderData: { school } }: Route.MetaArgs) {
	return [{ title: `Gerenciar membros em ${school.trade_name} | CodiGO!` }];
}

export default function MemberAdminPage({
	loaderData: { user, school, memberships },
}: Route.ComponentProps) {
	const { handleDeleteMembership, handleUpdateRole } =
		Self.useMembershipActions({
			userId: user.id,
			school,
		});

	return (
		<UI.Container>
			<UI.Stack>
				<UI.Title order={1}>Gerenciar membros em {school.trade_name}</UI.Title>
				<Self.InviteUserForm school={school} />

				<UI.Paper>
					<UI.Stack>
						<UI.Title order={2}>Gerenciar Membros</UI.Title>

						<UI.Grid
							visibleFrom="lg"
							w="100%"
							px="md"
							py="sm"
							style={{
								borderBottom: "1px solid var(--app-border)",
							}}
						>
							<UI.Grid.Col span={2}>
								<UI.Text size="sm" c="dimmed" fw={700}>
									Nome
								</UI.Text>
							</UI.Grid.Col>

							<UI.Grid.Col span={2}>
								<UI.Text size="sm" c="dimmed" fw={700}>
									Nome de Usuário
								</UI.Text>
							</UI.Grid.Col>

							<UI.Grid.Col span={2}>
								<UI.Text size="sm" c="dimmed" fw={700}>
									Cargo
								</UI.Text>
							</UI.Grid.Col>

							<UI.Grid.Col span={2}>
								<UI.Text size="sm" c="dimmed" fw={700}>
									Vínculo
								</UI.Text>
							</UI.Grid.Col>

							<UI.Grid.Col span={4}>
								<UI.Text size="sm" c="dimmed" fw={700}>
									Ações
								</UI.Text>
							</UI.Grid.Col>
						</UI.Grid>

						<UI.Stack>
							{memberships.map((membership) => (
								<UI.Grid
									key={`${membership.school_id}-${membership.profile_id}`}
									w="100%"
									align="center"
									px="md"
									py="sm"
									style={{
										borderBottom: "1px solid var(--app-border)",
									}}
								>
									<UI.Grid.Col span={{ base: 6, md: 3, lg: 2 }}>
										<UI.Text fw={600}>{membership.name ?? "—"}</UI.Text>
									</UI.Grid.Col>

									<UI.Grid.Col span={{ base: 6, md: 3, lg: 2 }}>
										<UI.Text c="dimmed">
											{membership.username ? `@${membership.username}` : "—"}
										</UI.Text>
									</UI.Grid.Col>

									<UI.Grid.Col span={{ base: 6, md: 2, lg: 2 }}>
										<UI.Text>
											{membership.role === "admin"
												? "Administrador"
												: "Professor"}
										</UI.Text>
									</UI.Grid.Col>

									<UI.Grid.Col span={{ base: 6, md: 2, lg: 2 }}>
										<UI.Badge
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
										</UI.Badge>
									</UI.Grid.Col>

									<UI.Grid.Col span={{ base: 12, md: 2, lg: 4 }}>
										<UI.Group gap="sm" grow>
											{membership.status === "active" ? (
												<UI.Button
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
														const { profile_id, username, name, role } =
															membership;

														handleUpdateRole({
															profile_id,
															username: username ? `@${username}` : name,
															current_role: role,
														});
													}}
												>
													{membership.role === "admin"
														? "Rebaixar"
														: "Promover"}
												</UI.Button>
											) : (
												<div />
											)}

											<UI.Button
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
													const { profile_id, username, name, status } =
														membership;

													handleDeleteMembership({
														profile_id,
														username: username ? `@${username}` : name,
														action: status === "active" ? "remove" : "cancel",
													});
												}}
											>
												{membership.status === "active"
													? "Remover"
													: "Cancelar"}
											</UI.Button>
										</UI.Group>
									</UI.Grid.Col>
								</UI.Grid>
							))}
						</UI.Stack>
					</UI.Stack>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}
