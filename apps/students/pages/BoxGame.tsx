import type { Route } from "+pages/BoxGame";
import { Icon, notifications, UI } from "@codi-go/ui";
import { useState } from "react";
import { useReward } from "react-rewards";
import { BoxContents, parseBoxLevel } from "@/BoxGame";
import type { Feedback, ObjectType } from "@/Games";
import { CodiMessage, GameHeader, ObjectOption, objectImages } from "@/Games";
import {
	getLevel,
	getStudentSession,
	isClassPlaying,
	registerProgress,
} from "@/services";

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
	const { reward } = useReward("confettiDiv", "confetti", {
		position: "fixed",
		elementCount: 240,
		angle: 90,
		spread: 120,
	});

	const [options] = useState(() =>
		shuffleObjects([level.correctObject, ...level.alternatives]),
	);
	const [selectedObject, setSelectedObject] = useState<ObjectType | null>(null);
	const [feedback, setFeedback] = useState<Feedback>("idle");
	const [isRegistering, setIsRegistering] = useState(false);

	const isCorrect = feedback === "correct";

	const message = isCorrect
		? `Muito bem! ${level.explanation}`
		: feedback === "incorrect"
			? "Hmm, esse objeto não segue a mesma regra. Observe a caixa e tente novamente!"
			: selectedObject
				? `Você escolheu ${objectImages[selectedObject].label}. Será que ele segue a mesma regra dos objetos da caixa?`
				: "Observe os objetos dentro da caixa. O que eles têm em comum? Encontre outro objeto que siga a mesma regra!";

	function selectObject(object: ObjectType) {
		if (isCorrect || isRegistering) return;

		setSelectedObject(object);
		setFeedback("idle");
	}

	async function confirmAnswer() {
		if (selectedObject === null || isCorrect || isRegistering) return;

		const isAnswerCorrect = selectedObject === level.correctObject;

		setIsRegistering(true);

		try {
			await registerProgress({
				level_id: level.id,
				result: isAnswerCorrect ? "success" : "failure",
			});

			setFeedback(isAnswerCorrect ? "correct" : "incorrect");

			if (isAnswerCorrect) reward();
		} catch {
			notifications.show({
				message: "Não foi possível registrar seu progresso. Tente novamente.",
				color: "red",
				position: "top-center",
				autoClose: 3000,
				withCloseButton: false,
				icon: <Icon.X />,
			});
		} finally {
			setIsRegistering(false);
		}
	}

	return (
		<UI.Container>
			<UI.Stack gap="md">
				<GameHeader name={level.name} />

				<CodiMessage message={message} status={feedback} />

				<UI.Paper>
					<UI.Grid align="stretch">
						<UI.Grid.Col span={{ base: 12, md: 5 }}>
							<BoxContents objects={level.boxObjects} />
						</UI.Grid.Col>

						<UI.Grid.Col span={{ base: 12, md: 7 }}>
							<ControlColumn
								feedback={feedback}
								options={options}
								selectedObject={selectedObject}
								isCorrect={isCorrect}
								isRegistering={isRegistering}
								selectObject={selectObject}
								confirmAnswer={confirmAnswer}
							/>
						</UI.Grid.Col>
					</UI.Grid>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}

type ControlColumnProps = {
	feedback: Feedback;
	options: ObjectType[];
	selectedObject: ObjectType | null;
	isCorrect: boolean;
	isRegistering: boolean;
	selectObject: (object: ObjectType) => void;
	confirmAnswer: () => Promise<void>;
};

const ControlColumn = ({
	feedback,
	options,
	selectedObject,
	isCorrect,
	isRegistering,
	selectObject,
	confirmAnswer,
}: ControlColumnProps) => (
	<UI.Stack gap="lg">
		<UI.Group justify="space-between" align="center" wrap="wrap">
			<UI.Title order={2}>Qual objeto segue a mesma regra?</UI.Title>

			<UI.Text size="sm" c="dimmed">
				{options.length} opções
			</UI.Text>
		</UI.Group>

		<UI.SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
			{options.map((object) => (
				<ObjectOption
					key={object}
					object={object}
					selected={selectedObject === object}
					disabled={isCorrect || isRegistering}
					onSelect={selectObject}
				/>
			))}
		</UI.SimpleGrid>

		<UI.Button
			type="button"
			fullWidth
			loading={isRegistering}
			disabled={selectedObject === null || isCorrect}
			onClick={confirmAnswer}
		>
			{isCorrect ? "Resposta confirmada" : "Confirmar resposta"}
		</UI.Button>

		<UI.Box mih={24}>
			{feedback === "correct" && (
				<UI.Text c="green" fw={600}>
					<Icon.Check size={18} /> Resposta correta!
				</UI.Text>
			)}
		</UI.Box>
	</UI.Stack>
);
