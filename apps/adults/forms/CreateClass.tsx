import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rootError, setRootError] = useState<string | null>(null);

	const classForm = form.useForm({
		mode: "uncontrolled",
		initialValues: {
			name: "",
		},
		validate: {
			name: (value) =>
				value.trim().length === 0 ? "O nome da turma é obrigatório." : null,
		},
	});

	async function onSubmit({ name }: typeof classForm.values) {
		setIsSubmitting(true);
		setRootError(null);

		try {
			await createClass({
				name: name.trim(),
				school_id: school.id,
			});

			classForm.reset();
			await revalidate();
		} catch {
			setRootError("Não foi possível criar a turma.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<UI.Paper>
			<UI.Stack gap="lg">
				<UI.Title order={1}>
					Criar Turma em {school.trade_name || school.legal_name}
				</UI.Title>

				<UI.Divider />

				<form onSubmit={classForm.onSubmit(onSubmit)} noValidate>
					<UI.Group align="flex-start" gap="md" wrap="nowrap">
						<UI.TextInput
							key={classForm.key("name")}
							flex={1}
							size="lg"
							leftSection={<Icon.School size={18} />}
							placeholder="Digite o nome da turma"
							{...classForm.getInputProps("name")}
						/>

						<UI.Button
							type="submit"
							size="lg"
							w={160}
							loading={isSubmitting}
							disabled={!classForm.getValues().name}
						>
							{isSubmitting ? "Criando..." : "Criar Turma"}
						</UI.Button>
					</UI.Group>

					{rootError && <UI.Alert mt="md">{rootError}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
