import * as M from "@mantine/core";
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
		<M.Menu position="bottom-start">
			<M.Menu.Target>
				<M.Button
					type="button"
					aria-label={ariaLabel}
					variant="default"
					color="gray"
					className={className}
					rightSection={<Icon.ChevronDown size={16} />}
				>
					<M.Text truncate size="sm" fw={500}>
						{selectedOption?.label ?? "Selecione…"}
					</M.Text>
				</M.Button>
			</M.Menu.Target>

			<M.Menu.Dropdown>
				{options.map((option) => (
					<M.Menu.Item
						key={option.value}
						onClick={() => onChange(option.value)}
						fw={option.value === value ? 600 : undefined}
						color={option.value === value ? "violet" : undefined}
					>
						{option.label}
					</M.Menu.Item>
				))}
			</M.Menu.Dropdown>
		</M.Menu>
	);
}