import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import {
	getClassById,
	getStudentsByClassId,
	setClassPlaying,
} from "@/services";

export async function clientLoader({
	params,
}: {
	params: { schoolId?: string; classId?: string };
}) {
	if (!params.schoolId || !params.classId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const [classData, students] = await Promise.all([
		getClassById(params.classId),
		getStudentsByClassId(params.classId),
	]);

	if (classData.school_id !== params.schoolId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	return { classData, students };
}

type Student = ReturnType<
	typeof useLoaderData<typeof clientLoader>
>["students"][number];

function StudentRow({
	student,
	schoolId,
}: {
	student: Student;
	schoolId: string;
}) {
	const [showCredential, setShowCredential] = useState(false);
	const navigate = useNavigate();

	return (
		<UI.Grid align="center" py="md">
			<UI.Grid.Col span={{ base: 12, lg: 4 }}>
				<UI.Text fw={600}>{student.name ?? "—"}</UI.Text>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, lg: 2 }}>
				<UI.Group h={56}>
					{showCredential ? (
						<UI.Image
							src={imageCodes[student.access_code as ImageCode].src}
							alt={imageCodes[student.access_code as ImageCode].label}
							h={56}
							w="auto"
							fit="contain"
						/>
					) : (
						<UI.Text size="sm" ff="monospace" lts="0.25em">
							••••••••
						</UI.Text>
					)}
				</UI.Group>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, lg: 6 }}>
				<UI.Group grow>
					<UI.Button
						variant="light"
						onClick={() => setShowCredential(!showCredential)}
						leftSection={
							showCredential ? (
								<Icon.EyeOff size={18} />
							) : (
								<Icon.Eye size={18} />
							)
						}
					>
						{showCredential ? "Esconder Credencial" : "Mostrar Credencial"}
					</UI.Button>

					<UI.Button
						onClick={() => navigate(`/escola/${schoolId}/aluno/${student.id}`)}
						leftSection={<Icon.FileText size={18} />}
					>
						Ver Registros
					</UI.Button>
				</UI.Group>
			</UI.Grid.Col>
		</UI.Grid>
	);
}

export default function ClassPage() {
	const { classData, students } = useLoaderData<typeof clientLoader>();
	const { revalidate } = useRevalidator();
	const navigate = useNavigate();
	const [isUpdatingPlaying, setIsUpdatingPlaying] = useState(false);

	async function handleTogglePlaying() {
		if (isUpdatingPlaying) {
			return;
		}

		setIsUpdatingPlaying(true);

		try {
			await setClassPlaying({
				class_id: classData.id,
				is_playing: !classData.is_playing,
			});

			await revalidate();
		} finally {
			setIsUpdatingPlaying(false);
		}
	}

	return (
		<UI.Stack w="100%" mx="auto" gap="md">
			<title>CodiGO! | Turma</title>

			<UI.Group justify="space-between" align="center" gap="md">
				<div>
					<UI.Title order={1} size="h2">
						{classData.name} | Código de Acesso: {classData.access_code}
					</UI.Title>

					<UI.Text size="sm" c="dimmed">
						{students.length} {students.length === 1 ? "aluno" : "alunos"}
					</UI.Text>
				</div>

				<UI.Group gap="sm">
					<UI.Button
						variant={classData.is_playing ? "filled" : "light"}
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
						{isUpdatingPlaying
							? "Atualizando…"
							: classData.is_playing
								? "Em atividade"
								: "Iniciar atividade"}
					</UI.Button>

					<UI.Button
						variant="light"
						onClick={() => navigate(`/escola/${classData.school_id}`)}
						leftSection={<Icon.ArrowLeft size={18} />}
					>
						Voltar
					</UI.Button>
				</UI.Group>
			</UI.Group>

			<UI.Paper p="lg">
				<UI.Title order={2} size="h3" mb="md">
					Alunos
				</UI.Title>

				<UI.Grid
					visibleFrom="lg"
					align="center"
					py="md"
					style={{
						borderBottom: "1px solid var(--mantine-color-default-border)",
					}}
				>
					<UI.Grid.Col span={4}>
						<UI.Text size="sm" c="dimmed" fw={700}>
							Nome
						</UI.Text>
					</UI.Grid.Col>

					<UI.Grid.Col span={2}>
						<UI.Text size="sm" c="dimmed" fw={700}>
							Credencial
						</UI.Text>
					</UI.Grid.Col>

					<UI.Grid.Col span={6}>
						<UI.Text size="sm" c="dimmed" fw={700}>
							Ações
						</UI.Text>
					</UI.Grid.Col>
				</UI.Grid>

				<UI.Stack gap={0}>
					{students.map((student) => (
						<>
							<StudentRow
								key={student.id}
								student={student}
								schoolId={classData.school_id}
							/>
							<UI.Divider />
						</>
					))}
				</UI.Stack>

				{students.length === 0 && (
					<UI.Text size="lg" ta="center" py="xl">
						Esta turma ainda não possui alunos.
					</UI.Text>
				)}
			</UI.Paper>
		</UI.Stack>
	);
}
