import { form, Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { createClass } from "@/services";

export function CreateClassForm({ school_id }: { school_id: string }) {
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
			await createClass({ name: name.trim(), school_id });

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
				<UI.Title order={2}>Criar Turma</UI.Title>

				<form onSubmit={classForm.onSubmit(onSubmit)} noValidate>
					<UI.Flex
						direction={{ base: "column", sm: "row" }}
						align="stretch"
						gap="sm"
					>
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
							w={{ base: "100%", sm: 160 }}
							loading={isSubmitting}
							disabled={!classForm.getValues().name}
						>
							{isSubmitting ? "Criando..." : "Criar Turma"}
						</UI.Button>
					</UI.Flex>

					{rootError && <UI.Alert mt="md">{rootError}</UI.Alert>}
				</form>
			</UI.Stack>
		</UI.Paper>
	);
}
