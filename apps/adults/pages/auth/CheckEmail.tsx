import * as M from "@mantine/core";
import { Link } from "react-router";

export default function CheckEmailPage() {
	return (
		<M.Paper>
			<title>CodiGO! | Confirme seu e-mail</title>

			<M.Stack gap="lg">
				<M.Stack gap="xs" align="center">
					<M.Title order={1} ta="center">
						Confirme seu e-mail
					</M.Title>

					<M.Text c="dimmed" ta="center">
						Enviamos uma mensagem para confirmar sua conta.
					</M.Text>
				</M.Stack>

				<M.Divider />

				<M.Stack gap="md">
					<M.Text c="dimmed">
						Se não encontrar a mensagem, verifique também a pasta de spam ou
						lixo eletrônico.
					</M.Text>

					<M.Text>
						Depois de confirmar seu e-mail, você poderá entrar na sua conta.
					</M.Text>
				</M.Stack>

				<M.Text size="sm" c="dimmed" ta="center" mt="sm">
					Já confirmou seu e-mail?{" "}
					<M.Anchor component={Link} to="/login" fw={700}>
						Entrar
					</M.Anchor>
				</M.Text>
			</M.Stack>
		</M.Paper>
	);
}