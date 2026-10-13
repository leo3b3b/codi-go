import { Icon, UI } from "@codi-go/ui";
import type { Student } from "../Class";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getImageCode } from "./utils";

type CopyDropdownProps = {
	onCopyCode: () => Promise<boolean>;
	onCopyLink: () => Promise<boolean>;
};

export function CopyDropdown({ onCopyCode, onCopyLink }: CopyDropdownProps) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const combobox = UI.useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleOptionSubmit = async (value: string) => {
		combobox.closeDropdown();

		const success =
			(value === "code" && (await onCopyCode())) ||
			(value === "link" && (await onCopyLink()));

		if (!success) return;

		setCopied(true);

		if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setCopied(false);
			timeoutRef.current = null;
		}, 2000);
	};

	return (
		<UI.Combobox
			store={combobox}
			position="bottom-start"
			middlewares={{ flip: true, shift: true }}
			onOptionSubmit={handleOptionSubmit}
		>
			<UI.Combobox.Target targetType="button">
				<UI.Button
					variant="light"
					color="gray"
					rightSection={
						copied ? (
							<Icon.LucideCheck size={16} />
						) : (
							<Icon.LucideCopy size={16} />
						)
					}
					onClick={() => combobox.toggleDropdown()}
				>
					Acesso dos alunos
				</UI.Button>
			</UI.Combobox.Target>

			<UI.Combobox.Dropdown
				style={{
					width: "max-content",
					minWidth: 180,
					maxWidth: "calc(100vw - 32px)",
				}}
			>
				<UI.Combobox.Options>
					<UI.Combobox.Option value="code" className="copy-dropdown-option">
						Copiar código
					</UI.Combobox.Option>

					<UI.Combobox.Option value="link" className="copy-dropdown-option">
						Copiar link
					</UI.Combobox.Option>
				</UI.Combobox.Options>
			</UI.Combobox.Dropdown>
		</UI.Combobox>
	);
}

type StudentRowProps = {
	student: Student;
	schoolId: string;
};

export function StudentRow({ student, schoolId }: StudentRowProps) {
	const [showCredential, setShowCredential] = useState(false);
	const navigate = useNavigate();

	const credential = getImageCode(student.access_code);

	return (
		<>
			<UI.Grid align="center" py="md">
				<UI.Grid.Col span={{ base: 12, lg: 4 }}>
					<UI.Text fw={600}>{student.name ?? "—"}</UI.Text>
				</UI.Grid.Col>

				<UI.Grid.Col span={{ base: 12, lg: 2 }}>
					<UI.Group h={56}>
						{credential ? (
							showCredential ? (
								<UI.Image
									src={credential.src}
									alt={credential.label}
									h={56}
									w="auto"
									fit="contain"
								/>
							) : (
								<UI.Text size="sm" ff="monospace" lts="0.25em">
									••••••••
								</UI.Text>
							)
						) : (
							<UI.Text size="sm" c="dimmed">
								Indisponível
							</UI.Text>
						)}
					</UI.Group>
				</UI.Grid.Col>

				<UI.Grid.Col span={{ base: 12, lg: 6 }}>
					<UI.Group grow>
						<UI.Button
							variant="light"
							disabled={!credential}
							onClick={() => setShowCredential((visible) => !visible)}
							leftSection={
								showCredential ? (
									<Icon.EyeOff size={18} />
								) : (
									<Icon.Eye size={18} />
								)
							}
						>
							{showCredential ? "Esconder Credencial" : "Mostrar Credencial"}
						</UI.Button>

						<UI.Button
							onClick={() =>
								navigate(`/escola/${schoolId}/aluno/${student.id}`)
							}
							leftSection={<Icon.FileText size={18} />}
						>
							Ver Registros
						</UI.Button>
					</UI.Group>
				</UI.Grid.Col>
			</UI.Grid>

			<UI.Divider />
		</>
	);
}
