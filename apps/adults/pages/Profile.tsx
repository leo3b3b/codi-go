import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useRevalidator } from "react-router";
import { Icon } from "@/components";
import type { profileLoader } from "@/router";
import { type ProfileOutput, profileSchema } from "@/schemas";
import { updateProfileForCurrentUser } from "@/services";

export function ProfilePage() {
	const profile = useLoaderData<typeof profileLoader>();

	const { revalidate } = useRevalidator();

	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ProfileOutput>({
		resolver: valibotResolver(profileSchema),
	});

	const currentName = watch("name");
	const currentUsername = watch("username");
	const isFormEmpty = !currentName && !currentUsername;

	async function onSubmit({ name, username }: ProfileOutput) {
		try {
			setIsSuccess(false);

			await updateProfileForCurrentUser({
				name: name || null,
				username: username || null,
			});

			revalidate();
			reset();
			setIsSuccess(true);
		} catch {
			setError("root", {
				message:
					"Não foi possível salvar seu perfil. Tente novamente mais tarde.",
			});
		}
	}

	return (
		<div className="w-full max-w-lg h-full mx-auto flex-(~ col) items-center gap-4">
			<title>CodiGO! | Meu Perfil</title>

			<section className="ui-card w-full flex-(~ row) gap-6 items-center">
				<div className="rounded-full bg-primary text-(8 on-primary) flex items-center justify-center size-16 font-bold uppercase tracking-wider">
					{profile.name.slice(0, 2)}
				</div>
				<div>
					<h1 className="text-(2xl heading) sm:text-3xl font-bold break-words">
						{profile.name}
					</h1>
					<p className="text-(lg muted) italic">@{profile.username}</p>
				</div>
			</section>

			<section className="ui-card w-full">
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className="flex-(~ col) gap-5"
				>
					<header className="flex-(~ col) gap-1 mb-2">
						<h2 className="text-(xl heading) font-bold">Editar Perfil</h2>
						<p className="text-(sm muted)">
							Deixe em branco os campos que não deseja alterar.
						</p>
					</header>

					<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
						<span>Novo nome</span>
						<input
							type="text"
							{...register("name")}
							autoComplete="name"
							placeholder={profile.name}
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
						<span>Novo nome de usuário</span>
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
								placeholder={profile.username}
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

					{isSuccess && !errors.root && (
						<p
							role="alert"
							className="text-(sm primary) font-bold flex items-center gap-2"
						>
							<Icon icon="i-lucide-check-circle" color="primary" size={5} />
							Perfil atualizado com sucesso!
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting || isFormEmpty}
						className="ui-button-(~ primary) mt-2"
					>
						<Icon icon="i-lucide-save" color="on-primary" size={6} />
						{isSubmitting ? "Salvando..." : "Salvar Alterações"}
					</button>
				</form>
			</section>
		</div>
	);
}
