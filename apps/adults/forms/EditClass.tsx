import { UI } from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Icon from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useRevalidator } from "react-router";
import * as v from "valibot";
import {
	deleteClass,
	generateClassAccessCode,
	getUserIdByUsername,
	updateClass,
} from "@/services";

const updateClassSchema = v.object({
	name: v.pipe(
		v.string("O nome da turma deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome da turma não pode estar vazio."),
	),
	teacher_username: v.optional(
		v.union([
			v.literal(""),
			v.pipe(
				v.string("O nome de usuário deve ser um texto."),
				v.trim(),
				v.minLength(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
				v.maxLength(30, "O nome de usuário pode ter no máximo 30 caracteres."),
				v.regex(
					/^[a-z0-9._-]+$/,
					"Use apenas letras minúsculas, números, pontos, traços ou sublinhados.",
				),
			),
		]),
	),
	access_code: v.pipe(
		v.string("O código de acesso deve ser um texto."),
		v.length(6, "O código de acesso deve ter 6 caracteres."),
		v.regex(
			/^[A-Z]{6}$/,
			"O código de acesso deve conter apenas letras maiúsculas.",
		),
	),
});

type UpdateClassOutput = v.InferOutput<typeof updateClassSchema>;

export function EditClassForm({
	classData,
}: {
	classData: {
		teacher_username: string | null;
		id: string;
		name: string;
		access_code: string;
		is_playing: boolean;
		school_id: string;
		teacher_id: string | null;
	};
}) {
	const navigate = useNavigate();
	const { revalidate } = useRevalidator();
	const [isDeleting, setIsDeleting] = useState(false);

	const initialValues: UpdateClassOutput = {
		name: classData.name,
		teacher_username: classData.teacher_username ?? "",
		access_code: classData.access_code ?? "",
	};

	const {
		register,
		handleSubmit,
		setError,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<UpdateClassOutput>({
		resolver: valibotResolver(updateClassSchema),
		defaultValues: initialValues,
	});

	const currentValues = watch();

	const isUnchanged =
		currentValues.name === initialValues.name &&
		currentValues.teacher_username === initialValues.teacher_username &&
		currentValues.access_code === initialValues.access_code;

	function handleGenerateAccessCode() {
		setValue("access_code", generateClassAccessCode(), {
			shouldDirty: true,
			shouldValidate: true,
		});
	}

	function handleBack() {
		navigate(-1);
	}

	async function handleDeleteClass() {
		setIsDeleting(true);
		const confirmed = window.confirm(
			classData.name
				? `Tem certeza de que quer deletar a turma ${classData.name}? Essa ação é irreversível!`
				: "Tem certeza de que quer deletar esta turma? Essa ação é irreversível!",
		);
		if (!confirmed) return;

		await deleteClass(classData.id);
		setIsDeleting(false);
		handleBack();
	}

	async function onSubmit({
		name,
		teacher_username,
		access_code,
	}: UpdateClassOutput) {
		try {
			const teacher_id = teacher_username
				? await getUserIdByUsername(teacher_username)
				: null;

			await updateClass({
				class_id: classData.id,
				name,
				teacher_id,
				access_code,
			});

			await revalidate();
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("getUserIdByUsername")
			) {
				setError("teacher_username", {
					message: "Professor não encontrado.",
				});
				return;
			}

			setError("root", {
				message: "Não foi possível salvar as alterações da turma.",
			});
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

					<UI.Title order={1} style={{ overflowWrap: "anywhere" }}>
						{classData.name}
					</UI.Title>
				</UI.Group>

				<UI.Divider />

				{classData.is_playing && (
					<UI.Alert color="red">
						Esta turma está em atividade e não pode ser editada no momento.
					</UI.Alert>
				)}

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.SimpleGrid cols={{ base: 1, md: 2 }}>
							<UI.TextInput
								label="Nome da Turma"
								autoComplete="off"
								disabled={classData.is_playing}
								{...register("name")}
								error={errors.name?.message}
							/>

							<UI.TextInput
								label="Professor Responsável"
								placeholder="Nome de usuário do professor"
								autoComplete="off"
								leftSection={<Icon.AtSign size={16} />}
								disabled={classData.is_playing}
								{...register("teacher_username")}
								error={errors.teacher_username?.message}
							/>

							<UI.TextInput
								label="Código de Acesso"
								readOnly
								disabled={classData.is_playing}
								rightSection={
									<UI.ActionIcon
										variant="default"
										aria-label="Gerar novo código de acesso"
										disabled={classData.is_playing}
										onClick={handleGenerateAccessCode}
									>
										<Icon.Shuffle size={18} />
									</UI.ActionIcon>
								}
								styles={{
									input: {
										fontFamily: "monospace",
										letterSpacing: "0.15em",
										textTransform: "uppercase",
									},
								}}
								{...register("access_code")}
								error={errors.access_code?.message}
							/>

							<UI.Group gap="sm" align="stretch" mt={{ base: 0, md: "xl" }}>
								<UI.Button
									type="submit"
									flex={1}
									loading={isSubmitting}
									disabled={isUnchanged || isDeleting || classData.is_playing}
									leftSection={<Icon.Save size={18} />}
								>
									{isSubmitting ? "Salvando..." : "Salvar Alterações"}
								</UI.Button>

								<UI.Button
									type="button"
									flex={1}
									color="red"
									loading={isDeleting}
									disabled={isSubmitting || classData.is_playing}
									leftSection={<Icon.Trash2 size={18} />}
									onClick={handleDeleteClass}
								>
									{isDeleting ? "Excluindo..." : "Excluir Turma"}
								</UI.Button>
							</UI.Group>
						</UI.SimpleGrid>

						{errors.root && <UI.Alert>{errors.root.message}</UI.Alert>}
					</UI.Stack>
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
