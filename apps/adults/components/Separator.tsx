type SeparatorProps = {
	className?: string;
};

export function HorizontalSeparator({ className }: SeparatorProps) {
	return (
		<div
			className={`${className} w-full h-px bg-border my-4`}
			aria-hidden="true"
		/>
	);
}

export function VerticalSeparator({ className }: SeparatorProps) {
	return (
		<div
			className={`${className} h-full w-px bg-border mx-4`}
			aria-hidden="true"
		/>
	);
}
