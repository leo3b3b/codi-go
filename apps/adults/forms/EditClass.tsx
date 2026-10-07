import { valibotResolver } from "@hookform/resolvers/valibot";
import * as M from "@mantine/core";
import * as Icon from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useRevalidator } from "react-router";
import { type UpdateClassOutput, updateClassSchema } from "@/schemas";
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

					<M.Title order={1} style={{ overflowWrap: "anywhere" }}>
						{classData.name}
					</M.Title>
				</M.Group>

				<M.Divider />

				{classData.is_playing && (
					<M.Alert color="red">
						Esta turma está em atividade e não pode ser editada no momento.
					</M.Alert>
				)}

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<M.Stack gap="md">
						<M.SimpleGrid cols={{ base: 1, md: 2 }}>
							<M.TextInput
								label="Nome da Turma"
								autoComplete="off"
								disabled={classData.is_playing}
								{...register("name")}
								error={errors.name?.message}
							/>

							<M.TextInput
								label="Professor Responsável"
								placeholder="Nome de usuário do professor"
								autoComplete="off"
								leftSection={<Icon.AtSign size={16} />}
								disabled={classData.is_playing}
								{...register("teacher_username")}
								error={errors.teacher_username?.message}
							/>

							<M.TextInput
								label="Código de Acesso"
								readOnly
								disabled={classData.is_playing}
								rightSection={
									<M.ActionIcon
										variant="default"
										aria-label="Gerar novo código de acesso"
										disabled={classData.is_playing}
										onClick={handleGenerateAccessCode}
									>
										<Icon.Shuffle size={18} />
									</M.ActionIcon>
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

							<M.Group
								gap="sm"
								align="stretch"
								mt={{ base: 0, md: "xl" }}
							>
								<M.Button
									type="submit"
									flex={1}
									loading={isSubmitting}
									disabled={
										isUnchanged ||
										isDeleting ||
										classData.is_playing
									}
									leftSection={<Icon.Save size={18} />}
								>
									{isSubmitting ? "Salvando..." : "Salvar Alterações"}
								</M.Button>

								<M.Button
									type="button"
									flex={1}
									color="red"
									loading={isDeleting}
									disabled={
										isSubmitting ||
										classData.is_playing
									}
									leftSection={<Icon.Trash2 size={18} />}
									onClick={handleDeleteClass}
								>
									{isDeleting ? "Excluindo..." : "Excluir Turma"}
								</M.Button>
							</M.Group>
						</M.SimpleGrid>

						{errors.root && (
							<M.Alert>
								{errors.root.message}
							</M.Alert>
						)}
					</M.Stack>
				</form>
			</M.Stack>
		</M.Paper>
	);
}
