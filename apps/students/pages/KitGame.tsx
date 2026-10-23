import type { Route } from "+pages/KitGame";
import { Icon, notifications, UI } from "@codi-go/ui";
import { useState } from "react";
import { useReward } from "react-rewards";
import {
	CodiMessage,
	type Feedback,
	GameHeader,
	ObjectOption,
	type ObjectType,
} from "@/Games";
import { parseKitLevel, shuffleObjects } from "@/KitGame";
import type { ProgressResult } from "@/services";
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
	return parseKitLevel(levelData);
}

export function meta({ loaderData: level }: Route.MetaArgs) {
	return [{ title: `${level.name} | CodiGO!` }];
}

export default function KitGamePage({
	loaderData: level,
}: Route.ComponentProps) {
	const { reward } = useReward("confettiDiv", "confetti", {
		position: "fixed",
		elementCount: 240,
		angle: 90,
		spread: 120,
	});

	const itemCount = level.correctItems.length;

	const [options] = useState(() =>
		shuffleObjects([...level.correctItems, ...level.alternatives]),
	);
	const [selectedItems, setSelectedItems] = useState<ObjectType[]>([]);
	const [feedback, setFeedback] = useState<Feedback>("idle");
	const [checkedCount, setCheckedCount] = useState<number | null>(null);
	const [isRegistering, setIsRegistering] = useState(false);

	const isCorrect = feedback === "correct";

	const message =
		feedback === "correct"
			? `Muito bem! Você acertou todos os ${itemCount} itens!`
			: feedback === "partial"
				? `Você acertou ${checkedCount} de ${itemCount} itens. Ajuste sua escolha e tente novamente!`
				: feedback === "incorrect"
					? `Você não acertou nenhum item desta vez. Tente outra combinação!`
					: selectedItems.length > 0
						? `Você escolheu ${selectedItems.length} de ${itemCount} itens.`
						: level.instruction;

	function selectObject(object: ObjectType) {
		if (isCorrect || isRegistering) return;

		if (!selectedItems.includes(object) && selectedItems.length >= itemCount)
			return;

		setSelectedItems((current) =>
			current.includes(object)
				? current.filter((item) => item !== object)
				: [...current, object],
		);
		setFeedback("idle");
		setCheckedCount(null);
	}

	async function confirmAnswer() {
		if (selectedItems.length !== itemCount || isCorrect || isRegistering)
			return;

		const correctCount = selectedItems.filter((item) =>
			level.correctItems.includes(item),
		).length;

		const result: ProgressResult =
			correctCount === itemCount
				? "success"
				: correctCount > 0
					? "partial"
					: "failure";

		setIsRegistering(true);

		try {
			await registerProgress({
				level_id: level.id,
				result,
				metadata: {
					selected_items: selectedItems,
					correct_count: correctCount,
					item_count: itemCount,
				},
			});

			setCheckedCount(correctCount);
			setFeedback(
				result === "success"
					? "correct"
					: result === "partial"
						? "partial"
						: "incorrect",
			);

			if (result === "success") reward();
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

				<CodiMessage message={message} status={feedback} textSize="xl" />

				<UI.Paper h="100%">
					<UI.Stack gap="lg">
						<UI.Group justify="space-between" align="center">
							<UI.Title order={2}>Escolha os itens</UI.Title>

							<UI.Text c="dimmed" size="sm">
								Escolhidos: {selectedItems.length}/{itemCount}
							</UI.Text>
						</UI.Group>

						<UI.SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="sm">
							{options.map((object) => (
								<ObjectOption
									key={object}
									object={object}
									selected={selectedItems.includes(object)}
									disabled={isCorrect || isRegistering}
									onSelect={selectObject}
								/>
							))}
						</UI.SimpleGrid>

						<UI.Button
							type="button"
							fullWidth
							loading={isRegistering}
							disabled={selectedItems.length !== itemCount || isCorrect}
							onClick={confirmAnswer}
						>
							{isCorrect ? "Resposta certa!" : "Verificar"}
						</UI.Button>
					</UI.Stack>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}
