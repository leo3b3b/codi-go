import { useEffect, useState } from "react";
import type { GridDirection } from "../types";

const DIRECTION_ROWS: Record<GridDirection, number> = {
	down: 0,
	left: 1,
	right: 2,
	up: 3,
};

export const Codi = ({
	direction,
	moving,
}: {
	direction: GridDirection;
	moving: boolean;
}) => {
	const [frame, setFrame] = useState(0);

	useEffect(() => {
		if (!moving) {
			setFrame(0);
			return;
		}

		const interval = window.setInterval(
			() => setFrame((current) => (current + 1) % 4),
			100,
		);

		return () => window.clearInterval(interval);
	}, [moving]);

	return (
		<div
			role="img"
			aria-label="Codi"
			style={{
				width: "100%",
				height: "100%",
				backgroundSize: "400% 400%",
				backgroundImage: "url(/spritesheet.png)",
				backgroundPosition: `${(frame / 3) * 100}% ${(DIRECTION_ROWS[direction] / 3) * 100}%`,
				backgroundRepeat: "no-repeat",
			}}
		/>
	);
};

