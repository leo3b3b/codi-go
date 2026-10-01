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

	async function onSubmit({ name }: CreateStudentOutput) {
		try {
			await createStudent({
				name,
				class_id: classData.id,
				school_id: classData.school_id,
			});

			reset();
			await revalidate();
		} catch {
			setError("root", {
				message: "Não foi possível criar o aluno.",
			});
		}
	}

	return (
		<section className="ui-card">
			<header>
				<h2 className="text-(2xl heading) font-bold">
					Criar Aluno em {classData.name}
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
						{...register("name")}
						placeholder="Digite o nome do aluno"
						aria-invalid={Boolean(errors.name)}
						className="ui-field w-full h-14 pl-10"
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting || !watch("name")}
					className="ui-button-(~ primary) h-14 mt-4 sm:(mt-0 w-40)"
				>
					{isSubmitting ? "Criando..." : "Criar Aluno"}
				</button>
			</form>

			{errors.name && (
				<p role="alert" className="text-(sm danger) font-medium">
					{errors.name.message}
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
