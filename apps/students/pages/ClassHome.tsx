import { type ImageCode, imageCodes } from "@codi-go/supabase";
import logo from "@codi-go/ui/images/logo.png";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router";
import { CodiToast, Icon } from "@/components";
import type { classLoader } from "@/router";
import { signInStudent } from "@/services";

export function ClassHome() {
	const { classData, students } = useLoaderData<typeof classLoader>();
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
			toast.custom((t) => <CodiToast t={t} />);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<section className="ui-card w-full grid-(~ cols-[1fr_3fr_1fr]) items-center py-2">
				<img src={logo} alt="Logo do CodiGO!" className="w-full" />

				<h1 className="text-(4xl heading center) font-bold">
					{classData.name}
				</h1>

				<div
					className={`px-4 py-2 gap-2 w-full rounded-lg flex-(~ row) items-center justify-center
						text-lg font-semibold ${
							classData.is_playing
								? "bg-primary-soft text-on-primary"
								: "bg-danger-soft text-on-danger"
						}`}
				>
					<Icon
						icon={
							classData.is_playing
								? "i-lucide-lock-keyhole-open"
								: "i-lucide-lock-keyhole"
						}
						color={classData.is_playing ? "on-primary" : "on-danger"}
						size={5}
					/>
					{classData.is_playing ? "Sala Aberta" : "Sala Fechada"}
				</div>
			</section>

			<section className="ui-card flex flex-col gap-4">
				<h2 className="text-(2xl heading center) font-bold">Quem é você?</h2>

				<div className="grid-(~ cols-1) sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-3">
					{students.map((student) => {
						const selected = selectedStudent?.id === student.id;

						return (
							<button
								key={student.id}
								type="button"
								className={`ui-button w-auto ${
									selected ? "ui-button-primary" : "ui-button-secondary"
								}`}
								onClick={() => {
									setSelectedStudent({
										id: student.id,
										name: student.name,
									});
									setSelectedCode(null);
								}}
							>
								{student.name}
							</button>
						);
					})}
				</div>
			</section>

			{selectedStudent && (
				<section className="ui-card flex flex-col gap-4">
					<h2 className="text-(2xl heading center) font-bold">
						Escolha sua imagem
					</h2>

					<div className="flex flex-wrap justify-center gap-4">
						{(Object.keys(imageCodes) as ImageCode[]).map((code) => {
							const imageCode = imageCodes[code];
							const selected = selectedCode === code;

							return (
								<button
									key={code}
									type="button"
									className={`rounded-xl border-4 p-2 transition cursor-pointer ${
										selected ? "border-primary" : "border-transparent"
									}`}
									onClick={() => setSelectedCode(code)}
								>
									<img
										src={imageCode.src}
										alt={imageCode.label}
										className="h-24 w-24 object-contain"
									/>
								</button>
							);
						})}
					</div>

					<div className="flex justify-center">
						<button
							type="button"
							className="ui-button-(~ primary)"
							disabled={!selectedCode}
							onClick={handleStart}
						>
							Começar
						</button>
					</div>
				</section>
			)}
		</div>
	);
}
