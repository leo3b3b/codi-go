import type { Route } from "+pages/ClassAdmin";
import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { requireAdmin } from "@/middlewares";
import { deleteStudent, getClassById, getStudentsByClassId } from "@/services";
import * as Self from "./ClassAdminPage";

export const clientMiddleware = [requireAdmin];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!params.classId)
		throw new Response("Turma não encontrada", { status: 404 });

	const classData = await getClassById(params.classId);
	const students = await getStudentsByClassId(params.classId);

	return { classData, students };
}

export function meta({ loaderData }: Route.MetaArgs) {
	return [
		{ title: `Gerenciar ${loaderData?.classData.name ?? "Turma"} | CodiGO!` },
	];
}

export default function ClassAdminPage({
	loaderData: { classData, students },
}: Route.ComponentProps) {
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
		const message = `Tem certeza de que quer excluir ${student_name} e todos os seus registros? Essa ação é irreversível!`;
		if (!window.confirm(message)) return;

		await deleteStudent(student_id);
		revalidate();
	}

	return (
		<UI.Container>
			<UI.Stack>
				<UI.Title order={1} style={{ overflowWrap: "anywhere" }}>
					{classData.name}
				</UI.Title>
				<Self.EditClassForm classData={classData} />

				<Self.CreateStudentForm
					class_id={classData.id}
					school_id={classData.school_id}
				/>

				<UI.Paper>
					<UI.Stack>
						<UI.Group
							justify="space-between"
							align="center"
							gap="sm"
							wrap="wrap"
						>
							<UI.Title order={2}>Gerenciar Alunos</UI.Title>

							<UI.Text size="sm" c="dimmed">
								{students.length} {students.length === 1 ? "aluno" : "alunos"}
							</UI.Text>
						</UI.Group>

						{students.length === 0 ? (
							<UI.Center py="xl">
								<UI.Text size="lg" ta="center" c="dimmed">
									Esta turma ainda não possui alunos.
								</UI.Text>
							</UI.Center>
						) : (
							<UI.Stack gap="sm">
								{students.map((student) => (
									<StudentRow
										key={student.id}
										student={student}
										onUpdate={handleUpdate}
										onDelete={handleDeleteStudent}
									/>
								))}
							</UI.Stack>
						)}
					</UI.Stack>
				</UI.Paper>
			</UI.Stack>
		</UI.Container>
	);
}

interface StudentRowProps {
	student: Awaited<ReturnType<typeof getStudentsByClassId>>[number];
	onDelete: (params: { student_id: string; student_name: string }) => void;
	onUpdate: (student_id: string) => void | Promise<void>;
}

function StudentRow({ student, onDelete, onUpdate }: StudentRowProps) {
	const [showCredential, setShowCredential] = useState(false);
	const credential = imageCodes[student.access_code as ImageCode];

	return (
		<UI.Paper>
			<UI.Stack gap="md">
				<UI.Text size="lg" fw={700} style={{ overflowWrap: "anywhere" }}>
					{student.name ?? "—"}
				</UI.Text>

				<UI.Divider />

				<UI.Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "stretch", md: "center" }}
					justify="space-between"
					gap="md"
				>
					<UI.Stack gap="xs" flex={1}>
						<UI.Flex
							direction={{ base: "column", sm: "row" }}
							align={{ base: "stretch", sm: "center" }}
							gap="sm"
						>
							<UI.Group gap="sm" align="center" wrap="nowrap" flex={1}>
								<UI.Center w={56} h={56} style={{ flex: "0 0 56px" }}>
									{showCredential ? (
										<UI.Image
											src={credential.src}
											alt={credential.label}
											w={48}
											h={48}
											fit="contain"
										/>
									) : (
										<Icon.EyeOff
											size={22}
											color="var(--mantine-color-dimmed)"
										/>
									)}
								</UI.Center>

								<UI.Text
									size="sm"
									c={showCredential ? undefined : "dimmed"}
									lineClamp={2}
									style={{ minWidth: 0, overflowWrap: "anywhere" }}
								>
									{showCredential ? credential.label : "Credencial oculta"}
								</UI.Text>
							</UI.Group>

							<UI.Button
								type="button"
								size="sm"
								w={{ base: "100%", sm: "auto" }}
								variant="default"
								leftSection={
									showCredential ? (
										<Icon.EyeOff size={18} />
									) : (
										<Icon.Eye size={18} />
									)
								}
								onClick={() => setShowCredential((current) => !current)}
							>
								{showCredential ? "Ocultar credencial" : "Mostrar credencial"}
							</UI.Button>
						</UI.Flex>
					</UI.Stack>
					<UI.Flex
						direction={{ base: "column", sm: "row" }}
						gap="sm"
						w={{ base: "100%", md: 260 }}
					>
						<UI.Button
							type="button"
							flex={1}
							leftSection={<Icon.Pencil size={18} />}
							onClick={() => onUpdate(student.id)}
						>
							Editar
						</UI.Button>

						<UI.Button
							type="button"
							flex={1}
							color="red"
							variant="light"
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
					</UI.Flex>
				</UI.Flex>
			</UI.Stack>
		</UI.Paper>
	);
}
