import logo from "@codi-go/ui/images/logo.png";
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
		<section className="mx-auto w-full max-w-md">
			<title>CodiGO! | Entrar</title>
			<img src={logo} alt="Logo do CodiGO!" className="w-sm mx-auto" />

			<form className="ui-card flex-(~ col) gap-4" onSubmit={handleSubmit}>
				<header className="flex-(~ col) gap-1">
					<h1 className="text-(2xl heading) font-bold">Entrar em uma turma</h1>
					<p className="text-(sm muted)">
						Digite o código de acesso fornecido pelo professor.
					</p>
				</header>

				<div className="flex-(~ col) gap-2">
					<input
						className="ui-field"
						value={accessCode}
						onChange={(event) => {
							setAccessCode(event.target.value.toUpperCase());
							setError("");
						}}
						placeholder="Código de acesso"
						autoComplete="off"
						autoCapitalize="characters"
						maxLength={6}
						aria-invalid={Boolean(error)}
						aria-describedby={error ? "access-code-error" : undefined}
					/>

					{error && (
						<p id="access-code-error" className="text-sm text-danger">
							{error}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="ui-button-(~ primary)"
					disabled={loading}
				>
					{loading ? "Entrando..." : "Entrar"}
				</button>
			</form>
		</section>
	);
}
