import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { Icon } from "@/components";
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
		<div
			className="
				grid grid-cols-[1fr_auto]
				gap-x-4 gap-y-2 py-3
				border-b-(~ border)
				lg:grid-cols-[1fr_0.5fr_2fr]
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
					className="ui-button-(~ secondary) w-1/2"
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
					className="ui-button-(~ primary) w-1/2"
					onClick={() => navigate(`/escola/${schoolId}/aluno/${student.id}`)}
				>
					<Icon icon="i-lucide-file-text" color="on-primary" size={5} />
					Ver Registros
				</button>
			</div>
		</div>
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
		<div className="w-full mx-auto flex-(~ col) gap-4">
			<title>CodiGO! | Turma</title>

			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-(2xl heading) font-bold">
						{classData.name} ({classData.access_code})
					</h1>

					<p className="text-(sm muted)">
						{students.length} {students.length === 1 ? "aluno" : "alunos"}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						className={`w-auto ui-button ${
							classData.is_playing ? "ui-button-primary" : "ui-button-secondary"
						}`}
						disabled={isUpdatingPlaying}
						onClick={handleTogglePlaying}
					>
						<Icon
							icon={
								classData.is_playing
									? "i-lucide-circle-pause"
									: "i-lucide-circle-play"
							}
							color={classData.is_playing ? "on-primary" : "fg"}
							size={5}
						/>
						{isUpdatingPlaying
							? "Atualizando…"
							: classData.is_playing
								? "Em atividade"
								: "Iniciar atividade"}
					</button>

					<button
						type="button"
						className="ui-button-(~ secondary) w-auto"
						onClick={() => navigate(`/escola/${classData.school_id}`)}
					>
						<Icon icon="i-lucide-arrow-left" size={5} color="fg" />
						Voltar
					</button>
				</div>
			</header>

			<section className="ui-card">
				<header>
					<h2 className="text-(2xl heading) font-bold mb-4">Alunos</h2>
				</header>

				<div
					className="
						hidden lg:grid
						grid-cols-[1fr_0.5fr_2fr]
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
							schoolId={classData.school_id}
						/>
					))}
				</div>

				{students.length === 0 && (
					<p className="text-(lg center) py-6">
						Esta turma ainda não possui alunos.
					</p>
				)}
			</section>
		</div>
	);
}
