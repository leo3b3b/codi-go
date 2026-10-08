import * as UI from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { type SignInOutput, signInSchema } from "@/schemas";
import { signInWithPassword } from "@/services";

export default function SignInPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignInOutput>({
		resolver: valibotResolver(signInSchema),
	});

	async function onSubmit({ email, password }: SignInOutput) {
		try {
			await signInWithPassword(email, password);
			navigate("/escolas", { replace: true });
		} catch {
			setError("root", {
				message: "Não foi possível entrar. Verifique seu e-mail e senha.",
			});
		}
	}

	return (
		<UI.Paper>
			<title>CodiGO! | Login</title>

			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Bom te ver!
				</UI.Title>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<UI.Stack gap="md">
						<UI.TextInput
							label="E-mail"
							type="email"
							placeholder="Digite seu e-mail"
							autoComplete="email"
							{...register("email")}
							error={errors.email?.message}
						/>

						<UI.PasswordInput
							label="Senha"
							placeholder="Digite sua senha"
							autoComplete="current-password"
							{...register("password")}
							error={errors.password?.message}
						/>

						{errors.root && (
							<UI.Alert>
								{errors.root.message}
							</UI.Alert>
						)}

						<UI.Button
							type="submit"
							loading={isSubmitting}
							mt="xs"
						>
							{isSubmitting ? "Entrando..." : "Entrar"}
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
