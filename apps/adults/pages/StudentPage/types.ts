import type { MazeProgressRecord } from "@/games/maze";
import type { getStudentById, getStudentProgress } from "@/services";

export type Student = Awaited<ReturnType<typeof getStudentById>>;

export type StudentGame = Awaited<
	ReturnType<typeof getStudentProgress>
>[number];

export type StudentProgressRecord = StudentGame["records"][number];

export type { MazeProgressRecord };
