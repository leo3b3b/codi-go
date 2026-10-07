import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as M from "@mantine/core";
import * as Icon from "lucide-react";
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
		<M.Grid align="center" py="md">
			<M.Grid.Col span={{ base: 12, lg: 4 }}>
				<M.Text fw={600}>{student.name ?? "—"}</M.Text>
			</M.Grid.Col>

			<M.Grid.Col span={{ base: 12, lg: 2 }}>
				<M.Group h={56}>
					{showCredential ? (
						<M.Image
							src={imageCodes[student.access_code as ImageCode].src}
							alt={imageCodes[student.access_code as ImageCode].label}
							h={56}
							w="auto"
							fit="contain"
						/>
					) : (
						<M.Text size="sm" ff="monospace" lts="0.25em">
							••••••••
						</M.Text>
					)}
				</M.Group>
			</M.Grid.Col>

			<M.Grid.Col span={{ base: 12, lg: 6 }}>
				<M.Group grow>
					<M.Button
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
					</M.Button>

					<M.Button
						onClick={() => navigate(`/escola/${schoolId}/aluno/${student.id}`)}
						leftSection={<Icon.FileText size={18} />}
					>
						Ver Registros
					</M.Button>
				</M.Group>
			</M.Grid.Col>
		</M.Grid>
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
		<M.Stack w="100%" mx="auto" gap="md">
			<title>CodiGO! | Turma</title>

			<M.Group justify="space-between" align="center" gap="md">
				<div>
					<M.Title order={1} size="h2">
						{classData.name} | Código de Acesso: {classData.access_code}
					</M.Title>

					<M.Text size="sm" c="dimmed">
						{students.length} {students.length === 1 ? "aluno" : "alunos"}
					</M.Text>
				</div>

				<M.Group gap="sm">
					<M.Button
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
					</M.Button>

					<M.Button
						variant="light"
						onClick={() => navigate(`/escola/${classData.school_id}`)}
						leftSection={<Icon.ArrowLeft size={18} />}
					>
						Voltar
					</M.Button>
				</M.Group>
			</M.Group>

			<M.Paper p="lg">
				<M.Title order={2} size="h3" mb="md">
					Alunos
				</M.Title>

				<M.Grid
					visibleFrom="lg"
					align="center"
					py="md"
					style={{
						borderBottom: "1px solid var(--mantine-color-default-border)",
					}}
				>
					<M.Grid.Col span={4}>
						<M.Text size="sm" c="dimmed" fw={700}>
							Nome
						</M.Text>
					</M.Grid.Col>

					<M.Grid.Col span={2}>
						<M.Text size="sm" c="dimmed" fw={700}>
							Credencial
						</M.Text>
					</M.Grid.Col>

					<M.Grid.Col span={6}>
						<M.Text size="sm" c="dimmed" fw={700}>
							Ações
						</M.Text>
					</M.Grid.Col>
				</M.Grid>

				<M.Stack gap={0}>
					{students.map((student) => (
						<>
							<StudentRow
								key={student.id}
								student={student}
								schoolId={classData.school_id}
							/>
							<M.Divider />
						</>
					))}
				</M.Stack>

				{students.length === 0 && (
					<M.Text size="lg" ta="center" py="xl">
						Esta turma ainda não possui alunos.
					</M.Text>
				)}
			</M.Paper>
		</M.Stack>
	);
}
