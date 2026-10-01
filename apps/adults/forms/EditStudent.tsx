import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useRevalidator } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
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
		<section className="ui-card">
			<header className="flex-(~ row) items-center gap-3">
				<button
					type="button"
					onClick={handleBack}
					aria-label="Voltar para turmas"
					className="ui-button-(~ secondary) w-auto p-3"
				>
					<Icon icon="i-lucide-arrow-left" color="fg" size={6} />
				</button>

				<h1 className="text-(2xl heading) font-bold">Editar Aluno</h1>
			</header>
			<HorizontalSeparator />

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex-(~ col) gap-5"
			>
				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Nome do Aluno</span>

					<input
						type="text"
						{...register("name")}
						autoComplete="off"
						aria-invalid={Boolean(errors.name)}
						className="ui-field"
					/>

					{errors.name && (
						<p role="alert" className="text-(sm danger) font-medium">
							{errors.name.message}
						</p>
					)}
				</label>

				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Credencial</span>

					<div className="flex-(~ row) items-center gap-4">
						{imageCode && (
							<img
								src={imageCode.src}
								alt={imageCode.label}
								className="h-20 w-20 object-contain"
							/>
						)}

						<div className="flex-(~ row) gap-2 flex-1">
							<input
								type="text"
								value={imageCodes[watch("access_code")].label}
								readOnly
								aria-invalid={Boolean(errors.access_code)}
								className="ui-field flex-1"
							/>

							<button
								type="button"
								onClick={handleGenerateAccessCode}
								aria-label="Gerar nova credencial"
								className="ui-button-(~ secondary) w-auto px-4"
							>
								<Icon icon="i-lucide-shuffle" color="fg" size={6} />
							</button>
						</div>
					</div>

					{errors.access_code && (
						<p role="alert" className="text-(sm danger) font-medium">
							{errors.access_code.message}
						</p>
					)}
				</label>

				{errors.root && (
					<p role="alert" className="ui-alert-danger">
						{errors.root.message}
					</p>
				)}

				<div className="flex-(~ row) items-center gap-2 mt-2 h-16">
					<button
						type="submit"
						disabled={isSubmitting || isUnchanged || isDeleting}
						className="ui-button-(~ primary) h-full"
					>
						<Icon icon="i-lucide-save" color="on-primary" size={5} />
						{isSubmitting ? "Salvando..." : "Salvar Alterações"}
					</button>
					<button
						type="button"
						disabled={isSubmitting || isDeleting}
						className="ui-button-(~ danger) h-full"
						onClick={() =>
							handleDeleteStudent({
								student_id: student.id,
								student_name: student.name,
							})
						}
					>
						<Icon icon="i-lucide-trash" color="on-danger" size={5} />
						{isDeleting ? "Excluindo..." : "Excluir Aluno"}
					</button>
				</div>
			</form>
		</section>
	);
}
