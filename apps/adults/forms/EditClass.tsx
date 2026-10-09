import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import {
	deleteClass,
	generateClassAccessCode,
	getUserIdByUsername,
	updateClass,
} from "@/services";

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
	const [rootError, setRootError] = useState<string | null>(null);

	const classForm = form.useForm({
		mode: "controlled",
		initialValues: {
			name: classData.name,
			teacher_username: classData.teacher_username ?? "",
			access_code: classData.access_code ?? "",
		},
		validate: {
			name: (value) =>
				value.trim() ? null : "O nome da turma não pode estar vazio.",
			teacher_username: (value) => {
				if (value === "") return null;
				const username = value.trim();

				if (username.length < 3)
					return "O nome de usuário deve ter pelo menos 3 caracteres.";
				if (username.length > 30)
					return "O nome de usuário pode ter no máximo 30 caracteres.";
				if (!/^[a-z0-9._-]+$/.test(username))
					return "Use apenas letras minúsculas, números, pontos, traços ou sublinhados.";
				return null;
			},
			access_code: (value) =>
				/^[A-Z]{6}$/.test(value)
					? null
					: value.length !== 6
						? "O código de acesso deve ter 6 caracteres."
						: "O código de acesso deve conter apenas letras maiúsculas.",
		},
	});

	function handleBack() {
		navigate(-1);
	}

	async function handleDeleteClass() {
		const confirmed = window.confirm(
			`Tem certeza de que quer deletar a turma ${classData.name || ""}? Essa ação é irreversível!`,
		);
		if (!confirmed) return;

		setIsDeleting(true);
		try {
			await deleteClass(classData.id);
			handleBack();
		} finally {
			setIsDeleting(false);
		}
	}

	async function onSubmit(values: typeof classForm.values) {
		setRootError(null);

		try {
			const teacherUsername = values.teacher_username.trim();
			let teacher_id: string | null = null;

			if (teacherUsername) {
				try {
					teacher_id = await getUserIdByUsername(teacherUsername);
				} catch {
					classForm.setFieldError(
						"teacher_username",
						"Professor não encontrado.",
					);
					return;
				}
			}

			await updateClass({
				class_id: classData.id,
				name: values.name.trim(),
				teacher_id,
				access_code: values.access_code,
			});

			classForm.setInitialValues(classForm.getValues());
			classForm.resetDirty();
			await revalidate();
		} catch {
			setRootError("Não foi possível salvar as alterações da turma.");
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
					<UI.Alert>
						Esta turma está em atividade e não pode ser editada no momento.
					</UI.Alert>
				)}

				<form onSubmit={classForm.onSubmit(onSubmit)} noValidate>
					<UI.Stack gap="md">
						<UI.SimpleGrid cols={{ base: 1, md: 2 }}>
							<UI.TextInput
								label="Nome da Turma"
								autoComplete="off"
								disabled={classData.is_playing}
								{...classForm.getInputProps("name")}
							/>
							<UI.TextInput
								label="Professor Responsável"
								placeholder="Nome de usuário do professor"
								autoComplete="off"
								leftSection={<Icon.AtSign size={16} />}
								disabled={classData.is_playing}
								{...classForm.getInputProps("teacher_username")}
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
										onClick={() =>
											classForm.setFieldValue(
												"access_code",
												generateClassAccessCode(),
											)
										}
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
								{...classForm.getInputProps("access_code")}
							/>
							<UI.Group gap="sm" align="stretch" mt={{ base: 0, md: "lg" }}>
								<UI.Button
									type="submit"
									flex={1}
									loading={classForm.submitting}
									disabled={
										!classForm.isDirty() || isDeleting || classData.is_playing
									}
									leftSection={<Icon.Save size={18} />}
								>
									{classForm.submitting ? "Salvando..." : "Salvar Alterações"}
								</UI.Button>
								<UI.Button
									type="button"
									flex={1}
									color="red"
									loading={isDeleting}
									disabled={classForm.submitting || classData.is_playing}
									leftSection={<Icon.Trash2 size={18} />}
									onClick={handleDeleteClass}
								>
									{isDeleting ? "Excluindo..." : "Excluir Turma"}
								</UI.Button>
							</UI.Group>
						</UI.SimpleGrid>

						{rootError && <UI.Alert>{rootError}</UI.Alert>}
					</UI.Stack>
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
