import { Icon, UI } from "@codi-go/ui";
import { SectionHeading } from "./SectionHeading";

const pillars = [
	{
		title: "Decomposição",
		description:
			"Dividir desafios complexos em partes menores e mais fáceis de resolver.",
		icon: Icon.Layers3,
		color: "teal",
		number: "01",
	},
	{
		title: "Reconhecimento de padrões",
		description: "Identificar semelhanças e padrões para encontrar soluções.",
		icon: Icon.Shapes,
		color: "blue",
		number: "02",
	},
	{
		title: "Abstração",
		description: "Reconhecer o que é essencial para compreender um problema.",
		icon: Icon.Search,
		color: "grape",
		number: "03",
	},
	{
		title: "Algoritmos",
		description:
			"Organizar instruções em uma sequência lógica para resolver desafios.",
		icon: Icon.ListChecks,
		color: "violet",
		number: "04",
	},
];

type Pillar = (typeof pillars)[number];

const PillarCard = ({ pillar }: { pillar: Pillar }) => {
	const PillarIcon = pillar.icon;

	return (
		<UI.Card withBorder radius="lg" padding="lg" h="100%">
			<UI.Group justify="space-between" align="flex-start">
				<UI.ThemeIcon
					variant="light"
					color={pillar.color}
					size={48}
					radius="md"
				>
					<PillarIcon size={24} />
				</UI.ThemeIcon>
				<UI.Text size="sm" c="dimmed" fw={700}>
					{pillar.number}
				</UI.Text>
			</UI.Group>

			<UI.Title order={3} size="h4" mt="lg">
				{pillar.title}
			</UI.Title>
			<UI.Text c="dimmed" size="sm" mt="sm">
				{pillar.description}
			</UI.Text>
		</UI.Card>
	);
};

export const PillarsSection = () => (
	<UI.Box component="section" id="pilares" py={{ base: 48, md: 80 }}>
		<SectionHeading
			eyebrow="Pensamento computacional"
			title="Habilidades para resolver problemas"
			description="O CodiGO! trabalha conceitos fundamentais da computação de forma acessível, prática e divertida."
		/>

		<UI.SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="xl">
			{pillars.map((pillar) => (
				<PillarCard key={pillar.number} pillar={pillar} />
			))}
		</UI.SimpleGrid>
	</UI.Box>
);
