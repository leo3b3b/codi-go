import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import {
	type getProfileForCurrentUser,
	updateProfileForCurrentUser,
} from "@/services";

type Profile = Awaited<ReturnType<typeof getProfileForCurrentUser>>;

export function EditProfileForm({ profile }: { profile: Profile }) {
	const { revalidate } = useRevalidator();
	const [rootError, setRootError] = useState<string | null>(null);

	const profileForm = form.useForm({
		mode: "controlled",
		initialValues: { name: "", username: "" },
		validate: {
			name: (value) => {
				if (!value) return null;
				return /^\p{L}+(?: +\p{L}+)*$/u.test(value.trim())
					? null
					: "O nome deve conter apenas letras e espaços.";
			},
			username: (value) => {
				if (!value) return null;
				const username = value.trim();

				if (username.length < 3)
					return "O nome de usuário deve ter pelo menos 3 caracteres.";
				if (username.length > 30)
					return "O nome de usuário pode ter no máximo 30 caracteres.";
				if (!/^[a-z0-9._-]+$/.test(username))
					return "Use apenas letras minúsculas, números, pontos, traços ou sublinhados.";

				return null;
			},
		},
	});

	async function onSubmit(values: typeof profileForm.values) {
		setRootError(null);
		try {
			await updateProfileForCurrentUser({
				name: values.name.trim() || null,
				username: values.username.trim() || null,
			});
			profileForm.reset();
			await revalidate();
		} catch {
			setRootError(
				"Não foi possível salvar seu perfil. Tente novamente mais tarde.",
			);
		}
	}

	return (
		<UI.Paper>
			<form onSubmit={profileForm.onSubmit(onSubmit)} noValidate>
				<UI.Stack gap="md">
					<div>
						<UI.Title order={2}>Editar Perfil</UI.Title>
						<UI.Text size="sm" c="dimmed">
							Deixe em branco os campos que não deseja alterar.
						</UI.Text>
					</div>

					<UI.TextInput
						label="Novo nome"
						autoComplete="name"
						placeholder={profile.name || undefined}
						{...profileForm.getInputProps("name")}
					/>
					<UI.TextInput
						label="Novo nome de usuário"
						autoComplete="username"
						placeholder={profile.username || undefined}
						leftSection={<Icon.AtSign size={18} />}
						{...profileForm.getInputProps("username")}
					/>

					{rootError && <UI.Alert>{rootError}</UI.Alert>}

					<UI.Button
						type="submit"
						disabled={!profileForm.isDirty() || profileForm.submitting}
						mt="xs"
						leftSection={<Icon.Save size={18} />}
					>
						{profileForm.submitting ? "Salvando..." : "Salvar Alterações"}
					</UI.Button>
				</UI.Stack>
			</form>
		</UI.Paper>
	);
}
