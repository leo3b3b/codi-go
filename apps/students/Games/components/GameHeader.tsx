import { Icon, UI } from "@codi-go/ui";
import { useNavigate } from "react-router";

export function GameHeader({ name }: { name: string }) {
	const navigate = useNavigate();
	return (
		<UI.Flex gap="md" direction={{ base: "column", md: "row" }}>
			<UI.Button
				type="button"
				variant="default"
				w="auto"
				leftSection={<Icon.ArrowLeft size={18} />}
				onClick={() => navigate("../fases")}
			>
				Voltar para fases
			</UI.Button>

			<UI.Title order={1}>{name}</UI.Title>
		</UI.Flex>
	);
}
