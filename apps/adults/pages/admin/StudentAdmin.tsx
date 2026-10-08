import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { EditStudentForm } from "@/forms";
import {
	getClassesBySchool,
	getStudentById,
	transferStudent,
} from "@/services";

export async function clientLoader({
	params,
}: {
	params: {
		schoolId?: string;
		studentId?: string;
	};
}) {
	if (!params.schoolId || !params.studentId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	const student = await getStudentById(params.studentId);

	if (student.school_id !== params.schoolId) {
		throw new Response("Aluno não encontrado", { status: 404 });
	}

	const classes = await getClassesBySchool(params.schoolId);

	return { student, classes };
}

export default function StudentAdminPage() {
	const { student, classes } = useLoaderData<typeof clientLoader>();
	const { revalidate } = useRevalidator();

	const [isTransferring, setIsTransferring] = useState(false);
	const [transferError, setTransferError] = useState<string | null>(null);

	async function handleTransfer(classId: string, className: string) {
		const confirmed = window.confirm(
			`Tem certeza de que quer transferir ${student.name} para a turma ${className}?`,
		);

		if (!confirmed) return;

		setIsTransferring(true);
		setTransferError(null);

		try {
			await transferStudent({
				student_id: student.id,
				class_id: classId,
			});

			await revalidate();
		} catch {
			setTransferError("Não foi possível transferir o aluno. Tente novamente.");
		} finally {
			setIsTransferring(false);
		}
	}

	return (
		<UI.Stack w="100%" gap="md">
			<title>CodiGO! | Editar Aluno</title>

			<EditStudentForm student={student} />

			<UI.Paper>
				<UI.Stack gap="lg">
					<div>
						<UI.Title order={2}>Turma do Aluno</UI.Title>

						<UI.Text size="sm" c="dimmed">
							Selecione outra turma para transferir o aluno.
						</UI.Text>
					</div>

					<UI.Divider />

					{transferError && (
						<UI.Alert>
							{transferError}
						</UI.Alert>
					)}

					<UI.Stack gap="sm">
						{classes.map((classData) => {
							const isCurrentClass =
								classData.id === student.class_id;

							return (
								<UI.Paper
									key={classData.id}
									bg={isCurrentClass ? "violet.0" : "gray.1"}
									style={{
										borderColor: isCurrentClass
											? "var(--mantine-color-violet-6)"
											: undefined,
									}}
								>
									<UI.Group
										justify="space-between"
										gap="md"
										wrap="nowrap"
									>
										<div>
											<UI.Text fw={600}>
												{classData.name}
											</UI.Text>

											{isCurrentClass && (
												<UI.Text
													size="sm"
													c="violet"
													fw={600}
												>
													Turma atual
												</UI.Text>
											)}
										</div>

										{isCurrentClass ? (
											<UI.Text
												size="sm"
												c="dimmed"
												fw={600}
											>
												Atual
											</UI.Text>
										) : (
											<UI.Button
												type="button"
												variant="default"
												w="auto"
												disabled={isTransferring}
												leftSection={
													<Icon.Shuffle size={18} />
												}
												onClick={() =>
													handleTransfer(
														classData.id,
														classData.name,
													)
												}
											>
												Transferir
											</UI.Button>
										)}
									</UI.Group>
								</UI.Paper>
							);
						})}
					</UI.Stack>
				</UI.Stack>
			</UI.Paper>
		</UI.Stack>
	);
}
