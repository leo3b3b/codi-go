type IconSize = 4 | 5 | 6 | 8 | 10;

interface IconProps {
	icon: string;
	size?: IconSize;
	color?: string;
	className?: string;
}

const sizeClasses: Record<IconSize, string> = {
	4: "size-4",
	5: "size-5",
	6: "size-6",
	8: "size-8",
	10: "size-10",
};

export function Icon(props: IconProps) {
	const { icon, size, color, className } = props;
	return (
		<span
			className={`
				${icon}
				${size && sizeClasses[size as keyof typeof sizeClasses]}
				${color && `text-${color}`}
				${className}
			`}
			aria-hidden="true"
		/>
	);
}
