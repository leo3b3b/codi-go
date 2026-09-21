import type { Tables } from "@codi-go/supabase";
import { supabase } from "@codi-go/supabase";
import logo from "@codi-go/ui/images/logo.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

type SchoolOption = Pick<Tables<"school">, "id" | "trade_name" | "legal_name">;

type ClassOption = Pick<
	Tables<"classes">,
	"id" | "name" | "school_id" | "teacher_id"
>;

export function TeacherHome() {
	const navigate = useNavigate();
	const { schoolId } = useParams<{ schoolId: string }>();

	const [schools, setSchools] = useState<SchoolOption[]>([]);
	const [classes, setClasses] = useState<ClassOption[]>([]);
	const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(
		null,
	);

	const [schoolMenuOpen, setSchoolMenuOpen] = useState(true);
	const [classMenuOpen, setClassMenuOpen] = useState(true);

	const [loadingSchools, setLoadingSchools] = useState(true);
	const [loadingClasses, setLoadingClasses] = useState(false);

	const [error, setError] = useState("");

	useEffect(() => {
		async function loadSchools() {
			setLoadingSchools(true);
			setError("");

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				navigate("/login", { replace: true });
				return;
			}

			const { data: schoolLinks, error: schoolLinksError } = await supabase
				.from("school_memberships")
				.select("school_id")
				.eq("profile_id", user.id)
				.eq("status", "active");

			if (schoolLinksError) {
				setError("Não foi possível carregar suas escolas.");
				setLoadingSchools(false);
				return;
			}

			const schoolIds = (schoolLinks ?? []).map((item) => item.school_id);

			if (schoolIds.length === 0) {
				setSchools([]);
				setSelectedSchool(null);
				setLoadingSchools(false);
				return;
			}

			const { data: schoolData, error: schoolError } = await supabase
				.from("school")
				.select("id, trade_name, legal_name")
				.in("id", schoolIds)
				.eq("is_active", true)
				.order("trade_name");

			if (schoolError) {
				setError("Não foi possível carregar suas escolas.");
				setLoadingSchools(false);
				return;
			}

			const loadedSchools: SchoolOption[] = schoolData ?? [];

			setSchools(loadedSchools);

			const currentSchool = loadedSchools.find(
				(school) => school.id === schoolId,
			);

			if (!currentSchool) {
				const fallbackSchool = loadedSchools[0] ?? null;

				if (fallbackSchool) {
					navigate(`/${fallbackSchool.id}/dashboard`, {
						replace: true,
					});
				}

				setSelectedSchool(fallbackSchool);
				setLoadingSchools(false);
				return;
			}

			setSelectedSchool(currentSchool);
			setLoadingSchools(false);
		}

		void loadSchools();
	}, [navigate, schoolId]);

	useEffect(() => {
		async function loadClasses() {
			if (!selectedSchool) {
				setClasses([]);
				setLoadingClasses(false);
				return;
			}

			setLoadingClasses(true);
			setError("");

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				navigate("/login", { replace: true });
				return;
			}

			const { data: membership, error: membershipError } = await supabase
				.from("school_memberships")
				.select("role")
				.eq("school_id", selectedSchool.id)
				.eq("profile_id", user.id)
				.eq("status", "active")
				.maybeSingle();

			if (membershipError) {
				setError("Não foi possível verificar seu acesso à escola.");
				setClasses([]);
				setLoadingClasses(false);
				return;
			}

			if (!membership) {
				setError("Você não possui acesso a esta escola.");
				setClasses([]);
				setLoadingClasses(false);
				return;
			}

			let query = supabase
				.from("classes")
				.select("id, name, school_id, teacher_id")
				.eq("school_id", selectedSchool.id)
				.order("name");

			if (membership.role === "teacher") {
				query = query.eq("teacher_id", user.id);
			}

			const { data: classData, error: classError } = await query;

			if (classError) {
				setError("Não foi possível carregar suas turmas.");
				setClasses([]);
				setLoadingClasses(false);
				return;
			}

			setClasses(classData ?? []);
			setLoadingClasses(false);
		}

		void loadClasses();
	}, [navigate, selectedSchool]);

	function schoolName(school: SchoolOption) {
		return school.trade_name || school.legal_name;
	}

	function selectSchool(school: SchoolOption) {
		setSelectedSchool(school);
		navigate(`/${school.id}/dashboard`);
	}

	function openClass(classRoom: ClassOption) {
		if (!selectedSchool) {
			return;
		}

		navigate(`/${selectedSchool.id}/turmas/${classRoom.id}`);
	}

	if (loadingSchools) {
		return (
			<main className="flex h-screen items-center justify-center bg-[#e2c7e5]">
				<p className="text-2xl font-bold text-[#372a58]">Carregando...</p>
			</main>
		);
	}

	return (
		<main className="h-screen overflow-hidden bg-gradient-to-br from-[#c6a0ea] via-[#f0ddd4] to-[#c8a0eb]">
			<header className="relative h-20 shrink-0 bg-[rgba(112,86,204,0.76)] shadow-lg">
				<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
					<button
						type="button"
						onClick={() => {
							if (selectedSchool) {
								navigate(`/${selectedSchool.id}/dashboard`);
							}
						}}
						className="flex items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
						aria-label="Ir para a página inicial"
					>
						<img src={logo} alt="CodiGO!" className="h-11 w-auto" />
					</button>

					<nav className="absolute left-1/2 flex h-full -translate-x-1/2 items-center gap-2 text-base font-bold text-white">
						<button
							type="button"
							onClick={() => {
								if (selectedSchool) {
									navigate("/meu-perfil");
								}
							}}
							className="h-full px-5 transition-opacity hover:opacity-80"
						>
							Configurações
						</button>

						<button
							type="button"
							onClick={() => {
								if (selectedSchool) {
									navigate(`/${selectedSchool.id}/turmas`);
								}
							}}
							className="h-full border-b-3 border-white px-5"
							aria-current="page"
						>
							Turmas
						</button>

						<button
							type="button"
							onClick={() => {
								if (selectedSchool) {
									navigate(`/${selectedSchool.id}/medias`);
								}
							}}
							className="h-full px-5 transition-opacity hover:opacity-80"
						>
							Médias
						</button>
					</nav>

					<div className="min-w-40 text-right text-base font-bold text-white">
						{selectedSchool ? schoolName(selectedSchool) : "Escola"}
					</div>
				</div>
			</header>

			<section className="mx-auto grid h-[calc(100vh-96px)] max-w-[1450px] grid-cols-[380px_1fr] gap-14 px-10 py-12">
				<div className="flex flex-col gap-9">
					<div className="rounded-[2rem] bg-white p-7 shadow-2xl">
						<button
							type="button"
							onClick={() => setSchoolMenuOpen(!schoolMenuOpen)}
							className="flex w-full items-center justify-center gap-4 text-2xl text-black"
							aria-expanded={schoolMenuOpen}
						>
							Escolha sua escola
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d={schoolMenuOpen ? "M6 15L12 9L18 15" : "M6 9L12 15L18 9"}
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						{schoolMenuOpen && (
							<div className="mt-7 flex flex-col gap-4">
								{schools.length === 0 ? (
									<p className="py-4 text-center text-[#716886]">
										Nenhuma escola encontrada.
									</p>
								) : (
									schools.map((school) => {
										const isSelected = school.id === selectedSchool?.id;

										return (
											<button
												key={school.id}
												type="button"
												onClick={() => selectSchool(school)}
												className={`rounded-2xl px-5 py-4 text-xl font-medium transition ${
													isSelected
														? "bg-gradient-to-r from-[#df9cf4] via-[#e5c4e8] to-[#fff0bd] text-[#3267d9]"
														: "bg-[#d8d8d8] text-[#3267d9] hover:bg-[#cfcfcf]"
												}`}
											>
												{schoolName(school)}
											</button>
										);
									})
								)}
							</div>
						)}
					</div>

					<div className="rounded-[2rem] bg-white p-7 shadow-2xl">
						<button
							type="button"
							onClick={() => setClassMenuOpen(!classMenuOpen)}
							className="flex w-full items-center justify-center gap-4 text-2xl text-black"
							aria-expanded={classMenuOpen}
						>
							Escolha sua turma
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d={classMenuOpen ? "M6 15L12 9L18 15" : "M6 9L12 15L18 9"}
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						{classMenuOpen && (
							<div className="mt-7 flex flex-col gap-4">
								{loadingClasses ? (
									<p className="py-4 text-center text-[#716886]">
										Carregando turmas...
									</p>
								) : classes.length === 0 ? (
									<p className="py-4 text-center text-[#716886]">
										Nenhuma turma encontrada.
									</p>
								) : (
									classes.map((classRoom) => (
										<button
											key={classRoom.id}
											type="button"
											onClick={() => openClass(classRoom)}
											className="rounded-2xl border-2 border-[#8c62c9] bg-[#eedcff] px-5 py-4 text-xl font-bold text-black shadow-sm transition hover:bg-[#e5d0f7] hover:shadow-md"
										>
											{classRoom.name}
										</button>
									))
								)}
							</div>
						)}
					</div>
				</div>

				<div className="flex min-h-0 flex-col rounded-[2rem] bg-white/85 p-10 shadow-2xl">
					<div className="mb-6 self-start rounded-full bg-purple px-6 py-3 text-2xl shadow-lg">
						Pontos fortes e fracos de cada turma
					</div>

					<div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl bg-white p-8">
						<div className="w-full">
							<p className="mb-8 text-center text-lg text-[#716886]">
								Estatísticas gerais das turmas de{" "}
								<strong>
									{selectedSchool
										? schoolName(selectedSchool)
										: "escola selecionada"}
								</strong>
							</p>

							{classes.length === 0 ? (
								<div className="py-16 text-center">
									<h2 className="text-3xl font-bold text-[#372a58]">
										Nenhuma turma encontrada
									</h2>

									<p className="mt-3 text-lg text-[#716886]">
										As estatísticas aparecerão aqui quando houver turmas
										cadastradas.
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-5">
									{classes.map((classRoom) => (
										<div key={classRoom.id} className="flex items-center gap-5">
											<div className="w-32 text-right text-lg font-bold text-[#372a58]">
												{classRoom.name}
											</div>

											<div className="h-10 flex-1 overflow-hidden rounded-xl bg-[#eee9f4]">
												<div
													className="h-full rounded-xl bg-[#8f68e8]"
													style={{
														width: "0%",
													}}
												/>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{error && (
				<div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-[#fff0f2] px-6 py-4 text-[#8e2331] shadow-xl">
					{error}
				</div>
			)}
		</main>
	);
}
