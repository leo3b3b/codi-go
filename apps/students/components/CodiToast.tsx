import { UI } from "@codi-go/ui";
import type { Toast } from "react-hot-toast";

type CodiToastProps = {
	t: Toast;
	is_class_playing: boolean;
};

export function CodiToast({ t, is_class_playing }: CodiToastProps) {
	return (
		<UI.Box
			style={{
				pointerEvents: "auto",
				width: "min(90vw, 28rem)",
				transform: t.visible ? "translateY(0)" : "translateY(0.5rem)",
				opacity: t.visible ? 1 : 0,
				transition: "transform 300ms, opacity 300ms",
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
								: "Tente de novo depois"}
						</UI.Text>
					</UI.Box>
				</UI.Group>
			</UI.Paper>
		</UI.Box>
	);
}
