import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import { type CreateStudentOutput, createStudentSchema } from "@/schemas";
import { createStudent } from "@/services";

export function CreateStudentForm({
	classData,
}: {
	classData: {
		name: string;
		id: string;
		school_id: string;
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
	} = useForm<CreateStudentOutput>({
		resolver: valibotResolver(createStudentSchema),
	});

	async function onSubmit({ names }: CreateStudentOutput) {
		try {
			const studentNames = names.split(",").map((name) => name.trim());

			for (const name of studentNames) {
				await createStudent({
					name,
					class_id: classData.id,
					school_id: classData.school_id,
				});
			}

			reset();
			await revalidate();
		} catch {
			setError("root", {
				message: "Não foi possível criar o aluno.",
			});
		}
	}

	const namesValue = watch("names") ?? "";

	const studentCount = namesValue
		.split(",")
		.map((name) => name.trim())
		.filter(Boolean).length;



	return (
		<M.Paper>
			<M.Stack gap="lg">
				<M.Title order={2}>
					Criar Alunos em {classData.name}
				</M.Title>

				<M.Divider />

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<M.Group
						align="flex-start"
						gap="md"
						wrap="nowrap"
					>
						<M.TextInput
							flex={1}
							size="lg"
							leftSection={<Icon.Baby size={18} />}
							placeholder="Digite um ou mais nomes, separados por vírgula"
							{...register("names")}
							error={errors.names?.message}
						/>

						<M.Button
							type="submit"
							size="lg"
							w={160}
							mt={0}
							loading={isSubmitting}
							disabled={!namesValue}
						>
							{isSubmitting
								? "Criando..."
								: `Criar ${studentCount > 1 ? "Alunos" : "Aluno"}`}
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
