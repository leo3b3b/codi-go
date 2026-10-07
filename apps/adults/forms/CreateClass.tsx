import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import { type CreateClassOutput, createClassSchema } from "@/schemas";
import { createClass } from "@/services";

export function CreateClassForm({
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
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CreateClassOutput>({
		resolver: valibotResolver(createClassSchema),
	});

	async function onSubmit({ name }: CreateClassOutput) {
		try {
			await createClass({
				name,
				school_id: school.id,
			});

			reset();
			await revalidate();
		} catch {
			setError("root", {
				message: "Não foi possível criar a turma.",
			});
		}
	}

	return (
		<M.Paper>
			<M.Stack gap="lg">
				<M.Title order={1}>
					Criar Turma em {school.trade_name || school.legal_name}
				</M.Title>

				<M.Divider />

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<M.Group
						align="flex-start"
						gap="md"
						wrap="nowrap"
					>
						<M.TextInput
							flex={1}
							size="lg"
							leftSection={<Icon.School size={18} />}
							placeholder="Digite o nome da turma"
							{...register("name")}
							error={errors.name?.message}
						/>

						<M.Button
							type="submit"
							size="lg"
							w={160}
							loading={isSubmitting}
							disabled={!watch("name")}
						>
							{isSubmitting ? "Criando..." : "Criar Turma"}
						</M.Button>
					</M.Group>

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
