import { Icon, UI } from "@codi-go/ui";
import { GAME_GUIDANCE } from "./gameInfo";

type GameGuidanceCardsProps = {
	gameKey: string;
	gameName: string;
};

export function GameGuidanceCards({
	gameKey,
	gameName,
}: GameGuidanceCardsProps) {
	const messages = GAME_GUIDANCE[gameKey] ?? [
		`Neste jogo, o aluno participa das atividades de ${gameName} e busca alcançar o objetivo de cada nível.`,
		"A atividade permite praticar estratégias de resolução de problemas, compreensão de instruções e tomada de decisões.",
		"Observe os sucessos, as falhas e a evolução das tentativas ao longo dos níveis. Os registros mostram os resultados alcançados, mas podem não explicar, por si só, as dificuldades encontradas.",
	];

	const cards = [
		{ text: messages[0], IconComponent: Icon.Route, color: "violet" },
		{ text: messages[1], IconComponent: Icon.Brain, color: "teal" },
		{
			text: messages[2],
			IconComponent: Icon.ChartNoAxesCombined,
			color: "orange",
		},
	] as const;

	return (
		<UI.Stack gap="sm" mb="sm">
			{cards.map(({ text, IconComponent, color }, index) => (
				<UI.Paper key={index} p="md" radius="lg" withBorder h="100%">
					<UI.Group align="flex-start" gap="sm" wrap="nowrap">
						<UI.ThemeIcon size={42} radius="md" variant="light" color={color}>
							<IconComponent size={21} strokeWidth={1.8} />
						</UI.ThemeIcon>

						<UI.Text size="sm" style={{ lineHeight: 1.65 }}>
							{text}
						</UI.Text>
					</UI.Group>
				</UI.Paper>
			))}
		</UI.Stack>
	);
}
