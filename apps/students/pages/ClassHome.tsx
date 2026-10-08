import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { CodiToast } from "@/components";
import {
	getClassByAccessCode,
	getStudentsByClassId,
	signInStudent,
} from "@/services";

export async function clientLoader({ params }: LoaderFunctionArgs) {
	if (!params.accessCode) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const classData = await getClassByAccessCode(params.accessCode);

	if (!classData) {
		throw new Response("Turma não encontrada", { status: 404 });
	}

	const students = await getStudentsByClassId(classData.id);

	return { classData, students };
}

export default function ClassHome() {
	const { classData, students } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	const [selectedStudent, setSelectedStudent] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [selectedCode, setSelectedCode] = useState<ImageCode | null>(null);

	async function handleStart() {
		if (!selectedStudent || !selectedCode) {
			return;
		}

		try {
			await signInStudent({
				id: selectedStudent.id,
				name: selectedStudent.name,
				access_code: selectedCode,
			});

			navigate(`/${classData.access_code}/fases`);
		} catch {
			toast.custom((t) => (
				<CodiToast t={t} is_class_playing={classData.is_playing} />
			));
		}
	}

	return (
		<UI.Stack w="100%" gap="xl">
			<title>CodiGO! | Quem é você?</title>

			<UI.Paper>
				<UI.Grid align="center">
					<UI.Grid.Col span={{ base: 12, md: 2 }}>
						<UI.Image
							src="/logo.png"
							alt="Logo do CodiGO!"
							w="100%"
							maw={160}
							mx="auto"
						/>
					</UI.Grid.Col>

					<UI.Grid.Col span={{ base: 12, md: 7 }}>
						<UI.Title order={1} ta="center">
							{classData.name}
						</UI.Title>
					</UI.Grid.Col>

					<UI.Grid.Col span={{ base: 12, md: 3 }}>
						<UI.Badge
							size="lg"
							variant="light"
							color={classData.is_playing ? "violet" : "red"}
							leftSection={
								classData.is_playing ? (
									<Icon.LockKeyholeOpen size={18} />
								) : (
									<Icon.LockKeyhole size={18} />
								)
							}
							w="100%"
							h={44}
						>
							{classData.is_playing
								? "Sala Aberta"
								: "Sala Fechada"}
						</UI.Badge>
					</UI.Grid.Col>
				</UI.Grid>
			</UI.Paper>

			<UI.Paper>
				<UI.Stack gap="lg">
					<UI.Title order={2} ta="center">
						Quem é você?
					</UI.Title>

					<UI.SimpleGrid
						cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
						spacing="sm"
					>
						{students.map((student) => {
							const selected =
								selectedStudent?.id === student.id;

							return (
								<UI.Button
									key={student.id}
									type="button"
									variant={selected ? "filled" : "default"}
									color={selected ? "violet" : "gray"}
									fullWidth
									onClick={() => {
										setSelectedStudent({
											id: student.id,
											name: student.name,
										});
										setSelectedCode(null);
									}}
								>
									{student.name}
								</UI.Button>
							);
						})}
					</UI.SimpleGrid>
				</UI.Stack>
			</UI.Paper>

			{selectedStudent && (
				<UI.Paper>
					<UI.Stack gap="lg">
						<UI.Title order={2} ta="center">
							Escolha sua imagem
						</UI.Title>

						<UI.Group justify="center" gap="md">
							{(Object.keys(imageCodes) as ImageCode[]).map(
								(code) => {
									const imageCode = imageCodes[code];
									const selected = selectedCode === code;

									return (
										<UI.ActionIcon
											key={code}
											type="button"
											variant="default"
											size={112}
											p={8}
											radius="lg"
											aria-label={imageCode.label}
											aria-pressed={selected}
											style={{
												border: `4px solid ${selected
													? "var(--mantine-color-violet-6)"
													: "transparent"
													}`,
											}}
											onClick={() =>
												setSelectedCode(code)
											}
										>
											<UI.Image
												src={imageCode.src}
												alt={imageCode.label}
												w={88}
												h={88}
												fit="contain"
											/>
										</UI.ActionIcon>
									);
								},
							)}
						</UI.Group>

						<UI.Group justify="center">
							<UI.Button
								type="button"
								w="100%"
								maw={320}
								disabled={!selectedCode}
								onClick={handleStart}
							>
								Começar
							</UI.Button>
						</UI.Group>
					</UI.Stack>
				</UI.Paper>
			)}
		</UI.Stack>
	);
}
