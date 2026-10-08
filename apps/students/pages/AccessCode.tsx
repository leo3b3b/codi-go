import { UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getClassByAccessCode } from "@/services";

const ACCESS_CODE_PATTERN = /^[A-Z]{6}$/;

export default function AccessCodePage() {
	const navigate = useNavigate();
	const [accessCode, setAccessCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const code = accessCode.trim().toUpperCase();

		if (!ACCESS_CODE_PATTERN.test(code)) {
			setError("Código de acesso inválido.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			await getClassByAccessCode(code);
			navigate(`/${code}`);
		} catch {
			setError("Turma não encontrada.");
		} finally {
			setLoading(false);
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
					<form onSubmit={handleSubmit}>
						<UI.Stack gap="lg">
							<div>
								<UI.Title order={1}>Entrar em uma turma</UI.Title>

								<UI.Text size="sm" c="dimmed" mt="xs">
									Digite o código de acesso fornecido pelo professor.
								</UI.Text>
							</div>

							<UI.TextInput
								label="Código de acesso"
								value={accessCode}
								onChange={(event) => {
									setAccessCode(event.currentTarget.value.toUpperCase());
									setError("");
								}}
								placeholder="Código de acesso"
								autoComplete="off"
								autoCapitalize="characters"
								maxLength={6}
								error={error || undefined}
							/>

							<UI.Button type="submit" fullWidth loading={loading}>
								{loading ? "Entrando..." : "Entrar"}
							</UI.Button>
						</UI.Stack>
					</form>
				</UI.Paper>
			</UI.Stack>
		</UI.Center>
	);
}
