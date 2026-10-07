import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
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
		<M.Container size="sm">
			<title>CodiGO! | Meu Perfil</title>

			<M.Stack gap="md">
				<M.Paper p="lg">
					<M.Group gap="lg" wrap="nowrap">
						<M.ThemeIcon size={64} radius="xl">
							<Icon.User size={32} />
						</M.ThemeIcon>

						<div>
							<M.Title order={1} style={{ wordBreak: "break-word" }}>
								{profile.name}
							</M.Title>

							<M.Text size="lg" c="dimmed" fs="italic">
								@{profile.username}
							</M.Text>
						</div>
					</M.Group>
				</M.Paper>

				<M.Paper p="lg">
					<M.Title order={2}>Minhas Escolas</M.Title>

					<M.Divider />

					<M.Stack gap="sm">
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
					</M.Stack>

					{schools.length === 0 && (
						<M.Text size="sm" c="dimmed" ta="center">
							Você não participa de nenhuma escola!
						</M.Text>
					)}

					<M.Title order={2} mt="xl">
						Convites
					</M.Title>

					<M.Divider />

					<M.Stack gap="sm">
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
					</M.Stack>

					{invites.length === 0 && (
						<M.Text size="sm" c="dimmed" ta="center">
							Você não tem convites!
						</M.Text>
					)}
				</M.Paper>

				<M.Paper p="lg">
					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<M.Stack gap="md">
							<div>
								<M.Title order={2} size="h3">
									Editar Perfil
								</M.Title>

								<M.Text size="sm" c="dimmed">
									Deixe em branco os campos que não deseja alterar.
								</M.Text>
							</div>

							<M.TextInput
								label="Novo nome"
								type="text"
								{...register("name")}
								autoComplete="name"
								placeholder={profile.name || undefined}
								error={errors.name?.message}
							/>

							<M.TextInput
								label="Novo nome de usuário"
								type="text"
								{...register("username")}
								autoComplete="username"
								placeholder={profile.username || undefined}
								error={errors.username?.message}
								leftSection={<Icon.AtSign size={18} />}
							/>

							{errors.root && (
								<M.Alert color="red" variant="light">
									{errors.root.message}
								</M.Alert>
							)}

							<M.Button
								type="submit"
								disabled={isSubmitting || isFormEmpty}
								mt="xs"
								leftSection={<Icon.Save size={18} />}
							>
								{isSubmitting ? "Salvando..." : "Salvar Alterações"}
							</M.Button>
						</M.Stack>
					</form>
				</M.Paper>

				<M.Paper p="lg">
					<M.Group grow>
						<M.Button
							type="button"
							color="red"
							onClick={handleSignOut}
							leftSection={<Icon.LogOut size={18} />}
						>
							Sair da Conta
						</M.Button>

						<M.Button
							type="button"
							color="red"
							onClick={handleDeleteAccount}
							leftSection={<Icon.Trash2 size={18} />}
						>
							Deletar Conta
						</M.Button>
					</M.Group>
				</M.Paper>
			</M.Stack>
		</M.Container>
	);
}
