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
			<UI.Stack>
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

				<SchoolsList profile={profile} schools={schools} invites={invites} />
				<Self.EditProfileForm profile={profile} />

				<UI.Paper>
					<UI.Flex direction={{ base: "column", md: "row" }} gap="sm">
						<UI.Button
							type="button"
							w="100%"
							color="red"
							onClick={handleSignOut}
							leftSection={<Icon.LogOut size={18} />}
						>
							Sair da Conta
						</UI.Button>
						<UI.Button
							type="button"
							w="100%"
							color="red"
							onClick={handleDeleteAccount}
							leftSection={<Icon.Trash2 size={18} />}
						>
							Deletar Conta
						</UI.Button>
					</UI.Flex>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}

function SchoolsList({
	profile,
	schools,
	invites,
}: Route.ComponentProps["loaderData"]) {
	return (
		<UI.Paper>
			<UI.Stack>
				<UI.Title order={2}>Minhas Escolas</UI.Title>
				{schools.length === 0 ? (
					<UI.Text c="dimmed" ta="center">
						Você não tem convites!
					</UI.Text>
				) : (
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
				)}

				<UI.Title order={2} mt="md">
					Meus Convites
				</UI.Title>
				{invites.length === 0 ? (
					<UI.Text c="dimmed" ta="center">
						Você não tem convites!
					</UI.Text>
				) : (
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
				)}
			</UI.Stack>
		</UI.Paper>
	);
}
