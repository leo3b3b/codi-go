import * as UI from "@codi-go/ui";
import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<UI.Grid mih="100vh" bg="gray.1">
			<UI.Grid.Col span={{ base: 12, lg: 6 }}>
				<UI.Center mih="100vh" px={{ base: "md", sm: "xl", lg: "2xl" }}>
					<UI.Stack w="100%" maw={448}>
						<UI.Image
							src="/logo.png"
							alt="CodiGO!"
							w="auto"
							h={72}
							fit="contain"
							hiddenFrom="lg"
							mx="auto"
						/>

						<Outlet />
					</UI.Stack>
				</UI.Center>
			</UI.Grid.Col>

			<UI.Grid.Col
				span={6}
				visibleFrom="lg"
				style={{
					position: "relative",
					overflow: "hidden",
					backgroundImage: `
						linear-gradient(
							180deg,
							color-mix(in srgb, var(--mantine-color-violet-4) 60%, transparent),
							color-mix(in srgb, var(--mantine-color-violet-8) 20%, transparent)
						),
						url("/backgroundIceberg.png")
					`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			>
				<UI.Stack
					h="100%"
					justify="space-between"
					p="xl"
					style={{ position: "relative" }}
				>
					<div>
						<UI.Image
							src="/logo.png"
							alt="CodiGO!"
							w="auto"
							h={128}
							fit="contain"
						/>

						<UI.Title order={1} c="white" mt="xl" size="2.75rem" lh={1.1}>
							Pronto para se aventurar?
						</UI.Title>

						<UI.Text c="white" size="lg" lh={1.6} mt="md" maw={384}>
							Entre na sua conta e acompanhe a jornada dos seus alunos!
						</UI.Text>
					</div>

					<UI.Image
						src="/codiPisca.png"
						alt="Mascote do CodiGO!"
						w="100%"
						maw={448}
						mx="auto"
						fit="contain"
					/>
				</UI.Stack>
			</UI.Grid.Col>
		</UI.Grid>
	);
}
