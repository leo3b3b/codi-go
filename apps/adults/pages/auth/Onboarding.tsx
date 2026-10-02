import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Icon } from "@/components";
import { requireAuth } from "@/router";
import { type OnboardingOutput, onboardingSchema } from "@/schemas";
import { updateProfileForCurrentUser } from "@/services";

export const clientMiddleware = [requireAuth];

export default function OnboardingPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<OnboardingOutput>({
		resolver: valibotResolver(onboardingSchema),
	});

	async function onSubmit({ name, username }: OnboardingOutput) {
		try {
			await updateProfileForCurrentUser({ name, username });
			navigate("/escolas", { replace: true });
		} catch {
			setError("root", {
				message:
					"Não foi possível salvar seu perfil. Tente novamente mais tarde.",
			});
		}
	}

	return (
		<section className="ui-card">
			<title>CodiGO! | Complete seu perfil</title>
			<header className="mb-8 text-center">
				<h1 className="mt-4 text-(2xl heading) font-black tracking-tight">
					Complete seu perfil
				</h1>
			</header>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex-(~ col) gap-5"
			>
				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Nome</span>

					<input
						type="text"
						{...register("name")}
						autoComplete="name"
						placeholder="Digite seu nome"
						aria-invalid={Boolean(errors.name)}
						className="ui-field"
					/>

					{errors.name && (
						<p role="alert" className="text-(sm danger) font-medium">
							{errors.name.message}
						</p>
					)}
				</label>
				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Nome de usuário</span>

					<div className="relative flex items-center">
						<Icon
							icon="i-lucide-at-sign"
							color="muted"
							size={6}
							className="absolute left-3 pointer-events-none"
						/>

						<input
							type="text"
							{...register("username")}
							autoComplete="username"
							placeholder="Escolha um nome de usuário"
							aria-invalid={Boolean(errors.username)}
							className="ui-field w-full pl-10"
						/>
					</div>

					{errors.username && (
						<p role="alert" className="text-(sm danger) font-medium">
							{errors.username.message}
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
					className="ui-button-(~ primary) mt-1"
				>
					{isSubmitting ? "Salvando..." : "Salvar"}
				</button>
			</form>
		</section>
	);
}
