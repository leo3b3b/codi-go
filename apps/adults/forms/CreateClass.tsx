import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
import { type CreateClassOutput, createClassSchema } from "@/schemas";
import { createClass } from "@/services";

export function CreateClassForm({
	school,
}: {
	school: {
		id: string;
		legal_name: string;
		trade_name: string;
		cnpj: string;
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
	} = useForm<CreateClassOutput>({
		resolver: valibotResolver(createClassSchema),
	});

	async function onSubmit({ name }: CreateClassOutput) {
		try {
			await createClass({
				name,
				school_id: school.id,
			});

			reset();
			await revalidate();
		} catch {
			setError("root", {
				message: "Não foi possível criar a turma.",
			});
		}
	}

	return (
		<section className="ui-card">
			<header>
				<h1 className="text-(2xl heading) font-bold">
					Criar Turma em {school.trade_name || school.legal_name}
				</h1>
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
						icon="i-lucide-school"
						color="muted"
						size={6}
						className="absolute left-3 pointer-events-none"
					/>

					<input
						type="text"
						{...register("name")}
						placeholder="Digite o nome da turma"
						aria-invalid={Boolean(errors.name)}
						className="ui-field w-full h-14 pl-10"
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting || !watch("name")}
					className="ui-button-(~ primary) h-14 mt-4 sm:(mt-0 w-40)"
				>
					{isSubmitting ? "Criando..." : "Criar Turma"}
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
