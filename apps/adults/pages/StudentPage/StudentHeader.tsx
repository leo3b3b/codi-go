import { Icon, UI } from "@codi-go/ui";
import type { Student } from "./types";

type StudentHeaderProps = {
	student: Student;
	onBack: () => void;
};

export const StudentHeader = ({ student, onBack }: StudentHeaderProps) => (
	<UI.Paper>
		<UI.Group justify="space-between" gap="md" wrap="nowrap">
			<div>
				<UI.Title order={1}>{student.name}</UI.Title>
				<UI.Text size="sm" c="dimmed">
					Acompanhamento do aluno
				</UI.Text>
			</div>

			<UI.Button
				type="button"
				variant="default"
				w="auto"
				leftSection={<Icon.ArrowLeft size={18} />}
				onClick={onBack}
			>
				Voltar
			</UI.Button>
		</UI.Group>
	</UI.Paper>
);
