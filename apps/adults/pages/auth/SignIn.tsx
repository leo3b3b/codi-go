import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
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
		<M.Paper>
			<title>CodiGO! | Login</title>

			<M.Stack gap="lg">
				<M.Title order={1} ta="center">
					Bom te ver!
				</M.Title>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<M.Stack gap="md">
						<M.TextInput
							label="E-mail"
							type="email"
							placeholder="Digite seu e-mail"
							autoComplete="email"
							{...register("email")}
							error={errors.email?.message}
						/>

						<M.PasswordInput
							label="Senha"
							placeholder="Digite sua senha"
							autoComplete="current-password"
							{...register("password")}
							error={errors.password?.message}
						/>

						{errors.root && (
							<M.Alert>
								{errors.root.message}
							</M.Alert>
						)}

						<M.Button
							type="submit"
							loading={isSubmitting}
							mt="xs"
						>
							{isSubmitting ? "Entrando..." : "Entrar"}
						</M.Button>
					</M.Stack>
				</form>

				<M.Text size="sm" c="dimmed" ta="center">
					Ainda não tem uma conta?{" "}
					<M.Anchor component={Link} to="/criar-conta" fw={700}>
						Criar conta
					</M.Anchor>
				</M.Text>
			</M.Stack>
		</M.Paper>
	);
}
