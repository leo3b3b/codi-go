import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components";

interface Option {
	value: string;
	label: string;
}

interface BreadcrumbSelectProps {
	"aria-label": string;
	value: string;
	onChange: (value: string) => void;
	options: Option[];
}

export function BreadcrumbSelect({
	"aria-label": ariaLabel,
	value,
	onChange,
	options,
}: BreadcrumbSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			className="relative inline-block min-w-0 flex-1 text-left sm:flex-none"
			ref={containerRef}
		>
			<button
				type="button"
				aria-label={ariaLabel}
				onClick={() => setIsOpen(!isOpen)}
				className="
					w-full sm:max-w-32
					flex items-center justify-between rounded-lg border border-border
					bg-surface-subtle px-3 py-2 text-sm font-medium text-fg
					outline-none transition-colors cursor-pointer
					hover:border-primary
					focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
				"
			>
				<span className="min-w-0 truncate">
					{selectedOption ? selectedOption.label : "Selecione…"}
				</span>
				<Icon
					icon="i-lucide-chevron-down"
					color="muted"
					size={4}
					className={`${isOpen ? "rotate-180" : ""} transition-transform ml-3`}
				/>
			</button>

			{isOpen && (
				<div
					className="
						absolute right-0 z-20 mt-1
						w-full min-w-0
						rounded-lg border border-border
						bg-surface shadow-lg overflow-hidden
						sm:left-0 sm:right-auto sm:min-w-[12rem]
					"
				>
					<div className="max-h-60 overflow-y-auto py-1">
						{options.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={`
						w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors
						${
							option.value === value
								? "bg-primary/10 font-semibold text-primary"
								: "bg-surface-subtle text-fg"
						}
					`}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
