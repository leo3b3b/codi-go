import type { Route } from "+pages/MazeGame";
import { UI } from "@codi-go/ui";
import { GameHeader } from "@/Games";
import { C, parseMazeLevel } from "@/MazeGame";
import { useMazeGame } from "@/MazeGame/useMazeGame";
import { getLevel, getStudentSession, isClassPlaying } from "@/services";

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
	return parseMazeLevel(levelData);
}

export function meta({ loaderData: level }: Route.MetaArgs) {
	return [{ title: `${level.name} | CodiGO!` }];
}

export default function MazeGame({ loaderData: level }: Route.ComponentProps) {
	const {
		state,
		isRunning,
		message,
		feedback,
		addCommand,
		clearCommands,
		play,
	} = useMazeGame(level);

	return (
		<UI.Container>
			<UI.Stack w="100%" gap="sm">
				<GameHeader name={level.name} />

				<UI.Grid align="stretch">
					<UI.Grid.Col span={{ base: 12, lg: 5 }} style={{ display: "flex" }}>
						<C.MazeBoard
							level={state.level}
							playerPosition={state.playerPosition}
							direction={state.direction}
							moving={isRunning}
						/>
					</UI.Grid.Col>

					<UI.Grid.Col span={{ base: 12, lg: 7 }} style={{ display: "flex" }}>
						<C.MazeControls
							message={message}
							feedback={feedback}
							sequence={state.commands}
							activeCommandIndex={state.activeCommandIndex}
							isRunning={isRunning}
							onAddCommand={addCommand}
							onPlay={play}
							onClear={clearCommands}
						/>
					</UI.Grid.Col>
				</UI.Grid>
			</UI.Stack>
		</UI.Container>
	);
}
