import type { Route } from "+pages/TreasureHunt";
import { UI } from "@codi-go/ui";
import { GameHeader } from "@/Games";
import { getLevel, getStudentSession, isClassPlaying } from "@/services";
import { C, parseTreasureHuntLevel, useTreasureHunt } from "@/TreasureHunt";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const levelId = Number(params.levelId);
	const session = getStudentSession();

	if (!session)
		throw new Response("Sessão de aluno não encontrada.", {
			status: 401,
		});

	const status = await isClassPlaying(session.class_id);

	if (status !== true)
		throw new Response("A turma não está em atividade.", {
			status: 403,
		});

	const levelData = await getLevel(levelId);
	return parseTreasureHuntLevel(levelData);
}

export function meta({ loaderData: level }: Route.MetaArgs) {
	return [{ title: `${level.name} | CodiGO!` }];
}

export default function TreasureHuntPage({
	loaderData: level,
}: Route.ComponentProps) {
	const { state, isMoving, isRegistering, move, restart } =
		useTreasureHunt(level);

	return (
		<UI.Container>
			<UI.Stack
				w="100%"
				gap="sm"
				h={{ base: "auto", lg: "calc(100dvh - 104px)" }}
				style={{ minHeight: 0 }}
			>
				<GameHeader name={level.name} />

				<UI.Grid align="stretch" style={{ flex: "1 1 auto", minHeight: 0 }}>
					<UI.Grid.Col
						span={{ base: 12, lg: 5 }}
						style={{ display: "flex", minHeight: 0 }}
					>
						<C.TreasureHuntBoard
							level={level}
							playerPosition={state.playerPosition}
							direction={state.direction}
							moving={isMoving}
							nextPlaceIndex={state.nextPlaceIndex}
						/>
					</UI.Grid.Col>

					<UI.Grid.Col
						span={{ base: 12, lg: 7 }}
						style={{ display: "flex", minHeight: 0 }}
					>
						<C.TreasureHuntControls
							level={level}
							state={state}
							isMoving={isMoving}
							isRegistering={isRegistering}
							onMove={move}
							onRestart={restart}
						/>
					</UI.Grid.Col>
				</UI.Grid>
			</UI.Stack>
		</UI.Container>
	);
}
