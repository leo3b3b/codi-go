import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { type SignUpOutput, signUpSchema } from "@/schemas";
import { signUp } from "@/services";

export default function SignUpPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignUpOutput>({
		resolver: valibotResolver(signUpSchema),
	});

	async function onSubmit({ email, password }: SignUpOutput) {
		try {
			await signUp(email, password);
			navigate("/confirmar-email", { replace: true });
		} catch {
			setError("root", {
				message: "Não foi possível criar sua conta. Tente novamente.",
			});
		}
	}

	return (
		<M.Paper>
			<title>CodiGO! | Crie sua conta</title>

			<M.Stack gap="lg">
				<M.Title order={1} ta="center">
					Crie sua conta
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
							placeholder="Crie uma senha"
							autoComplete="new-password"
							{...register("password")}
							error={errors.password?.message}
						/>

						<M.PasswordInput
							label="Confirmar senha"
							placeholder="Confirme sua senha"
							autoComplete="new-password"
							{...register("confirmation")}
							error={errors.confirmation?.message}
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
							{isSubmitting ? "Criando..." : "Criar conta"}
						</M.Button>
					</M.Stack>
				</form>

				<M.Text size="sm" c="dimmed" ta="center">
					Já possui uma conta?{" "}
					<M.Anchor component={Link} to="/login" fw={700}>
						Entrar
					</M.Anchor>
				</M.Text>
			</M.Stack>
		</M.Paper>
	);
}
