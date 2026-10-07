import * as M from "@mantine/core";
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
		<M.Center w="100%" mih="100vh" px="md">
			<title>CodiGO! | Entrar</title>

			<M.Stack w="100%" maw={448} gap="lg">
				<M.Image
					src="/logo.png"
					alt="Logo do CodiGO!"
					w="auto"
					h={72}
					fit="contain"
					mx="auto"
				/>

				<M.Paper>
					<form onSubmit={handleSubmit}>
						<M.Stack gap="lg">
							<div>
								<M.Title order={1}>
									Entrar em uma turma
								</M.Title>

								<M.Text size="sm" c="dimmed" mt="xs">
									Digite o código de acesso fornecido pelo
									professor.
								</M.Text>
							</div>

							<M.TextInput
								label="Código de acesso"
								value={accessCode}
								onChange={(event) => {
									setAccessCode(
										event.currentTarget.value.toUpperCase(),
									);
									setError("");
								}}
								placeholder="Código de acesso"
								autoComplete="off"
								autoCapitalize="characters"
								maxLength={6}
								error={error || undefined}
							/>

							<M.Button
								type="submit"
								fullWidth
								loading={loading}
							>
								{loading ? "Entrando..." : "Entrar"}
							</M.Button>
						</M.Stack>
					</form>
				</M.Paper>
			</M.Stack>
		</M.Center>
	);
}
