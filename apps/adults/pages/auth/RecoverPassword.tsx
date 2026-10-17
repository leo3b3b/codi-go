import { form, UI } from "@codi-go/ui";
import { useState } from "react";
import { Link } from "react-router";
import { resetPasswordForEmail } from "@/services";

export default function RecoverPasswordPage() {
	const [rootError, setRootError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const recoverForm = form.useForm({
		mode: "uncontrolled",
		initialValues: {
			email: "",
		},
		validate: {
			email: (value) => {
				const email = value.trim();
				if (!email) return "Informe seu e-mail.";

				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
					return "Informe um endereço de e-mail válido.";

				return null;
			},
		},
	});

	async function onSubmit(values: typeof recoverForm.values) {
		setRootError(null);
		setSubmitted(false);

		try {
			await resetPasswordForEmail(values.email.trim());
			setSubmitted(true);
		} catch {
			setRootError(
				"Não foi possível enviar o e-mail. Tente novamente mais tarde.",
			);
		}
	}

	return (
		<UI.Paper>
			<title>Recuperar senha | CodiGO!</title>

			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Recuperar senha
				</UI.Title>

				<UI.Text c="dimmed" ta="center">
					Informe o e-mail associado à sua conta. Se houver uma conta
					correspondente, você receberá as instruções para redefinir sua senha.
				</UI.Text>

				{!submitted ? (
					<form onSubmit={recoverForm.onSubmit(onSubmit)} noValidate>
						<UI.Stack gap="md">
							<UI.TextInput
								label="E-mail"
								type="email"
								placeholder="Digite seu e-mail"
								autoComplete="email"
								{...recoverForm.getInputProps("email")}
							/>

							{rootError && <UI.Alert>{rootError}</UI.Alert>}

							<UI.Button type="submit" loading={recoverForm.submitting} mt="xs">
								{recoverForm.submitting ? "Enviando..." : "Enviar instruções"}
							</UI.Button>
						</UI.Stack>
					</form>
				) : (
					<UI.Alert color="violet">
						Se houver uma conta associada a esse e-mail, você receberá as
						instruções para redefinir sua senha. Verifique sua caixa de entrada
						e a pasta de spam.
					</UI.Alert>
				)}

				<UI.Text size="sm" c="dimmed" ta="center">
					Lembrou sua senha?{" "}
					<UI.Anchor component={Link} to="/login" fw={700}>
						Voltar para o login
					</UI.Anchor>
				</UI.Text>
			</UI.Stack>
		</UI.Paper>
	);
}
