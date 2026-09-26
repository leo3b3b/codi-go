import { useEffect, useRef, useState } from "react";

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
		<div className="relative inline-block text-left" ref={containerRef}>
			<button
				type="button"
				aria-label={ariaLabel}
				onClick={() => setIsOpen(!isOpen)}
				className="
                    min-w-32 flex items-center justify-between rounded-lg border border-border
                    bg-surface px-3 py-2 text-sm font-medium text-heading
                    outline-none transition-colors cursor-pointer
                    hover:border-primary
                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                "
			>
				<span>{selectedOption ? selectedOption.label : "Selecione..."}</span>
			</button>

			{isOpen && (
				<div className="absolute left-0 z-20 mt-1 w-full min-w-[12rem] rounded-lg border border-border bg-surface shadow-lg overflow-hidden">
					<div className="py-1 max-h-60 overflow-y-auto">
						{options.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={`
                                    w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer
                                    ${option.value === value ? "bg-primary/10 text-primary font-semibold" : "text-fg bg-surface-subtle"}
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
