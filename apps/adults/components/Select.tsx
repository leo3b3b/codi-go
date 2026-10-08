import * as UI from "@codi-go/ui";
import * as Icon from "lucide-react";

interface Option {
	value: string;
	label: string;
}

interface SelectProps {
	"aria-label": string;
	value: string;
	onChange: (value: string) => void;
	options: Option[];
	className?: string;
}

export function Select({
	"aria-label": ariaLabel,
	value,
	onChange,
	options,
	className,
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
					className={className}
					rightSection={<Icon.ChevronDown size={16} />}
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