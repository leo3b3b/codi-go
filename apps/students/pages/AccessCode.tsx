import { form, UI } from "@codi-go/ui";
import { useNavigate } from "react-router";
import { getClassByAccessCode } from "@/services";

export default function AccessCodePage() {
	const navigate = useNavigate();

	const accessCodeForm = form.useForm({
		mode: "controlled",
		initialValues: { accessCode: "" },
		validate: {
			accessCode: (value) =>
				/^[A-Z]{6}$/.test(value.trim().toUpperCase())
					? null
					: "Código de acesso inválido.",
		},
	});

	async function onSubmit({ accessCode }: typeof accessCodeForm.values) {
		const code = accessCode.trim().toUpperCase();

		try {
			await getClassByAccessCode(code);
			navigate(`/${code}`);
		} catch {
			accessCodeForm.setFieldError("accessCode", "Turma não encontrada.");
		}
	}

	return (
		<UI.Center w="100%" mih="100vh" px="md">
			<title>CodiGO! | Entrar</title>
			<UI.Stack w="100%" maw={448} gap="lg">
				<UI.Image
					src="/logo.png"
					alt="Logo do CodiGO!"
					w="auto"
					h={72}
					fit="contain"
					mx="auto"
				/>
				<UI.Paper>
					<form onSubmit={accessCodeForm.onSubmit(onSubmit)} noValidate>
						<UI.Stack gap="lg">
							<div>
								<UI.Title order={1}>Entrar em uma turma</UI.Title>
								<UI.Text size="sm" c="dimmed" mt="xs">
									Digite o código de acesso fornecido pelo professor.
								</UI.Text>
							</div>
							<UI.TextInput
								label="Código de acesso"
								placeholder="Código de acesso"
								autoComplete="off"
								maxLength={6}
								styles={{ input: { textTransform: "uppercase" } }}
								{...accessCodeForm.getInputProps("accessCode")}
							/>
							<UI.Button
								type="submit"
								fullWidth
								loading={accessCodeForm.submitting}
							>
								{accessCodeForm.submitting ? "Entrando..." : "Entrar"}
							</UI.Button>
						</UI.Stack>
					</form>
				</UI.Paper>
			</UI.Stack>
		</UI.Center>
	);
}