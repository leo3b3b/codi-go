import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import { requireAuth } from "@/middlewares";
import { updateProfileForCurrentUser } from "@/services";

export const clientMiddleware = [requireAuth];

export default function OnboardingPage() {
	const navigate = useNavigate();
	const [rootError, setRootError] = useState<string | null>(null);

	const onboardingForm = form.useForm({
		mode: "controlled",
		initialValues: {
			name: "",
			username: "",
		},
		validate: {
			name: (value) => {
				const name = value.trim();
				if (!name) return "Informe seu nome.";
				if (!/^\p{L}+(?: +\p{L}+)*$/u.test(name))
					return "O nome deve conter apenas letras e espaços.";
				return null;
			},
			username: (value) => {
				const username = value.trim();
				if (!username) return "Informe um nome de usuário.";
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

	async function onSubmit(values: typeof onboardingForm.values) {
		setRootError(null);

		try {
			await updateProfileForCurrentUser({
				name: values.name.trim(),
				username: values.username.trim(),
			});
			navigate("/escolas", { replace: true });
		} catch {
			setRootError(
				"Não foi possível salvar seu perfil. Tente novamente mais tarde.",
			);
		}
	}

	return (
		<UI.Paper>
			<title>CodiGO! | Complete seu perfil</title>
			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Complete seu perfil
				</UI.Title>
				<form onSubmit={onboardingForm.onSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.TextInput
							label="Nome"
							placeholder="Digite seu nome"
							autoComplete="name"
							{...onboardingForm.getInputProps("name")}
						/>
						<UI.TextInput
							label="Nome de usuário"
							placeholder="Escolha um nome de usuário"
							autoComplete="username"
							leftSection={<Icon.AtSign size={16} />}
							{...onboardingForm.getInputProps("username")}
						/>
						{rootError && <UI.Alert>{rootError}</UI.Alert>}
						<UI.Button
							type="submit"
							loading={onboardingForm.submitting}
							mt="xs"
						>
							{onboardingForm.submitting ? "Salvando..." : "Salvar"}
						</UI.Button>
					</UI.Stack>
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}