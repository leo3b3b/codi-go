import logo from "@codi-go/ui/images/logo.png";
import { NavLink } from "react-router";

type SchoolHeaderProps = {
	schoolId: string;
};

const navigation = [
	{
		label: "Visão geral",
		to: ".",
		end: true,
	},
];

export function SchoolHeader({ schoolId }: SchoolHeaderProps) {
	return (
		<header className="sticky top-0 z-40 border-b-(~ border) bg-bg/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
				<NavLink
					to="/"
					className="shrink-0 focus-visible:outline-none focus-visible:ring-(2 primary offset-2)"
				>
					<img src={logo} alt="Logo do CodiGO!" className="h-12 w-auto" />
				</NavLink>

				<div className="h-5 w-px bg-border" />

				<nav className="flex h-full items-center gap-1">
					{navigation.map((item) => (
						<NavLink
							key={item.label}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								[
									"relative flex h-full items-center rounded-md px-4 text-sm font-medium transition-colors",
									isActive
										? "bg-primary-soft text-primary after:bg-primary"
										: "text-muted hover:(bg-surface-subtle text-fg) after:bg-transparent",
								].join(" ")
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>

				<div className="ml-auto flex items-center gap-3">
					<div className="hidden text-right sm:block">
						<p className="text-xs font-medium text-muted">Escola</p>
						<p className="max-w-40 truncate text-sm font-medium text-heading">
							{schoolId}
						</p>
					</div>

					<div className="h-8 w-8 rounded-full bg-primary-soft" />
				</div>
			</div>
		</header>
	);
}
