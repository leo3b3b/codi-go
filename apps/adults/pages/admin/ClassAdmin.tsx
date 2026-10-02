import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { Icon } from "@/components";
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

function StudentRow({ student, onDelete, onUpdate }: StudentRowProps) {
	const [showCredential, setShowCredential] = useState(false);

	return (
		<div
			className="
                grid grid-cols-[1fr_auto]
                gap-x-4 gap-y-2 py-3
                border-b-(~ border)
                lg:grid-cols-[1fr_0.5fr_3fr]
                lg:items-center
            "
		>
			<div className="font-semibold text-heading">{student.name ?? "—"}</div>

			<div className="h-14 flex items-center">
				{showCredential ? (
					<img
						src={imageCodes[student.access_code as ImageCode].src}
						aria-label={imageCodes[student.access_code as ImageCode].label}
						className="h-14"
					/>
				) : (
					<span className="text-sm text-muted font-mono tracking-widest">
						••••••••
					</span>
				)}
			</div>

			<div className="flex gap-2 col-span-2 mt-2 lg:(col-span-1 mt-0)">
				<button
					type="button"
					className="ui-button-(~ secondary) w-1/3"
					onClick={() => setShowCredential(!showCredential)}
				>
					<Icon
						icon={showCredential ? "i-lucide-eye-off" : "i-lucide-eye"}
						color="fg"
						size={5}
					/>
					{showCredential ? "Esconder Credencial" : "Mostrar Credencial"}
				</button>

				<button
					type="button"
					className="ui-button-(~ primary) w-1/3"
					onClick={() => onUpdate(student.id)}
				>
					<Icon icon={"i-lucide-pencil"} color="on-primary" size={5} />
					Editar
				</button>

				<button
					type="button"
					className="ui-button-(~ danger) w-1/3"
					onClick={() =>
						onDelete({
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
	);
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
						<StudentRow
							key={student.id}
							student={student}
							onUpdate={handleUpdate}
							onDelete={handleDeleteStudent}
						/>
					))}
				</div>
			</section>
		</div>
	);
}
