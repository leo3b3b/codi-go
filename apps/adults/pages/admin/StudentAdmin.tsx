import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { HorizontalSeparator, Icon } from "@/components";
import { EditStudentForm } from "@/forms";
import type { studentAdminLoader } from "@/router";
import { transferStudent } from "@/services";

export function StudentAdminPage() {
	const { student, classes } = useLoaderData<typeof studentAdminLoader>();
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
		<div className="w-full mx-auto flex-(~ col) gap-4">
			<title>CodiGO! | Editar Aluno</title>

			<EditStudentForm student={student} />

			<section className="ui-card">
				<header>
					<h2 className="text-(2xl heading) font-bold">Turma do Aluno</h2>
					<p className="text-(sm muted)">
						Selecione outra turma para transferir o aluno.
					</p>
					<HorizontalSeparator />
				</header>

				{transferError && (
					<p role="alert" className="ui-alert-danger mb-4">
						{transferError}
					</p>
				)}

				<div className="flex-(~ col) gap-2">
					{classes.map((classData) => {
						const isCurrentClass = classData.id === student.class_id;

						return (
							<article
								key={classData.id}
								className={`
									flex-(~ row) items-center justify-between gap-4
									rounded-xl border-(~ border)
									px-4 py-3
									${
										isCurrentClass
											? "bg-primary-soft/40 border-primary"
											: "bg-surface-subtle"
									}
								`}
							>
								<div>
									<h3 className="font-semibold text-heading">
										{classData.name}
									</h3>

									{isCurrentClass && (
										<p className="text-(sm primary) font-semibold">
											Turma atual
										</p>
									)}
								</div>

								{isCurrentClass ? (
									<span className="text-(sm muted) font-semibold">Atual</span>
								) : (
									<button
										type="button"
										disabled={isTransferring}
										onClick={() => handleTransfer(classData.id, classData.name)}
										className="ui-button-(~ secondary) w-auto"
									>
										<Icon icon="i-lucide-shuffle" color="fg" size={5} />
										Transferir
									</button>
								)}
							</article>
						);
					})}
				</div>
			</section>
		</div>
	);
}
