import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
	type SignInFormData,
	signInSchema,
} from "../features/auth/auth.schemas";
import { signInWithPassword } from "../features/auth/auth.service";

export function SignInPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormData>({
		resolver: valibotResolver(signInSchema),
	});

	async function onSubmit({ email, password }: SignInFormData) {
		try {
			await signInWithPassword(email, password);

			navigate("/app", { replace: true });
		} catch {
			setError("root", {
				message: "Não foi possível entrar. Verifique seu e-mail e senha.",
			});
		}
	}

	return (
		<section className="ui-card">
			<header className="mb-8 text-center">
				<h1 className="mt-4 text-(2xl heading) font-black tracking-tight">
					Bom te ver!
				</h1>
			</header>

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex-(~ col) gap-5"
			>
				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>E-mail</span>

					<input
						type="email"
						{...register("email")}
						autoComplete="email"
						placeholder="Digite seu e-mail"
						aria-invalid={Boolean(errors.email)}
						className="ui-field"
					/>

					{errors.email && (
						<p role="alert" className="text-(sm danger) font-medium">
							{errors.email.message}
						</p>
					)}
				</label>

				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Senha</span>

					<input
						type="password"
						{...register("password")}
						autoComplete="current-password"
						placeholder="Digite sua senha"
						aria-invalid={Boolean(errors.password)}
						className="ui-field"
					/>

					{errors.password && (
						<p role="alert" className="text-(sm danger) font-medium">
							{errors.password.message}
						</p>
					)}
				</label>

				{errors.root && (
					<p role="alert" className="ui-alert-danger">
						{errors.root.message}
					</p>
				)}

				<button
					type="submit"
					disabled={isSubmitting}
					className="ui-button-primary mt-1"
				>
					{isSubmitting ? "Entrando..." : "Entrar"}
				</button>
			</form>

			<p className="mt-7 text-(center sm muted)">
				Ainda não tem uma conta?{" "}
				<Link to="/criar-conta" className="ui-link">
					Criar conta
				</Link>
			</p>
		</section>
	);
}
