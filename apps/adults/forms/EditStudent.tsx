import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as UI from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Icon from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useRevalidator } from "react-router";
import { type UpdateStudentOutput, updateStudentSchema } from "@/schemas";
import { deleteStudent, generateImageCode, updateStudent } from "@/services";

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

	const initialValues: UpdateStudentOutput = {
		name: student.name,
		access_code: student.access_code as ImageCode,
	};

	const {
		register,
		handleSubmit,
		setError,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<UpdateStudentOutput>({
		resolver: valibotResolver(updateStudentSchema),
		defaultValues: initialValues,
	});

	const currentValues = watch();

	const isUnchanged =
		currentValues.name === initialValues.name &&
		currentValues.access_code === initialValues.access_code;

	function handleGenerateAccessCode() {
		setValue("access_code", generateImageCode(), {
			shouldDirty: true,
			shouldValidate: true,
		});
	}

	async function handleDeleteStudent({
		student_id,
		student_name,
	}: {
		student_id: string;
		student_name: string;
	}) {
		setIsDeleting(true);
		const confirmed = window.confirm(
			`Tem certeza de que quer excluir ${student_name} e todos os seus registros? Essa ação é irreversível!`,
		);
		if (!confirmed) return;

		await deleteStudent(student_id);
		setIsDeleting(false);
		revalidate();
	}

	function handleBack() {
		navigate(-1);
	}

	async function onSubmit({ name, access_code }: UpdateStudentOutput) {
		try {
			await updateStudent({
				student_id: student.id,
				name,
				access_code,
			});

			await revalidate();
		} catch {
			setError("root", {
				message: "Não foi possível salvar as alterações do aluno.",
			});
		}
	}

	const accessCode = currentValues.access_code as ImageCode;
	const imageCode = imageCodes[accessCode];

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

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<UI.Stack gap="lg">
						<UI.TextInput
							label="Nome do Aluno"
							autoComplete="off"
							{...register("name")}
							error={errors.name?.message}
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
									value={imageCodes[watch("access_code")].label}
									readOnly
									error={errors.access_code?.message}
									rightSection={
										<UI.ActionIcon
											variant="default"
											aria-label="Gerar nova credencial"
											onClick={handleGenerateAccessCode}
										>
											<Icon.Shuffle size={18} />
										</UI.ActionIcon>
									}
								/>
							</UI.Group>
						</UI.Stack>

						{errors.root && <UI.Alert>{errors.root.message}</UI.Alert>}

						<UI.Group gap="sm" mt="xs">
							<UI.Button
								type="submit"
								flex={1}
								loading={isSubmitting}
								disabled={isUnchanged || isDeleting}
								leftSection={<Icon.Save size={18} />}
							>
								{isSubmitting ? "Salvando..." : "Salvar Alterações"}
							</UI.Button>

							<UI.Button
								type="button"
								flex={1}
								color="red"
								loading={isDeleting}
								disabled={isSubmitting}
								leftSection={<Icon.Trash2 size={18} />}
								onClick={() =>
									handleDeleteStudent({
										student_id: student.id,
										student_name: student.name,
									})
								}
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
