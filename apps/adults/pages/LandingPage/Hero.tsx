import { Hooks, Icon, UI } from "@codi-go/ui";
import { Link } from "react-router";
import { SUPPORT_EMAIL } from "./";

const CLASSROOM_IMAGE =
	"https://images.pexels.com/photos/5621938/pexels-photo-5621938.jpeg?auto=compress&cs=tinysrgb&w=1200";

export const Hero = () => {
	const isDesktop = Hooks.useMediaQuery("(min-width: 48em)");

	return (
		<UI.Grid
			gap={{ base: "xl", md: 48 }}
			align="center"
			py={{ base: 40, md: 72 }}
		>
			<UI.Grid.Col span={{ base: 12, md: 6 }}>
				<UI.Group
					justify={isDesktop ? "flex-start" : "center"}
					gap="xs"
					mb="md"
				>
					<UI.ThemeIcon variant="light" color="violet" radius="xl">
						<Icon.Brain size={16} />
					</UI.ThemeIcon>
					<UI.Text size="sm" fw={700} c="violet">
						Pensamento computacional para crianças
					</UI.Text>
				</UI.Group>

				<UI.Title order={1} size="h1" ta={{ base: "center", md: "left" }}>
					Aprender a pensar pode ser{" "}
					<UI.Text component="span" inherit c="violet">
						uma grande aventura.
					</UI.Text>
				</UI.Title>

				<UI.Text
					c="dimmed"
					size="lg"
					mt="lg"
					ta={{ base: "center", md: "left" }}
				>
					Com o CodiGO!, crianças desenvolvem o raciocínio lógico e aprendem
					conceitos de computação por meio de experiências educativas.
				</UI.Text>

				<UI.Group
					mt="xl"
					justify={isDesktop ? "flex-start" : "center"}
					gap="sm"
				>
					<UI.Button component={Link} to="/escolas" size="lg" radius="xl">
						Acessar o CodiGO!
					</UI.Button>

					<UI.Button
						component="a"
						href={`mailto:${SUPPORT_EMAIL}`}
						variant="default"
						size="lg"
						radius="xl"
					>
						Adotar na Minha Escola
					</UI.Button>
				</UI.Group>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, md: 6 }}>
				<UI.Box pos="relative">
					<UI.Image
						src={CLASSROOM_IMAGE}
						alt="Crianças participando de uma atividade educativa em sala de aula"
						radius="xl"
						h={{ base: 280, md: 420 }}
						fit="cover"
					/>

					<UI.Image
						src="/codiPisca.png"
						alt="Mascote CodiGO!"
						pos="absolute"
						w={{ base: 100, md: 140 }}
						right={0}
						bottom={-24}
						fit="contain"
					/>
				</UI.Box>
			</UI.Grid.Col>
		</UI.Grid>
	);
};
