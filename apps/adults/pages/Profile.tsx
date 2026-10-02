import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { HorizontalSeparator, Icon, InviteCard } from "@/components";
import { type ProfileOutput, profileSchema } from "@/schemas";
import {
	getInvitesForCurrentUser,
	getProfileForCurrentUser,
	getSchoolsForCurrentUser,
	signOut,
	updateProfileForCurrentUser,
} from "@/services";
import { deleteUserAccount } from "@/services/auth";

export async function clientLoader() {
	const profile = await getProfileForCurrentUser();
	const schools = await getSchoolsForCurrentUser();
	const invites = await getInvitesForCurrentUser();

	return { profile, schools, invites };
}

export default function ProfilePage() {
	const { profile, schools, invites } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();
	const { revalidate } = useRevalidator();

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
			await updateProfileForCurrentUser({
				name: name || null,
				username: username || null,
			});

			revalidate();
			reset();
		} catch {
			setError("root", {
				message:
					"Não foi possível salvar seu perfil. Tente novamente mais tarde.",
			});
		}
	}

	async function handleSignOut() {
		await signOut();
		navigate("/login");
	}

	async function handleDeleteAccount() {
		const confirmed = window.confirm(
			"Tem certeza de que quer deletar sua conta? Essa ação é irreversível!",
		);
		if (!confirmed) return;
		await deleteUserAccount();
		navigate("/login");
	}

	return (
		<div className="w-full max-w-2xl h-full mx-auto flex-(~ col) items-center gap-4">
			<title>CodiGO! | Meu Perfil</title>

			<section className="ui-card w-full flex-(~ row) gap-6 items-center">
				<div className="rounded-full bg-primary flex items-center justify-center size-16">
					<Icon icon="i-lucide-user" color="on-primary" size={8} />
				</div>
				<div>
					<h1 className="text-(2xl heading) sm:text-3xl font-bold break-words">
						{profile.name}
					</h1>
					<p className="text-(lg muted) italic">@{profile.username}</p>
				</div>
			</section>

			<section className="ui-card w-full">
				<h2 className="text-(xl heading) font-bold">Minhas Escolas</h2>
				<HorizontalSeparator />
				<div className="size-full flex-(~ col) gap-2">
					{schools.map(({ school_id, legal_name, trade_name, role }) => (
						<InviteCard
							key={school_id}
							school_id={school_id}
							profile_id={profile.id}
							legal_name={legal_name}
							trade_name={trade_name}
							user_role={role}
							invite_status="active"
						/>
					))}
				</div>
				{schools.length === 0 && (
					<p className="text-(sm muted center)">
						Você não participa de nenhuma escola!
					</p>
				)}
				<h2 className="text-(xl heading) font-bold mt-6">Convites</h2>
				<HorizontalSeparator />
				<div className="size-full flex-(~ col) gap-2">
					{invites.map(({ school_id, legal_name, trade_name, role }) => (
						<InviteCard
							key={school_id}
							school_id={school_id}
							profile_id={profile.id}
							legal_name={legal_name}
							trade_name={trade_name}
							user_role={role}
							invite_status="pending"
						/>
					))}
				</div>
				{invites.length === 0 && (
					<p className="text-(sm muted center)">Você não tem convites!</p>
				)}
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
							placeholder={profile.name || undefined}
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
								placeholder={profile.username || undefined}
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
						disabled={isSubmitting || isFormEmpty}
						className="ui-button-(~ primary) mt-2"
					>
						<Icon icon="i-lucide-save" color="on-primary" size={5} />
						{isSubmitting ? "Salvando..." : "Salvar Alterações"}
					</button>
				</form>
			</section>
			<section className="ui-card w-full flex-(~ row) gap-4">
				<button
					type="button"
					className="ui-button-(~ danger)"
					onClick={handleSignOut}
				>
					<Icon icon="i-lucide-log-out" color="on-danger" size={5} />
					Sair da Conta
				</button>
				<button
					type="button"
					className="ui-button-(~ danger)"
					onClick={handleDeleteAccount}
				>
					<Icon icon="i-lucide-trash-2" color="on-danger" size={5} />
					Deletar Conta
				</button>
			</section>
		</div>
	);
}
