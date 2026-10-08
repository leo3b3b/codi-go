import { UI } from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Icon from "lucide-react";
import { useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import * as v from "valibot";
import { createStudent } from "@/services";

const studentNameRegex =
	/^\p{L}+(?: +\p{L}+)*(?:\s*,\s*\p{L}+(?: +\p{L}+)*)*$/u;

const createStudentSchema = v.object({
	names: v.pipe(
		v.string("Os nomes dos alunos devem ser um texto."),
		v.trim(),
		v.nonEmpty("O nome do aluno é obrigatório."),
		v.regex(
			studentNameRegex,
			"Os nomes devem conter apenas letras e espaços, separados por vírgulas.",
		),
	),
});

type CreateStudentOutput = v.InferOutput<typeof createStudentSchema>;

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
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={2}>Criar Alunos em {classData.name}</UI.Title>

				<UI.Divider />

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<UI.Group align="flex-start" gap="md" wrap="nowrap">
						<UI.TextInput
							flex={1}
							size="lg"
							leftSection={<Icon.Baby size={18} />}
							placeholder="Digite um ou mais nomes, separados por vírgula"
							{...register("names")}
							error={errors.names?.message}
						/>

						<UI.Button
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
						</UI.Button>
					</UI.Group>

					{errors.root && <UI.Alert mt="md">{errors.root.message}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
