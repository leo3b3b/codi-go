import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { CreateStudentForm, EditClassForm } from "@/forms";
import { deleteStudent, getClassById, getStudentsByClassId } from "@/services";

export async function clientLoader({
	params,
}: {
	params: { classId?: string };
}) {
	if (!params.classId) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const classData = await getClassById(params.classId);
	const students = await getStudentsByClassId(params.classId);

	return { classData, students };
}

type Student = ReturnType<
	typeof useLoaderData<typeof clientLoader>
>["students"][number];

interface StudentRowProps {
	student: Student;
	onDelete: (params: { student_id: string; student_name: string }) => void;
	onUpdate: (student_id: string) => void | Promise<void>;
}

export default function ClassAdminPage() {
	const { classData, students } = useLoaderData<typeof clientLoader>();
	const { revalidate } = useRevalidator();
	const navigate = useNavigate();

	function handleUpdate(student_id: string) {
		navigate(`/escola/${classData.school_id}/admin/aluno/${student_id}`);
	}

	async function handleDeleteStudent({
		student_id,
		student_name,
	}: {
		student_id: string;
		student_name: string;
	}) {
		const confirmed = window.confirm(
			`Tem certeza de que quer excluir ${student_name} e todos os seus registros? Essa ação é irreversível!`,
		);
		if (!confirmed) return;

		await deleteStudent(student_id);
		revalidate();
	}

	return (
		<UI.Stack w="100%" gap="md">
			<title>CodiGO! | Gerenciar Turma</title>

			<EditClassForm classData={classData} />

			<CreateStudentForm
				classData={{
					name: classData.name,
					id: classData.id,
					school_id: classData.school_id,
				}}
			/>

			<UI.Paper>
				<UI.Stack gap="md">
					<UI.Title order={2}>Gerenciar Alunos</UI.Title>

					<UI.Grid
						visibleFrom="lg"
						px="md"
						py="sm"
						style={{
							borderBottom: "1px solid var(--mantine-color-gray-3)",
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

					<UI.Stack gap="md">
						{students.map((student) => (
							<StudentRow
								key={student.id}
								student={student}
								onUpdate={handleUpdate}
								onDelete={handleDeleteStudent}
							/>
						))}
					</UI.Stack>
				</UI.Stack>
			</UI.Paper>
		</UI.Stack>
	);
}

function StudentRow({ student, onDelete, onUpdate }: StudentRowProps) {
	const [showCredential, setShowCredential] = useState(false);

	return (
		<UI.Grid
			align="center"
			px="md"
			py="sm"
			style={{
				borderBottom: "1px solid var(--mantine-color-gray-3)",
			}}
		>
			<UI.Grid.Col span={{ base: 12, lg: 4 }}>
				<UI.Text fw={600}>{student.name ?? "—"}</UI.Text>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, lg: 2 }}>
				<UI.Center h={56}>
					{showCredential ? (
						<UI.Image
							src={imageCodes[student.access_code as ImageCode].src}
							alt={imageCodes[student.access_code as ImageCode].label}
							h={56}
							w="auto"
							fit="contain"
						/>
					) : (
						<UI.Text size="sm" ff="monospace" c="dimmed">
							••••••••
						</UI.Text>
					)}
				</UI.Center>
			</UI.Grid.Col>

			<UI.Grid.Col span={{ base: 12, lg: 6 }}>
				<UI.Group gap="sm" grow>
					<UI.Button
						type="button"
						variant="default"
						leftSection={
							showCredential ? (
								<Icon.EyeOff size={18} />
							) : (
								<Icon.Eye size={18} />
							)
						}
						onClick={() => setShowCredential(!showCredential)}
					>
						{showCredential ? "Esconder Credencial" : "Mostrar Credencial"}
					</UI.Button>

					<UI.Button
						type="button"
						leftSection={<Icon.Pencil size={18} />}
						onClick={() => onUpdate(student.id)}
					>
						Editar
					</UI.Button>

					<UI.Button
						type="button"
						color="red"
						leftSection={<Icon.UserX size={18} />}
						onClick={() =>
							onDelete({
								student_id: student.id,
								student_name: student.name,
							})
						}
					>
						Excluir
					</UI.Button>
				</UI.Group>
			</UI.Grid.Col>
		</UI.Grid>
	);
}
