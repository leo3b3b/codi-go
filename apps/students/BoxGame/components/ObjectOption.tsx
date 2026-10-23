import { UI } from "@codi-go/ui";
import { type ObjectType, objectImages } from "../types";

type ObjectOptionProps = {
	object: ObjectType;
	selected: boolean;
	disabled: boolean;
	onSelect: (object: ObjectType) => void;
};

export const ObjectOption = ({
	object,
	selected,
	disabled,
	onSelect,
}: ObjectOptionProps) => (
	<UI.Paper
		component="button"
		type="button"
		p="sm"
		w="100%"
		radius="md"
		aria-pressed={selected}
		disabled={disabled}
		onClick={() => onSelect(object)}
		style={{
			cursor: disabled ? "default" : "pointer",
			border: selected
				? "2px solid var(--mantine-color-violet-6)"
				: "2px solid var(--app-border)",
			background: selected
				? "var(--mantine-color-violet-0)"
				: "var(--app-surface)",
		}}
	>
		<UI.Stack gap="xs" align="center">
			<img
				src={objectImages[object].src}
				alt=""
				draggable={false}
				style={{
					width: 76,
					height: 76,
					objectFit: "contain",
				}}
			/>

			<UI.Text size="sm" ta="center">
				{objectImages[object].label}
			</UI.Text>
		</UI.Stack>
	</UI.Paper>
);
