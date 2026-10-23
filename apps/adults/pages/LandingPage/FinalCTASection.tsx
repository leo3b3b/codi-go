import { Icon, UI } from "@codi-go/ui";
import { Link } from "react-router";
import { SUPPORT_EMAIL } from "./";

export const FinalCTASection = () => (
	<UI.Paper
		component="section"
		p={{ base: "xl", md: 48 }}
		radius="xl"
		bg="violet.9"
		c="white"
		withBorder={false}
		style={{ overflow: "hidden", position: "relative" }}
	>
		<UI.Box
			pos="absolute"
			top={-70}
			right={-50}
			w={240}
			h={240}
			style={{
				borderRadius: "50%",
				background: "rgba(255, 255, 255, 0.07)",
				pointerEvents: "none",
			}}
		/>

		<UI.Grid align="center" gap="xl">
			<UI.Grid.Col span={{ base: 12, md: 8 }}>
				<UI.Stack gap="md">
					<UI.Text
						size="sm"
						fw={700}
						tt="uppercase"
						style={{ letterSpacing: "0.09em" }}
					>
						O próximo passo começa aqui
					</UI.Text>

					<UI.Title
						order={2}
						size="clamp(2rem, 4vw, 3.25rem)"
						lh={1.12}
						c="white"
					>
						Leve novas possibilidades de aprendizagem para sua escola.
					</UI.Title>

					<UI.Text size="lg" lh={1.8} style={{ opacity: 0.88 }}>
						Conheça a plataforma ou converse com a equipe sobre a adoção do
						CodiGO! na sua instituição.
					</UI.Text>

					<UI.Group mt="sm" gap="sm" wrap="wrap">
						<UI.Button
							component="a"
							href={`mailto:${SUPPORT_EMAIL}`}
							size="lg"
							variant="white"
							color="violet"
							leftSection={<Icon.School size={18} />}
						>
							Adotar na Minha Escola
						</UI.Button>

						<UI.Button
							component={Link}
							to="/escolas"
							size="lg"
							variant="outline"
							color="white"
							rightSection={<Icon.ArrowRight size={18} />}
						>
							Acessar o CodiGO!
						</UI.Button>
					</UI.Group>
				</UI.Stack>
			</UI.Grid.Col>

			<UI.Grid.Col span={4} visibleFrom="md">
				<UI.Center>
					<UI.Image
						src="/codiPisca.png"
						alt="Codi, mascote do CodiGO!"
						w={400}
						h={400}
						fit="contain"
					/>
				</UI.Center>
			</UI.Grid.Col>
		</UI.Grid>
	</UI.Paper>
);
