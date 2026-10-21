import type { Route } from "+layouts/School";
import { Icon, UI } from "@codi-go/ui";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { Select } from "./Select";

const adminOptions = [
	{ value: "turmas", label: "Turmas" },
	{ value: "membros", label: "Membros" },
] as const;

type AdminScreen = (typeof adminOptions)[number]["value"];

type SchoolHeaderProps = Pick<
	Route.ComponentProps["loaderData"],
	"schools" | "classes" | "profile" | "invites"
>;

type SchoolNavigationProps = {
	schoolId: string;
	classId: string | undefined;
	schools: SchoolHeaderProps["schools"];
	classes: SchoolHeaderProps["classes"];
	isAdminRoute: boolean;
	currentAdminScreen: AdminScreen;
	currentClass: SchoolHeaderProps["classes"][number] | undefined;
	navigate: ReturnType<typeof useNavigate>;
};

export function SchoolHeader({
	schools,
	classes,
	profile,
	invites,
}: SchoolHeaderProps) {
	const { schoolId, classId } = useParams<"schoolId" | "classId">();
	const location = useLocation();
	const navigate = useNavigate();

	const isAdminRoute = location.pathname.includes("/admin/");
	const currentClass = classes.find((item) => item.id === classId);

	const currentAdminScreen: AdminScreen =
		adminOptions.find((option) =>
			location.pathname.includes(`/admin/${option.value}`),
		)?.value ?? "turmas";

	const navigationProps: SchoolNavigationProps | undefined =
		schoolId === undefined
			? undefined
			: {
					schoolId,
					classId,
					schools,
					classes,
					isAdminRoute,
					currentAdminScreen,
					currentClass,
					navigate,
				};

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
				<UI.Group h={48} justify="space-between" wrap="nowrap" gap="sm">
					<UI.Group gap="md" wrap="nowrap" flex={1}>
						<NavLink to="/escolas">
							<UI.Image src="/logo.png" alt="Logo do CodiGO!" h={44} w="auto" />
						</NavLink>

						{navigationProps && (
							<DesktopSchoolNavigation {...navigationProps} />
						)}
					</UI.Group>

					<UI.Group gap="xs" wrap="nowrap">
						{navigationProps && <MobileSchoolNavigation {...navigationProps} />}

						<GoBack />
						<ThemeToggle />

						<ProfileAction
							name={profile.name}
							username={profile.username}
							pendingInvites={invites.length}
						/>
					</UI.Group>
				</UI.Group>
			</UI.Container>
		</UI.Paper>
	);
}

function DesktopSchoolNavigation(props: SchoolNavigationProps) {
	const {
		schoolId,
		classId,
		schools,
		classes,
		isAdminRoute,
		currentAdminScreen,
		currentClass,
		navigate,
	} = props;

	return (
		<UI.Group gap="sm" wrap="nowrap" flex={1} visibleFrom="sm">
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
	);
}

function MobileSchoolNavigation(props: SchoolNavigationProps) {
	const {
		schoolId,
		classId,
		schools,
		classes,
		isAdminRoute,
		currentAdminScreen,
		currentClass,
		navigate,
	} = props;

	return (
		<UI.Box hiddenFrom="sm">
			<UI.Menu position="bottom-end" width={280} shadow="md">
				<UI.Menu.Target>
					<UI.ActionIcon
						size={40}
						radius="xl"
						variant="default"
						aria-label="Abrir menu de navegação"
					>
						<Icon.Menu size={20} />
					</UI.ActionIcon>
				</UI.Menu.Target>

				<UI.Menu.Dropdown>
					<UI.Menu.Label>Escola</UI.Menu.Label>

					{schools.map((school) => (
						<UI.Menu.Item
							key={school.school_id}
							onClick={() => navigate(`/escola/${school.school_id}`)}
							rightSection={
								school.school_id === schoolId ? (
									<Icon.Check size={16} />
								) : undefined
							}
						>
							{school.trade_name || school.legal_name}
						</UI.Menu.Item>
					))}

					{classId !== undefined && !isAdminRoute && currentClass && (
						<>
							<UI.Menu.Divider />
							<UI.Menu.Label>Turma</UI.Menu.Label>

							{classes.map((schoolClass) => (
								<UI.Menu.Item
									key={schoolClass.id}
									onClick={() =>
										navigate(`/escola/${schoolId}/turma/${schoolClass.id}`)
									}
									rightSection={
										schoolClass.id === classId ? (
											<Icon.Check size={16} />
										) : undefined
									}
								>
									{schoolClass.name}
								</UI.Menu.Item>
							))}
						</>
					)}

					{isAdminRoute && (
						<>
							<UI.Menu.Divider />
							<UI.Menu.Label>Administração</UI.Menu.Label>

							{adminOptions.map((option) => (
								<UI.Menu.Item
									key={option.value}
									onClick={() =>
										navigate(`/escola/${schoolId}/admin/${option.value}`)
									}
									rightSection={
										option.value === currentAdminScreen ? (
											<Icon.Check size={16} />
										) : undefined
									}
								>
									{option.label}
								</UI.Menu.Item>
							))}
						</>
					)}
				</UI.Menu.Dropdown>
			</UI.Menu>
		</UI.Box>
	);
}

function GoBack() {
	const navigate = useNavigate();
	return (
		<UI.ActionIcon
			size={40}
			radius="xl"
			variant="default"
			aria-label="Voltar"
			onClick={() => navigate(-1)}
		>
			<Icon.ArrowLeft size={18} />
		</UI.ActionIcon>
	);
}

function ThemeToggle() {
	const { setColorScheme } = UI.useMantineColorScheme();
	const colorScheme = UI.useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	const isDark = colorScheme === "dark";

	return (
		<UI.ActionIcon
			size={40}
			radius="xl"
			variant="default"
			aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
			onClick={() => setColorScheme(isDark ? "light" : "dark")}
		>
			{isDark ? <Icon.Sun size={20} /> : <Icon.Moon size={20} />}
		</UI.ActionIcon>
	);
}

function ProfileAction({
	name,
	username,
	pendingInvites,
}: {
	name: string | null;
	username: string | null;
	pendingInvites: number;
}) {
	const navigate = useNavigate();
	const displayName = name || username || undefined;

	return (
		<UI.Indicator
			disabled={pendingInvites === 0}
			label={pendingInvites > 99 ? "99+" : pendingInvites}
			color="red"
			size={18}
			offset={4}
		>
			<UI.UnstyledButton
				onClick={() => navigate("/meu-perfil")}
				aria-label={
					`Abrir perfil de ${displayName ?? "usuário"}` +
					(pendingInvites > 0 ? `, ${pendingInvites} convites pendentes` : "")
				}
				style={{
					display: "block",
					borderRadius: "var(--mantine-radius-xl)",
				}}
			>
				<UI.Avatar
					name={displayName}
					color="violet"
					variant="filled"
					radius="xl"
					size={40}
				/>
			</UI.UnstyledButton>
		</UI.Indicator>
	);
}
