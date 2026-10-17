import type { Route } from "+pages/Profile";
import { Icon, UI } from "@codi-go/ui";
import { useNavigate } from "react-router";
import {
	deleteUserAccount,
	getInvitesForCurrentUser,
	getProfileForCurrentUser,
	getSchoolsForCurrentUser,
	signOut,
} from "@/services";
import * as Self from "./ProfilePage";

export async function clientLoader() {
	const [profile, schools, invites] = await Promise.all([
		getProfileForCurrentUser(),
		getSchoolsForCurrentUser(),
		getInvitesForCurrentUser(),
	]);
	return { profile, schools, invites };
}

export default function ProfilePage({
	loaderData: { profile, schools, invites },
}: Route.ComponentProps) {
	const navigate = useNavigate();

	async function handleSignOut() {
		await signOut();
		navigate("/login");
	}

	async function handleDeleteAccount() {
		const message =
			"Tem certeza de que quer deletar sua conta? Essa ação é irreversível!";
		if (!window.confirm(message)) return;

		await deleteUserAccount();
		navigate("/login");
	}

	return (
		<UI.Container size="sm">
			<title>Meu Perfil | CodiGO!</title>
			<UI.Stack gap="md">
				<UI.Paper>
					<UI.Group gap="lg" wrap="nowrap">
						<UI.Avatar
							name={profile.name || undefined}
							color="violet"
							variant="filled"
							radius="xl"
							size={64}
						/>
						<div>
							<UI.Title order={1} style={{ overflowWrap: "anywhere" }}>
								{profile.name}
							</UI.Title>
							<UI.Text size="lg" c="dimmed" fs="italic">
								@{profile.username}
							</UI.Text>
						</div>
					</UI.Group>
				</UI.Paper>

				<UI.Paper>
					<UI.Title order={2}>Minhas Escolas</UI.Title>
					<UI.Divider />
					<UI.Stack gap="sm">
						{schools.map((school) => (
							<Self.InviteCard
								key={school.school_id}
								school={school}
								profile_id={profile.id}
								status="active"
							/>
						))}
					</UI.Stack>
					{!schools.length && (
						<UI.Text size="sm" c="dimmed" ta="center">
							Você não participa de nenhuma escola!
						</UI.Text>
					)}

					<UI.Title order={2} mt="xl">
						Meus Convites
					</UI.Title>
					<UI.Divider />
					<UI.Stack gap="sm">
						{invites.map((school) => (
							<Self.InviteCard
								key={school.school_id}
								school={school}
								profile_id={profile.id}
								status="pending"
							/>
						))}
					</UI.Stack>
					{!invites.length && (
						<UI.Text size="sm" c="dimmed" ta="center">
							Você não tem convites!
						</UI.Text>
					)}
				</UI.Paper>

				<Self.EditProfileForm profile={profile} />

				<UI.Paper>
					<UI.Group grow>
						<UI.Button
							type="button"
							color="red"
							onClick={handleSignOut}
							leftSection={<Icon.LogOut size={18} />}
						>
							Sair da Conta
						</UI.Button>
						<UI.Button
							type="button"
							color="red"
							onClick={handleDeleteAccount}
							leftSection={<Icon.Trash2 size={18} />}
						>
							Deletar Conta
						</UI.Button>
					</UI.Group>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}
