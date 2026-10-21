import { Icon, UI } from "@codi-go/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { getStudentsByClassId } from "@/services";
import { getImageCode } from "./utils";

type Student = Awaited<ReturnType<typeof getStudentsByClassId>>[number];

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
		<UI.Paper>
			<UI.Stack gap="md">
				<UI.Text size="lg" fw={700} style={{ overflowWrap: "anywhere" }}>
					{student.name ?? "—"}
				</UI.Text>

				<UI.Divider />

				<UI.Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "stretch", md: "center" }}
					justify="space-between"
					gap="md"
				>
					<UI.Stack gap="xs" flex={1}>
						<UI.Flex
							direction={{ base: "column", sm: "row" }}
							align={{ base: "stretch", sm: "center" }}
							gap="sm"
						>
							<UI.Group gap="sm" align="center" wrap="nowrap" flex={1}>
								<UI.Center w={56} h={56} style={{ flex: "0 0 56px" }}>
									{credential && showCredential ? (
										<UI.Image
											src={credential.src}
											alt={credential.label}
											w={48}
											h={48}
											fit="contain"
										/>
									) : credential ? (
										<Icon.EyeOff
											size={22}
											color="var(--mantine-color-dimmed)"
										/>
									) : (
										<Icon.ImageOff
											size={22}
											color="var(--mantine-color-dimmed)"
										/>
									)}
								</UI.Center>

								<UI.Text
									size="sm"
									c={credential && showCredential ? undefined : "dimmed"}
									lineClamp={2}
									style={{
										minWidth: 0,
										overflowWrap: "anywhere",
									}}
								>
									{!credential
										? "Credencial indisponível"
										: showCredential
											? credential.label
											: "Credencial oculta"}
								</UI.Text>
							</UI.Group>

							<UI.Button
								type="button"
								size="sm"
								w={{ base: "100%", sm: "auto" }}
								variant="default"
								disabled={!credential}
								leftSection={
									showCredential ? (
										<Icon.EyeOff size={18} />
									) : (
										<Icon.Eye size={18} />
									)
								}
								onClick={() => setShowCredential((visible) => !visible)}
							>
								{showCredential ? "Ocultar credencial" : "Mostrar credencial"}
							</UI.Button>
						</UI.Flex>
					</UI.Stack>

					<UI.Flex
						direction={{ base: "column", sm: "row" }}
						gap="sm"
						w={{ base: "100%", md: 260 }}
					>
						<UI.Button
							type="button"
							flex={1}
							leftSection={<Icon.FileText size={18} />}
							onClick={() =>
								navigate(`/escola/${schoolId}/aluno/${student.id}`)
							}
						>
							Ver registros
						</UI.Button>
					</UI.Flex>
				</UI.Flex>
			</UI.Stack>
		</UI.Paper>
	);
}
