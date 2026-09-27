import logo from "@codi-go/ui/images/logo.png";
import {
	NavLink,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
} from "react-router";
import { BreadcrumbSelect, VerticalSeparator } from "@/components";
import type { schoolLayoutLoader } from "@/router";

const adminOptions = [
	{
		value: "turmas",
		label: "Gerenciar Turmas",
	},
	{
		value: "membros",
		label: "Gerenciar Membros",
	},
];

export function SchoolHeader() {
	const data = useLoaderData<typeof schoolLayoutLoader>();

	const schools = data?.schools || [];
	const classes = data?.classes || [];

	const { schoolId, classId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const isSchoolRoute = Boolean(schoolId);
	const isClassRoute = Boolean(schoolId && classId);
	const isAdminRoute = location.pathname.includes("/admin/");

	const matchedOption = adminOptions.find((option) =>
		location.pathname.includes(`/admin/${option.value}`),
	);

	const currentAdminScreen = matchedOption ? matchedOption.value : "turmas";
	const currentClass = classes.find((item) => item.id === classId);

	return (
		<header className="sticky top-0 z-40 border-b-(~ border) bg-surface">
			<div className="mx-auto flex justify-between h-16 max-w-7xl items-center px-4 py-4">
				<div className="flex items-center h-full">
					<NavLink
						to="/escolas"
						className="shrink-0 focus-visible:outline-none focus-visible:ring-(2 primary offset-2)"
					>
						<img src={logo} alt="Logo do CodiGO!" className="h-12 w-auto" />
					</NavLink>

					{isSchoolRoute && (
						<>
							<VerticalSeparator />

							<BreadcrumbSelect
								aria-label="Escola"
								value={schoolId}
								onChange={(nextSchoolId) => {
									navigate(`/escola/${nextSchoolId}`);
								}}
								options={schools.map((school) => ({
									value: school.schoolId,
									label: school.tradeName || school.legalName,
								}))}
							/>

							{isClassRoute && currentClass && (
								<>
									<VerticalSeparator />

									<BreadcrumbSelect
										aria-label="Turma"
										value={classId}
										onChange={(nextClassId) => {
											navigate(`/escola/${schoolId}/turma/${nextClassId}`);
										}}
										options={classes.map((schoolClass) => ({
											value: schoolClass.id,
											label: schoolClass.name,
										}))}
									/>
								</>
							)}

							{isAdminRoute && (
								<>
									<VerticalSeparator />

									<BreadcrumbSelect
										aria-label="Administração"
										value={currentAdminScreen}
										onChange={(screen) => {
											navigate(`/escola/${schoolId}/admin/${screen}`);
										}}
										options={adminOptions}
									/>
								</>
							)}
						</>
					)}
				</div>

				<NavLink
					to="/meu-perfil"
					className="bg-primary-soft hover:bg-primary rounded-full h-10 w-10 flex items-center justify-center transition-colors"
				>
					<div className="i-lucide-user text-(xl on-primary)" />
				</NavLink>
			</div>
		</header>
	);
}
