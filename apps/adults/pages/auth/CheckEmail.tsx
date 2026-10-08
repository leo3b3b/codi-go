import * as UI from "@codi-go/ui";
import { Link } from "react-router";

export default function CheckEmailPage() {
	return (
		<UI.Paper>
			<title>CodiGO! | Confirme seu e-mail</title>

			<UI.Stack gap="lg">
				<UI.Stack gap="xs" align="center">
					<UI.Title order={1} ta="center">
						Confirme seu e-mail
					</UI.Title>

					<UI.Text c="dimmed" ta="center">
						Enviamos uma mensagem para confirmar sua conta.
					</UI.Text>
				</UI.Stack>

				<UI.Divider />

				<UI.Stack gap="md">
					<UI.Text c="dimmed">
						Se não encontrar a mensagem, verifique também a pasta de spam ou
						lixo eletrônico.
					</UI.Text>

					<UI.Text>
						Depois de confirmar seu e-mail, você poderá entrar na sua conta.
					</UI.Text>
				</UI.Stack>

				<UI.Text size="sm" c="dimmed" ta="center" mt="sm">
					Já confirmou seu e-mail?{" "}
					<UI.Anchor component={Link} to="/login" fw={700}>
						Entrar
					</UI.Anchor>
				</UI.Text>
			</UI.Stack>
		</UI.Paper>
	);
}
