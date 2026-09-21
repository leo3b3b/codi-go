import type { Tables } from "@codi-go/supabase";
import { supabase } from "@codi-go/supabase";
import logo from "@codi-go/ui/images/logo.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function TeacherConfig() {
	const navigate = useNavigate();
	const { schoolId } = useParams();

	const [selectedSchool, setSelectedSchool] = useState<Pick<
		Tables<"school">,
		"id" | "trade_name" | "legal_name"
	> | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadSchool() {
			setLoading(true);
			setError("");

			if (!schoolId) {
				navigate("/", { replace: true });
				return;
			}

			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError || !user) {
				navigate("/login", { replace: true });
				return;
			}

			const { data: membership, error: membershipError } = await supabase
				.from("school_memberships")
				.select("school_id, role")
				.eq("school_id", schoolId)
				.eq("profile_id", user.id)
				.eq("status", "active")
				.maybeSingle();

			if (membershipError || !membership) {
				setError("Você não tem acesso a esta escola.");
				setLoading(false);
				return;
			}

			const { data: schoolData, error: schoolError } = await supabase
				.from("school")
				.select("id, trade_name, legal_name")
				.eq("id", schoolId)
				.eq("is_active", true)
				.maybeSingle();

			if (schoolError || !schoolData) {
				setError("Não foi possível carregar a escola.");
				setLoading(false);
				return;
			}

			setSelectedSchool(schoolData);
			setLoading(false);
		}

		void loadSchool();
	}, [navigate, schoolId]);

	function goToHome() {
		if (!schoolId) {
			return;
		}

		navigate(`/${schoolId}/dashboard`);
	}

	function goToClasses() {
		if (!schoolId) {
			return;
		}

		navigate(`/${schoolId}/turmas`);
	}

	function goToAverages() {
		if (!schoolId) {
			return;
		}

		navigate(`/${schoolId}/medias`);
	}

	if (loading) {
		return (
			<main className="flex h-screen items-center justify-center bg-gradient-to-br from-[#c9a8ed] via-[#f1dfd4] to-[#c9a8ed]">
				<p className="text-2xl font-bold text-[#372a58]">Carregando...</p>
			</main>
		);
	}

	return (
		<main className="h-screen overflow-hidden bg-gradient-to-br from-[#c9a8ed] via-[#f1dfd4] to-[#c9a8ed]">
			<header className="relative h-20 shrink-0 bg-[rgba(112,86,204,0.76)] shadow-lg">
				<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
					<button
						type="button"
						onClick={goToHome}
						className="flex items-center border-none bg-transparent p-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
						aria-label="Ir para a página inicial"
					>
						<img src={logo} alt="CodiGO!" className="h-11 w-auto" />
					</button>

					<nav className="absolute left-1/2 flex h-full -translate-x-1/2 items-center gap-2 text-base font-bold text-white">
						<button
							type="button"
							className="h-full border-b-3 border-white px-5"
							aria-current="page"
						>
							Configurações
						</button>

						<button
							type="button"
							onClick={goToClasses}
							className="h-full px-5 transition-opacity hover:opacity-80"
						>
							Turmas
						</button>

						<button
							type="button"
							onClick={goToAverages}
							className="h-full px-5 transition-opacity hover:opacity-80"
						>
							Médias
						</button>
					</nav>

					<div className="min-w-40 text-right text-base font-bold text-white">
						{selectedSchool
							? selectedSchool.trade_name || selectedSchool.legal_name
							: "Escola"}
					</div>
				</div>
			</header>

			<section className="flex h-[calc(100vh-5rem)] items-center justify-center px-6 py-8">
				{error ? (
					<div className="rounded-2xl bg-white/90 px-6 py-4 text-sm font-medium text-red-700 shadow-sm">
						{error}
					</div>
				) : (
					<div className="rounded-[2rem] bg-white px-16 py-14 text-center shadow-2xl">
						<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1edff]">
							<span
								className="i-lucide-settings text-4xl text-[#7254d5]"
								aria-hidden="true"
							/>
						</div>

						<h1 className="mt-6 text-4xl font-bold text-[#372a58]">
							Configurações
						</h1>

						<p className="mt-4 text-lg text-[#716886]">
							Área de configurações do professor.
						</p>
					</div>
				)}
			</section>
		</main>
	);
}

export default TeacherConfig;
