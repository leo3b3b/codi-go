import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { createStudent } from "@/services";

const studentNameRegex =
	/^\p{L}+(?: +\p{L}+)*(?:\s*,\s*\p{L}+(?: +\p{L}+)*)*$/u;

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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rootError, setRootError] = useState<string | null>(null);

	const studentForm = form.useForm({
		mode: "uncontrolled",
		initialValues: {
			names: "",
		},
		validate: {
			names: (value) => {
				if (!value.trim()) return "O nome do aluno é obrigatório.";
				if (!studentNameRegex.test(value.trim()))
					return "Os nomes devem conter apenas letras e espaços, separados por vírgulas.";
				return null;
			},
		},
	});

	async function onSubmit({ names }: typeof studentForm.values) {
		setIsSubmitting(true);
		setRootError(null);

		try {
			const studentNames = names.split(",").map((name) => name.trim());

			for (const name of studentNames) {
				await createStudent({
					name,
					class_id: classData.id,
					school_id: classData.school_id,
				});
			}

			studentForm.reset();
			await revalidate();
		} catch {
			setRootError("Não foi possível criar o aluno.");
		} finally {
			setIsSubmitting(false);
		}
	}

	const namesValue = studentForm.getValues().names;
	const studentCount = namesValue
		.split(",")
		.map((name) => name.trim())
		.filter(Boolean).length;

	return (
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={2}>Criar Alunos em {classData.name}</UI.Title>
				<UI.Divider />

				<form onSubmit={studentForm.onSubmit(onSubmit)} noValidate>
					<UI.Group align="flex-start" gap="md" wrap="nowrap">
						<UI.TextInput
							key={studentForm.key("names")}
							flex={1}
							size="lg"
							leftSection={<Icon.Baby size={18} />}
							placeholder="Digite um ou mais nomes, separados por vírgula"
							{...studentForm.getInputProps("names")}
						/>

						<UI.Button
							type="submit"
							size="lg"
							w={160}
							mt={0}
							loading={isSubmitting}
							disabled={!namesValue}
						>
							{isSubmitting ? "Criando..." : `Criar ${studentCount > 1 ? "Alunos" : "Aluno"}`}
						</UI.Button>
					</UI.Group>

					{rootError && <UI.Alert mt="md">{rootError}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
