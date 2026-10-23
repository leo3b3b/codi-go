import { UI } from "@codi-go/ui";
import type { Feedback } from "../types";

type CodiMessageProps = {
	message: string;
	status: Feedback;
};

const statusStyles = {
	idle: {
		background: "blue.0",
		color: "blue.9",
	},
	correct: {
		background: "green.0",
		color: "green.9",
	},
	incorrect: {
		background: "red.0",
		color: "red.9",
	},
} as const;

export function CodiMessage({ message, status }: CodiMessageProps) {
	const style = statusStyles[status];

	return (
		<UI.Group h={120} align="center" gap="md" wrap="nowrap">
			<UI.Image src="/codi.png" alt="Codi" w={100} h={140} fit="contain" />
			<UI.Paper
				h="100%"
				p="md"
				radius="lg"
				bg={style.background}
				c={style.color}
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
				}}
			>
				<UI.Text>{message}</UI.Text>
			</UI.Paper>
		</UI.Group>
	);
}
