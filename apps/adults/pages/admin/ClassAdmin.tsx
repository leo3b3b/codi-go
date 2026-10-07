import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as M from "@mantine/core";
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
		<M.Stack w="100%" gap="md">
			<title>CodiGO! | Gerenciar Turma</title>

			<EditClassForm classData={classData} />

			<CreateStudentForm
				classData={{
					name: classData.name,
					id: classData.id,
					school_id: classData.school_id,
				}}
			/>

			<M.Paper>
				<M.Stack gap="md">
					<M.Title order={2}>
						Gerenciar Alunos
					</M.Title>

					<M.Grid
						visibleFrom="lg"
						px="md"
						py="sm"
						style={{
							borderBottom: "1px solid var(--mantine-color-gray-3)",
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

					<M.Stack gap="md">
						{students.map((student) => (
							<StudentRow
								key={student.id}
								student={student}
								onUpdate={handleUpdate}
								onDelete={handleDeleteStudent}
							/>
						))}
					</M.Stack>
				</M.Stack>
			</M.Paper>
		</M.Stack>
	);
}

function StudentRow({ student, onDelete, onUpdate }: StudentRowProps) {
	const [showCredential, setShowCredential] = useState(false);

	return (
		<M.Grid
			align="center"
			px="md"
			py="sm"
			style={{
				borderBottom: "1px solid var(--mantine-color-gray-3)",
			}}
		>
			<M.Grid.Col span={{ base: 12, lg: 4 }}>
				<M.Text fw={600}>
					{student.name ?? "—"}
				</M.Text>
			</M.Grid.Col>

			<M.Grid.Col span={{ base: 12, lg: 2 }}>
				<M.Center h={56}>
					{showCredential ? (
						<M.Image
							src={imageCodes[student.access_code as ImageCode].src}
							alt={imageCodes[student.access_code as ImageCode].label}
							h={56}
							w="auto"
							fit="contain"
						/>
					) : (
						<M.Text
							size="sm"
							ff="monospace"
							c="dimmed"
						>
							••••••••
						</M.Text>
					)}
				</M.Center>
			</M.Grid.Col>

			<M.Grid.Col span={{ base: 12, lg: 6 }}>
				<M.Group gap="sm" grow>
					<M.Button
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
						{showCredential
							? "Esconder Credencial"
							: "Mostrar Credencial"}
					</M.Button>

					<M.Button
						type="button"
						leftSection={<Icon.Pencil size={18} />}
						onClick={() => onUpdate(student.id)}
					>
						Editar
					</M.Button>

					<M.Button
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
					</M.Button>
				</M.Group>
			</M.Grid.Col>
		</M.Grid>
	);
}