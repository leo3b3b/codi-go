import { form, UI } from "@codi-go/ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "@/services";

export default function SignUpPage() {
	const navigate = useNavigate();
	const [rootError, setRootError] = useState<string | null>(null);

	const signUpForm = form.useForm({
		mode: "controlled",
		initialValues: {
			email: "",
			password: "",
			confirmation: "",
		},
		validate: {
			email: (value) => {
				const email = value.trim();
				if (!email) return "Informe seu e-mail.";
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
					return "Informe um endereço de e-mail válido (ex: nome@dominio.com).";
				return null;
			},
			password: (value) => {
				const password = value.trim();
				if (!password) return "Crie uma senha.";
				if (password.length < 6)
					return "A senha deve ter no mínimo 6 caracteres.";
				return null;
			},
			confirmation: (value, values) => {
				const confirmation = value.trim();
				if (!confirmation) return "Confirme sua senha.";
				if (values.password.trim() !== confirmation)
					return "As senhas não coincidem. Digite a mesma senha nos dois campos.";
				return null;
			},
		},
	});

	async function onSubmit(values: typeof signUpForm.values) {
		setRootError(null);

		try {
			await signUp(values.email.trim(), values.password.trim());
			navigate("/confirmar-email", { replace: true });
		} catch {
			setRootError("Não foi possível criar sua conta. Tente novamente.");
		}
	}

	return (
		<UI.Paper>
			<title>CodiGO! | Crie sua conta</title>
			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Crie sua conta
				</UI.Title>
				<form onSubmit={signUpForm.onSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.TextInput
							label="E-mail"
							type="email"
							placeholder="Digite seu e-mail"
							autoComplete="email"
							{...signUpForm.getInputProps("email")}
						/>
						<UI.PasswordInput
							label="Senha"
							placeholder="Crie uma senha"
							autoComplete="new-password"
							{...signUpForm.getInputProps("password")}
						/>
						<UI.PasswordInput
							label="Confirmar senha"
							placeholder="Confirme sua senha"
							autoComplete="new-password"
							{...signUpForm.getInputProps("confirmation")}
						/>
						{rootError && <UI.Alert>{rootError}</UI.Alert>}
						<UI.Button
							type="submit"
							loading={signUpForm.submitting}
							mt="xs"
						>
							{signUpForm.submitting ? "Criando..." : "Criar conta"}
						</UI.Button>
					</UI.Stack>
				</form>
				<UI.Text size="sm" c="dimmed" ta="center">
					Já possui uma conta?{" "}
					<UI.Anchor component={Link} to="/login" fw={700}>
						Entrar
					</UI.Anchor>
				</UI.Text>
			</UI.Stack>
		</UI.Paper>
	);
}