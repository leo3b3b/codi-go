import { UI } from "@codi-go/ui";
import { SectionHeading } from "./components/SectionHeading";

const faqs = [
	{
		question: "Para qual faixa etária o CodiGO! é indicado?",
		answer:
			"A proposta é voltada principalmente para crianças de 7 a 11 anos, considerando o contexto e as necessidades de cada escola.",
	},
	{
		question: "É necessário instalar algum programa?",
		answer:
			"O acesso é feito pelo navegador, sem necessidade de instalar um aplicativo no dispositivo.",
	},
	{
		question: "A escola consegue acompanhar a aprendizagem?",
		answer:
			"A proposta inclui apoiar o acompanhamento das atividades e do desenvolvimento dos estudantes.",
	},
];

export const FAQSection = () => (
	<UI.Box component="section" id="duvidas" py={{ base: 48, md: 80 }}>
		<SectionHeading
			eyebrow="Dúvidas frequentes"
			title="O que você precisa saber"
			description="Respostas para algumas dúvidas comuns sobre a plataforma."
		/>

		<UI.Accordion variant="separated" radius="md" mt="xl">
			{faqs.map((faq) => (
				<UI.Accordion.Item key={faq.question} value={faq.question}>
					<UI.Accordion.Control>{faq.question}</UI.Accordion.Control>
					<UI.Accordion.Panel>{faq.answer}</UI.Accordion.Panel>
				</UI.Accordion.Item>
			))}
		</UI.Accordion>
	</UI.Box>
);
