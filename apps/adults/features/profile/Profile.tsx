import logo from "@codi-go/ui/images/logo.png";
import { useNavigate } from "react-router";

export default function ProfilePage() {
	const navigate = useNavigate();

	function goToHome() {
		navigate("/");
	}

	function goToClasses() {
		navigate("/escola");
	}

	function goToAverages() {
		navigate("/escola");
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
				</div>
			</header>

			<section className="flex h-[calc(100vh-5rem)] items-center justify-center px-6 py-8">
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
						Configurações do seu perfil.
					</p>
				</div>
			</section>
		</main>
	);
}
