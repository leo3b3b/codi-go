import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { requireAuth } from "@/middlewares";
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
		<M.Paper>
			<title>CodiGO! | Complete seu perfil</title>

			<M.Stack gap="lg">
				<M.Title order={1} ta="center">
					Complete seu perfil
				</M.Title>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<M.Stack gap="md">
						<M.TextInput
							label="Nome"
							placeholder="Digite seu nome"
							autoComplete="name"
							{...register("name")}
							error={errors.name?.message}
						/>

						<M.TextInput
							label="Nome de usuário"
							placeholder="Escolha um nome de usuário"
							autoComplete="username"
							leftSection={<Icon.AtSign size={16} />}
							{...register("username")}
							error={errors.username?.message}
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
							{isSubmitting ? "Salvando..." : "Salvar"}
						</M.Button>
					</M.Stack>
				</form>
			</M.Stack>
		</M.Paper>
	);
}
