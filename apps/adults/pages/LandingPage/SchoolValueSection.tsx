import { Icon, UI } from "@codi-go/ui";
import type { ComponentType, SVGProps } from "react";
import { SUPPORT_EMAIL } from "./";

const schoolBenefits = [
	{
		title: "Apoio ao trabalho pedagógico",
		description:
			"Atividades que podem complementar o planejamento dos educadores.",
	},
	{
		title: "Acompanhamento da aprendizagem",
		description:
			"Informações para ajudar a observar a evolução dos estudantes.",
	},
	{
		title: "Acesso pensado para a escola",
		description:
			"Uma experiência digital que pode ser integrada à rotina escolar.",
	},
];

const dashboardItems = [
	{
		icon: Icon.Users,
		title: "Turmas",
		description: "Organização dos estudantes",
	},
	{
		icon: Icon.Target,
		title: "Progresso",
		description: "Acompanhamento das atividades",
	},
	{
		icon: Icon.BookOpen,
		title: "Aprendizagem",
		description: "Desenvolvimento das habilidades",
	},
];

const SchoolBenefit = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => (
	<UI.Group align="flex-start" wrap="nowrap" gap="sm">
		<UI.ThemeIcon color="violet" variant="light" radius="xl" size={28}>
			<Icon.Check size={16} />
		</UI.ThemeIcon>

		<UI.Box>
			<UI.Text fw={600}>{title}</UI.Text>
			<UI.Text c="dimmed" size="sm" mt={4}>
				{description}
			</UI.Text>
		</UI.Box>
	</UI.Group>
);

type DashboardIcon = ComponentType<
	SVGProps<SVGSVGElement> & { size?: number | string }
>;

const DashboardItem = ({
	icon: ItemIcon,
	title,
	description,
}: {
	icon: DashboardIcon;
	title: string;
	description: string;
}) => (
	<UI.Group align="center" wrap="nowrap" gap="sm">
		<UI.ThemeIcon size={40} radius="md" variant="light">
			<ItemIcon size={20} />
		</UI.ThemeIcon>

		<UI.Box>
			<UI.Text fw={600} size="sm">
				{title}
			</UI.Text>
			<UI.Text size="xs" c="dimmed">
				{description}
			</UI.Text>
		</UI.Box>
	</UI.Group>
);

export const SchoolValueSection = () => (
	<UI.Box component="section" id="para-escolas" py={{ base: 48, md: 80 }}>
		<UI.Grid gap={{ base: "xl", md: 48 }} align="center">
			<UI.Grid.Col span={{ base: 12, md: 6 }}>
				<UI.Text c="violet" fw={700} tt="uppercase" size="sm">
					Para escolas
				</UI.Text>

				<UI.Title order={2} size="h1" mt="sm">
					Tecnologia a serviço da aprendizagem
				</UI.Title>

				<UI.Text c="dimmed" mt="md">
					O CodiGO! apoia o desenvolvimento do pensamento computacional e
					oferece uma experiência que pode fazer parte das atividades
					pedagógicas da escola.
				</UI.Text>

				<UI.Stack gap="lg" mt="xl">
					{schoolBenefits.map((benefit) => (
						<SchoolBenefit
							key={benefit.title}
							title={benefit.title}
							description={benefit.description}
						/>
					))}
				</UI.Stack>

				<UI.Button
					component="a"
					href={`mailto:${SUPPORT_EMAIL}`}
					size="lg"
					radius="xl"
					mt="xl"
				>
					Adotar na Minha Escola
				</UI.Button>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, md: 6 }}>
				<UI.Card withBorder radius="xl" padding="xl">
					<UI.Group justify="space-between" align="center" mb="xl">
						<UI.Box>
							<UI.Text fw={700}>Visão da escola</UI.Text>
							<UI.Text size="sm" c="dimmed">
								Um exemplo de acompanhamento
							</UI.Text>
						</UI.Box>

						<UI.Image
							src="/codi.png"
							alt="Codi (mascote do CodiGO!)"
							w={76}
							fit="contain"
						/>
					</UI.Group>

					<UI.Stack gap="lg">
						{dashboardItems.map((item) => (
							<DashboardItem
								key={item.title}
								icon={item.icon}
								title={item.title}
								description={item.description}
							/>
						))}
					</UI.Stack>
				</UI.Card>
			</UI.Grid.Col>
		</UI.Grid>
	</UI.Box>
);
