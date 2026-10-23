import { Icon, UI } from "@codi-go/ui";
import { SectionHeading } from "./components/SectionHeading";

const steps = [
	{
		number: "01",
		title: "A escola organiza o acesso",
		description:
			"Educadores e escolas orientam o acesso dos estudantes à plataforma.",
		icon: Icon.School,
	},
	{
		number: "02",
		title: "A criança aprende brincando",
		description:
			"Atividades interativas ajudam a desenvolver o raciocínio e a autonomia.",
		icon: Icon.Gamepad2,
	},
	{
		number: "03",
		title: "O educador acompanha",
		description:
			"A escola acompanha a evolução dos estudantes e utiliza os resultados no planejamento pedagógico.",
		icon: Icon.ChartNoAxesCombined,
	},
];

type Step = (typeof steps)[number];

const StepCard = ({ step }: { step: Step }) => {
	const StepIcon = step.icon;

	return (
		<UI.Card withBorder radius="lg" padding="lg" h="100%">
			<UI.ThemeIcon variant="light" size={48} radius="md">
				<StepIcon size={24} />
			</UI.ThemeIcon>

			<UI.Text size="sm" fw={700} c="dimmed" mt="lg">
				ETAPA {step.number}
			</UI.Text>
			<UI.Title order={3} size="h4" mt="xs">
				{step.title}
			</UI.Title>
			<UI.Text size="sm" c="dimmed" mt="sm">
				{step.description}
			</UI.Text>
		</UI.Card>
	);
};

export const HowItWorksSection = () => (
	<UI.Box component="section" id="como-funciona" py={{ base: 48, md: 80 }}>
		<SectionHeading
			eyebrow="Como funciona"
			title="Uma jornada simples para aprender"
			description="A plataforma conecta a experiência do estudante ao acompanhamento pedagógico da escola."
		/>

		<UI.SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="xl">
			{steps.map((step) => (
				<StepCard key={step.number} step={step} />
			))}
		</UI.SimpleGrid>
	</UI.Box>
);
