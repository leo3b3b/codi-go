import { useEffect, useState } from "react";
import type { Command } from "@/types";

export function Codi({
	direction,
	moving,
}: {
	direction: Command;
	moving: boolean;
}) {
	const [frame, setFrame] = useState(0);

	useEffect(() => {
		for (const direction of ["up", "down", "left", "right"] as const) {
			for (let frame = 1; frame <= 4; frame++) {
				const image = new Image();
				image.src = `/codi/${direction}-${frame}.png`;
			}
		}
	}, []);

	useEffect(() => {
		if (!moving) {
			setFrame(0);
			return;
		}

		const interval = window.setInterval(() => {
			setFrame((current) => (current + 1) % 4);
		}, 100);

		return () => window.clearInterval(interval);
	}, [moving]);

	return (
		<img
			src={`/codi/${direction}-${frame + 1}.png`}
			alt="Codi"
			draggable={false}
			className="size-full object-contain"
		/>
	);
}
