import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { Select } from "@/layouts/SchoolLayout";
import { type getSchoolById, inviteUserToSchool } from "@/services";

export function InviteUserForm({
	school,
}: {
	school: Awaited<ReturnType<typeof getSchoolById>>;
}) {
	const { revalidate } = useRevalidator();
	const [rootError, setRootError] = useState<string | null>(null);

	const inviteForm = form.useForm({
		mode: "uncontrolled",
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
				<UI.Title order={2}>Convidar Usuário</UI.Title>

				<form onSubmit={inviteForm.onSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.Flex
							direction={{ base: "column", md: "row" }}
							align="stretch"
							gap="md"
						>
							<UI.TextInput
								flex={2}
								autoComplete="username"
								placeholder="Digite o nome de usuário"
								leftSection={<Icon.AtSign size={18} />}
								{...inviteForm.getInputProps("username")}
							/>

							<UI.Stack gap={4} flex={1}>
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
									<UI.Text size="sm" c="red">
										{inviteForm.errors.role}
									</UI.Text>
								)}
							</UI.Stack>

							<UI.Button
								type="submit"
								w={{ base: "100%", md: 160 }}
								loading={inviteForm.submitting}
								disabled={!inviteForm.values.username.trim()}
							>
								{inviteForm.submitting ? "Convidando..." : "Convidar"}
							</UI.Button>
						</UI.Flex>

						{rootError && <UI.Alert>{rootError}</UI.Alert>}
					</UI.Stack>

					{rootError && <UI.Alert mt="md">{rootError}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
