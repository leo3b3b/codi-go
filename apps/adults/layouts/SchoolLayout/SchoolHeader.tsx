import type { Route } from "+layouts/School";
import { Icon, UI } from "@codi-go/ui";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { Select } from "./Select";

const adminOptions = [
	{
		value: "turmas",
		label: "Turmas",
	},
	{
		value: "membros",
		label: "Membros",
	},
] as const;

type AdminScreen = (typeof adminOptions)[number]["value"];

type SchoolHeaderProps = Pick<
	Route.ComponentProps["loaderData"],
	"schools" | "classes"
>;

export function SchoolHeader({ schools, classes }: SchoolHeaderProps) {
	const { schoolId, classId } = useParams<"schoolId" | "classId">();
	const location = useLocation();
	const navigate = useNavigate();

	const isAdminRoute = location.pathname.includes("/admin/");

	const currentAdminScreen: AdminScreen =
		adminOptions.find((option) =>
			location.pathname.includes(`/admin/${option.value}`),
		)?.value ?? "turmas";

	const currentClass = classes.find((item) => item.id === classId);

	const { setColorScheme } = UI.useMantineColorScheme();
	const colorScheme = UI.useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<UI.Paper
			component="header"
			pos="sticky"
			top={0}
			withBorder
			radius="none"
			style={{ zIndex: 40 }}
		>
			<UI.Container size="xl">
				<UI.Group h={40} py="sm" justify="space-between" wrap="nowrap">
					<UI.Group gap="md" wrap="nowrap" flex={1}>
						<NavLink to="/escolas">
							<UI.Image src="/logo.png" alt="Logo do CodiGO!" h={48} w="auto" />
						</NavLink>

						{schoolId !== undefined && (
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

								{classId !== undefined && !isAdminRoute && currentClass && (
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

					<UI.Group gap="xs" wrap="nowrap">
						<UI.ActionIcon
							size={40}
							radius="xl"
							variant="default"
							aria-label={
								colorScheme === "dark"
									? "Ativar tema claro"
									: "Ativar tema escuro"
							}
							onClick={() =>
								setColorScheme(colorScheme === "dark" ? "light" : "dark")
							}
						>
							{colorScheme === "dark" ? (
								<Icon.Sun size={20} />
							) : (
								<Icon.Moon size={20} />
							)}
						</UI.ActionIcon>

						<UI.ActionIcon
							size={40}
							radius="xl"
							variant="filled"
							color="violet"
							onClick={() => navigate("/meu-perfil")}
						>
							<Icon.User size={20} />
						</UI.ActionIcon>
					</UI.Group>
				</UI.Group>
			</UI.Container>
		</UI.Paper>
	);
}
