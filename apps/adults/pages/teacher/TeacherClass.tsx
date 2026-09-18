import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "@codi-go/supabase";
import logo from "@codi-go/ui/images/logo.png";
import type { Student, ClassRoom, School } from "@codi-go/supabase/types";

type OrderOption = "az" | "za";
type LevelOption = "high" | "low";

const FILTERS_KEY = "codi-go:teacher-class-filters";

function TeacherClass() {
    const navigate = useNavigate();
    const { classId } = useParams();

    const [school, setSchool] = useState<School | null>(null);
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);
    const [students, setStudents] = useState<Student[]>([]);

    const [order, setOrder] = useState<OrderOption>("az");
    const [levelOrder, setLevelOrder] = useState<LevelOption>("high");
    const [search, setSearch] = useState("");

    const [orderOpen, setOrderOpen] = useState(false);
    const [levelOpen, setLevelOpen] = useState(false);
    const [classOpen, setClassOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function loadClass() {
            if (!classId) {
                setError("Turma não encontrada.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            const {
                data: classData,
                error: classError,
            } = await supabase
                .from("classes")
                .select("id, name, school_id")
                .eq("id", classId)
                .single();

            if (classError || !classData) {
                setError("Não foi possível carregar a turma.");
                setLoading(false);
                return;
            }

            setSelectedClass(classData);

            const {
                data: schoolData,
                error: schoolError,
            } = await supabase
                .from("school")
                .select("id, trade_name, legal_name")
                .eq("id", classData.school_id)
                .single();

            if (!schoolError && schoolData) {
                setSchool({
                    id: schoolData.id,
                    name: schoolData.trade_name || schoolData.legal_name,
                });
            }

            const {
                data: classList,
                error: classListError,
            } = await supabase
                .from("classes")
                .select("id, name, school_id")
                .eq("school_id", classData.school_id)
                .order("name");

            if (!classListError) {
                setClasses(classList ?? []);
            }

            const {
                data: studentsData,
                error: studentsError,
            } = await supabase
                .from("students")
                .select("id, name")
                .eq("class_id", classId)
                .order("name");

            if (studentsError) {
                setError("Não foi possível carregar os alunos.");
                setLoading(false);
                return;
            }

            const studentIds = (studentsData ?? []).map(
                (student) => student.id,
            );

            const levels = new Map<string, number>();

            if (studentIds.length > 0) {
                const { data: progressData } = await supabase
                    .from("progress")
                    .select("student_id, level_id")
                    .in("student_id", studentIds);

                for (const progress of progressData ?? []) {
                    const currentLevel =
                        levels.get(progress.student_id) ?? 0;

                    if (progress.level_id > currentLevel) {
                        levels.set(progress.student_id, progress.level_id);
                    }
                }
            }

            setStudents(
                (studentsData ?? []).map((student) => ({
                    id: student.id,
                    name: student.name,
                    level: levels.has(student.id)
                        ? levels.get(student.id)!
                        : null,
                })),
            );

            setLoading(false);
        }

        loadClass();
    }, [classId]);

    useEffect(() => {
        const savedFilters = localStorage.getItem(FILTERS_KEY);

        if (!savedFilters) {
            return;
        }

        try {
            const filters = JSON.parse(savedFilters);

            if (filters.order === "az" || filters.order === "za") {
                setOrder(filters.order);
            }

            if (
                filters.levelOrder === "high" ||
                filters.levelOrder === "low"
            ) {
                setLevelOrder(filters.levelOrder);
            }

            if (typeof filters.search === "string") {
                setSearch(filters.search);
            }
        } catch {
            localStorage.removeItem(FILTERS_KEY);
        }
    }, []);

    const filteredStudents = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        const result = students.filter((student) =>
            student.name.toLowerCase().includes(normalizedSearch),
        );

        result.sort((a, b) => {
            if (levelOrder === "high") {
                const levelA = a.level ?? -1;
                const levelB = b.level ?? -1;

                if (levelA !== levelB) {
                    return levelB - levelA;
                }
            }

            if (levelOrder === "low") {
                const levelA = a.level ?? Number.MAX_SAFE_INTEGER;
                const levelB = b.level ?? Number.MAX_SAFE_INTEGER;

                if (levelA !== levelB) {
                    return levelA - levelB;
                }
            }

            const comparison = a.name.localeCompare(b.name, "pt-BR");

            return order === "az" ? comparison : -comparison;
        });

        return result;
    }, [students, search, order, levelOrder]);

    function saveFilters() {
        localStorage.setItem(
            FILTERS_KEY,
            JSON.stringify({
                order,
                levelOrder,
                search,
            }),
        );

        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 1800);
    }

    function selectClass(nextClass: ClassRoom) {
        setClassOpen(false);
        navigate(`/app/turma/${nextClass.id}`);
    }

    function goToHome() {
        navigate("/app");
    }

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-[#c9a8ed] via-[#f1dfd4] to-[#c9a8ed]">
            <header className="h-20 shrink-0 bg-gradient-to-r from-[#5541a9] to-[#7254d5] shadow-lg">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                    <button
                        type="button"
                        onClick={goToHome}
                        className="flex items-center"
                        aria-label="Voltar para a página inicial"
                    >
                        <img
                            src={logo}
                            alt="CodiGO!"
                            className="h-11 w-auto"
                        />
                    </button>

                    <nav className="flex items-center gap-8 text-sm font-semibold text-white">
                        <button
                            type="button"
                            onClick={() => navigate("/app/configuracoes")}
                            className="transition-opacity hover:opacity-80"
                        >
                            Configurações
                        </button>

                        <button
                            type="button"
                            className="border-b-2 border-white pb-1"
                        >
                            Turmas
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/app/medias")}
                            className="transition-opacity hover:opacity-80"
                        >
                            Médias
                        </button>
                    </nav>

                    <div className="min-w-40 text-right text-sm font-semibold text-white">
                        {school?.name ?? "Escola"}
                    </div>
                </div>
            </header>

            <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-7xl flex-col overflow-hidden px-6 py-5">
                <div className="mb-4 flex shrink-0 items-center justify-between">
                    <button
                        type="button"
                        onClick={goToHome}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#5541a9] transition hover:bg-white/50"
                    >
                        <span
                            className="i-lucide-arrow-left text-base"
                            aria-hidden="true"
                        />
                        Voltar
                    </button>

                    <h1 className="text-xl font-bold text-[#372a58]">
                        {selectedClass?.name ?? "Turma"}
                    </h1>

                    <div className="w-20" />
                </div>

                {loading ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center">
                        <div className="rounded-2xl bg-white/80 px-6 py-4 text-sm font-medium text-[#5541a9] shadow-sm">
                            Carregando turma...
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center">
                        <div className="rounded-2xl bg-white/90 px-6 py-4 text-sm font-medium text-red-700 shadow-sm">
                            {error}
                        </div>
                    </div>
                ) : (
                    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                        <aside className="min-h-0 overflow-visible">
                            <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white/90 p-4 shadow-md backdrop-blur-sm">
                                <div className="mb-4">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#716886]">
                                        Turma
                                    </p>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setClassOpen((open) => !open)
                                            }
                                            className="flex w-full items-center justify-between rounded-xl border border-[#ded8ea] bg-[#f5f2fb] px-3 py-2.5 text-sm font-bold text-[#372a58] transition hover:border-[#7254d5]"
                                            aria-expanded={classOpen}
                                        >
                                            <span className="truncate">
                                                {selectedClass?.name ??
                                                    "Selecionar turma"}
                                            </span>

                                            <span
                                                className={`i-lucide-chevron-${classOpen ? "up" : "down"} ml-2 shrink-0 text-base text-[#7254d5]`}
                                                aria-hidden="true"
                                            />
                                        </button>

                                        {classOpen && (
                                            <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[#ded8ea] bg-white p-1.5 shadow-xl">
                                                {classes.length === 0 ? (
                                                    <p className="px-3 py-2 text-sm text-[#716886]">
                                                        Nenhuma turma encontrada.
                                                    </p>
                                                ) : (
                                                    classes.map(
                                                        (classRoom) => (
                                                            <button
                                                                key={
                                                                    classRoom.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    selectClass(
                                                                        classRoom,
                                                                    )
                                                                }
                                                                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                                                                    classRoom.id ===
                                                                    selectedClass?.id
                                                                        ? "bg-[#f1edff] font-bold text-[#5541a9]"
                                                                        : "text-[#716886] hover:bg-[#f5f2fb] hover:text-[#372a58]"
                                                                }`}
                                                            >
                                                                {
                                                                    classRoom.name
                                                                }
                                                            </button>
                                                        ),
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-[#372a58]">
                                            Alunos
                                        </p>

                                        <p className="text-xs text-[#716886]">
                                            {students.length}{" "}
                                            {students.length === 1
                                                ? "aluno"
                                                : "alunos"}
                                        </p>
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                    <div className="space-y-2">
                                        {students.length === 0 ? (
                                            <div className="rounded-xl bg-[#f5f2fb] px-3 py-4 text-center text-xs text-[#716886]">
                                                Esta turma ainda não possui
                                                alunos.
                                            </div>
                                        ) : (
                                            filteredStudents.map((student) => (
                                                <div
                                                    key={student.id}
                                                    className="flex items-center gap-3 rounded-xl border border-[#ebe7f2] bg-white px-3 py-2.5 shadow-sm"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1edff] text-[#7254d5]">
                                                        <span
                                                            className="i-lucide-user-round text-lg"
                                                            aria-hidden="true"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-[#372a58]">
                                                            {student.name}
                                                        </p>

                                                        <p className="text-xs text-[#716886]">
                                                            {student.level !==
                                                            null
                                                                ? `Nível ${student.level}`
                                                                : "Sem nível registrado"}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 rounded-lg bg-[#f1edff] px-2 py-1 text-[11px] font-bold text-[#5541a9]">
                                                        {student.level !== null
                                                            ? `lvl.${student.level}`
                                                            : "lvl.—"}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="flex min-h-0 flex-col rounded-2xl bg-white/90 p-5 shadow-md backdrop-blur-sm">
                            <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-[#372a58]">
                                        Alunos da turma
                                    </h2>

                                    <p className="mt-1 text-sm text-[#716886]">
                                        Organize a visualização dos alunos
                                        usando os filtros abaixo.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={saveFilters}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#7254d5] px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#6245c5]"
                                >
                                    <span
                                        className="i-lucide-save text-base"
                                        aria-hidden="true"
                                    />
                                    {saved ? "Filtros salvos" : "Salvar filtros"}
                                </button>
                            </div>

                            <div className="mb-4 grid shrink-0 grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
                                <label className="relative block">
                                    <span className="sr-only">
                                        Buscar aluno
                                    </span>

                                    <span
                                        className="i-lucide-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#716886]"
                                        aria-hidden="true"
                                    />

                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Buscar aluno..."
                                        className="w-full rounded-xl border border-[#ded8ea] bg-[#f5f2fb] py-2.5 pl-10 pr-3 text-sm text-[#302746] outline-none transition placeholder:text-[#716886] focus:border-[#7254d5] focus:ring-4 focus:ring-[#7254d5]/15"
                                    />
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOrderOpen((open) => !open)
                                        }
                                        className="flex w-full items-center justify-between rounded-xl border border-[#ded8ea] bg-[#f5f2fb] px-3 py-2.5 text-sm font-semibold text-[#372a58] transition hover:border-[#7254d5]"
                                        aria-expanded={orderOpen}
                                    >
                                        <span>
                                            {order === "az"
                                                ? "A → Z"
                                                : "Z → A"}
                                        </span>

                                        <span
                                            className={`i-lucide-chevron-${orderOpen ? "up" : "down"} text-base text-[#7254d5]`}
                                            aria-hidden="true"
                                        />
                                    </button>

                                    {orderOpen && (
                                        <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-[#ded8ea] bg-white p-1.5 shadow-xl">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOrder("az");
                                                    setOrderOpen(false);
                                                }}
                                                className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${
                                                    order === "az"
                                                        ? "bg-[#f1edff] font-bold text-[#5541a9]"
                                                        : "text-[#716886] hover:bg-[#f5f2fb]"
                                                }`}
                                            >
                                                A → Z
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOrder("za");
                                                    setOrderOpen(false);
                                                }}
                                                className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${
                                                    order === "za"
                                                        ? "bg-[#f1edff] font-bold text-[#5541a9]"
                                                        : "text-[#716886] hover:bg-[#f5f2fb]"
                                                }`}
                                            >
                                                Z → A
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLevelOpen((open) => !open)
                                        }
                                        className="flex w-full items-center justify-between rounded-xl border border-[#ded8ea] bg-[#f5f2fb] px-3 py-2.5 text-sm font-semibold text-[#372a58] transition hover:border-[#7254d5]"
                                        aria-expanded={levelOpen}
                                    >
                                        <span>
                                            {levelOrder === "high"
                                                ? "Maior nível"
                                                : "Menor nível"}
                                        </span>

                                        <span
                                            className={`i-lucide-chevron-${levelOpen ? "up" : "down"} text-base text-[#7254d5]`}
                                            aria-hidden="true"
                                        />
                                    </button>

                                    {levelOpen && (
                                        <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-[#ded8ea] bg-white p-1.5 shadow-xl">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLevelOrder("high");
                                                    setLevelOpen(false);
                                                }}
                                                className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${
                                                    levelOrder === "high"
                                                        ? "bg-[#f1edff] font-bold text-[#5541a9]"
                                                        : "text-[#716886] hover:bg-[#f5f2fb]"
                                                }`}
                                            >
                                                Maior nível
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLevelOrder("low");
                                                    setLevelOpen(false);
                                                }}
                                                className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${
                                                    levelOrder === "low"
                                                        ? "bg-[#f1edff] font-bold text-[#5541a9]"
                                                        : "text-[#716886] hover:bg-[#f5f2fb]"
                                                }`}
                                            >
                                                Menor nível
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                {filteredStudents.length === 0 ? (
                                    <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#ded8ea] bg-[#f5f2fb] px-5 text-center">
                                        <div>
                                            <span
                                                className="i-lucide-user-search mb-2 text-2xl text-[#7254d5]"
                                                aria-hidden="true"
                                            />

                                            <p className="text-sm font-semibold text-[#372a58]">
                                                Nenhum aluno encontrado
                                            </p>

                                            <p className="mt-1 text-xs text-[#716886]">
                                                Tente alterar a busca ou os
                                                filtros.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        {filteredStudents.map((student) => (
                                            <article
                                                key={student.id}
                                                className="rounded-xl border border-[#ebe7f2] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1edff] text-[#7254d5]">
                                                        <span
                                                            className="i-lucide-user-round text-xl"
                                                            aria-hidden="true"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-sm font-bold text-[#372a58]">
                                                            {student.name}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-[#716886]">
                                                            {student.level !==
                                                            null
                                                                ? `Nível ${student.level}`
                                                                : "Sem nível registrado"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between border-t border-[#ebe7f2] pt-3">
                                                    <span className="text-xs font-medium text-[#716886]">
                                                        Progresso
                                                    </span>

                                                    <span className="rounded-lg bg-[#f1edff] px-2 py-1 text-[11px] font-bold text-[#5541a9]">
                                                        {student.level !== null
                                                            ? `lvl.${student.level}`
                                                            : "lvl.—"}
                                                    </span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}

export default TeacherClass;