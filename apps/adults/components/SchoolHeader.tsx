import logo from "@codi-go/ui/images/logo.png";
import {
	NavLink,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
} from "react-router";
import { Icon, Select, VerticalSeparator } from "@/components";
import type { schoolLayoutLoader } from "@/router";

const adminOptions = [
	{
		value: "turmas",
		label: "Turmas",
	},
	{
		value: "membros",
		label: "Membros",
	},
];

export function SchoolHeader() {
	const data = useLoaderData<typeof schoolLayoutLoader>();

	const schools = data?.schools || [];
	const classes = data?.classes || [];

	const { schoolId, classId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const isSchoolRoute = schoolId !== undefined;
	const isAdminRoute = location.pathname.includes("/admin/");
	const isClassRoute =
		schoolId !== undefined && classId !== undefined && !isAdminRoute;

	const matchedOption = adminOptions.find((option) =>
		location.pathname.includes(`/admin/${option.value}`),
	);

	const currentAdminScreen = matchedOption ? matchedOption.value : "turmas";
	const currentClass = classes.find((item) => item.id === classId);

	return (
		<header className="sticky top-0 z-40 border-b-(~ border) bg-surface">
			<div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[1fr_auto] items-center px-4 py-3 sm:(flex h-16 px-6 py-4) lg:px-8">
				<NavLink
					to="/escolas"
					className="order-1 shrink-0 focus-visible:outline-none focus-visible:ring-(2 primary offset-2)"
				>
					<img src={logo} alt="Logo do CodiGO!" className="h-12 w-auto" />
				</NavLink>

				{isSchoolRoute && (
					<div
						className="
							order-3 col-span-2 h-full flex-(~ 1) items-center
							gap-2 mt-2 sm:(order-2 ml-4 w-auto gap-0 mt-0)
						"
					>
						<VerticalSeparator className="hidden sm:block" />

						<Select
							aria-label="Escola"
							value={schoolId}
							onChange={(nextSchoolId) => {
								navigate(`/escola/${nextSchoolId}`);
							}}
							options={schools.map((school) => ({
								value: school.school_id,
								label: school.trade_name || school.legal_name,
							}))}
							className="flex-1 sm:max-w-32"
						/>

						{isClassRoute && currentClass && (
							<>
								<VerticalSeparator className="hidden sm:block" />

								<Select
									aria-label="Turma"
									value={classId}
									onChange={(nextClassId) => {
										navigate(`/escola/${schoolId}/turma/${nextClassId}`);
									}}
									options={classes.map((schoolClass) => ({
										value: schoolClass.id,
										label: schoolClass.name,
									}))}
									className="flex-1 sm:max-w-32"
								/>
							</>
						)}

						{isAdminRoute && (
							<>
								<VerticalSeparator className="hidden sm:block" />

								<Select
									aria-label="Administração"
									value={currentAdminScreen}
									onChange={(screen) => {
										navigate(`/escola/${schoolId}/admin/${screen}`);
									}}
									options={adminOptions}
									className="flex-1 sm:max-w-32"
								/>
							</>
						)}
					</div>
				)}

				<NavLink
					to="/meu-perfil"
					className="order-2 col-start-2 row-start-1 flex
					h-10 w-10 items-center justify-center rounded-full
					bg-primary-soft transition-colors hover:bg-primary
					sm:(order-3 ml-auto)"
				>
					<Icon icon="i-lucide-user" color="on-primary" size={6} />
				</NavLink>
			</div>
		</header>
	);
}
