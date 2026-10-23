import { Icon } from "@codi-go/ui";
import type { Command } from "./types";

export const commandIcons: Record<Command, Icon.LucideIcon> = {
	up: Icon.ArrowUp,
	down: Icon.ArrowDown,
	left: Icon.ArrowLeft,
	right: Icon.ArrowRight,
};

export const commands: Command[] = ["up", "left", "down", "right"];
