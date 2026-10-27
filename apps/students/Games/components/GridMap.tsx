import type { CSSProperties, ReactNode } from "react";
import { UI } from "@codi-go/ui";
import type { GridTiles, GridTileType } from "../types";
import { gridTileImages } from "../types";

type GridMapProps = {
	tiles: GridTiles;
	tileSize?: number | string;
	children?: ReactNode;
};

const Tile = ({ type }: { type: GridTileType }) => (
	<img
		src={gridTileImages[type]}
		alt=""
		draggable={false}
		style={{
			display: "block",
			width: "var(--tile-size)",
			height: "var(--tile-size)",
		}}
	/>
);

export const GridMap = ({ tiles, tileSize = 64, children }: GridMapProps) => {
	if (tiles.length === 0 || tiles[0].length === 0) return null;

	return (
		<UI.Box
			pos="relative"
			w="fit-content"
			style={
				{
					"--tile-size":
						typeof tileSize === "number" ? `${tileSize}px` : tileSize,
				} as CSSProperties
			}
		>
			<UI.Box
				display="grid"
				style={{
					gridTemplateColumns: `repeat(${tiles[0].length}, var(--tile-size))`,
				}}
			>
				{tiles.flatMap((row, y) =>
					row.map((tile, x) => <Tile key={`${x}-${y}`} type={tile} />),
				)}
			</UI.Box>

			<UI.Box pos="absolute" inset={0}>
				{children}
			</UI.Box>
		</UI.Box>
	);
};
