import type { Route } from "+pages/ClassHome";
import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { UI } from "@codi-go/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
	getClassByAccessCode,
	getStudentsByClassId,
	signInStudent,
} from "@/services";
import * as Self from "./ClassHomePage/components";

type Students = Awaited<ReturnType<typeof getStudentsByClassId>>;
type Student = Students[number];
type SelectedStudent = Pick<Student, "id" | "name">;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!params.accessCode)
		throw new Response("Turma não encontrada", { status: 404 });

	const classData = await getClassByAccessCode(params.accessCode);
	if (!classData) throw new Response("Turma não encontrada", { status: 404 });

	const students = await getStudentsByClassId(classData.id);

	return { classData, students };
}

export default function ClassHomePage({
	loaderData: { classData, students },
}: Route.ComponentProps) {
	const navigate = useNavigate();

	const [selectedStudent, setSelectedStudent] =
		useState<SelectedStudent | null>(null);

	const [selectedCode, setSelectedCode] = useState<ImageCode | null>(null);

	function handleSelectStudent(student: Student) {
		setSelectedStudent({
			id: student.id,
			name: student.name,
		});
		setSelectedCode(null);
	}

	async function handleStart() {
		if (!selectedStudent || !selectedCode) return;

		try {
			await signInStudent({
				id: selectedStudent.id,
				name: selectedStudent.name,
				access_code: selectedCode,
			});

			navigate(`/${classData.access_code}/fases`);
		} catch {
			Self.showCodiToast(classData.is_playing);
		}
	}

	return (
		<UI.Container>
			<title>Quem é você? | CodiGO!</title>
			<UI.Stack>
				<Self.ClassHeader classData={classData} />

				<StudentPicker
					students={students}
					selectedStudentId={selectedStudent?.id ?? null}
					onSelect={handleSelectStudent}
				/>

				{selectedStudent && (
					<StudentImageStep
						selectedCode={selectedCode}
						onSelectCode={setSelectedCode}
						onStart={handleStart}
					/>
				)}
			</UI.Stack>
		</UI.Container>
	);
}

type StudentPickerProps = {
	students: Students;
	selectedStudentId: string | null;
	onSelect: (student: Student) => void;
};

const StudentPicker = ({
	students,
	selectedStudentId,
	onSelect,
}: StudentPickerProps) => (
	<UI.Paper>
		<UI.Stack gap="lg">
			<UI.Title order={2}>Quem é você?</UI.Title>

			<UI.SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="sm">
				{students.map((student) => {
					const selected = selectedStudentId === student.id;

					return (
						<UI.Button
							key={student.id}
							type="button"
							variant={selected ? "filled" : "default"}
							color={selected ? "violet" : "gray"}
							fullWidth
							onClick={() => onSelect(student)}
						>
							{student.name}
						</UI.Button>
					);
				})}
			</UI.SimpleGrid>
		</UI.Stack>
	</UI.Paper>
);

type StudentImageStepProps = {
	selectedCode: ImageCode | null;
	onSelectCode: (code: ImageCode) => void;
	onStart: () => void;
};

const StudentImageStep = ({
	selectedCode,
	onSelectCode,
	onStart,
}: StudentImageStepProps) => (
	<UI.Paper>
		<UI.Stack gap="lg">
			<UI.Title order={2}>Escolha sua imagem</UI.Title>

			<ImageCodePicker selectedCode={selectedCode} onSelect={onSelectCode} />

			<UI.Group justify="center">
				<UI.Button
					type="button"
					w="100%"
					maw={320}
					disabled={!selectedCode}
					onClick={onStart}
				>
					Começar
				</UI.Button>
			</UI.Group>
		</UI.Stack>
	</UI.Paper>
);

type ImageCodePickerProps = {
	selectedCode: ImageCode | null;
	onSelect: (code: ImageCode) => void;
};

const ImageCodePicker = ({ selectedCode, onSelect }: ImageCodePickerProps) => (
	<UI.Group justify="center" gap="md">
		{(Object.keys(imageCodes) as ImageCode[]).map((code) => (
			<UI.ActionIcon
				key={code}
				type="button"
				variant="default"
				size={110}
				p={8}
				radius="lg"
				aria-label={imageCodes[code].label}
				aria-pressed={selectedCode === code}
				style={{
					border: `4px solid ${
						selectedCode === code
							? "var(--mantine-color-violet-6)"
							: "transparent"
					}`,
				}}
				onClick={() => onSelect(code)}
			>
				<UI.Image
					src={imageCodes[code].src}
					alt={imageCodes[code].label}
					w={88}
					h={88}
					fit="contain"
				/>
			</UI.ActionIcon>
		))}
	</UI.Group>
);
