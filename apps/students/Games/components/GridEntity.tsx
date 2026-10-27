import { UI } from "@codi-go/ui";
import type { ReactNode } from "react";
import type { GridPosition } from "../types";

type GridEntityProps = {
	position: GridPosition;
	animate?: boolean;
	children: ReactNode;
};

export const GridEntity = ({
	position,
	animate = true,
	children,
}: GridEntityProps) => (
	<UI.Box
		pos="absolute"
		style={{
			aspectRatio: "1",
			width: "var(--tile-size)",
			height: "var(--tile-size)",
			left: `calc(${position.x} * var(--tile-size))`,
			top: `calc(${position.y} * var(--tile-size))`,
			...(animate && {
				transition: "left 300ms ease-in-out, top 300ms ease-in-out",
			}),
		}}
	>
		{children}
	</UI.Box>
);
