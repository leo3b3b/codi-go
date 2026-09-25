import type { Tables } from "@codi-go/supabase";
import { supabase } from "@codi-go/supabase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

type SchoolOption = Pick<Tables<"schools">, "id" | "trade_name" | "legal_name">;

type ClassOption = Pick<
	Tables<"classes">,
	"id" | "name" | "school_id" | "teacher_id"
>;

export function DashboardPage() {
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
				.from("schools")
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
					navigate(`/escola/${fallbackSchool.id}`, {
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
		navigate(`/escola/${school.id}`);
	}

	function openClass(classRoom: ClassOption) {
		if (!selectedSchool) {
			return;
		}

		navigate(`/escola/${selectedSchool.id}/turma/${classRoom.id}`);
	}

	if (loadingSchools) {
		return (
			<main className="flex min-h-full items-center justify-center">
				<div className="ui-card px-8 py-6 text-center">
					<p className="text-sm font-medium text-muted">Carregando...</p>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto grid min-h-full w-full max-w-[1450px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 lg:px-8">
			<div className="flex flex-col gap-6">
				<section className="ui-card">
					<button
						type="button"
						onClick={() => setSchoolMenuOpen((open) => !open)}
						className="flex w-full items-center justify-between gap-4 text-left"
						aria-expanded={schoolMenuOpen}
					>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-muted">
								Escola
							</p>

							<p className="mt-1 text-lg font-semibold text-heading">
								Escolha sua escola
							</p>
						</div>

						<span
							className={
								schoolMenuOpen
									? "i-lucide-chevron-up shrink-0 text-lg text-primary"
									: "i-lucide-chevron-down shrink-0 text-lg text-primary"
							}
							aria-hidden="true"
						/>
					</button>

					{schoolMenuOpen && (
						<div className="mt-5 flex flex-col gap-2">
							{schools.length === 0 ? (
								<p className="rounded-xl bg-surface-subtle px-4 py-3 text-center text-sm text-muted">
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
											className={[
												"rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
												isSelected
													? "border-primary bg-primary-soft text-heading"
													: "border-border bg-surface-subtle text-fg hover:border-primary/50 hover:bg-surface",
											].join(" ")}
										>
											{schoolName(school)}
										</button>
									);
								})
							)}
						</div>
					)}
				</section>

				<section className="ui-card">
					<button
						type="button"
						onClick={() => setClassMenuOpen((open) => !open)}
						className="flex w-full items-center justify-between gap-4 text-left"
						aria-expanded={classMenuOpen}
					>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-muted">
								Turmas
							</p>

							<p className="mt-1 text-lg font-semibold text-heading">
								Escolha sua turma
							</p>
						</div>

						<span
							className={
								classMenuOpen
									? "i-lucide-chevron-up shrink-0 text-lg text-primary"
									: "i-lucide-chevron-down shrink-0 text-lg text-primary"
							}
							aria-hidden="true"
						/>
					</button>

					{classMenuOpen && (
						<div className="mt-5 flex flex-col gap-2">
							{loadingClasses ? (
								<p className="rounded-xl bg-surface-subtle px-4 py-3 text-center text-sm text-muted">
									Carregando turmas...
								</p>
							) : classes.length === 0 ? (
								<p className="rounded-xl bg-surface-subtle px-4 py-3 text-center text-sm text-muted">
									Nenhuma turma encontrada.
								</p>
							) : (
								classes.map((classRoom) => (
									<button
										key={classRoom.id}
										type="button"
										onClick={() => openClass(classRoom)}
										className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle px-4 py-3 text-left text-sm font-semibold text-heading transition-colors hover:border-primary/50 hover:bg-primary-soft"
									>
										<span>{classRoom.name}</span>

										<span
											className="i-lucide-arrow-right text-base text-primary"
											aria-hidden="true"
										/>
									</button>
								))
							)}
						</div>
					)}
				</section>
			</div>

			<section className="ui-card flex min-h-0 flex-col">
				<div className="mb-6">
					<p className="text-xs font-semibold uppercase tracking-wide text-muted">
						Visão geral
					</p>

					<h1 className="mt-1 text-2xl font-semibold text-heading">
						Pontos fortes e fracos de cada turma
					</h1>

					<p className="mt-2 text-sm text-muted">
						Estatísticas gerais das turmas de{" "}
						<strong className="font-semibold text-fg">
							{selectedSchool
								? schoolName(selectedSchool)
								: "escola selecionada"}
						</strong>
					</p>
				</div>

				<div className="min-h-0 flex-1 rounded-2xl border border-border bg-surface-subtle p-5 sm:p-8">
					{classes.length === 0 ? (
						<div className="flex min-h-60 items-center justify-center text-center">
							<div>
								<span
									className="i-lucide-chart-no-axes-combined text-3xl text-primary"
									aria-hidden="true"
								/>

								<h2 className="mt-3 text-lg font-semibold text-heading">
									Nenhuma turma encontrada
								</h2>

								<p className="mt-2 text-sm text-muted">
									As estatísticas aparecerão aqui quando houver turmas
									cadastradas.
								</p>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-5">
							{classes.map((classRoom) => (
								<div key={classRoom.id} className="flex items-center gap-4">
									<div className="w-28 shrink-0 truncate text-right text-sm font-semibold text-heading">
										{classRoom.name}
									</div>

									<div className="h-8 min-w-0 flex-1 overflow-hidden rounded-lg bg-surface">
										<div
											className="h-full rounded-lg bg-primary transition-[width]"
											style={{ width: "0%" }}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</section>

			{error && (
				<div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-fg shadow-card">
					{error}
				</div>
			)}
		</main>
	);
}
