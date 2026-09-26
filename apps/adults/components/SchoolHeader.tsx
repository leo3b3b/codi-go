import logo from "@codi-go/ui/images/logo.png";
import { NavLink } from "react-router";

export function SchoolHeader() {
	return (
		<header className="sticky top-0 z-40 border-b-(~ border) bg-surface/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
				<NavLink
					to="/escolas"
					className="shrink-0 focus-visible:outline-none focus-visible:ring-(2 primary offset-2)"
				>
					<img src={logo} alt="Logo do CodiGO!" className="h-12 w-auto" />
				</NavLink>

				<div className="h-full w-px bg-border" />
			</div>
		</header>
	);
}
