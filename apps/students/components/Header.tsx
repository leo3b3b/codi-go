import * as M from "@mantine/core";
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
		<M.Paper
			component="header"
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
					gap="md"
					wrap="nowrap"
				>
					<M.Image
						src="/logo.png"
						alt="Logo do CodiGO!"
						h={56}
						w="auto"
					/>

					<M.Text
						size="xl"
						fw={600}
						truncate
					>
						{student?.name ?? "Aluno"}
					</M.Text>

					<M.Button
						type="button"
						color="red"
						size="lg"
						w={{ base: 40, sm: "auto" }}
						ml="auto"
						onClick={handleLogOut}
						leftSection={<Icon.LogOut size={20} />}
					>
						<M.Text visibleFrom="sm">Sair</M.Text>
					</M.Button>
				</M.Group>
			</M.Container>
		</M.Paper>
	);
}
