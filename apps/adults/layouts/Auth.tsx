import * as M from "@mantine/core";
import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<M.Grid mih="100vh" bg="gray.1">
			<M.Grid.Col span={{ base: 12, lg: 6 }}>
				<M.Center mih="100vh" px={{ base: "md", sm: "xl", lg: "2xl" }}>
					<M.Stack w="100%" maw={448}>
						<M.Image
							src="/logo.png"
							alt="CodiGO!"
							w="auto"
							h={72}
							fit="contain"
							hiddenFrom="lg"
							mx="auto"
						/>

						<Outlet />
					</M.Stack>
				</M.Center>
			</M.Grid.Col>

			<M.Grid.Col
				span={6}
				visibleFrom="lg"
				style={{
					position: "relative",
					overflow: "hidden",
					backgroundImage: `
						linear-gradient(
							180deg,
							var(--color-hero-overlay-start),
							var(--color-hero-overlay-end)
						),
						url("/backgroundIceberg.png")
					`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			>
				<M.Stack
					h="100%"
					justify="space-between"
					p="xl"
					style={{ position: "relative" }}
				>
					<div>
						<M.Image
							src="/logo.png"
							alt="CodiGO!"
							w="auto"
							h={128}
							fit="contain"
						/>

						<M.Title
							order={1}
							c="white"
							mt="xl"
							size="2.75rem"
							lh={1.1}
						>
							Pronto para se aventurar?
						</M.Title>

						<M.Text
							c="white"
							size="lg"
							lh={1.6}
							mt="md"
							maw={384}
						>
							Entre na sua conta e acompanhe a jornada dos seus alunos!
						</M.Text>
					</div>

					<M.Image
						src="/codiPisca.png"
						alt="Mascote do CodiGO!"
						w="100%"
						maw={448}
						mx="auto"
						fit="contain"
					/>
				</M.Stack>
			</M.Grid.Col>
		</M.Grid>
	);
}
