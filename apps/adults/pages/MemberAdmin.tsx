import type { Route } from "+pages/MemberAdmin";
import { UI } from "@codi-go/ui";
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

				<UI.Paper p="md">
					<UI.Stack gap="md">
						<UI.Group
							justify="space-between"
							align="center"
							gap="sm"
							wrap="wrap"
						>
							<UI.Title order={2}>Gerenciar Membros</UI.Title>

							<UI.Text size="sm" c="dimmed">
								{memberships.length}{" "}
								{memberships.length === 1 ? "membro" : "membros"}
							</UI.Text>
						</UI.Group>

						{memberships.length === 0 ? (
							<UI.Center py="xl">
								<UI.Text ta="center" c="dimmed">
									Nenhum membro cadastrado nesta escola.
								</UI.Text>
							</UI.Center>
						) : (
							<UI.Stack gap="sm">
								{memberships.map((member) => (
									<Self.MemberCard
										key={`${member.school_id}-${member.profile_id}`}
										member={member}
										onUpdateRole={handleUpdateRole}
										onDeleteMembership={handleDeleteMembership}
									/>
								))}
							</UI.Stack>
						)}
					</UI.Stack>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}
