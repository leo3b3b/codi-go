import { Icon, UI } from "@codi-go/ui";

const accessBenefits = [
	{
		icon: Icon.MonitorSmartphone,
		title: "Direto pelo navegador",
		description: "Acesse sem precisar instalar um programa.",
	},
	{
		icon: Icon.MessagesSquare,
		title: "Em português",
		description: "Conteúdo apresentado em linguagem acessível.",
	},
	{
		icon: Icon.ChartNoAxesCombined,
		title: "Acompanhamento pedagógico",
		description: "Uma experiência que apoia o acompanhamento da aprendizagem.",
	},
];

export const AccessBenefits = () => (
	<UI.SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" py="xl">
		{accessBenefits.map((benefit) => {
			const BenefitIcon = benefit.icon;

			return (
				<UI.Group key={benefit.title} align="flex-start" wrap="nowrap">
					<UI.ThemeIcon variant="light" radius="md" size={44}>
						<BenefitIcon size={22} />
					</UI.ThemeIcon>

					<UI.Box>
						<UI.Text fw={700}>{benefit.title}</UI.Text>
						<UI.Text size="sm" c="dimmed" mt={4}>
							{benefit.description}
						</UI.Text>
					</UI.Box>
				</UI.Group>
			);
		})}
	</UI.SimpleGrid>
);
