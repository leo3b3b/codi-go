import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import { Select } from "@/components";
import { type InviteOutput, inviteSchema } from "@/schemas";
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
		<M.Paper>
			<M.Stack gap="lg">
				<M.Title order={1}>
					Convidar Usuário para {school.trade_name || school.legal_name}
				</M.Title>

				<M.Divider />

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<M.Grid align="flex-start">
						<M.Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
							<M.TextInput
								autoComplete="username"
								placeholder="Digite o nome do usuário"
								leftSection={<Icon.AtSign size={18} />}
								{...register("username")}
								error={errors.username?.message}
							/>
						</M.Grid.Col>

						<M.Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
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
								<M.Text size="sm" c="red" mt={4}>
									{errors.role.message}
								</M.Text>
							)}
						</M.Grid.Col>

						<M.Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
							<M.Button
								type="submit"
								fullWidth
								loading={isSubmitting}
								disabled={!watch("username")}
							>
								{isSubmitting ? "Convidando..." : "Convidar"}
							</M.Button>
						</M.Grid.Col>
					</M.Grid>

					{errors.root && (
						<M.Alert mt="md">
							{errors.root.message}
						</M.Alert>
					)}
				</form>
			</M.Stack>
		</M.Paper>
	);
}
