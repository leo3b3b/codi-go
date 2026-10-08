import { UI } from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
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
		<UI.Paper>
			<title>CodiGO! | Crie sua conta</title>

			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Crie sua conta
				</UI.Title>

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
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
							placeholder="Crie uma senha"
							autoComplete="new-password"
							{...register("password")}
							error={errors.password?.message}
						/>

						<UI.PasswordInput
							label="Confirmar senha"
							placeholder="Confirme sua senha"
							autoComplete="new-password"
							{...register("confirmation")}
							error={errors.confirmation?.message}
						/>

						{errors.root && <UI.Alert>{errors.root.message}</UI.Alert>}

						<UI.Button type="submit" loading={isSubmitting} mt="xs">
							{isSubmitting ? "Criando..." : "Criar conta"}
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
