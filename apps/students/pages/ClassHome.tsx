import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as M from "@mantine/core";
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
		<M.Stack w="100%" gap="xl">
			<title>CodiGO! | Quem é você?</title>

			<M.Paper>
				<M.Grid align="center">
					<M.Grid.Col span={{ base: 12, md: 2 }}>
						<M.Image
							src="/logo.png"
							alt="Logo do CodiGO!"
							w="100%"
							maw={160}
							mx="auto"
						/>
					</M.Grid.Col>

					<M.Grid.Col span={{ base: 12, md: 7 }}>
						<M.Title order={1} ta="center">
							{classData.name}
						</M.Title>
					</M.Grid.Col>

					<M.Grid.Col span={{ base: 12, md: 3 }}>
						<M.Badge
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
						</M.Badge>
					</M.Grid.Col>
				</M.Grid>
			</M.Paper>

			<M.Paper>
				<M.Stack gap="lg">
					<M.Title order={2} ta="center">
						Quem é você?
					</M.Title>

					<M.SimpleGrid
						cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
						spacing="sm"
					>
						{students.map((student) => {
							const selected =
								selectedStudent?.id === student.id;

							return (
								<M.Button
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
								</M.Button>
							);
						})}
					</M.SimpleGrid>
				</M.Stack>
			</M.Paper>

			{selectedStudent && (
				<M.Paper>
					<M.Stack gap="lg">
						<M.Title order={2} ta="center">
							Escolha sua imagem
						</M.Title>

						<M.Group justify="center" gap="md">
							{(Object.keys(imageCodes) as ImageCode[]).map(
								(code) => {
									const imageCode = imageCodes[code];
									const selected = selectedCode === code;

									return (
										<M.ActionIcon
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
											<M.Image
												src={imageCode.src}
												alt={imageCode.label}
												w={88}
												h={88}
												fit="contain"
											/>
										</M.ActionIcon>
									);
								},
							)}
						</M.Group>

						<M.Group justify="center">
							<M.Button
								type="button"
								w="100%"
								maw={320}
								disabled={!selectedCode}
								onClick={handleStart}
							>
								Começar
							</M.Button>
						</M.Group>
					</M.Stack>
				</M.Paper>
			)}
		</M.Stack>
	);
}
