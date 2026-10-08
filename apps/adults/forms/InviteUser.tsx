import { UI } from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Icon from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import * as v from "valibot";
import { Select } from "@/components";
import { inviteUserToSchool } from "@/services";

const inviteSchema = v.object({
	username: v.pipe(
		v.string("O nome de usuário deve ser um texto."),
		v.trim(),
		v.minLength(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
		v.maxLength(30, "O nome de usuário pode ter no máximo 30 caracteres."),
		v.regex(
			/^[a-z0-9._-]+$/,
			"Use apenas letras minúsculas, números, pontos, traços ou sublinhados.",
		),
	),
	role: v.union(
		[v.literal("teacher"), v.literal("admin")],
		"O usuário deve ser administrador ou professor.",
	),
});

type InviteOutput = v.InferOutput<typeof inviteSchema>;

export function InviteUserForm({
	school,
}: {
	school: {
		id: string;
		legal_name: string;
		trade_name: string;
		cnpj: string;
	};
}) {
	const { revalidate } = useRevalidator();

	const {
		register,
		handleSubmit,
		setError,
		watch,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<InviteOutput>({
		resolver: valibotResolver(inviteSchema),
		defaultValues: { role: "teacher" },
	});

	async function onSubmit({ username, role }: InviteOutput) {
		try {
			await inviteUserToSchool({
				username,
				role,
				school_id: school.id,
			});
		} catch {
			setError("root", {
				message: "Não foi possível convidar o usuário.",
			});
		}

		revalidate();
		reset();
	}

	return (
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={1}>
					Convidar Usuário para {school.trade_name || school.legal_name}
				</UI.Title>

				<UI.Divider />

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<UI.Grid align="flex-start">
						<UI.Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
							<UI.TextInput
								autoComplete="username"
								placeholder="Digite o nome do usuário"
								leftSection={<Icon.AtSign size={18} />}
								{...register("username")}
								error={errors.username?.message}
							/>
						</UI.Grid.Col>

						<UI.Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
							<Controller
								name="role"
								control={control}
								render={({ field }) => (
									<Select
										aria-label="Cargo"
										value={field.value}
										onChange={field.onChange}
										options={[
											{
												value: "teacher",
												label: "Professor",
											},
											{
												value: "admin",
												label: "Administrador",
											},
										]}
										className="w-full"
									/>
								)}
							/>
							{errors.role && (
								<UI.Text size="sm" c="red" mt={4}>
									{errors.role.message}
								</UI.Text>
							)}
						</UI.Grid.Col>

						<UI.Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
							<UI.Button
								type="submit"
								fullWidth
								loading={isSubmitting}
								disabled={!watch("username")}
							>
								{isSubmitting ? "Convidando..." : "Convidar"}
							</UI.Button>
						</UI.Grid.Col>
					</UI.Grid>

					{errors.root && <UI.Alert mt="md">{errors.root.message}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
