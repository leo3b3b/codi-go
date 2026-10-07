import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
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
		<M.Paper>
			<M.Stack gap="lg">
				<M.Group gap="sm" wrap="nowrap">
					<M.ActionIcon
						variant="default"
						size="lg"
						aria-label="Voltar para turmas"
						onClick={handleBack}
					>
						<Icon.ArrowLeft size={20} />
					</M.ActionIcon>

					<M.Title order={1}>Editar Aluno</M.Title>
				</M.Group>

				<M.Divider />

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<M.Stack gap="lg">
						<M.TextInput
							label="Nome do Aluno"
							autoComplete="off"
							{...register("name")}
							error={errors.name?.message}
						/>

						<M.Stack gap="xs">
							<M.Text fw={700} size="sm">
								Credencial
							</M.Text>

							<M.Group align="center" gap="md" wrap="nowrap">
								{imageCode && (
									<M.Image
										src={imageCode.src}
										alt={imageCode.label}
										h={80}
										w={80}
										fit="contain"
									/>
								)}

								<M.TextInput
									flex={1}
									value={imageCodes[watch("access_code")].label}
									readOnly
									error={errors.access_code?.message}
									rightSection={
										<M.ActionIcon
											variant="default"
											aria-label="Gerar nova credencial"
											onClick={handleGenerateAccessCode}
										>
											<Icon.Shuffle size={18} />
										</M.ActionIcon>
									}
								/>
							</M.Group>
						</M.Stack>

						{errors.root && (
							<M.Alert>
								{errors.root.message}
							</M.Alert>
						)}

						<M.Group gap="sm" mt="xs">
							<M.Button
								type="submit"
								flex={1}
								loading={isSubmitting}
								disabled={isUnchanged || isDeleting}
								leftSection={<Icon.Save size={18} />}
							>
								{isSubmitting
									? "Salvando..."
									: "Salvar Alterações"}
							</M.Button>

							<M.Button
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
							</M.Button>
						</M.Group>
					</M.Stack>
				</form>
			</M.Stack>
		</M.Paper>
	);
}
