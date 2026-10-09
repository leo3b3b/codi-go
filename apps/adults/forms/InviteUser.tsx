import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { Select } from "@/components";
import { inviteUserToSchool } from "@/services";

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
	const [rootError, setRootError] = useState<string | null>(null);

	const inviteForm = form.useForm({
		mode: "controlled",
		initialValues: { username: "", role: "teacher" as "teacher" | "admin" },
		validate: {
			username: (value) => {
				const username = value.trim();

				if (username.length < 3)
					return "O nome de usuário deve ter pelo menos 3 caracteres.";
				if (username.length > 30)
					return "O nome de usuário pode ter no máximo 30 caracteres.";
				if (!/^[a-z0-9._-]+$/.test(username))
					return "Use apenas letras minúsculas, números, pontos, traços ou sublinhados.";
				return null;
			},
			role: (value) =>
				value === "teacher" || value === "admin"
					? null
					: "O usuário deve ser administrador ou professor.",
		},
	});

	async function onSubmit(values: typeof inviteForm.values) {
		setRootError(null);

		try {
			await inviteUserToSchool({
				username: values.username.trim(),
				role: values.role,
				school_id: school.id,
			});
			inviteForm.reset();
			await revalidate();
		} catch {
			setRootError("Não foi possível convidar o usuário.");
		}
	}

	return (
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={1}>
					Convidar Usuário para {school.trade_name || school.legal_name}
				</UI.Title>
				<UI.Divider />

				<form onSubmit={inviteForm.onSubmit(onSubmit)} noValidate>
					<UI.Grid align="flex-start">
						<UI.Grid.Col span={{ base: 12, md: 6 }}>
							<UI.TextInput
								autoComplete="username"
								placeholder="Digite o nome de usuário"
								leftSection={<Icon.AtSign size={18} />}
								{...inviteForm.getInputProps("username")}
							/>
						</UI.Grid.Col>

						<UI.Grid.Col span={{ base: 12, md: 3 }}>
							<Select
								aria-label="Cargo"
								value={inviteForm.values.role}
								onChange={(value) =>
									inviteForm.setFieldValue(
										"role",
										value === "admin" ? "admin" : "teacher",
									)
								}
								options={[
									{ value: "teacher", label: "Professor" },
									{ value: "admin", label: "Administrador" },
								]}
								w="100%"
							/>
							{inviteForm.errors.role && (
								<UI.Text size="sm" c="red" mt={4}>
									{inviteForm.errors.role}
								</UI.Text>
							)}
						</UI.Grid.Col>

						<UI.Grid.Col span={{ base: 12, md: 3 }}>
							<UI.Button
								type="submit"
								fullWidth
								loading={inviteForm.submitting}
								disabled={!inviteForm.values.username.trim()}
							>
								{inviteForm.submitting ? "Convidando..." : "Convidar"}
							</UI.Button>
						</UI.Grid.Col>
					</UI.Grid>

					{rootError && <UI.Alert mt="md">{rootError}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}