import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { deleteStudent, generateImageCode, updateStudent } from "@/services";

const imageCodeValues = Object.keys(imageCodes) as [ImageCode, ...ImageCode[]];
const studentNameRegex = /^\p{L}+(?: +\p{L}+)*$/u;

export function EditStudentForm({
	student,
}: {
	student: {
		id: string;
		name: string;
		access_code: string;
	};
}) {
	const { revalidate } = useRevalidator();
	const navigate = useNavigate();
	const [isDeleting, setIsDeleting] = useState(false);
	const [rootError, setRootError] = useState<string | null>(null);

	const studentForm = form.useForm({
		mode: "controlled",
		initialValues: {
			name: student.name,
			access_code: student.access_code as ImageCode,
		},
		validate: {
			name: (value) =>
				!value.trim()
					? "O nome do aluno é obrigatório."
					: !studentNameRegex.test(value.trim())
						? "O nome deve conter apenas letras e espaços."
						: null,
			access_code: (value) =>
				imageCodeValues.includes(value)
					? null
					: "O código de acesso deve ser uma imagem válida.",
		},
	});

	const imageCode = imageCodes[studentForm.values.access_code];

	function handleBack() {
		navigate(-1);
	}

	async function handleDeleteStudent() {
		const confirmed = window.confirm(
			`Tem certeza de que quer excluir ${student.name} e todos os seus registros? Essa ação é irreversível!`,
		);
		if (!confirmed) return;

		setIsDeleting(true);
		try {
			await deleteStudent(student.id);
			handleBack();
		} finally {
			setIsDeleting(false);
		}
	}

	async function onSubmit(values: typeof studentForm.values) {
		setRootError(null);
		try {
			await updateStudent({
				student_id: student.id,
				name: values.name.trim(),
				access_code: values.access_code,
			});
			studentForm.setInitialValues(studentForm.getValues());
			studentForm.resetDirty();
			await revalidate();
		} catch {
			setRootError("Não foi possível salvar as alterações do aluno.");
		}
	}

	return (
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Group gap="sm" wrap="nowrap">
					<UI.ActionIcon
						variant="default"
						size="lg"
						aria-label="Voltar para turmas"
						onClick={handleBack}
					>
						<Icon.ArrowLeft size={20} />
					</UI.ActionIcon>
					<UI.Title order={1}>Editar Aluno</UI.Title>
				</UI.Group>

				<UI.Divider />

				<form onSubmit={studentForm.onSubmit(onSubmit)} noValidate>
					<UI.Stack gap="lg">
						<UI.TextInput
							label="Nome do Aluno"
							autoComplete="off"
							{...studentForm.getInputProps("name")}
						/>

						<UI.Stack gap="xs">
							<UI.Text fw={700} size="sm">
								Credencial
							</UI.Text>
							<UI.Group align="center" gap="md" wrap="nowrap">
								{imageCode && (
									<UI.Image
										src={imageCode.src}
										alt={imageCode.label}
										h={80}
										w={80}
										fit="contain"
									/>
								)}
								<UI.TextInput
									flex={1}
									value={imageCode?.label ?? ""}
									readOnly
									error={studentForm.errors.access_code}
									rightSection={
										<UI.ActionIcon
											variant="default"
											aria-label="Gerar nova credencial"
											onClick={() =>
												studentForm.setFieldValue(
													"access_code",
													generateImageCode(),
												)
											}
										>
											<Icon.Shuffle size={18} />
										</UI.ActionIcon>
									}
								/>
							</UI.Group>
						</UI.Stack>

						{rootError && <UI.Alert>{rootError}</UI.Alert>}

						<UI.Group gap="sm" mt="xs">
							<UI.Button
								type="submit"
								flex={1}
								loading={studentForm.submitting}
								disabled={!studentForm.isDirty() || isDeleting}
								leftSection={<Icon.Save size={18} />}
							>
								{studentForm.submitting ? "Salvando..." : "Salvar Alterações"}
							</UI.Button>
							<UI.Button
								type="button"
								flex={1}
								loading={isDeleting}
								disabled={studentForm.submitting}
								leftSection={<Icon.Trash2 size={18} />}
								onClick={handleDeleteStudent}
							>
								{isDeleting ? "Excluindo..." : "Excluir Aluno"}
							</UI.Button>
						</UI.Group>
					</UI.Stack>
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}