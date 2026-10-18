import { form, UI } from "@codi-go/ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { updatePassword } from "@/services";

export default function ResetPasswordPage() {
	const navigate = useNavigate();

	const [passwordVisible, setPasswordVisible] = useState(false);
	const [rootError, setRootError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const resetForm = form.useForm({
		mode: "uncontrolled",
		initialValues: {
			password: "",
			confirmPassword: "",
		},
		validate: {
			password: (value) => {
				if (!value) return "Informe a nova senha.";
				if (value.length < 8)
					return "A senha deve ter pelo menos 8 caracteres.";
				return null;
			},
			confirmPassword: (value, values) => {
				if (!value) return "Confirme sua nova senha.";
				if (value !== values.password) return "As senhas não coincidem.";
				return null;
			},
		},
	});

	async function onSubmit(values: typeof resetForm.values) {
		setRootError(null);

		try {
			await updatePassword(values.password);
			setSuccess(true);
		} catch {
			setRootError(
				"Não foi possível redefinir sua senha. O link pode ter expirado ou ser inválido. Solicite uma nova recuperação.",
			);
		}
	}

	return (
		<UI.Paper>
			<title>Redefinir senha | CodiGO!</title>

			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Redefinir senha
				</UI.Title>

				{!success ? (
					<>
						<UI.Text c="dimmed" ta="center">
							Escolha uma nova senha para recuperar o acesso à sua conta
							CodiGO!.
						</UI.Text>

						<form onSubmit={resetForm.onSubmit(onSubmit)} noValidate>
							<UI.Stack gap="md">
								<UI.PasswordInput
									label="Nova senha"
									placeholder="Digite sua nova senha"
									autoComplete="new-password"
									visible={passwordVisible}
									onVisibilityChange={setPasswordVisible}
									{...resetForm.getInputProps("password")}
								/>

								<UI.PasswordInput
									label="Confirmar nova senha"
									placeholder="Digite novamente sua senha"
									autoComplete="new-password"
									visible={passwordVisible}
									onVisibilityChange={setPasswordVisible}
									{...resetForm.getInputProps("confirmPassword")}
								/>

								{rootError && <UI.Alert>{rootError}</UI.Alert>}

								<UI.Button type="submit" loading={resetForm.submitting} mt="xs">
									{resetForm.submitting ? "Salvando..." : "Salvar nova senha"}
								</UI.Button>
							</UI.Stack>
						</form>
					</>
				) : (
					<UI.Stack gap="md">
						<UI.Alert color="violet">
							Sua senha foi redefinida com sucesso. Você já pode entrar com sua
							nova senha.
						</UI.Alert>

						<UI.Button onClick={() => navigate("/login")}>
							Ir para o login
						</UI.Button>
					</UI.Stack>
				)}

				{!success && (
					<UI.Text size="sm" c="dimmed" ta="center">
						Lembrou sua senha?{" "}
						<UI.Anchor component={Link} to="/login" fw={700}>
							Voltar para o login
						</UI.Anchor>
					</UI.Text>
				)}
			</UI.Stack>
		</UI.Paper>
	);
}
