import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { Link } from "react-router";

export default function LandingPage() {
    return (
        <UI.Box mih="100vh" className="ui-root">
            <UI.Container size="xl">
                <Header />
                <Hero />

                <UI.Divider />

                <ComputationalThinkingSection />
                <FeaturesSection />

                <UI.Divider />

                <SchoolValueSection />
                <Footer />
            </UI.Container>
        </UI.Box>
    );
}

const SUPPORT_EMAIL = "suporte.codigo.app@gmail.com";

const features = [
    {
        icon: Icon.Layers3,
        title: "Decomposição",
        description:
            "Aprenda a dividir problemas complexos em partes menores e mais fáceis de compreender.",
    },
    {
        icon: Icon.Shapes,
        title: "Reconhecimento de padrões",
        description:
            "Identifique semelhanças e regularidades para encontrar caminhos mais eficientes para cada desafio.",
    },
    {
        icon: Icon.ListChecks,
        title: "Organização de estratégias",
        description:
            "Planeje soluções por etapas, desenvolvendo uma maneira mais estruturada de raciocinar.",
    },
];

function Header() {
    return (
        <UI.Group
            h={76}
            justify="space-between"
            wrap="nowrap"
        >
            <Link to="/" aria-label="CodiGO!">
                <UI.Image
                    src="/logo.png"
                    alt="CodiGO!"
                    h={48}
                    w="auto"
                    fit="contain"
                />
            </Link>

            <UI.Group gap="sm">
                <UI.Anchor
                    href="#pensamento-computacional"
                    visibleFrom="md"
                    underline="never"
                >
                    Pensamento computacional
                </UI.Anchor>

                <UI.Anchor
                    href={`mailto:${SUPPORT_EMAIL}`}
                    underline="never"
                    visibleFrom="sm"
                >
                    Falar com a equipe
                </UI.Anchor>

                <UI.Button
                    component={Link}
                    to="/escolas"
                    variant="light"
                >
                    Entrar
                </UI.Button>
            </UI.Group>
        </UI.Group>
    );
}

function Hero() {
    return (
        <UI.Grid
            align="start"
            py={{ base: 32, md: 48 }}
        >
            <UI.Grid.Col span={{ base: 12, md: 7 }}>
                <UI.Stack gap="lg">
                    <UI.Badge
                        color="violet"
                        variant="light"
                        size="lg"
                        w="fit-content"
                    >
                        Pensamento computacional
                    </UI.Badge>

                    <UI.Title
                        order={1}
                        size="clamp(2.5rem, 5vw, 4rem)"
                        lh={1.05}
                    >
                        Uma nova forma de{" "}
                        <UI.Text span inherit c="violet.7">
                            pensar soluções.
                        </UI.Text>
                    </UI.Title>

                    <UI.Text
                        size="xl"
                        c="gray.8"
                        lh={1.7}
                        maw={640}
                    >
                        O CodiGO! é uma ferramenta de ensino para escolas que
                        querem desenvolver o pensamento computacional de seus
                        alunos por meio de desafios, atividades e experiências
                        estruturadas.
                    </UI.Text>

                    <UI.Text c="gray.7" lh={1.7} maw={620}>
                        Para educadores, isso significa ter uma abordagem clara
                        para trabalhar raciocínio, resolução de problemas e
                        organização de estratégias em sala de aula.
                    </UI.Text>

                    <UI.Group mt="sm">
                        <UI.Button
                            component="a"
                            href={`mailto:${SUPPORT_EMAIL}`}
                            size="lg"
                            leftSection={<Icon.MessageCircle size={18} />}
                        >
                            Conversar com a equipe
                        </UI.Button>

                        <UI.Button
                            component={Link}
                            to="/escolas"
                            size="lg"
                            variant="light"
                            rightSection={<Icon.ArrowRight size={18} />}
                        >
                            Entrar no CodiGO!
                        </UI.Button>
                    </UI.Group>
                </UI.Stack>
            </UI.Grid.Col>

            <UI.Grid.Col span={{ base: 12, md: 5 }}>
                <UI.Paper
                    bg="white"
                    p={{ base: "md", md: "xl" }}
                >
                    <UI.Stack gap="md">
                        <UI.Group
                            justify="space-between"
                            align="center"
                        >
                            <UI.Stack gap={2}>
                                <UI.Text size="sm" c="dimmed">
                                    O CodiGO! na escola
                                </UI.Text>

                                <UI.Title order={2}>
                                    Pensar antes de resolver
                                </UI.Title>
                            </UI.Stack>

                            <UI.ThemeIcon
                                size={44}
                                variant="light"
                                color="violet"
                                radius="xl"
                            >
                                <Icon.Brain size={24} />
                            </UI.ThemeIcon>
                        </UI.Group>

                        <UI.Image
                            src="/codiPisca.png"
                            alt="Codi, mascote do CodiGO!"
                            h={{ base: 220, md: 280 }}
                            w="100%"
                            fit="contain"
                        />

                        <UI.Divider />

                        <UI.Text fw={600} ta="center">
                            Compreender. Organizar. Resolver.
                        </UI.Text>

                        <UI.Text
                            size="sm"
                            c="dimmed"
                            ta="center"
                            lh={1.7}
                        >
                            O pensamento computacional ajuda os alunos a
                            enfrentar desafios de forma lógica, estruturada e
                            estratégica.
                        </UI.Text>
                    </UI.Stack>
                </UI.Paper>
            </UI.Grid.Col>
        </UI.Grid>
    );
}

function ComputationalThinkingSection() {
    return (
        <UI.Stack
            id="pensamento-computacional"
            gap="md"
            py={{ base: 40, md: 64 }}
        >
            <UI.Text
                ta="center"
                size="sm"
                fw={700}
                c="violet.7"
                tt="uppercase"
            >
                O que é pensamento computacional?
            </UI.Text>

            <UI.Title order={2} ta="center" maw={720} mx="auto">
                Uma maneira estruturada de compreender problemas
            </UI.Title>

            <UI.Text
                ta="center"
                c="gray.8"
                maw={720}
                mx="auto"
                lh={1.8}
            >
                Pensamento computacional é a capacidade de analisar um
                problema, dividi-lo em partes, identificar padrões e
                organizar uma estratégia para chegar a uma solução.
            </UI.Text>

            <UI.Text
                ta="center"
                c="gray.7"
                maw={680}
                mx="auto"
                lh={1.8}
            >
                É uma competência que pode ser trabalhada em diferentes
                contextos e ajuda os alunos a desenvolver autonomia para
                lidar com desafios.
            </UI.Text>
        </UI.Stack>
    );
}

function FeaturesSection() {
    return (
        <UI.Stack
            id="recursos"
            gap="md"
            py={{ base: 40, md: 64 }}
        >
            <UI.Text
                ta="center"
                size="sm"
                fw={700}
                c="violet.7"
                tt="uppercase"
            >
                Como o CodiGO! trabalha isso
            </UI.Text>

            <UI.Title order={2} ta="center">
                Competências que podem ser desenvolvidas
            </UI.Title>

            <UI.Text
                ta="center"
                c="gray.7"
                maw={680}
                mx="auto"
                lh={1.8}
            >
                Os desafios do CodiGO! são organizados para estimular
                diferentes aspectos do pensamento computacional.
            </UI.Text>

            <UI.Grid mt="lg">
                {features.map((feature) => {
                    const FeatureIcon = feature.icon;

                    return (
                        <UI.Grid.Col
                            key={feature.title}
                            span={{ base: 12, md: 4 }}
                        >
                            <UI.Paper h="100%" bg="white">
                                <UI.Stack gap="md">
                                    <UI.ThemeIcon
                                        size={48}
                                        variant="light"
                                        color="violet"
                                        radius="lg"
                                    >
                                        <FeatureIcon size={24} />
                                    </UI.ThemeIcon>

                                    <UI.Title order={3}>
                                        {feature.title}
                                    </UI.Title>

                                    <UI.Text c="gray.7" lh={1.7}>
                                        {feature.description}
                                    </UI.Text>
                                </UI.Stack>
                            </UI.Paper>
                        </UI.Grid.Col>
                    );
                })}
            </UI.Grid>
        </UI.Stack>
    );
}

function SchoolValueSection() {
    return (
        <UI.Paper
            bg="white"
            p={{ base: "xl", md: 40 }}
        >
            <UI.Grid align="center">
                <UI.Grid.Col span={{ base: 12, md: 8 }}>
                    <UI.Stack gap="md">
                        <UI.Text
                            size="sm"
                            fw={700}
                            c="violet.7"
                            tt="uppercase"
                        >
                            Para escolas
                        </UI.Text>

                        <UI.Title order={2}>
                            Uma ferramenta para transformar desafios em
                            aprendizado.
                        </UI.Title>

                        <UI.Text c="gray.7" size="lg" lh={1.7}>
                            O CodiGO! oferece aos educadores uma experiência
                            estruturada para trabalhar pensamento computacional
                            com seus alunos e acompanhar essa jornada dentro
                            da escola.
                        </UI.Text>

                        <UI.Group mt="sm">
                            <UI.Button
                                component="a"
                                href={`mailto:${SUPPORT_EMAIL}`}
                                leftSection={<Icon.MessageCircle size={18} />}
                            >
                                Falar com a equipe
                            </UI.Button>

                            <UI.Button
                                component={Link}
                                to="/escolas"
                                variant="light"
                            >
                                Entrar
                            </UI.Button>
                        </UI.Group>
                    </UI.Stack>
                </UI.Grid.Col>

                <UI.Grid.Col
                    span={{ base: 12, md: 4 }}
                    visibleFrom="md"
                >
                    <UI.Center>
                        <UI.ThemeIcon
                            size={128}
                            variant="light"
                            color="violet"
                            radius="xl"
                        >
                            <Icon.School size={64} />
                        </UI.ThemeIcon>
                    </UI.Center>
                </UI.Grid.Col>
            </UI.Grid>
        </UI.Paper>
    );
}

function Footer() {
    return (
        <UI.Group
            justify="space-between"
            py="xl"
            mt={{ base: 16, md: 24 }}
        >
            <UI.Image
                src="/logo.png"
                alt="CodiGO!"
                h={40}
                w="auto"
                fit="contain"
            />

            <UI.Text size="sm" c="gray.7">
                © {new Date().getFullYear()} CodiGO!
            </UI.Text>
        </UI.Group>
    );
}
