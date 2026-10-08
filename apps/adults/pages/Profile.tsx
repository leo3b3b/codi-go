import * as UI from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Icon from "lucide-react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { InviteCard } from "@/components";
import { type ProfileOutput, profileSchema } from "@/schemas";
import {
	getInvitesForCurrentUser,
	getProfileForCurrentUser,
	getSchoolsForCurrentUser,
	signOut,
	updateProfileForCurrentUser,
} from "@/services";
import { deleteUserAccount } from "@/services/auth";

export async function clientLoader() {
	const profile = await getProfileForCurrentUser();
	const schools = await getSchoolsForCurrentUser();
	const invites = await getInvitesForCurrentUser();

	return { profile, schools, invites };
}

export default function ProfilePage() {
	const { profile, schools, invites } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();
	const { revalidate } = useRevalidator();

	const {
		register,
		handleSubmit,
		setError,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ProfileOutput>({
		resolver: valibotResolver(profileSchema),
	});

	const currentName = watch("name");
	const currentUsername = watch("username");
	const isFormEmpty = !currentName && !currentUsername;

	async function onSubmit({ name, username }: ProfileOutput) {
		try {
			await updateProfileForCurrentUser({
				name: name || null,
				username: username || null,
			});

			revalidate();
			reset();
		} catch {
			setError("root", {
				message:
					"Não foi possível salvar seu perfil. Tente novamente mais tarde.",
			});
		}
	}

	async function handleSignOut() {
		await signOut();
		navigate("/login");
	}

	async function handleDeleteAccount() {
		const confirmed = window.confirm(
			"Tem certeza de que quer deletar sua conta? Essa ação é irreversível!",
		);
		if (!confirmed) return;
		await deleteUserAccount();
		navigate("/login");
	}

	return (
		<UI.Container size="sm">
			<title>CodiGO! | Meu Perfil</title>

			<UI.Stack gap="md">
				<UI.Paper p="lg">
					<UI.Group gap="lg" wrap="nowrap">
						<UI.ThemeIcon size={64} radius="xl">
							<Icon.User size={32} />
						</UI.ThemeIcon>

						<div>
							<UI.Title order={1} style={{ wordBreak: "break-word" }}>
								{profile.name}
							</UI.Title>

							<UI.Text size="lg" c="dimmed" fs="italic">
								@{profile.username}
							</UI.Text>
						</div>
					</UI.Group>
				</UI.Paper>

				<UI.Paper p="lg">
					<UI.Title order={2}>Minhas Escolas</UI.Title>

					<UI.Divider />

					<UI.Stack gap="sm">
						{schools.map(({ school_id, legal_name, trade_name, role }) => (
							<InviteCard
								key={school_id}
								school_id={school_id}
								profile_id={profile.id}
								legal_name={legal_name}
								trade_name={trade_name}
								user_role={role}
								invite_status="active"
							/>
						))}
					</UI.Stack>

					{schools.length === 0 && (
						<UI.Text size="sm" c="dimmed" ta="center">
							Você não participa de nenhuma escola!
						</UI.Text>
					)}

					<UI.Title order={2} mt="xl">
						Convites
					</UI.Title>

					<UI.Divider />

					<UI.Stack gap="sm">
						{invites.map(({ school_id, legal_name, trade_name, role }) => (
							<InviteCard
								key={school_id}
								school_id={school_id}
								profile_id={profile.id}
								legal_name={legal_name}
								trade_name={trade_name}
								user_role={role}
								invite_status="pending"
							/>
						))}
					</UI.Stack>

					{invites.length === 0 && (
						<UI.Text size="sm" c="dimmed" ta="center">
							Você não tem convites!
						</UI.Text>
					)}
				</UI.Paper>

				<UI.Paper p="lg">
					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<UI.Stack gap="md">
							<div>
								<UI.Title order={2} size="h3">
									Editar Perfil
								</UI.Title>

								<UI.Text size="sm" c="dimmed">
									Deixe em branco os campos que não deseja alterar.
								</UI.Text>
							</div>

							<UI.TextInput
								label="Novo nome"
								type="text"
								{...register("name")}
								autoComplete="name"
								placeholder={profile.name || undefined}
								error={errors.name?.message}
							/>

							<UI.TextInput
								label="Novo nome de usuário"
								type="text"
								{...register("username")}
								autoComplete="username"
								placeholder={profile.username || undefined}
								error={errors.username?.message}
								leftSection={<Icon.AtSign size={18} />}
							/>

							{errors.root && (
								<UI.Alert color="red" variant="light">
									{errors.root.message}
								</UI.Alert>
							)}

							<UI.Button
								type="submit"
								disabled={isSubmitting || isFormEmpty}
								mt="xs"
								leftSection={<Icon.Save size={18} />}
							>
								{isSubmitting ? "Salvando..." : "Salvar Alterações"}
							</UI.Button>
						</UI.Stack>
					</form>
				</UI.Paper>

				<UI.Paper p="lg">
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
