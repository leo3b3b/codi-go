import { useState } from "react";
import { MazeRenderer } from "@/components";
import { canMove, getNextPosition } from "@/engine";
import type { Command, MazeLevel, MazeState } from "@/types";

const level: MazeLevel = {
	id: "level-1",
	tiles: [
		["wall", "wall", "wall", "wall", "wall"],
		["wall", "floor", "floor", "floor", "wall"],
		["wall", "floor", "wall", "floor", "wall"],
		["wall", "floor", "floor", "floor", "wall"],
		["wall", "wall", "wall", "wall", "wall"],
	],
	start: {
		x: 1,
		y: 1,
	},
	goal: {
		x: 3,
		y: 3,
	},
};

export function MazeGame() {
	const [state, setState] = useState<MazeState>({
		level,
		playerPosition: level.start,
		commands: [],
		status: "editing",
	});

	function move(command: Command) {
		setState((current) => {
			if (!canMove(current.level, current.playerPosition, command)) {
				return current;
			}

			return {
				...current,
				playerPosition: getNextPosition(current.playerPosition, command),
			};
		});
	}
	return (
		<>
			<MazeRenderer level={state.level} playerPosition={state.playerPosition} />
			<div className="px-4 py-4 flex-(~ row) gap-4">
				<button
					type="button"
					className="ui-button-primary h-14 w-14 px-2 py-2 px-2 py-2"
					onClick={() => move("up")}
				>
					<span className="i-lucide-arrow-up color-white h-10 w-10"></span>
				</button>
				<button
					type="button"
					className="ui-button-primary h-14 w-14 px-2 py-2"
					onClick={() => move("left")}
				>
					<span className="i-lucide-arrow-left color-white h-10 w-10"></span>
				</button>
				<button
					type="button"
					className="ui-button-primary h-14 w-14 px-2 py-2"
					onClick={() => move("down")}
				>
					<span className="i-lucide-arrow-down color-white h-10 w-10"></span>
				</button>
				<button
					type="button"
					className="ui-button-primary h-14 w-14 px-2 py-2"
					onClick={() => move("right")}
				>
					<span className="i-lucide-arrow-right color-white h-10 w-10"></span>
				</button>
			</div>
		</>
	);
}
