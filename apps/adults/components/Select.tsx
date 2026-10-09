import { Icon, UI } from "@codi-go/ui";
import type { ButtonProps } from "@mantine/core";

interface Option {
	value: string;
	label: string;
}

type SelectProps = Omit<
	ButtonProps,
	"children" | "type" | "rightSection" | "value" | "onChange" | "aria-label"
> & {
	"aria-label": string;
	value: string;
	onChange: (value: string) => void;
	options: Option[];
};

export function Select({
	"aria-label": ariaLabel,
	value,
	onChange,
	options,
	...buttonProps
}: SelectProps) {
	const selectedOption = options.find((option) => option.value === value);

	return (
		<UI.Menu position="bottom-start">
			<UI.Menu.Target>
				<UI.Button
					type="button"
					aria-label={ariaLabel}
					variant="default"
					color="gray"
					rightSection={<Icon.ChevronDown size={16} />}
					{...buttonProps}
				>
					<UI.Text truncate size="sm" fw={500}>
						{selectedOption?.label ?? "Selecione…"}
					</UI.Text>
				</UI.Button>
			</UI.Menu.Target>

			<UI.Menu.Dropdown>
				{options.map((option) => (
					<UI.Menu.Item
						key={option.value}
						onClick={() => onChange(option.value)}
						fw={option.value === value ? 600 : undefined}
						color={option.value === value ? "violet" : undefined}
					>
						{option.label}
					</UI.Menu.Item>
				))}
			</UI.Menu.Dropdown>
		</UI.Menu>
	);
}
