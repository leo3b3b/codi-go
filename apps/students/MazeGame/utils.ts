import { Icon } from "@codi-go/ui";
import type { Command } from "./types";

export const commandIcons: Record<
	Command,
	React.ComponentType<{ size?: number; color?: string }>
> = {
	up: Icon.ArrowUp,
	down: Icon.ArrowDown,
	left: Icon.ArrowLeft,
	right: Icon.ArrowRight,
};

export const commands: Command[] = ["up", "left", "down", "right"];

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
