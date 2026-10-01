import { useLoaderData, useRevalidator } from "react-router";
import { Icon } from "@/components";
import { CreateStudentForm, EditClassForm } from "@/forms";
import type { classAdminLoader } from "@/router";
import { deleteStudent } from "@/services";

export function ClassAdminPage() {
	const { classData, students } = useLoaderData<typeof classAdminLoader>();
	const { revalidate } = useRevalidator();

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
		<div className="w-full mx-auto flex-(~ col) gap-4">
			<title>CodiGO! | Gerenciar Turma</title>

			<EditClassForm classData={classData} />

			<CreateStudentForm
				classData={{
					name: classData.name,
					id: classData.id,
					school_id: classData.school_id,
				}}
			/>

			<section className="ui-card">
				<header>
					<h2 className="text-(2xl heading) font-bold mb-4">
						Gerenciar Alunos
					</h2>
				</header>
				<div
					className="
						hidden lg:grid
						grid-cols-[1fr_0.5fr_3fr]
						gap-x-4 gap-y-2 py-3
						border-b-(~ border)
						text-(sm muted) font-bold
					"
				>
					<div>Nome</div>
					<div>Credencial</div>
					<div>Ações</div>
				</div>
				<div className="flex-(~ col) gap-4 lg:gap-0">
					{students.map((student) => (
						<div
							key={student.id}
							className="
								grid grid-cols-[1fr_auto]
								gap-x-4 gap-y-2 py-3
								border-b-(~ border)
								lg:grid-cols-[1fr_0.5fr_3fr]
								lg:items-center
							"
						>
							<div className="font-semibold text-heading">
								{student.name ?? "—"}
							</div>

							<div className="text-muted">{student.access_code ?? "—"}</div>
							<div className="flex gap-2 col-span-2 mt-2 lg:(col-span-1 mt-0)">
								<button type="button" className="ui-button-(~ secondary) w-1/3">
									<Icon icon={"i-lucide-eye"} color="fg" size={5} />
									Mostrar Credencial
								</button>
								<button type="button" className="ui-button-(~ primary) w-1/3">
									<Icon icon={"i-lucide-pencil"} color="on-primary" size={5} />
									Editar
								</button>
								<button
									type="button"
									className="ui-button-(~ danger) w-1/3"
									onClick={() =>
										handleDeleteStudent({
											student_id: student.id,
											student_name: student.name,
										})
									}
								>
									<Icon icon={"i-lucide-user-x"} color="on-danger" size={5} />
									Excluir
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
