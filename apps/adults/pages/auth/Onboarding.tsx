import { UI } from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Icon from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as v from "valibot";
import { requireAuth } from "@/middlewares";
import { updateProfileForCurrentUser } from "@/services";

const onboardingSchema = v.object({
	name: v.pipe(
		v.string("O nome deve ser um texto."),
		v.trim(),
		v.nonEmpty("Informe seu nome."),
		v.regex(
			/^\p{L}+(?: +\p{L}+)*$/u,
			"O nome deve conter apenas letras e espaços.",
		),
	),
	username: v.pipe(
		v.string("O nome de usuário deve ser um texto."),
		v.trim(),
		v.nonEmpty("Informe um nome de usuário."),
		v.minLength(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
		v.maxLength(30, "O nome de usuário pode ter no máximo 30 caracteres."),
		v.regex(
			/^[a-z0-9._-]+$/,
			"Use apenas letras minúsculas, números, pontos, traços ou sublinhados.",
		),
	),
});

type OnboardingOutput = v.InferOutput<typeof onboardingSchema>;

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
		<UI.Paper>
			<title>CodiGO! | Complete seu perfil</title>

			<UI.Stack gap="lg">
				<UI.Title order={1} ta="center">
					Complete seu perfil
				</UI.Title>

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.TextInput
							label="Nome"
							placeholder="Digite seu nome"
							autoComplete="name"
							{...register("name")}
							error={errors.name?.message}
						/>

						<UI.TextInput
							label="Nome de usuário"
							placeholder="Escolha um nome de usuário"
							autoComplete="username"
							leftSection={<Icon.AtSign size={16} />}
							{...register("username")}
							error={errors.username?.message}
						/>

						{errors.root && <UI.Alert>{errors.root.message}</UI.Alert>}

						<UI.Button type="submit" loading={isSubmitting} mt="xs">
							{isSubmitting ? "Salvando..." : "Salvar"}
						</UI.Button>
					</UI.Stack>
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
