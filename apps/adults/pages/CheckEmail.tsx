import { Link } from "react-router";
import { HorizontalSeparator } from "@/components";

export function CheckEmailPage() {
	return (
		<section className="ui-card">
			<title>CodiGO! | Confirme seu e-mail</title>
			<header className="mb-8 text-center">
				<h1 className="mb-4 text-(2xl heading) font-black tracking-tight">
					Confirme seu e-mail
				</h1>

				<p className="text-muted">
					Enviamos uma mensagem para confirmar sua conta.
				</p>
			</header>
			<HorizontalSeparator />
			<div className="flex-(~ col) gap-4 text-fg">
				<p className="text-muted">
					Se não encontrar a mensagem, verifique também a pasta de spam ou lixo
					eletrônico.
				</p>

				<p>Depois de confirmar seu e-mail, você poderá entrar na sua conta.</p>
			</div>

			<p className="mt-7 text-(center sm muted)">
				Já confirmou seu e-mail?{" "}
				<Link to="/login" className="ui-link">
					Entrar
				</Link>
			</p>
		</section>
	);
}
