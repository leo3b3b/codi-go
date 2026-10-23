import type { Route } from "+pages/BoxGame";
import { Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import { C, type ObjectType, objectImages, parseBoxLevel } from "@/BoxGame";
import { getLevel, getStudentSession, isClassPlaying } from "@/services";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const levelId = Number(params.levelId);
	const session = getStudentSession();

	if (!session)
		throw new Response("Sessão de aluno não encontrada.", { status: 401 });

	const status = await isClassPlaying(session.class_id);

	if (status !== true)
		throw new Response("A turma não está em atividade.", { status: 403 });

	const levelData = await getLevel(levelId);
	return parseBoxLevel(levelData);
}

export function meta({ loaderData: level }: Route.MetaArgs) {
	return [{ title: `${level.name} | CodiGO!` }];
}

function shuffleObjects(objects: ObjectType[]): ObjectType[] {
	const shuffled = [...new Set(objects)];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}

export default function BoxGamePage({
	loaderData: level,
}: Route.ComponentProps) {
	const navigate = useNavigate();

	const [options] = useState(() =>
		shuffleObjects([level.correctObject, ...level.alternatives]),
	);
	const [selectedObject, setSelectedObject] = useState<ObjectType | null>(null);
	const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
		"idle",
	);

	const isCorrect = feedback === "correct";

	const message = isCorrect
		? `Muito bem! ${level.explanation}`
		: feedback === "incorrect"
			? "Hmm, esse objeto não segue a mesma regra. Observe a caixa e tente novamente!"
			: selectedObject
				? `Você escolheu ${objectImages[selectedObject].label}. Será que ele segue a mesma regra dos objetos da caixa?`
				: "Observe os objetos dentro da caixa. O que eles têm em comum? Encontre outro objeto que siga a mesma regra!";

	function selectObject(object: ObjectType) {
		if (isCorrect) return;

		setSelectedObject(object);
		setFeedback("idle");
	}

	function confirmAnswer() {
		if (selectedObject === null || isCorrect) return;

		setFeedback(
			selectedObject === level.correctObject ? "correct" : "incorrect",
		);
	}

	return (
		<UI.Container>
			<UI.Stack gap="md">
				<UI.Paper>
					<UI.Group gap="md" wrap="nowrap">
						<UI.Button
							type="button"
							variant="default"
							w="auto"
							leftSection={<Icon.ArrowLeft size={18} />}
							onClick={() => navigate("../fases")}
						>
							Voltar para fases
						</UI.Button>

						<UI.Title order={1}>{level.name}</UI.Title>
					</UI.Group>
				</UI.Paper>

				<UI.Grid align="stretch">
					<UI.Grid.Col span={{ base: 12, lg: 6 }}>
						<UI.Paper h="100%">
							<C.BoxContents objects={level.boxObjects} />
						</UI.Paper>
					</UI.Grid.Col>

					<UI.Grid.Col span={{ base: 12, lg: 6 }}>
						<UI.Paper h="100%">
							<UI.Stack gap="lg">
								<C.CodiMessage message={message} status={feedback} />

								<UI.Title order={2}>Qual objeto segue a mesma regra?</UI.Title>

								<UI.SimpleGrid cols={2} spacing="sm">
									{options.map((object) => (
										<C.ObjectOption
											key={object}
											object={object}
											selected={selectedObject === object}
											disabled={isCorrect}
											onSelect={selectObject}
										/>
									))}
								</UI.SimpleGrid>

								{feedback === "correct" && (
									<UI.Text c="green" fw={600}>
										<Icon.Check size={18} /> Resposta correta!
									</UI.Text>
								)}

								<UI.Button
									type="button"
									fullWidth
									disabled={selectedObject === null || isCorrect}
									onClick={confirmAnswer}
								>
									{isCorrect ? "Resposta confirmada" : "Confirmar resposta"}
								</UI.Button>
							</UI.Stack>
						</UI.Paper>
					</UI.Grid.Col>
				</UI.Grid>
			</UI.Stack>
		</UI.Container>
	);
}
