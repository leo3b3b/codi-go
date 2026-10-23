import { UI } from "@codi-go/ui";
import { Link } from "react-router";

export const Header = () => (
	<UI.Box
		component="header"
		py="md"
		pos="sticky"
		top={0}
		style={{ zIndex: 40 }}
		bg="var(--app-page-bg)"
	>
		<UI.Container size="xl">
			<UI.Group justify="space-between" align="center">
				<Link to="/" aria-label="CodiGO! — página inicial">
					<UI.Image src="/logo.png" alt="CodiGO!" w={144} fit="contain" />
				</Link>

				<UI.Group gap="lg" visibleFrom="md">
					<UI.Anchor href="#pilares">Pilares</UI.Anchor>
					<UI.Anchor href="#como-funciona">Como funciona</UI.Anchor>
					<UI.Anchor href="#para-escolas">Para escolas</UI.Anchor>
				</UI.Group>

				<UI.Group gap="sm">
					<UI.Button component={Link} to="/escolas" radius="xl">
						Acessar o CodiGO!
					</UI.Button>
				</UI.Group>
			</UI.Group>
		</UI.Container>
	</UI.Box>
);
