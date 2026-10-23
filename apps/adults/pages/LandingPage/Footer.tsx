import { UI } from "@codi-go/ui";
import { Link } from "react-router";

export const Footer = () => (
	<UI.Group
		component="footer"
		justify="space-between"
		align="center"
		gap="md"
		wrap="wrap"
		py="xl"
		mt={{ base: "md", md: "xl" }}
	>
		<Link to="/" aria-label="Voltar à página inicial do CodiGO!">
			<UI.Image src="/logo.png" alt="CodiGO!" h={38} w="auto" fit="contain" />
		</Link>

		<UI.Text size="sm" c="dimmed">
			Jogos educativos para desenvolver o pensamento computacional.
		</UI.Text>

		<UI.Text size="sm" c="dimmed">
			© {new Date().getFullYear()} CodiGO!
		</UI.Text>
	</UI.Group>
);
