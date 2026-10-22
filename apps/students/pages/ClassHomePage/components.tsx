import { Icon, notifications, UI } from "@codi-go/ui";
import type { getClassByAccessCode } from "@/services";

type ClassData = NonNullable<Awaited<ReturnType<typeof getClassByAccessCode>>>;

export function showCodiToast(is_class_playing: boolean) {
	notifications.clean();
	notifications.show({
		message: "",
		autoClose: 3000,
		position: "top-center",

		renderNotification: () => <CodiToast is_class_playing={is_class_playing} />,
	});
}

function CodiToast({ is_class_playing }: { is_class_playing: boolean }) {
	return (
		<UI.Box
			style={{
				pointerEvents: "auto",
				width: "min(90vw, 28rem)",
			}}
		>
			<UI.Paper
				bg="red.0"
				style={{
					border: "2px solid var(--mantine-color-red-2)",
				}}
			>
				<UI.Group gap="md" wrap="nowrap">
					<UI.Image src="/codi.png" alt="" h={64} w={64} fit="contain" />

					<UI.Box style={{ flex: 1 }}>
						<UI.Text size="xl" fw={700}>
							{is_class_playing
								? "Ops! Não deu certo."
								: "Ops! A sala está fechada."}
						</UI.Text>

						<UI.Text mt={4}>
							{is_class_playing
								? "Tente escolher outra imagem."
								: "Tente de novo depois."}
						</UI.Text>
					</UI.Box>
				</UI.Group>
			</UI.Paper>
		</UI.Box>
	);
}

export const ClassHeader = ({ classData }: { classData: ClassData }) => (
	<UI.Paper>
		<UI.Grid align="center">
			<UI.Grid.Col span={{ base: 12, md: 2 }}>
				<UI.Image
					src="/logo.png"
					alt="Logo do CodiGO!"
					w="100%"
					maw={160}
					mx="auto"
				/>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, md: 7 }}>
				<UI.Title order={1} ta="center">
					{classData.name}
				</UI.Title>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, md: 3 }}>
				<UI.Badge
					size="lg"
					variant="light"
					color={classData.is_playing ? "violet" : "red"}
					leftSection={
						classData.is_playing ? (
							<Icon.LockKeyholeOpen size={18} />
						) : (
							<Icon.LockKeyhole size={18} />
						)
					}
					w="100%"
					h={44}
				>
					{classData.is_playing ? "Sala Aberta" : "Sala Fechada"}
				</UI.Badge>
			</UI.Grid.Col>
		</UI.Grid>
	</UI.Paper>
);
