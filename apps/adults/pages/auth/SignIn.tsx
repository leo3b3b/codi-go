import { form, UI } from "@codi-go/ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithPassword } from "@/services";

export default function SignInPage() {
	const navigate = useNavigate();
	const [rootError, setRootError] = useState<string | null>(null);

	const signInForm = form.useForm({
		mode: "controlled",
		initialValues: {
			email: "",
			password: "",
		},
		validate: {
			email: (value) => {
				const email = value.trim();
				if (!email) return "Informe seu e-mail.";
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
					return "Informe um endereço de e-mail válido (ex: nome@dominio.com).";
				return null;
			},
			password: (value) =>
				value.trim() ? null : "Informe sua senha.",
		},
	});

	async function onSubmit(values: typeof signInForm.values) {
		setRootError(null);

		try {
			await signInWithPassword(
				values.email.trim(),
				values.password.trim(),
			);
			navigate("/escolas", { replace: true });
		} catch {
			setRootError(
				"Não foi possível entrar. Verifique seu e-mail e senha.",
			);
		}
	}

	return (
		<UI.Paper>
			<title>CodiGO! | Login</title>
			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Bom te ver!
				</UI.Title>
				<form onSubmit={signInForm.onSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.TextInput
							label="E-mail"
							type="email"
							placeholder="Digite seu e-mail"
							autoComplete="email"
							{...signInForm.getInputProps("email")}
						/>
						<UI.PasswordInput
							label="Senha"
							placeholder="Digite sua senha"
							autoComplete="current-password"
							{...signInForm.getInputProps("password")}
						/>
						{rootError && <UI.Alert>{rootError}</UI.Alert>}
						<UI.Button
							type="submit"
							loading={signInForm.submitting}
							mt="xs"
						>
							{signInForm.submitting ? "Entrando..." : "Entrar"}
						</UI.Button>
					</UI.Stack>
				</form>
				<UI.Text size="sm" c="dimmed" ta="center">
					Ainda não tem uma conta?{" "}
					<UI.Anchor component={Link} to="/criar-conta" fw={700}>
						Criar conta
					</UI.Anchor>
				</UI.Text>
			</UI.Stack>
		</UI.Paper>
	);
}