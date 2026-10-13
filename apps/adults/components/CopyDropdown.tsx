import { Icon, UI } from "@codi-go/ui";
import { useEffect, useRef, useState } from "react";

type CopyDropdownProps = {
	onCopyCode: () => Promise<boolean>;
	onCopyLink: () => Promise<boolean>;
};

export function CopyDropdown({ onCopyCode, onCopyLink }: CopyDropdownProps) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const combobox = UI.useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const handleOptionSubmit = async (value: string) => {
		combobox.closeDropdown();

		const success =
			value === "code"
				? await onCopyCode()
				: value === "link"
					? await onCopyLink()
					: false;

		if (!success) return;

		setCopied(true);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setCopied(false);
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
