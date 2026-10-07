import * as M from "@mantine/core";
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
		<M.Paper component="header"
			pos="sticky"
			top={0}
			withBorder
			radius="none"
			style={{ zIndex: 40 }}
		>
			<M.Container size="xl">
				<M.Group
					h={40}
					py="sm"
					justify="space-between"
					wrap="nowrap"
				>
					<M.Group gap="md" wrap="nowrap" flex={1}>
						<NavLink to="/escolas">
							<M.Image
								src="/logo.png"
								alt="Logo do CodiGO!"
								h={48}
								w="auto"
							/>
						</NavLink>

						{isSchoolRoute && (
							<M.Group gap="sm" wrap="nowrap" flex={1}>
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
							</M.Group>
						)}
					</M.Group>

					<NavLink to="/meu-perfil">
						<M.ThemeIcon
							size={40}
							radius="xl"
							variant="light"
							color="violet"
						>
							<Icon.User size={20} />
						</M.ThemeIcon>
					</NavLink>
				</M.Group>
			</M.Container>
		</M.Paper>
	);
}
