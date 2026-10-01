import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useNavigate, useRevalidator } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
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
		navigate(`/escola/${classData.school_id}/admin/turmas`);
	}

	async function handleDeleteClass() {
		const confirmed = window.confirm(
			classData.name
				? `Tem certeza de que quer deletar a turma ${classData.name}? Essa ação é irreversível!`
				: "Tem certeza de que quer deletar esta turma? Essa ação é irreversível!",
		);
		if (!confirmed) return;

		await deleteClass(classData.id);
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

				<h1 className="text-(2xl heading) font-bold break-words">
					{classData.name}
				</h1>
			</header>

			<HorizontalSeparator />

			{classData.is_playing ? (
				<div className="ui-alert-danger mb-5">
					Esta turma está em atividade e não pode ser editada no momento.
				</div>
			) : null}

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex-(~ col) md:grid-(~ cols-2) gap-5 mb-4"
			>
				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Nome da Turma</span>

					<input
						type="text"
						{...register("name")}
						autoComplete="off"
						aria-invalid={Boolean(errors.name)}
						disabled={classData.is_playing}
						className="ui-field"
					/>
				</label>

				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Professor Responsável</span>

					<div className="relative flex items-center">
						<Icon
							icon="i-lucide-at-sign"
							color="muted"
							size={6}
							className="absolute left-3 pointer-events-none"
						/>

						<input
							type="text"
							{...register("teacher_username")}
							autoComplete="username"
							placeholder="Nome de usuário do professor"
							aria-invalid={Boolean(errors.teacher_username)}
							disabled={classData.is_playing}
							className="ui-field w-full pl-10"
						/>
					</div>
				</label>

				<label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
					<span>Código de Acesso</span>

					<div className="flex-(~ row) gap-2">
						<input
							type="text"
							{...register("access_code")}
							readOnly
							aria-invalid={Boolean(errors.access_code)}
							disabled={classData.is_playing}
							className="ui-field flex-1 font-mono tracking-widest uppercase"
						/>

						<button
							type="button"
							onClick={handleGenerateAccessCode}
							disabled={classData.is_playing}
							aria-label="Gerar novo código de acesso"
							className="ui-button-(~ secondary) w-auto px-4"
						>
							<Icon icon="i-lucide-shuffle" color="fg" size={6} />
						</button>
					</div>
				</label>

				<div className="flex-(~ row) items-center gap-2 mt-2 h-16 md:self-end">
					<button
						type="submit"
						disabled={isSubmitting || isUnchanged || classData.is_playing}
						className="ui-button-(~ primary) h-full"
					>
						<Icon icon="i-lucide-save" color="on-primary" size={5} />
						{isSubmitting ? "Salvando..." : "Salvar Alterações"}
					</button>
					<button
						type="button"
						disabled={isSubmitting || classData.is_playing}
						className="ui-button-(~ danger) h-full"
						onClick={handleDeleteClass}
					>
						<Icon icon="i-lucide-trash" color="on-danger" size={5} />
						{isSubmitting ? "Excluindo..." : "Excluir Turma"}
					</button>
				</div>
			</form>
			{errors.name && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.name.message}
				</p>
			)}
			{errors.teacher_username && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.teacher_username.message}
				</p>
			)}
			{errors.access_code && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.access_code.message}
				</p>
			)}
			{errors.root && (
				<p role="alert" className="ui-alert-danger">
					{errors.root.message}
				</p>
			)}
		</section>
	);
}
