import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { Select } from "@/components";
import type { SchoolLayoutLoaderData } from "@/layouts/School";

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

type SchoolHeaderProps = Pick<SchoolLayoutLoaderData, "schools" | "classes">;

export function SchoolHeader({ schools, classes }: SchoolHeaderProps) {
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
		<UI.Paper component="header"
			pos="sticky"
			top={0}
			withBorder
			radius="none"
			style={{ zIndex: 40 }}
		>
			<UI.Container size="xl">
				<UI.Group
					h={40}
					py="sm"
					justify="space-between"
					wrap="nowrap"
				>
					<UI.Group gap="md" wrap="nowrap" flex={1}>
						<NavLink to="/escolas">
							<UI.Image
								src="/logo.png"
								alt="Logo do CodiGO!"
								h={48}
								w="auto"
							/>
						</NavLink>

						{isSchoolRoute && (
							<UI.Group gap="sm" wrap="nowrap" flex={1}>
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
								/>

								{isClassRoute && currentClass && (
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
									/>
								)}

								{isAdminRoute && (
									<Select
										aria-label="Administração"
										value={currentAdminScreen}
										onChange={(screen) => {
											navigate(`/escola/${schoolId}/admin/${screen}`);
										}}
										options={adminOptions}
									/>
								)}
							</UI.Group>
						)}
					</UI.Group>

					<NavLink to="/meu-perfil">
						<UI.ThemeIcon
							size={40}
							radius="xl"
							variant="light"
							color="violet"
						>
							<Icon.User size={20} />
						</UI.ThemeIcon>
					</NavLink>
				</UI.Group>
			</UI.Container>
		</UI.Paper>
	);
}
