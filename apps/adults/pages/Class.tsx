import type { Route } from "+pages/Class";
import { Icon, notifications, UI } from "@codi-go/ui";
import { useState } from "react";
import { useRevalidator } from "react-router";
import {
	getClassById,
	getStudentsByClassId,
	setClassPlaying,
} from "@/services";
import * as Self from "./ClassPage";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!params.schoolId || !params.classId)
		throw new Response("Turma não encontrada", { status: 404 });

	const [classData, students] = await Promise.all([
		getClassById(params.classId),
		getStudentsByClassId(params.classId),
	]);

	if (classData.school_id !== params.schoolId)
		throw new Response("Turma não encontrada", { status: 404 });

	return { classData, students };
}

export function meta({ loaderData }: Route.MetaArgs) {
	return [{ title: `${loaderData?.classData.name ?? "Turma"} | CodiGO!` }];
}

export default function ClassPage({
	loaderData: { classData, students },
}: Route.ComponentProps) {
	const studentUrl = import.meta.env.VITE_STUDENT_URL;
	const { revalidate } = useRevalidator();

	const [isUpdatingPlaying, setIsUpdatingPlaying] = useState(false);

	async function handleTogglePlaying() {
		if (isUpdatingPlaying) return;

		setIsUpdatingPlaying(true);

		try {
			await setClassPlaying({
				class_id: classData.id,
				is_playing: !classData.is_playing,
			});

			await revalidate();
		} catch {
			notifications.show({
				message: "Não foi possível atualizar a atividade",
				color: "red",
				autoClose: 3000,
				withCloseButton: false,
			});
		} finally {
			setIsUpdatingPlaying(false);
		}
	}

	return (
		<UI.Container>
			<UI.Stack>
				<UI.Group justify="space-between" align="center" gap="md">
					<div>
						<UI.Title order={1}>{classData.name}</UI.Title>

						<UI.Text size="sm" c="dimmed">
							{students.length} {students.length === 1 ? "aluno" : "alunos"}
						</UI.Text>
					</div>

					<UI.Group gap="sm">
						<Self.CopyDropdown
							onCopyCode={() => Self.copyToClipboard(classData.access_code)}
							onCopyLink={() =>
								Self.copyToClipboard(`${studentUrl}/${classData.access_code}`)
							}
						/>

						<UI.Button
							variant={classData.is_playing ? "filled" : "light"}
							loading={isUpdatingPlaying}
							disabled={isUpdatingPlaying}
							onClick={handleTogglePlaying}
							leftSection={
								classData.is_playing ? (
									<Icon.CirclePause size={18} />
								) : (
									<Icon.CirclePlay size={18} />
								)
							}
						>
							{classData.is_playing ? "Em atividade" : "Iniciar atividade"}
						</UI.Button>
					</UI.Group>
				</UI.Group>

				<UI.Paper p="lg">
					<UI.Stack>
						<UI.Title order={2}>Alunos</UI.Title>
						{students.map((student) => (
							<Self.StudentRow
								key={student.id}
								student={student}
								schoolId={classData.school_id}
							/>
						))}
					</UI.Stack>

					{students.length === 0 && (
						<UI.Text size="lg" ta="center" py="xl">
							Esta turma ainda não possui alunos.
						</UI.Text>
					)}
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}
