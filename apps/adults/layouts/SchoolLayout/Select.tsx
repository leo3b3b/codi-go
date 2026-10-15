import { Icon, UI } from "@codi-go/ui";

interface SelectOption<TValue extends string> {
	value: TValue;
	label: string;
}

type SelectProps<TValue extends string> = Omit<
	UI.ButtonProps,
	"children" | "type" | "rightSection" | "value" | "onChange" | "aria-label"
> & {
	"aria-label": string;
	value: TValue;
	onChange: (value: TValue) => void;
	options: readonly SelectOption<TValue>[];
};

export function Select<TValue extends string>({
	"aria-label": ariaLabel,
	value,
	onChange,
	options,
	...buttonProps
}: SelectProps<TValue>) {
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
