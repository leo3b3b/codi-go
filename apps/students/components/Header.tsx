import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";
import { useNavigate, useParams } from "react-router";
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
		<UI.Paper
			component="header"
			pos="sticky"
			top={0}
			withBorder
			radius="none"
			style={{ zIndex: 40 }}
		>
			<UI.Container size="xl">
				<UI.Group h={40} py="sm" gap="md" wrap="nowrap">
					<UI.Image src="/logo.png" alt="Logo do CodiGO!" h={56} w="auto" />

					<UI.Text size="xl" fw={600} truncate>
						{student?.name ?? "Aluno"}
					</UI.Text>

					<UI.Button
						type="button"
						color="red"
						size="lg"
						w={{ base: 40, sm: "auto" }}
						ml="auto"
						onClick={handleLogOut}
						leftSection={<Icon.LogOut size={20} />}
					>
						<UI.Text visibleFrom="sm">Sair</UI.Text>
					</UI.Button>
				</UI.Group>
			</UI.Container>
		</UI.Paper>
	);
}
