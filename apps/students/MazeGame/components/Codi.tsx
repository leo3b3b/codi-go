import { useEffect, useState } from "react";
import type { Command } from "../types";

const SPRITE_WIDTH = 256 / 4;
const SPRITE_HEIGHT = 256 / 4;

const DIRECTION_ROWS: Record<Command, number> = {
	down: 0,
	left: 1,
	right: 2,
	up: 3,
};

export function Codi({
	direction,
	moving,
}: {
	direction: Command;
	moving: boolean;
}) {
	const [frame, setFrame] = useState(0);

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

	const sourceX = frame * SPRITE_WIDTH;
	const sourceY = (DIRECTION_ROWS[direction] ?? 0) * SPRITE_HEIGHT;

	return (
		<div
			role="img"
			aria-label="Codi"
			style={{
				width: "64px",
				height: "64px",
				backgroundSize: "256px 256px",
				backgroundImage: "url(/spritesheet.png)",
				backgroundPosition: `-${sourceX}px -${sourceY}px`,
				backgroundRepeat: "no-repeat",
			}}
		/>
	);
}
