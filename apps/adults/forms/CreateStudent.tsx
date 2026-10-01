import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
import { type CreateStudentOutput, createStudentSchema } from "@/schemas";
import { createStudent } from "@/services";

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
		<section className="ui-card">
			<header>
				<h2 className="text-(2xl heading) font-bold">
					Criar Alunos em {classData.name}
				</h2>
				<HorizontalSeparator />
			</header>

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="
					flex-(~ col) sm:flex-row items-center
					gap-x-4 gap-y-2 py-3
				"
			>
				<div className="flex-(~ row) relative items-center font-bold w-full">
					<Icon
						icon="i-lucide-baby"
						color="muted"
						size={6}
						className="absolute left-3 pointer-events-none"
					/>

					<input
						type="text"
						{...register("names")}
						placeholder="Digite um ou mais nomes, separados por vírgula"
						aria-invalid={Boolean(errors.names)}
						className="ui-field w-full h-14 pl-10"
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting || !namesValue}
					className="ui-button-(~ primary) h-14 mt-4 sm:(mt-0 w-40)"
				>
					{isSubmitting
						? "Criando..."
						: `Criar ${studentCount > 1 ? "Alunos" : "Aluno"}`}
				</button>
			</form>

			{errors.names && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.names.message}
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
