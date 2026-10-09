import { Icon, UI } from "@codi-go/ui";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { useRevalidator } from "react-router";
import * as v from "valibot";
import { createClass } from "@/services";

const createClassSchema = v.object({
	name: v.pipe(
		v.string("O nome da turma deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome da turma é obrigatório."),
	),
});

type CreateClassOutput = v.InferOutput<typeof createClassSchema>;

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
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={1}>
					Criar Turma em {school.trade_name || school.legal_name}
				</UI.Title>

				<UI.Divider />

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<UI.Group align="flex-start" gap="md" wrap="nowrap">
						<UI.TextInput
							flex={1}
							size="lg"
							leftSection={<Icon.School size={18} />}
							placeholder="Digite o nome da turma"
							{...register("name")}
							error={errors.name?.message}
						/>

						<UI.Button
							type="submit"
							size="lg"
							w={160}
							loading={isSubmitting}
							disabled={!watch("name")}
						>
							{isSubmitting ? "Criando..." : "Criar Turma"}
						</UI.Button>
					</UI.Group>

					{errors.root && <UI.Alert mt="md">{errors.root.message}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
