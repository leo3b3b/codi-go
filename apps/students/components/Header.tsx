import logo from "@codi-go/ui/images/logo.png";
import { useNavigate, useParams } from "react-router";
import { Icon } from "@/components";
import { getStudentSession, signOutStudent } from "@/services";

export function Header() {
	const student = getStudentSession();
	const navigate = useNavigate();
	const params = useParams();

	function handleLogOut() {
		signOutStudent();
		navigate(`/${params.accessCode ?? ""}`);
	}

	return (
		<header className="sticky top-0 z-40 border-b-(~ border) bg-surface">
			<div className="mx-auto flex h-16 max-w-7xl items-center px-4 py-3 sm:(px-6 py-4) gap-4">
				<img src={logo} alt="Logo do CodiGO!" className="h-14" />
				<span className="text-(xl heading) font-semibold truncate">
					{student?.name ?? "Aluno"}
				</span>
				<button
					type="button"
					className="ui-button-(~ danger) p-2 size-10 rounded-full sm:(rounded-xl w-auto) ml-auto"
					onClick={handleLogOut}
				>
					<Icon icon="i-lucide-log-out" color="on-danger" size={5} />
					<span className="hidden sm:block">Sair</span>
				</button>
			</div>
		</header>
	);
}
